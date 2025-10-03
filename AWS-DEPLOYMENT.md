# AWS DevOps Deployment Guide - Ryzer Tokenized Assets

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Local Test with Docker](#quick-local-test-with-docker)
3. [AWS Deployment Methods](#aws-deployment-methods)
    - [Method 1: AWS Amplify (Easiest - 5 Minutes)](#method-1-aws-amplify)
    - [Method 2: AWS CodePipeline + S3 (Professional CI/CD)](#method-2-aws-codepipeline--s3)
    - [Method 3: Docker + ECR + ECS (Advanced Container Deployment)](#method-3-docker--ecr--ecs)
4. [Monitoring & Best Practices](#monitoring--best-practices)
5. [Quick Commands Cheat Sheet](#quick-commands-cheat-sheet)
6. [Cost Breakdown](#cost-breakdown-monthly-estimates)

## Prerequisites

### Required Tools

```bash
# Check if you have these installed:
node --version    # Need v18 or higher
npm --version     # Need v9 or higher
git --version     # Any recent version
docker --version  # Optional but recommended
````

### AWS Account Setup

1. Create an AWS account: [https://aws.amazon.com](https://aws.amazon.com)
2. Install AWS CLI: [https://aws.amazon.com/cli/](https://aws.amazon.com/cli/)
3. Configure AWS credentials:

```bash
aws configure
# Enter your:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-east-1)
# - Output format: json
```

### GitHub Setup

1. Create a GitHub account (if needed)
2. Create a new repo: `ryzer-tokenized-assets`
3. Push your code:

```bash
git init
git add .
git commit -m "Initial commit - Ryzer Tokenized Assets Platform"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/REPO-NAME.git
git push -u origin main
```

## Quick Local Test with Docker

### Step 1: Build Docker Image

```bash
docker build -t ryzer-app .
```

### Step 2: Run Container

```bash
docker run -p 3000:3000 ryzer-app
```

### Step 3: Test Locally

Open your browser: `http://localhost:3000`

### Alternative: Docker Compose

```bash
docker-compose up
```

To stop:

```bash
docker-compose down
```

## AWS Deployment Methods

Choose based on your demo needs:

| Method                | Difficulty | Time   | Best For                         |
| --------------------- | ---------- | ------ | -------------------------------- |
| **AWS Amplify**       | ⭐ Easy     | 5 min  | Quick demo, automatic CI/CD      |
| **CodePipeline + S3** | ⭐⭐ Medium  | 15 min | Professional CI/CD pipeline      |
| **Docker + ECS**      | ⭐⭐⭐ Hard   | 30 min | Container orchestration showcase |


## Method 1: AWS Amplify

**Best for:** Quick demo with automatic deployments

### Step 1: Open Amplify Console

1. Go to AWS Console
2. Search for “Amplify”
3. Click “Get Started” under **Amplify Hosting**

### Step 2: Connect GitHub Repo

1. Choose GitHub as the source
2. Authorize Amplify
3. Select repo: `ryzer-tokenized-assets`
4. Select branch: `main`
5. Click **Next**

### Step 3: Build Settings (Auto-detected)

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: out
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Step 4: Deploy

1. Click **Next**
2. Review settings
3. Click **Save and Deploy**

### Step 5: Access App

Example URL:
`https://main.d1234abcd.amplifyapp.com`

✅ **Done! Auto-deploys on every GitHub push**


## Method 2: AWS CodePipeline + S3

**Best for:** Professional CI/CD demonstration

### Architecture

```
GitHub → CodePipeline → CodeBuild → S3 → CloudFront (optional)
```

### Step 1: Create S3 Bucket

```bash
aws s3 mb s3://ryzer-tokenized-assets-demo --region us-east-1
```

Or via Console:

* Uncheck "Block all public access"
* Enable static hosting

### Step 2: Enable Static Website Hosting

```bash
aws s3 website s3://ryzer-tokenized-assets-demo \
  --index-document index.html \
  --error-document 404.html
```

### Step 3: Set Bucket Policy

`bucket-policy.json`:

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

Apply it:

```bash
aws s3api put-bucket-policy \
  --bucket ryzer-tokenized-assets-demo \
  --policy file://bucket-policy.json
```

### Step 4: Create CodeBuild Project

Follow AWS Console instructions (details unchanged)

### Step 5: Create CodePipeline

Follow AWS Console instructions (details unchanged)

### Step 6: Watch It Deploy 🚀

Check site at:
`http://ryzer-tokenized-assets-demo.s3-website-us-east-1.amazonaws.com`

### Step 7: Test Auto-Deploy

```bash
git add .
git commit -m "Test auto-deployment"
git push
```

## Method 3: Docker + ECR + ECS

**Best for:** Demonstrating container orchestration skills

### Architecture

```
GitHub → CodePipeline → CodeBuild → ECR → ECS Fargate
```

### Step 1: Create ECR Repository

```bash
aws ecr create-repository \
  --repository-name ryzer-tokenized-assets \
  --region us-east-1
```

### Step 2: Build and Push Docker Image

```bash
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker build -t ryzer-tokenized-assets .
docker tag ryzer-tokenized-assets:latest \
  YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ryzer-tokenized-assets:latest

docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ryzer-tokenized-assets:latest
```

### Step 3: Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name ryzer-cluster --region us-east-1
```

### Step 4: Create Task Definition

Create `task-definition.json` (details unchanged), then:

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### Step 5: Create ECS Service

```bash
aws logs create-log-group --log-group-name /ecs/ryzer-task

aws ecs create-service \
  --cluster ryzer-cluster \
  --service-name ryzer-service \
  --task-definition ryzer-task \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}"
```

### Step 6: Access Application

```bash
aws ecs list-tasks --cluster ryzer-cluster --service-name ryzer-service
aws ecs describe-tasks --cluster ryzer-cluster --tasks TASK_ARN
```

Visit: `http://PUBLIC_IP:3000`


## Monitoring & Best Practices

### Monitoring with CloudWatch

* Check logs: `/ecs/ryzer-task`
* Set alarms: build failures, crashes, etc.

### Cost Optimization

```bash
aws ecs update-service --cluster ryzer-cluster --service ryzer-service --desired-count 0
aws ecs update-service --cluster ryzer-cluster --service ryzer-service --desired-count 1
```

### Security

* Use **IAM roles** (never store credentials in code)
* Use **Secrets Manager**
* Enable **CloudTrail**
* Add **SSL (CloudFront)**

## Quick Commands Cheat Sheet

```bash
# Local Development
npm install            # Install dependencies
npm run dev            # Run locally
npm run build          # Build production app
docker-compose up      # Run with Docker
docker-compose down    # Stop Docker

# AWS Deployment
aws s3 sync out/ s3://BUCKET-NAME --delete              # Deploy to S3
aws ecr get-login-password | docker login ...           # Login to ECR
docker build -t ryzer-app .                             # Build Docker image
docker push YOUR_ECR_URL                                # Push to ECR
aws ecs update-service ...                              # Update ECS service

# Monitoring
aws logs tail /ecs/ryzer-task --follow                  # ECS logs
aws codebuild list-builds                               # List CodeBuild builds
aws codepipeline get-pipeline-state ...                 # Check pipeline status
```

---

## Cost Breakdown (Monthly Estimates)

| Service                | Usage                 | Estimated Cost |
| ---------------------- | --------------------- | -------------- |
| **S3**                 | 1GB + 10,000 requests | ~$0.50         |
| **CodePipeline**       | 1 active pipeline     | ~$1.00         |
| **CodeBuild**          | 100 build minutes     | ~$1.00         |
| **ECS Fargate**        | 1 task, running 24/7  | ~$15.00        |
| **CloudWatch**         | Basic logging         | ~$0.50         |
| **Total (S3 Method)**  |                       | **~$3/month**  |
| **Total (ECS Method)** |                       | **~$18/month** |

