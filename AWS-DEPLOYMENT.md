# Ryzer Tokenized Assets – Local & AWS Deployment Guide

## Prerequisites
- Node.js 18+
- Git
- VS Code
- AWS account
- AWS CLI (optional but recommended)

## 1. Run Locally

### Install Dependencies (First Time)
```bash
npm install
````

### Start Development Server

```bash
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

### Build for Production (Test Before AWS)

```bash
npm run build
```

Generates the `out/` folder with static files.

## 2. Deploy to AWS

### Option A: Automated (CodePipeline + S3)

1. **Create S3 Bucket**

   * Name: `ryzer-tokenized-assets`
   * Uncheck "Block all public access"
   * Enable **Static website hosting** (index.html)

2. **Create CodeBuild Project**

   * Source: GitHub repo
   * Environment: Managed image, Ubuntu, Standard runtime
   * Buildspec: `buildspec.yml` in project root
   * Artifacts: Type S3 → Bucket `ryzer-tokenized-assets`

3. **Create CodePipeline**

   * Source: GitHub → `main` branch
   * Build: CodeBuild project
   * Deploy: S3 bucket, extract files before deploy

4. **Set S3 Bucket Policy**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ryzer-tokenized-assets/*"
    }
  ]
}
```

### Option B: Manual Deployment (Quick Test)

```bash
# 1. Build
npm run build

# 2. Configure AWS CLI
aws configure

# 3. Upload files
aws s3 sync out/ s3://ryzer-tokenized-assets --delete

# 4. Enable static website hosting
aws s3 website s3://ryzer-tokenized-assets --index-document index.html
```

Access your site via S3 endpoint, e.g.:
`http://ryzer-tokenized-assets.s3-website-us-east-1.amazonaws.com`

---

## 3. Troubleshooting

* **Cannot find module:**

```bash
rm -rf node_modules package-lock.json
npm install
```

* **Port 3000 already in use:**

  * Windows:

    ```bash
    netstat -ano | findstr :3000
    taskkill /PID <PID> /F
    ```
  * Mac/Linux:

    ```bash
    lsof -ti:3000 | xargs kill -9
    ```

* **Build fails in CodeBuild:**

  * Check CloudWatch logs
  * Ensure `buildspec.yml` exists in root
  * Node.js version matches local

* **S3 shows 404:**

  * Confirm static website hosting is enabled
  * Check bucket policy
  * Verify `index.html` exists in bucket root

---

## 4. Performance Tips

* Cache dependencies in CodeBuild to reduce build time:

```yaml
cache:
  paths:
    - 'node_modules/**/*'
```

## 5. Pre-Presentation Checklist

* [ ] `npm install` completes successfully
* [ ] `npm run dev` works on localhost:3000
* [ ] `npm run build` succeeds, `out/` folder exists
* [ ] Test all features: browse assets, buy tokens, portfolio
* [ ] Deploy to AWS S3
* [ ] Verify live URL
