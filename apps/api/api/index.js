const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'API is running', status: 'healthy' });
});

app.get('/health', (req, res) => {
  res.json({ message: 'API health is OK mere vai' });
});

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'DevsAround API v1.0.0' });
});

// User routes (simplified for now)
app.get('/api/users', (req, res) => {
  res.json({ users: [], message: 'Users endpoint' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// For Vercel serverless
module.exports = app;