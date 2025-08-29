const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

dotenv.config();

const app = express();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devsaround';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Response handler utility
const sendResponse = (res, statusCode, message, data = null, meta = null) => {
  const response = {
    status: statusCode >= 200 && statusCode < 300 ? 'success' : 'error',
    message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  if (meta) {
    response.meta = meta;
  }
  
  return res.status(statusCode).json(response);
};

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res) => {
    sendResponse(res, 429, 'Too many requests, please try again later');
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Models
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['author', 'reader'], default: 'author' }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

UserSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', UserSchema);

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  coverImageUrl: { type: String, default: '' },
  tags: [{ type: String, lowercase: true }],
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  publishedAt: { type: Date, default: null }
}, { timestamps: true });

PostSchema.index({ title: 'text', content: 'text', tags: 'text' });

PostSchema.pre('save', function(next) {
  if (!this.excerpt && this.content) {
    const plainText = this.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    this.excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
  }
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
  }
  next();
});

const Post = mongoose.model('Post', PostSchema);

// Auth middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return sendResponse(res, 401, 'Authentication required');
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendResponse(res, 401, 'Token has expired');
    }
    sendResponse(res, 401, 'Invalid token');
  }
};

// Routes
app.get('/', (req, res) => {
  sendResponse(res, 200, 'DevsAround Blog API', {
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      posts: '/api/posts',
      users: '/api/users'
    }
  });
});

app.get('/health', (req, res) => {
  sendResponse(res, 200, 'Server is healthy', {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Auth Routes
app.post('/api/auth/signup', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(res, 422, 'Validation failed', null, { errors: errors.array() });
    }

    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 409, 'User with this email already exists');
    }

    const user = new User({ name, email, passwordHash: password });
    await user.save();

    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });

    sendResponse(res, 201, 'User created successfully', { user, token });
  } catch (error) {
    console.error('Signup error:', error);
    sendResponse(res, 500, 'Server error');
  }
});

app.post('/api/auth/login', [
  body('email').trim().isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(res, 422, 'Validation failed', null, { errors: errors.array() });
    }

    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await user.comparePassword(password))) {
      return sendResponse(res, 401, 'Invalid email or password');
    }

    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
    user.passwordHash = undefined;

    sendResponse(res, 200, 'Login successful', { user, token });
  } catch (error) {
    console.error('Login error:', error);
    sendResponse(res, 500, 'Server error');
  }
});

app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return sendResponse(res, 404, 'User not found');
    }
    sendResponse(res, 200, 'User fetched successfully', { user });
  } catch (error) {
    console.error('Get me error:', error);
    sendResponse(res, 500, 'Server error');
  }
});

app.post('/api/auth/logout', authenticate, (req, res) => {
  sendResponse(res, 200, 'Logout successful');
});

// Posts Routes
app.get('/api/posts', async (req, res) => {
  try {
    const { search, tag, page = 1, limit = 10 } = req.query;
    const filter = { publishedAt: { $ne: null, $lte: new Date() } };
    
    if (search) filter.$text = { $search: search };
    if (tag) filter.tags = { $in: [tag.toLowerCase()] };

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('authorId', 'name email')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    sendResponse(res, 200, 'Posts fetched successfully', 
      { posts },
      { 
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    );
  } catch (error) {
    console.error('Get posts error:', error);
    sendResponse(res, 500, 'Server error');
  }
});

app.get('/api/posts/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ 
      slug: req.params.slug,
      publishedAt: { $ne: null, $lte: new Date() }
    }).populate('authorId', 'name email');

    if (!post) {
      return sendResponse(res, 404, 'Post not found');
    }

    sendResponse(res, 200, 'Post fetched successfully', { post });
  } catch (error) {
    console.error('Get post error:', error);
    sendResponse(res, 500, 'Server error');
  }
});

app.post('/api/posts', authenticate, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(res, 422, 'Validation failed', null, { errors: errors.array() });
    }

    const post = new Post({
      ...req.body,
      authorId: req.userId
    });

    await post.save();
    await post.populate('authorId', 'name email');

    sendResponse(res, 201, 'Post created successfully', { post });
  } catch (error) {
    if (error.code === 11000) {
      sendResponse(res, 409, 'A post with this slug already exists');
    } else {
      console.error('Create post error:', error);
      sendResponse(res, 500, 'Server error');
    }
  }
});

app.patch('/api/posts/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return sendResponse(res, 404, 'Post not found');
    }

    if (post.authorId.toString() !== req.userId) {
      return sendResponse(res, 403, 'You are not authorized to update this post');
    }

    Object.assign(post, req.body);
    await post.save();
    await post.populate('authorId', 'name email');

    sendResponse(res, 200, 'Post updated successfully', { post });
  } catch (error) {
    if (error.code === 11000) {
      sendResponse(res, 409, 'A post with this slug already exists');
    } else {
      console.error('Update post error:', error);
      sendResponse(res, 500, 'Server error');
    }
  }
});

app.delete('/api/posts/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return sendResponse(res, 404, 'Post not found');
    }

    if (post.authorId.toString() !== req.userId) {
      return sendResponse(res, 403, 'You are not authorized to delete this post');
    }

    await post.deleteOne();
    sendResponse(res, 200, 'Post deleted successfully');
  } catch (error) {
    console.error('Delete post error:', error);
    sendResponse(res, 500, 'Server error');
  }
});

// 404 handler
app.use((req, res) => {
  sendResponse(res, 404, `Route ${req.originalUrl} not found`);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  let statusCode = 500;
  let message = 'Internal server error';
  
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = 'Validation failed';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate key error';
  }
  
  sendResponse(res, statusCode, message, null, 
    process.env.NODE_ENV === 'development' ? { error: err.message } : null
  );
});

// For Vercel serverless
module.exports = app;