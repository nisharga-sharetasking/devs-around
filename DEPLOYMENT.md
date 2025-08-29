# Deployment Guide for DevsAround

This guide explains how to deploy both the API backend and Web frontend to Vercel.

## Prerequisites

1. Install Vercel CLI globally (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

## Deploying the API Backend

1. Navigate to the API directory:
   ```bash
   cd apps/api
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```
   
   During first deployment:
   - Set up and deploy: Yes
   - Select scope: Your account
   - Link to existing project: No (for first time)
   - Project name: `devsaround-api` (or your preferred name)
   - In which directory is your code located: `./` (current directory)
   - Want to modify settings: No

3. Set environment variables in Vercel dashboard:
   - Go to your project settings in Vercel
   - Navigate to "Environment Variables"
   - Add the following:
     ```
     MONGODB_URI=mongodb+srv://dbUser:V68m0LKcgwKuWp5a@cluster0.qemdz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     NODE_ENV=production
     FRONTEND_URL=https://your-web-app.vercel.app
     ```

4. Deploy to production:
   ```bash
   vercel --prod
   ```

5. Note your API URL (e.g., `https://devsaround-api.vercel.app`)

## Deploying the Web Frontend

1. Navigate to the Web directory:
   ```bash
   cd apps/web
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```
   
   During first deployment:
   - Set up and deploy: Yes
   - Select scope: Your account
   - Link to existing project: No (for first time)
   - Project name: `devsaround-web` (or your preferred name)
   - In which directory is your code located: `./` (current directory)
   - Want to modify settings: No

3. Set environment variables in Vercel dashboard:
   - Go to your project settings in Vercel
   - Navigate to "Environment Variables"
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://devsaround-api.vercel.app/api
     ```
   (Replace with your actual API URL from step 5 above)

4. Deploy to production:
   ```bash
   vercel --prod
   ```

## Quick Deployment Scripts

From the root directory, you can use:

```bash
# Deploy API only
pnpm run deploy:api

# Deploy Web only  
pnpm run deploy:web

# Deploy both
pnpm run deploy:all
```

## Important Notes

1. **MongoDB Connection**: Make sure your MongoDB Atlas cluster allows connections from Vercel's IP addresses. You may need to:
   - Go to MongoDB Atlas Network Access
   - Add `0.0.0.0/0` to allow access from anywhere (for production, consider more restrictive settings)

2. **CORS Configuration**: Update the `FRONTEND_URL` environment variable in your API deployment to match your Web app's URL to prevent CORS issues.

3. **Environment Variables**: Never commit sensitive environment variables. Use Vercel's dashboard to set them securely.

4. **Serverless Limitations**: 
   - API routes have a 10-second timeout on Vercel's hobby plan
   - Cold starts may occur if the function hasn't been called recently
   - Consider using Vercel KV or Redis for session management instead of in-memory storage

## Updating Deployments

After making changes:

1. Commit and push your changes to GitHub
2. Run the deployment command again:
   ```bash
   vercel --prod
   ```
   
Or use the scripts:
```bash
pnpm run deploy:all
```

## Connecting to GitHub (Optional)

For automatic deployments on push:

1. Go to your Vercel dashboard
2. Import your GitHub repository
3. Configure the root directory:
   - For API: `apps/api`
   - For Web: `apps/web`
4. Set the build settings according to the `vercel.json` files

## Troubleshooting

- **Build Errors**: Check that all dependencies are listed in `package.json`
- **Runtime Errors**: Check Vercel Functions logs in the dashboard
- **CORS Issues**: Verify `FRONTEND_URL` is set correctly in API environment variables
- **MongoDB Connection**: Ensure connection string is correct and network access is configured