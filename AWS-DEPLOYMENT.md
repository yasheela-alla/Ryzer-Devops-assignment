# AWS Deployment Guide for Ryzer Tokenized Assets

## Quick Start - Deploy to S3 in 5 Minutes

### Step 1: Build the Static Site

In VS Code terminal:

\`\`\`bash
npm run build
\`\`\`

This creates an `out` folder with all static files.

### Step 2: Create S3 Bucket

1. Go to AWS Console > S3
2. Click "Create bucket"
3. Bucket name: `ryzer-tokenized-assets` (must be unique)
4. Region: Choose closest to you
5. **Uncheck** "Block all public access"
6. Click "Create bucket"

### Step 3: Enable Static Website Hosting

1. Click on your bucket
2. Go to "Properties" tab
3. Scroll to "Static website hosting"
4. Click "Edit"
5. Enable "Static website hosting"
6. Index document: `index.html`
7. Error document: `404.html`
8. Click "Save changes"
9. **Copy the website endpoint URL** (you'll need this)

### Step 4: Set Bucket Policy

1. Go to "Permissions" tab
2. Scroll to "Bucket policy"
3. Click "Edit"
4. Paste this policy (replace `YOUR-BUCKET-NAME`):

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
\`\`\`

5. Click "Save changes"

### Step 5: Upload Files

**Option A: AWS Console (Easy)**
1. Go to "Objects" tab
2. Click "Upload"
3. Click "Add files" or drag the entire `out` folder
4. Click "Upload"

**Option B: AWS CLI (Faster)**
\`\`\`bash
# Install AWS CLI first: https://aws.amazon.com/cli/
aws configure  # Enter your AWS credentials
aws s3 sync out/ s3://YOUR-BUCKET-NAME --delete
\`\`\`

### Step 6: Access Your Website

Visit the S3 website endpoint URL from Step 3!

Example: `http://ryzer-tokenized-assets.s3-website-us-east-1.amazonaws.com`

---

## Advanced: CodePipeline CI/CD Setup

### Prerequisites
- GitHub account
- Code pushed to GitHub repository

### Step 1: Push to GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit - Ryzer Tokenized Assets"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ryzer-tokenized-assets.git
git push -u origin main
\`\`\`

### Step 2: Create CodePipeline

1. Go to AWS Console > CodePipeline
2. Click "Create pipeline"
3. Pipeline name: `ryzer-deployment`
4. Service role: Create new role
5. Click "Next"

### Step 3: Add Source Stage

1. Source provider: GitHub (Version 2)
2. Click "Connect to GitHub"
3. Connection name: `github-connection`
4. Authorize AWS
5. Select your repository
6. Branch: `main`
7. Click "Next"

### Step 4: Add Build Stage

1. Build provider: AWS CodeBuild
2. Click "Create project"
3. Project name: `ryzer-build`
4. Environment image: Managed image
5. Operating system: Ubuntu
6. Runtime: Standard
7. Image: Latest
8. Create a `buildspec.yml` in your project root:

\`\`\`yaml
version: 0.2

phases:
  pre_build:
    commands:
      - echo Installing dependencies...
      - npm install
  build:
    commands:
      - echo Building Next.js app...
      - npm run build
  post_build:
    commands:
      - echo Build completed

artifacts:
  files:
    - '**/*'
  base-directory: out
\`\`\`

9. Click "Continue to CodePipeline"
10. Click "Next"

### Step 5: Add Deploy Stage

1. Deploy provider: Amazon S3
2. Bucket: Select your S3 bucket
3. Check "Extract file before deploy"
4. Click "Next"
5. Review and click "Create pipeline"

### Step 6: Automatic Deployments

Now every time you push to GitHub:
1. CodePipeline detects the change
2. CodeBuild runs `npm install` and `npm run build`
3. Deploys the `out` folder to S3
4. Your website updates automatically!

---

## Custom Domain (Optional)

### Using CloudFront + Route 53

1. **Create CloudFront Distribution**
   - Origin: Your S3 website endpoint
   - Viewer protocol: Redirect HTTP to HTTPS
   - Default root object: `index.html`

2. **Get SSL Certificate**
   - AWS Certificate Manager (ACM)
   - Request certificate for your domain
   - Validate via DNS or email

3. **Add Custom Domain**
   - Route 53 > Create hosted zone
   - Add A record pointing to CloudFront
   - Update CloudFront with custom domain

---

## Troubleshooting

### Build Fails
- Check Node.js version: `node --version` (need 18+)
- Clear cache: `rm -rf .next node_modules && npm install`

### 403 Forbidden on S3
- Check bucket policy is set correctly
- Verify "Block public access" is OFF

### Files Not Updating
- Clear CloudFront cache if using CDN
- Or use: `aws s3 sync out/ s3://YOUR-BUCKET --delete --cache-control max-age=0`

### API Routes Not Working
- S3 only supports static files
- API routes need serverless functions (use AWS Amplify or Lambda)
- Current app uses mock data, so it works fine on S3

---

## Cost Estimate

- **S3 Storage**: ~$0.023/GB/month
- **S3 Requests**: ~$0.0004/1000 requests
- **Data Transfer**: First 100GB free, then $0.09/GB
- **CodePipeline**: First pipeline free, $1/month after

**Estimated monthly cost for low traffic: $1-5**

---

## Quick Commands Reference

\`\`\`bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build

# Deploy to S3 (after AWS CLI setup)
aws s3 sync out/ s3://YOUR-BUCKET-NAME --delete

# Clear S3 bucket
aws s3 rm s3://YOUR-BUCKET-NAME --recursive
\`\`\`

---

**Created by: Yasheela Alla**

Good luck with your Ryzer internship! 🚀
\`\`\`
