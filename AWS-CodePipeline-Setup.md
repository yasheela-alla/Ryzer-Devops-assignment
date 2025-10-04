# AWS CodePipeline + CodeBuild + S3 Deployment Guide

Professional CI/CD pipeline using AWS native services for static site deployment.

## Architecture

```
GitHub → AWS CodePipeline → AWS CodeBuild → Amazon S3 → CloudFront (optional)
```

## Prerequisites

- AWS Account with CLI configured
- GitHub repository with Next.js project
- Node.js 18+ locally

---

## Part 1: S3 Bucket Setup

### Create S3 Bucket

**AWS Console:**
1. Navigate to S3
2. Create bucket
3. Name: `ryzer-tokenized-assets-demo`
4. Region: `us-east-1`
5. Uncheck "Block all public access"
6. Acknowledge warning
7. Create bucket

<img width="1285" height="622" alt="Screenshot 2025-10-03 131256" src="https://github.com/user-attachments/assets/84f9f3f3-4ad9-402a-9dbe-9dd15ce74b60" />


**CLI:**
```bash
aws s3 mb s3://ryzer-tokenized-assets-demo --region us-east-1
```

### Enable Static Website Hosting

**Console:**
1. Select bucket → Properties
2. Static website hosting → Edit
3. Enable
4. Index document: `index.html`
5. Error document: `404.html`
6. Save changes

**CLI:**
```bash
aws s3 website s3://ryzer-tokenized-assets-demo \
  --index-document index.html \
  --error-document 404.html
```

### Set Bucket Policy

Create `bucket-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ryzer-tokenized-assets-demo/*"
    }
  ]
}
```

Apply policy:
```bash
aws s3api put-bucket-policy \
  --bucket ryzer-tokenized-assets-demo \
  --policy file://bucket-policy.json
```

**Note Website Endpoint:**
```
http://ryzer-tokenized-assets-demo.s3-website-us-east-1.amazonaws.com
```

---

## Part 2: Create Buildspec File

Create `buildspec.yml` in repository root:

```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 18
    commands:
      - echo "Installing dependencies"
      - npm ci

  build:
    commands:
      - echo "Building Next.js application"
      - npm run build
      - echo "Build completed"

artifacts:
  files:
    - '**/*'
  base-directory: out
  
cache:
  paths:
    - 'node_modules/**/*'
```

**Important:** Verify your Next.js outputs to `out` directory. If using `.next`, change `base-directory: .next`

Commit and push:
```bash
git add buildspec.yml
git commit -m "Add CodeBuild buildspec"
git push origin main
```

---

## Part 3: Create CodeBuild Project

### Console Setup

1. Navigate to AWS CodeBuild
2. Create build project

**Project configuration:**
- Project name: `ryzer-codebuild-project`
- Description: `Build project for Ryzer Next.js app`

**Source:**
- Source provider: GitHub
- Repository: Connect using OAuth
- Select repository: `yasheela-alla/Ryzer-Devops-assignment`
- Branch: `main`

**Environment:**
- Environment image: Managed image
- Operating system: Amazon Linux 2
- Runtime: Standard
- Image: `aws/codebuild/amazonlinux2-x86_64-standard:5.0`
- Image version: Latest
- Environment type: Linux
- Privileged: No
- Service role: New service role
- Role name: `codebuild-ryzer-service-role`

**Buildspec:**
- Build specifications: Use a buildspec file
- Buildspec name: `buildspec.yml`

**Artifacts:**
- Type: Amazon S3
- Bucket name: `ryzer-tokenized-assets-demo`
- Name: Leave empty (outputs to root)
- Artifacts packaging: None
- Enable semantic versioning: No

**Logs:**
- CloudWatch logs: Enabled
- Group name: `/aws/codebuild/ryzer-codebuild-project`

Create build project.

<img width="1405" height="587" alt="Screenshot 2025-10-03 131124" src="https://github.com/user-attachments/assets/75173652-b049-4003-85b0-84a80723287c" />


### Test Build

Click "Start build" to verify configuration works.

Expected output:
- Install phase completes
- Build phase runs `npm run build`
- Artifacts uploaded to S3
- Build succeeds

---

## Part 4: Create CodePipeline

### Console Setup

1. Navigate to AWS CodePipeline
2. Create pipeline

**Pipeline settings:**
- Pipeline name: `ryzer-cicd-pipeline`
- Service role: New service role
- Role name: `AWSCodePipelineServiceRole-ryzer`
- Allow AWS CodePipeline to create a service role

**Advanced settings:**
- Artifact store: Default location
- Encryption key: Default AWS Managed Key

Click Next.

**Source stage:**
- Source provider: GitHub (Version 2)
- Connection: Create new connection
  - Connection name: `github-ryzer-connection`
  - Authorize GitHub
  - Install AWS Connector app
  - Select repository
- Repository name: `yasheela-alla/Ryzer-Devops-assignment`
- Branch name: `main`
- Change detection options: Start the pipeline on source code change
- Output artifact format: CodePipeline default

Click Next.

**Build stage:**
- Build provider: AWS CodeBuild
- Region: US East (N. Virginia)
- Project name: `ryzer-codebuild-project`
- Build type: Single build

Click Next.

**Deploy stage:**
- Deploy provider: Amazon S3
- Region: US East (N. Virginia)
- Bucket: `ryzer-tokenized-assets-demo`
- S3 object key: Leave empty
- Extract file before deploy: Yes
- Deployment path: Leave empty
- Canned ACL: None

Click Next.

**Review:**
- Verify all stages
- Create pipeline

<img width="1919" height="625" alt="Screenshot 2025-10-03 131150" src="https://github.com/user-attachments/assets/b4358ddc-1de5-4d80-be8f-974390f35579" />


Pipeline starts automatically.

---

## Part 5: Monitor Pipeline Execution

### Pipeline Stages

**Source:**
- Pulls latest code from GitHub main branch
- Creates source artifact

**Build:**
- CodeBuild downloads source
- Runs buildspec.yml commands
- Installs Node.js 18
- Runs npm ci
- Executes npm run build
- Packages artifacts

**Deploy:**
- Extracts build artifacts
- Uploads to S3 bucket root
- Overwrites existing files

<img width="1919" height="1080" alt="Screenshot 2025-10-03 131036" src="https://github.com/user-attachments/assets/ab446464-e76c-45fa-9ff5-b3a226ab7c43" />


### View Logs

**CodeBuild logs:**
1. Click on Build stage
2. View details
3. Link to execution details
4. View build logs

**CloudWatch logs:**
```bash
aws logs tail /aws/codebuild/ryzer-codebuild-project --follow
```

---

## Part 6: Verify Deployment

### Access Application

Open S3 website endpoint:
```
http://ryzer-tokenized-assets-demo.s3-website-us-east-1.amazonaws.com
```

Should show your Next.js application.

### Verify Files in S3

```bash
aws s3 ls s3://ryzer-tokenized-assets-demo/
```

Should see:
- index.html
- _next/ directory
- Static assets
- Other build output

---

## Part 7: Test Auto-Deployment

### Make a Code Change

```bash
# Edit a file locally
git add .
git commit -m "Test CodePipeline auto-deploy"
git push origin main
```

### Watch Pipeline Trigger

1. Go to CodePipeline console
2. See new execution start automatically
3. Monitor each stage
4. Wait for completion

### Verify Changes Live

Refresh S3 website endpoint - changes should be visible.

---

## Troubleshooting

### Build Fails - Wrong Output Directory

**Error:** Artifacts not found in `out` directory

**Solution:** Check Next.js export configuration

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Required for static export
};

export default nextConfig;
```

Update buildspec.yml if using different directory:
```yaml
artifacts:
  base-directory: .next  # or dist, or build
```

### Build Fails - Node Version

**Error:** Node.js version mismatch

**Solution:** Update buildspec.yml:
```yaml
install:
  runtime-versions:
    nodejs: 18  # or 16, 20
```

### Pipeline Not Triggering

**Error:** Push to GitHub doesn't start pipeline

**Solution:**
1. Verify GitHub connection active
2. Check branch name matches
3. Verify webhook exists in GitHub repo settings
4. Reconnect GitHub if needed

### S3 Access Denied

**Error:** 403 Forbidden when accessing website

**Solution:**
1. Verify "Block all public access" is OFF
2. Check bucket policy applied correctly
3. Ensure static website hosting enabled
4. Check files have public-read permissions

### Files Not Extracting

**Error:** Zip file visible in S3 instead of files

**Solution:**
- Ensure "Extract file before deploy" is checked in deploy stage
- Artifacts packaging in CodeBuild should be "None"

---

## Cost Breakdown

| Service | Usage | Cost |
|---------|-------|------|
| CodePipeline | 1 active pipeline | $1.00/month |
| CodeBuild | ~100 build minutes | $1.00/month |
| S3 Storage | 1GB | $0.02/month |
| S3 Requests | 10,000 GET | $0.04/month |
| Data Transfer | 1GB out | $0.09/month |
| **Total** | | **~$2.15/month** |

Free tier covers most usage for demo purposes.

---

## Cleanup

### Delete Pipeline
```bash
aws codepipeline delete-pipeline --name ryzer-cicd-pipeline
```

### Delete CodeBuild Project
```bash
aws codebuild delete-project --name ryzer-codebuild-project
```

### Delete S3 Bucket
```bash
# Delete all objects first
aws s3 rm s3://ryzer-tokenized-assets-demo --recursive

# Delete bucket
aws s3 rb s3://ryzer-tokenized-assets-demo
```

### Delete IAM Roles

1. Console → IAM → Roles
2. Delete `codebuild-ryzer-service-role`
3. Delete `AWSCodePipelineServiceRole-ryzer`

---

## Comparison with Jenkins Approach

| Aspect | CodePipeline + S3 | Jenkins |
|--------|-------------------|---------|
| Setup Time | 15 minutes | 1-2 hours |
| Infrastructure | Serverless | 3 EC2 instances |
| Maintenance | Fully managed | Manual updates |
| Cost | ~$2/month | ~$70/month |
| Flexibility | Limited to AWS | Cloud-agnostic |
| Customization | AWS services only | Any tool/script |
| Code Quality Gates | Limited | Full SonarQube |
| Monitoring | CloudWatch only | Grafana + Prometheus |

**Use CodePipeline when:**
- Quick deployment needed
- AWS-committed infrastructure
- Simple build requirements
- Limited budget

**Use Jenkins when:**
- Need custom tools (SonarQube, etc.)
- Multi-cloud strategy
- Complex build workflows
- Full control required
