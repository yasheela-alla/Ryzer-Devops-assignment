# Ryzer Tokenized Assets - Setup Guide

## Prerequisites
- Node.js 18+ installed
- Git installed
- VS Code installed
- AWS Account (for deployment)

## Step 1: Clone/Download the Project

If you downloaded the ZIP from v0:
\`\`\`bash
# Extract the ZIP file to a folder
# Open VS Code
# File > Open Folder > Select the extracted folder
\`\`\`

If using Git:
\`\`\`bash
git clone <your-repo-url>
cd ryzer-tokenized-assets
\`\`\`

## Step 2: Install Dependencies

Open VS Code terminal (Terminal > New Terminal) and run:

\`\`\`bash
# Delete node_modules and package-lock.json if they exist
rm -rf node_modules package-lock.json

# Install fresh dependencies
npm install
\`\`\`

## Step 3: Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

The app will open at `http://localhost:3000` (or 3001/3002 if 3000 is busy)

## Step 4: Build for Production

Before deploying to AWS, test the production build:

\`\`\`bash
npm run build
npm start
\`\`\`

## Step 5: Deploy to AWS (S3 + CodePipeline)

### Option A: Static Export (Recommended for S3)

1. Update `next.config.mjs`:
\`\`\`javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
\`\`\`

2. Build static files:
\`\`\`bash
npm run build
\`\`\`

3. Upload the `out` folder to S3:
   - Create an S3 bucket
   - Enable static website hosting
   - Upload all files from the `out` folder
   - Set bucket policy for public access

### Option B: Full Next.js on AWS (EC2/Amplify)

Use AWS Amplify for full Next.js features:
1. Push code to GitHub
2. Connect GitHub repo to AWS Amplify
3. Amplify will auto-detect Next.js and deploy

## Troubleshooting

### Port Already in Use
If you see "Port 3000 is in use":
- The app will automatically try 3001, 3002, etc.
- Or kill the process: `npx kill-port 3000`

### Module Not Found Errors
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Build Errors
Make sure you're using Node.js 18+:
\`\`\`bash
node --version
\`\`\`

## Project Structure

\`\`\`
ryzer-tokenized-assets/
├── app/
│   ├── page.tsx              # Homepage
│   ├── assets/page.tsx       # Assets marketplace
│   ├── portfolio/page.tsx    # Portfolio tracker
│   ├── transactions/page.tsx # Transaction history
│   ├── api/                  # API routes
│   └── layout.tsx            # Root layout
├── components/               # Reusable components
├── lib/                      # Utilities
└── public/                   # Static assets
\`\`\`

## Features Included

- Real-time asset price updates
- Portfolio tracking with P&L
- ROI calculator
- Advanced search and filtering
- Transaction history
- Responsive design
- Professional UI matching Ryzer.app brand

## Support

Created by: Yasheela Alla

For issues, check the console logs in VS Code terminal.
\`\`\`

```mjs file="" isHidden
