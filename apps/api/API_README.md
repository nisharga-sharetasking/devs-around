# DevsAround Blog API Documentation

## 🚀 Live API URL
**Base URL**: `https://api-8n8pbw3zu-kabirnishargagmailcoms-projects.vercel.app`
**Last Deployed**: August 30, 2025
**Note**: Deployment protected by Vercel authentication

## 📋 Overview
A RESTful API for a blog platform built with Express.js, MongoDB, and TypeScript. Features user authentication, blog post management, and content search capabilities.

### ✨ Professional Features
- **Consistent Response Format**: All API responses follow a standardized `{status, message, data, meta}` structure
- **Comprehensive Error Handling**: Mongoose validation, JWT errors, and custom error classes
- **Type-Safe**: Built with TypeScript for better code reliability
- **Modular Architecture**: Organized with controllers, services, routes, and validation layers
- **Security**: JWT authentication, password hashing with bcrypt, rate limiting, CORS, and Helmet.js

## 🔧 Setup

### Environment Variables
Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

### Local Development
```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm run dev

# Build TypeScript
pnpm run build

# Run tests
pnpm run test
```

### Deployment
```bash
# Deploy to Vercel (Production)
vercel --prod

# Or use the deployment script
bash vercel-deploy.sh
```

## 📚 API Endpoints

### Base Endpoints

#### Health Check
```http
GET /
GET /health
```

**Response:**
```json
{
  "status": "success",
  "message": "DevsAround Blog API",
  "data": {
    "version": "1.0.0",
    "endpoints": {
      "auth": "/api/auth",
      "posts": "/api/posts",
      "users": "/api/users"
    }
  }
}
```

### 📦 Response Format

All API responses follow this consistent structure:

```json
{
  "status": "success" | "error",
  "message": "Descriptive message",
  "data": { /* Response data */ },
  "meta": { /* Pagination or additional info */ }
}
```

---

## 🔐 Authentication Endpoints

### 1. User Signup
```http
POST /api/auth/signup
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Validation Rules:**
- `name`: Required, 2-50 characters
- `email`: Required, valid email format
- `password`: Required, min 6 characters, must contain uppercase, lowercase, and number

**Success Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "author",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Response (409):**
```json
{
  "error": "User with this email already exists"
}
```

### 2. User Login
```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "author"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Response (401):**
```json
{
  "error": "Invalid email or password"
}
```

### 3. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "user": {
    "_id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "author",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

## 📝 Posts Endpoints

### 1. Get All Posts (Public)
```http
GET /api/posts?search=keyword&tag=technology&page=1&limit=10
```

**Query Parameters:**
- `search` (optional): Full-text search in title and content
- `tag` (optional): Filter by tag
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Success Response (200):**
```json
{
  "posts": [
    {
      "_id": "65def456...",
      "title": "Getting Started with Node.js",
      "slug": "getting-started-with-nodejs",
      "excerpt": "Learn the basics of Node.js...",
      "content": "Full article content...",
      "coverImageUrl": "https://example.com/image.jpg",
      "tags": ["nodejs", "javascript", "backend"],
      "authorId": {
        "_id": "65abc123...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "publishedAt": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 50
}
```

### 2. Get Post by Slug (Public)
```http
GET /api/posts/:slug
```

**Success Response (200):**
```json
{
  "post": {
    "_id": "65def456...",
    "title": "Getting Started with Node.js",
    "slug": "getting-started-with-nodejs",
    "excerpt": "Learn the basics...",
    "content": "Full article content...",
    "coverImageUrl": "https://example.com/image.jpg",
    "tags": ["nodejs", "javascript"],
    "authorId": {
      "_id": "65abc123...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "publishedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Create Post (Protected)
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My New Blog Post",
  "content": "This is the full content of my blog post...",
  "slug": "my-new-blog-post",
  "excerpt": "A brief summary...",
  "coverImageUrl": "https://example.com/cover.jpg",
  "tags": ["technology", "tutorial"],
  "publishedAt": "2024-01-01T00:00:00.000Z"
}
```

**Required Fields:**
- `title`: 3-200 characters
- `content`: Minimum 10 characters

**Optional Fields:**
- `slug`: Auto-generated from title if not provided
- `excerpt`: Auto-generated from content if not provided (first 200 chars)
- `coverImageUrl`: Valid URL
- `tags`: Array of strings
- `publishedAt`: ISO date string (null for drafts)

**Success Response (201):**
```json
{
  "message": "Post created successfully",
  "post": {
    "_id": "65ghi789...",
    "title": "My New Blog Post",
    "slug": "my-new-blog-post",
    "content": "Full content...",
    "authorId": "65abc123...",
    "publishedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Update Post (Protected - Owner Only)
```http
PATCH /api/posts/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "tags": ["updated", "tags"],
  "publishedAt": "2024-01-02T00:00:00.000Z"
}
```

**Success Response (200):**
```json
{
  "message": "Post updated successfully",
  "post": { /* updated post object */ }
}
```

**Error Response (403):**
```json
{
  "error": "You are not authorized to update this post"
}
```

### 5. Delete Post (Protected - Owner Only)
```http
DELETE /api/posts/:id
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "Post deleted successfully"
}
```

---

## 🔒 Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Tokens expire after 7 days by default.

---

## ❌ Error Responses

### Common Error Codes

| Status Code | Description |
|------------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error |

### Error Response Format
```json
{
  "error": "Descriptive error message"
}
```

---

## 🧪 Testing the API

### Using cURL

**Signup:**
```bash
curl -X POST https://api-8n8pbw3zu-kabirnishargagmailcoms-projects.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123!"}'
```

**Login:**
```bash
curl -X POST https://api-8n8pbw3zu-kabirnishargagmailcoms-projects.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

**Create Post:**
```bash
curl -X POST https://api-8n8pbw3zu-kabirnishargagmailcoms-projects.vercel.app/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Post","content":"This is my first blog post content!"}'
```

**Get Posts:**
```bash
curl https://api-8n8pbw3zu-kabirnishargagmailcoms-projects.vercel.app/api/posts
```

### Using JavaScript/Fetch

```javascript
// Signup
const signup = async () => {
  const response = await fetch('https://api-8n8pbw3zu-kabirnishargagmailcoms-projects.vercel.app/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123'
    })
  });
  const data = await response.json();
  console.log(data);
  return data.token; // Save this token
};

// Create Post
const createPost = async (token) => {
  const response = await fetch('https://api-8n8pbw3zu-kabirnishargagmailcoms-projects.vercel.app/api/posts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'My Blog Post',
      content: 'This is the content of my blog post...',
      tags: ['javascript', 'tutorial'],
      publishedAt: new Date().toISOString()
    })
  });
  const data = await response.json();
  console.log(data);
};

// Get Posts
const getPosts = async () => {
  const response = await fetch('https://api-8n8pbw3zu-kabirnishargagmailcoms-projects.vercel.app/api/posts?page=1&limit=10');
  const data = await response.json();
  console.log(data);
};
```

---

## 📊 Data Models

### User Model
```typescript
{
  _id: ObjectId
  name: string (2-50 chars)
  email: string (unique, valid email)
  passwordHash: string (hashed)
  role: "author" | "reader"
  createdAt: Date
  updatedAt: Date
}
```

### Post Model
```typescript
{
  _id: ObjectId
  title: string (3-200 chars)
  slug: string (unique, lowercase, kebab-case)
  excerpt: string (max 300 chars)
  content: string (min 10 chars)
  coverImageUrl?: string (valid URL)
  tags: string[]
  authorId: ObjectId (ref: User)
  publishedAt?: Date | null (null = draft)
  createdAt: Date
  updatedAt: Date
}
```

---

## 🚦 Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Limit**: 100 requests per 15-minute window
- **Applies to**: All `/api/` endpoints
- **Headers**: Rate limit info included in response headers

---

## 🛠️ Development Tips

1. **MongoDB Connection**: Make sure to set up a MongoDB Atlas cluster or local MongoDB instance
2. **JWT Secret**: Always use a strong, unique secret in production
3. **CORS**: Configure CORS settings based on your frontend domain
4. **Validation**: All inputs are validated using express-validator
5. **Error Handling**: Comprehensive error handling with appropriate status codes

---

## 📝 Notes

- Posts with `publishedAt: null` are considered drafts and won't appear in public listings
- Slugs are automatically generated from titles if not provided
- Excerpts are automatically generated from content if not provided
- Full-text search requires MongoDB text indexes (already configured)
- Passwords are hashed using bcrypt with salt rounds of 10

---

## 🤝 Support

For issues or questions about the API, please contact the development team or check the repository issues.

---

## 📄 License

This API is part of the DevsAround project. All rights reserved.