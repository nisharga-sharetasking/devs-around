# DevsAround Monorepo - Complete Setup Guide

This guide explains how to create this monorepo from scratch and understand how everything works together.

## Table of Contents
1. [Project Architecture](#project-architecture)
2. [Step-by-Step Setup](#step-by-step-setup)
3. [How It Works](#how-it-works)
4. [Technology Decisions](#technology-decisions)

## Project Architecture

```
devsaround/
├── apps/
│   ├── web/                 # Next.js frontend application
│   │   ├── src/             # Source code
│   │   ├── package.json     # Web app dependencies
│   │   ├── next.config.js   # Next.js configuration
│   │   ├── vercel.json      # Vercel deployment config
│   │   └── jest.config.js   # Testing configuration
│   │
│   └── api/                 # Express.js backend API
│       ├── src/             # Source code
│       │   ├── controllers/ # Request handlers
│       │   ├── models/      # MongoDB schemas
│       │   ├── routes/      # API endpoints
│       │   └── middleware/   # Express middleware
│       ├── api/             # Vercel serverless function
│       ├── package.json     # API dependencies
│       └── vercel.json      # Vercel deployment config
│
├── packages/
│   ├── ui/                  # Shared React components
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components
│   │   │   └── utils/       # Utility functions
│   │   └── package.json
│   │
│   └── config/              # Shared configurations
│       ├── eslint/          # ESLint configs
│       ├── tsconfig/        # TypeScript configs
│       └── tailwind.js      # Tailwind config
│
├── pnpm-workspace.yaml      # PNPM workspace configuration
├── turbo.json              # Turborepo configuration
├── package.json            # Root package.json with scripts
└── docker-compose.yml      # Docker configuration
```

## Step-by-Step Setup

### 1. Initialize Monorepo Structure

```bash
# Create project directory
mkdir devsaround && cd devsaround

# Initialize package.json
npm init -y

# Create directory structure
mkdir -p apps/web apps/api packages/ui packages/config
mkdir -p .github/workflows

# Initialize git
git init
```

### 2. Setup PNPM Workspaces

Create `pnpm-workspace.yaml`:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Update root `package.json`:
```json
{
  "name": "devsaround",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "packageManager": "pnpm@9.15.0",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 3. Install and Configure Turborepo

```bash
pnpm add -D turbo
```

Create `turbo.json`:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {}
  }
}
```

### 4. Create the API Backend (Express + TypeScript)

```bash
cd apps/api
pnpm init
```

Install dependencies:
```bash
pnpm add express cors helmet compression express-rate-limit mongoose dotenv
pnpm add -D typescript @types/express @types/node tsx eslint jest ts-jest
```

Create `tsconfig.json`:
```json
{
  "extends": "@devsaround/config/tsconfig/node.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

Create the Express server (`src/index.ts`):
```typescript
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { connectDB } from './config/database'
import routes from './routes'

const app = express()
const PORT = process.env.PORT || 4000

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use('/api', routes)

const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`)
  })
}

startServer()
```

### 5. Create the Web Frontend (Next.js)

```bash
cd apps/web
pnpm init
```

Install dependencies:
```bash
pnpm add next react react-dom
pnpm add -D @types/react @types/node typescript eslint tailwindcss
```

Create `next.config.js`:
```javascript
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@devsaround/ui"],
  output: 'standalone'
}
module.exports = nextConfig
```

Create the main page (`src/app/page.tsx`):
```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">DevsAround</h1>
      <p className="text-lg mb-8">Welcome to the monorepo application</p>
    </main>
  )
}
```

### 6. Create Shared UI Package

```bash
cd packages/ui
pnpm init
```

Configure for building (`tsup.config.ts`):
```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  external: ['react', 'react-dom'],
})
```

### 7. Create Shared Config Package

```bash
cd packages/config
pnpm init
```

Add shared TypeScript configs, ESLint rules, and Tailwind presets.

### 8. Setup Root Scripts

Update root `package.json`:
```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "start": "turbo run start",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "deploy:api": "cd apps/api && vercel --prod",
    "deploy:web": "cd apps/web && vercel --prod"
  }
}
```

### 9. Docker Configuration

Create `docker-compose.yml`:
```yaml
version: '3.9'
services:
  mongodb:
    image: mongo:7.0
    ports:
      - '27017:27017'
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123

  api:
    build: ./apps/api
    ports:
      - '4000:4000'
    depends_on:
      - mongodb

  web:
    build: ./apps/web
    ports:
      - '3000:3000'
    depends_on:
      - api
```

### 10. Vercel Deployment Setup

For API (`apps/api/vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.ts"
    }
  ]
}
```

For Web (`apps/web/vercel.json`):
```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "cd ../.. && pnpm run build --filter=@devsaround/web"
}
```

## How It Works

### 1. **Monorepo Management (PNPM + Turborepo)**

- **PNPM Workspaces**: Manages dependencies across all packages. Shared dependencies are hoisted to root, saving disk space.
- **Turborepo**: Orchestrates build tasks, caches results, and runs tasks in parallel when possible.

```bash
# Install dependencies for all packages
pnpm install

# Run dev servers for all apps
pnpm dev

# Build only the web app
pnpm build --filter=@devsaround/web
```

### 2. **Package Dependencies**

Internal packages are referenced using `workspace:*` protocol:
```json
{
  "dependencies": {
    "@devsaround/ui": "workspace:*",
    "@devsaround/config": "workspace:*"
  }
}
```

This tells PNPM to link the local package instead of downloading from npm.

### 3. **Development Workflow**

When you run `pnpm dev`:
1. Turborepo reads `turbo.json` to understand task dependencies
2. It starts all `dev` scripts in parallel
3. The API starts on port 4000
4. Next.js starts on port 3000
5. Changes in shared packages automatically trigger rebuilds

### 4. **Build Process**

When you run `pnpm build`:
1. Turborepo builds packages in dependency order
2. First builds `@devsaround/config` and `@devsaround/ui`
3. Then builds apps that depend on them
4. Caches results for faster subsequent builds

### 5. **TypeScript Configuration**

- Shared base configs in `packages/config/tsconfig/`
- Each package extends the appropriate config:
  - `node.json` for backend
  - `nextjs.json` for Next.js
  - `react-library.json` for React components

### 6. **ESLint Setup**

Using ESLint v9 flat config:
```javascript
const js = require('@eslint/js')
const typescript = require('@typescript-eslint/eslint-plugin')

module.exports = [
  js.configs.recommended,
  // Custom rules
]
```

### 7. **Testing**

Each app has its own Jest configuration:
- API uses `ts-jest` for TypeScript
- Web uses `next/jest` for Next.js compatibility

### 8. **Vercel Deployment**

**API Deployment**:
- Deployed as serverless functions
- MongoDB connection is reused across invocations
- CORS configured for production frontend

**Web Deployment**:
- Next.js app with standalone output
- Environment variables for API URL
- Automatic optimization and caching

### 9. **Environment Variables**

Development (`.env`):
```env
MONGODB_URI=mongodb://localhost:27017/devsaround
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Production (set in Vercel):
```env
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_API_URL=https://api.vercel.app
```

## Technology Decisions

### Why Monorepo?
- **Code Sharing**: Share components, types, and utilities
- **Atomic Changes**: Update API and frontend in single commit
- **Consistent Tooling**: Same ESLint, TypeScript, testing setup

### Why PNPM?
- **Disk Space**: Efficient with node_modules
- **Speed**: Faster than npm/yarn
- **Strict**: Prevents phantom dependencies

### Why Turborepo?
- **Caching**: Speeds up builds
- **Parallelization**: Runs tasks concurrently
- **Dependency Graph**: Understands package relationships

### Why Next.js?
- **Full-Stack**: API routes + React
- **Performance**: Automatic optimization
- **Vercel Integration**: Seamless deployment

### Why Express?
- **Flexibility**: Full control over API
- **Ecosystem**: Extensive middleware
- **Familiarity**: Well-documented

## Common Commands

```bash
# Development
pnpm dev                    # Start all apps
pnpm dev --filter=web      # Start only web app

# Building
pnpm build                  # Build everything
pnpm build --filter=api    # Build only API

# Testing
pnpm test                   # Run all tests
pnpm test --filter=ui      # Test UI package

# Linting
pnpm lint                   # Lint all packages

# Deployment
pnpm deploy:api            # Deploy API to Vercel
pnpm deploy:web           # Deploy Web to Vercel
pnpm deploy:all          # Deploy both

# Database
pnpm seed                  # Seed MongoDB with data

# Docker
docker-compose up          # Start with Docker
docker-compose down        # Stop containers
```

## Troubleshooting

1. **PNPM not found**: Install with `npm i -g pnpm`
2. **Port in use**: Change ports in package.json scripts
3. **MongoDB connection**: Check connection string and network
4. **Build errors**: Run `pnpm clean` and reinstall
5. **TypeScript errors**: Check extends paths in tsconfig.json

## Next Steps

1. Add authentication (NextAuth.js or Auth0)
2. Implement API rate limiting
3. Add more shared packages (types, utils)
4. Setup CI/CD with GitHub Actions
5. Add monitoring (Sentry, LogRocket)
6. Implement testing (unit, integration, e2e)

This architecture scales well for teams and can grow with your project needs.