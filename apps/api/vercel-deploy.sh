#!/bin/bash

# Backup original package.json
cp package.json package.json.backup

# Use Vercel-compatible package.json
cp package.vercel.json package.json

# Deploy to Vercel
vercel --prod --yes

# Restore original package.json
cp package.json.backup package.json
rm package.json.backup

echo "Deployment complete. Original package.json restored."