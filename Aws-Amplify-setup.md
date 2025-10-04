# AWS Amplify Deployment Guide

Fastest deployment method for Next.js applications with automatic CI/CD.

## Architecture

```
GitHub → AWS Amplify → CloudFront CDN
```

## What is AWS Amplify?

Fully managed hosting service for modern web applications with:
- Automatic CI/CD from GitHub
- Global CDN distribution
- SSL certificates
- Preview environments
- Zero infrastructure management

---

## Prerequisites

- AWS Account
- GitHub repository with Next.js project
- GitHub OAuth access

---

## Part 1: Access AWS Amplify

### Console Setup

1. AWS Console → Search "Amplify"
2. Click "AWS Amplify"
3. Under "Amplify Hosting", click "Get started"

---

## Part 2: Connect GitHub Repository

### Step 1: Select Source Provider

- Choose: **GitHub**
- Click "Continue"

### Step 2: Authorize GitHub

1. "Authorize AWS Amplify" popup opens
2. Click "Authorize aws-amplify-console"
3. Enter GitHub password if prompted
4. Install & Authorize

### Step 3: Select Repository

- Select repository: `yasheela-alla/Ryzer-Devops-assignment`
- Select branch: `main`
- Click "Next"

**Webhook automatically created** - every push triggers deployment

---

## Part 3: Configure Build Settings

### Auto-Detected Configuration

Amplify detects Next.js and generates:

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
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Customize if Needed

**For static export:**
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
    baseDirectory: out  # Change if using static export
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Environment Variables (Optional)

Add if needed:
- `NODE_ENV`: `production`
- `NEXT_PUBLIC_API_URL`: `https://api.example.com`
- Custom variables

Click "Next"

---

## Part 4: Review and Deploy

### Review Settings

- App name: `ryzer-tokenized-assets`
- Environment: `main`
- Build settings: Auto-detected
- Branch: `main`

### Deploy

1. Click "Save and deploy"
2. Initial build starts automatically

### Build Phases

**Provision:**
- Spins up build environment
- Allocates resources

**Build:**
- Installs dependencies (`npm ci`)
- Runs build command (`npm run build`)
- Generates production assets

**Deploy:**
- Uploads assets to S3
- Configures CloudFront
- SSL certificate provisioned

**Verify:**
- Health checks
- Deployment validation

**Time:** 3-5 minutes first build, 1-2 minutes subsequent


<img width="1919" height="821" alt="Screenshot 2025-10-04 155602" src="https://github.com/user-attachments/assets/2c359be3-ce7a-4c4a-89de-8cda07c717ab" />

---

## Part 5: Access Application

### Get URL

Amplify provides:
```
https://main.d1a2b3c4d5e6f7.amplifyapp.com
```

Format: `https://{branch}.{app-id}.amplifyapp.com`

<img width="1918" height="1144" alt="Screenshot 2025-10-03 131101" src="https://github.com/user-attachments/assets/f1c77210-4c4b-4f98-bf0d-127e24e96181" />

### Verify Deployment

1. Click provided URL
2. Application loads
3. Check functionality

---

## Part 6: Test Auto-Deployment

### Make Code Change

```bash
# Local change
git add .
git commit -m "Test Amplify auto-deploy"
git push origin main
```

### Watch Build Trigger

1. Amplify console shows new build
2. No manual action required
3. Build progresses through stages
4. Deployment completes automatically

### Verify Update

Refresh application URL - changes visible

**Time:** Push to live in 2-3 minutes

---

## Part 7: Configure Custom Domain (Optional)

### Add Domain

1. App settings → Domain management
2. Add domain
3. Enter domain: `app.ryzer.com`

### DNS Configuration

Amplify provides:
- CNAME records
- DNS validation

Add to domain registrar:
```
Type: CNAME
Name: app
Value: {amplify-provided-value}
```

### SSL Certificate

- Auto-provisioned by AWS Certificate Manager
- Free
- Auto-renewal

**Time:** 15-30 minutes for DNS propagation

---

## Part 8: Branch Deployments

### Setup Multiple Environments

**Main branch (Production):**
```
https://main.d1a2b3c4d5e6f7.amplifyapp.com
```

**Develop branch (Staging):**
1. Connect branch → develop
2. Deploys to: `https://develop.d1a2b3c4d5e6f7.amplifyapp.com`

**Feature branches (Preview):**
- Auto-creates preview URL for each PR
- Preview: `https://pr-123.d1a2b3c4d5e6f7.amplifyapp.com`
- Auto-deletes when PR closed

### Environment Variables per Branch

Configure different variables:
- Main: Production API endpoints
- Develop: Staging endpoints
- Feature: Development endpoints

---

## Part 9: Monitoring & Logs

### Access Logs

1. Select app → main branch
2. View build details
3. Download logs

**Build phases visible:**
- Provision logs
- Build logs
- Deploy logs

### Metrics

**App settings → Monitoring:**
- Requests
- Data transferred
- Error rates
- Build durations

### CloudWatch Integration

Logs automatically sent to:
```
/aws/amplify/{app-id}/{branch-name}
```

---

## Part 10: Rollback

### View Deployment History

1. App → Branch → Deployments
2. All builds listed with:
   - Commit hash
   - Build number
   - Timestamp
   - Status

### Rollback to Previous Version

1. Select previous successful deployment
2. Click "Redeploy this version"
3. Previous version goes live

**Time:** 1-2 minutes

No code changes needed

---

## Troubleshooting

### Build Fails - Module Not Found

**Error:** `Cannot find module 'next'`

**Solution:**
```yaml
# Ensure using npm ci, not npm install
preBuild:
  commands:
    - npm ci  # Uses package-lock.json
```

### Build Fails - Memory

**Error:** `JavaScript heap out of memory`

**Solution:**
```yaml
build:
  commands:
    - NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### Wrong Output Directory

**Error:** No files found in artifacts

**Solution:** Match `baseDirectory` to your build output:
```yaml
artifacts:
  baseDirectory: .next  # or out, or dist
```

### Build Timeout

**Error:** Build exceeds 30 minutes

**Solution:**
- Optimize build process
- Remove unnecessary dependencies
- Contact AWS to increase limit

### Environment Variables Not Working

**Error:** Variables undefined in app

**Solution:**
- Prefix with `NEXT_PUBLIC_` for client-side access
- Rebuild after adding variables
- Check spelling/case sensitivity

---

## Cost Breakdown

### Pricing

| Component | Usage | Cost |
|-----------|-------|------|
| Build | First 1000 minutes/month | Free |
| Build | Additional per minute | $0.01 |
| Hosting | First 15GB served | Free |
| Hosting | Per GB after | $0.15 |
| Storage | Per GB/month | $0.023 |

### Example Monthly Cost

**Small app (Demo):**
- 50 builds × 2 min = 100 minutes: Free
- 5GB bandwidth: Free
- Total: **$0**

**Production app:**
- 200 builds × 3 min = 600 minutes: Free
- 50GB bandwidth: (50-15) × $0.15 = $5.25
- 2GB storage: $0.05
- Total: **~$5.30/month**

Free tier covers most development use cases.

---

## Amplify vs Other Methods

| Feature | Amplify | CodePipeline | Jenkins |
|---------|---------|--------------|---------|
| Setup Time | 5 min | 15 min | 2 hours |
| Infrastructure | None | Serverless | 3 servers |
| Maintenance | Zero | Minimal | Manual |
| Cost (demo) | $0 | $2/month | $70/month |
| Cost (production) | $5-10/month | $5-15/month | $70+/month |
| Custom Tools | No | Limited | Yes |
| Code Quality Gates | No | Basic | Full |
| Multi-cloud | No | No | Yes |
| Preview Environments | Yes | No | Manual |
| Rollback | 1-click | Manual | Manual |
| SSL | Auto | Manual | Manual |
| CDN | Included | Extra | Extra |

---

## When to Use Amplify

### Ideal For:
- Quick deployments
- MVP/Demo projects
- Static or SSR Next.js apps
- Teams without DevOps expertise
- AWS-committed infrastructure
- Need preview environments

### Not Ideal For:
- Complex build requirements
- Custom tooling (SonarQube, etc.)
- Multi-cloud deployments
- Long build times (>30 min)
- Need full pipeline control
- Regulated industries with audit requirements

---

### Performance Optimizations

1. App settings → Build settings
2. Enable: "Build image updates"
3. Amplify uses latest optimized build images

### Notifications

1. App settings → Notifications
2. Add email/SNS topic
3. Get alerts on:
   - Build success
   - Build failure
   - Deployment complete

---

## Cleanup

### Delete Application

1. App settings → General
2. Scroll to "Delete app"
3. Confirm deletion

**Resources deleted:**
- CloudFront distribution
- S3 buckets
- Build artifacts
- SSL certificates
- All branches

No manual cleanup needed.

---

## Migration from Amplify

### Export to Other Platforms

**If moving away:**

1. Build locally:
```bash
npm run build
```

2. Deploy artifacts to:
   - Vercel: `vercel deploy`
   - Netlify: `netlify deploy`
   - S3: `aws s3 sync out/ s3://bucket-name`
   - Custom server: SCP/FTP

3. Update DNS records

4. Delete Amplify app

---

## Comparison: Amplify vs Jenkins

### Amplify Approach

**Pros:**
- 5-minute setup
- $0 for demo usage
- Zero maintenance
- Auto SSL, CDN, scaling
- Preview environments

**Cons:**
- No SonarQube integration
- No custom tools
- AWS vendor lock-in
- Limited build customization

### Jenkins Approach (What We Built)

**Pros:**
- Full SonarQube integration
- Custom tools (Grafana, Prometheus)
- Cloud-agnostic
- Complete control
- Production-grade

**Cons:**
- 2-hour setup
- $70/month minimum
- Requires maintenance
- Manual SSL setup
- More complexity

### Recommendation

**For Ryzer Platform:**

Use **both** strategically:
- **Amplify:** Frontend deployments, preview environments, quick iterations
- **Jenkins:** Backend services, microservices with quality gates, production critical paths

Hybrid approach maximizes benefits of each.

---

I also explored AWS Amplify as an alternative deployment approach. While the Jenkins pipeline demonstrates deep DevOps expertise, Amplify shows understanding of AWS native services and modern deployment practices.

The setup took 5 minutes - I connected the GitHub repo, Amplify detected Next.js automatically, and deployed with zero infrastructure management. Every push triggers automatic builds and deployments through CloudFront's global CDN.
