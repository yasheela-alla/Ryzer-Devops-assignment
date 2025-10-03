# AWS Deployment Guide – Ryzer Tokenized Assets

## Prerequisites
- Node.js 18+
- Git
- VS Code
- AWS account


## 1. Build the Static Site
```bash
npm run build
````

This generates the `out/` folder with all static files.


## 2. Deploy to S3 (Quick Start)

1. Create an S3 bucket in AWS (unique name, public access allowed).
2. Enable **Static Website Hosting**:

   * Index document: `index.html`
   * Error document: `404.html`
   * Copy the website endpoint URL.
3. Set bucket policy for public read access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

4. Upload files:

   * **AWS Console**: Drag `out/` folder and upload
   * **AWS CLI**:

```bash
aws configure
aws s3 sync out/ s3://YOUR-BUCKET-NAME --delete
```

5. Access your site via the S3 website endpoint.


## 3. Optional: CI/CD with CodePipeline

1. Push project to GitHub.
2. Create a CodePipeline:

   * Source: GitHub repository
   * Build: AWS CodeBuild

     * `buildspec.yml`:

```yaml
version: 0.2
phases:
  pre_build:
    commands:
      - npm install
  build:
    commands:
      - npm run build
      - npm run export
artifacts:
  files:
    - '**/*'
  base-directory: out
```

* Deploy: S3 bucket

3. Push changes → pipeline auto-builds and deploys.


## 4. Optional: Custom Domain

* Use **CloudFront + Route 53**
* Set S3 bucket as origin
* Enable HTTPS via ACM
* Point your domain to CloudFront distribution


## 5. Troubleshooting

* **Port in use:** `npx kill-port 3000`
* **Modules missing:** `rm -rf node_modules package-lock.json && npm install`
* **Build fails:** Ensure Node.js 18+
* **403 Forbidden on S3:** Check bucket policy and public access
* **Files not updating:** `aws s3 sync out/ s3://YOUR-BUCKET --delete --cache-control max-age=0`

> Note: S3 only supports static files. API routes require serverless hosting (Amplify/Lambda). Current app uses mock data, so static deployment works.


## 6. Quick Commands

```bash
npm install      # Install dependencies
npm run dev      # Run locally
npm run build    # Build for production
aws s3 sync out/ s3://YOUR-BUCKET-NAME --delete  # Deploy to S3
aws s3 rm s3://YOUR-BUCKET-NAME --recursive     # Clear bucket
```
