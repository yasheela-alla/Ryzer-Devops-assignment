# Ryzer Tokenized Assets Platform - DevOps Implementation

Production-grade CI/CD pipeline for Next.js application using Jenkins, SonarQube, and AWS infrastructure.  

**Developed by Yasheela Alla for [ryzer.app](https://www.ryzer.app)**

<img width="1919" height="1111" alt="Screenshot 2025-10-04 155651" src="https://github.com/user-attachments/assets/7d259764-5114-49f6-8699-1d366c4a44d4" />

## Project Overview

Full-stack tokenized assets trading platform with automated deployment pipeline, code quality enforcement, and comprehensive monitoring.

**Tech Stack:**
- Frontend: Next.js 14, React, TypeScript, Tailwind CSS
- Backend: Next.js API Routes
- DevOps: Jenkins, SonarQube, Grafana, Prometheus
- Infrastructure: AWS EC2, Ubuntu 22.04
- Process Management: PM2
- Version Control: GitHub

## Architecture

```
┌─────────┐     ┌─────────┐     ┌───────────┐     ┌───────────┐     ┌─────────┐
│ GitHub  │───▶│ Jenkins │────▶│ SonarQube │───▶│   Build   │────▶│   EC2   │
│         │     │  CI/CD  │     │  Analysis │     │  Process  │     │   App   │
└─────────┘     └─────────┘     └───────────┘     └───────────┘     └─────────┘
                     │                                                     │
                     │                                                     │
                     ▼                                                     ▼
                ┌──────────┐                                         ┌────────┐
                │ Grafana  │◀───────────────────────────────────────│   PM2   │
                │ Monitring│          Prometheus Metrics             │ Process │
                └──────────┘                                         └─────────┘
```

## Infrastructure

### Server Configuration

| Server | Purpose | Specs | Services | Ports |
|--------|---------|-------|----------|-------|
| jenkins-server | CI/CD + Monitoring | t2.medium, 25GB | Jenkins, Grafana, Prometheus | 8080, 3000, 9090 |
| sonarqube-server | Code Quality | t2.medium, 25GB | SonarQube (Docker) | 9000 |
| app-server | Application | t2.small, 20GB | Next.js, PM2 | 3000 |

## Pipeline Stages

1. **Git Checkout** - Clone repository from GitHub
2. **Install Dependencies** - npm install with package-lock.json
3. **SonarQube Analysis** - Code quality and security scanning
4. **Build Application** - Production build with optimizations
5. **Deploy to EC2** - SSH deployment with PM2 restart


## Quick Start

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
git
AWS account with EC2 access
GitHub account
```

### Local Development
```bash
# Clone repository
git clone https://github.com/yasheela-alla/Ryzer-Devops-assignment.git
cd Ryzer-Devops-assignment

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```


## Environment Variables

```env
# Not required for current setup
# Future production variables:
# DATABASE_URL=
# API_KEY=
# SECRET_KEY=
```

## CI/CD Configuration

### Jenkins Pipeline
Location: Jenkins → Ryzer-DevOps-Pipeline

Key configurations:
- NodeJS 20.x runtime
- SonarQube integration
- SSH agent for deployment
- Automatic GitHub webhook triggers

### SonarQube
Project: `ryzer-devops`
Quality Profile: Sonar way (default)
Quality Gate: Enforced on pipeline

### PM2 Process Manager
```bash
pm2 start npm --name "ryzer-app" -- start
pm2 save
pm2 startup
```

## Monitoring

### Grafana Dashboards
- Node Exporter Full (ID: 1860)
- System metrics visualization
- Real-time monitoring

### Prometheus Targets
- Jenkins: http://localhost:8080/prometheus
- Node Exporter: http://localhost:9100/metrics
- Prometheus: http://localhost:9090

## Troubleshooting

### Common Issues

**Pipeline fails at SonarQube stage:**
```bash
# Verify SonarQube is running
docker ps --filter name=sonarqube

# Check SonarQube logs
docker logs sonarqube

# Verify token in Jenkins credentials
```

**App not starting with PM2:**
```bash
# Check PM2 logs
pm2 logs ryzer-app

# Verify Next.js configuration
cat next.config.mjs

# Rebuild application
npm run build
pm2 restart ryzer-app
```

**Grafana shows no data:**
```bash
# Verify Prometheus is running
ps aux | grep prometheus

# Check Prometheus targets
curl localhost:9090/api/v1/targets

# Restart Prometheus
pkill prometheus
cd ~/prometheus-2.47.0.linux-amd64
nohup ./prometheus --config.file=prometheus.yml > prometheus.log 2>&1 &
```

### Debug Commands

```bash
# Check service status
systemctl status jenkins
systemctl status grafana-server
docker ps

# View logs
sudo journalctl -u jenkins -f
docker logs sonarqube -f
pm2 logs ryzer-app --lines 50

# Check ports
sudo netstat -tlnp | grep LISTEN

# Check disk space
df -h

# Check memory
free -h
```

## Performance Optimization

### Build Optimization
- npm ci for faster, deterministic installs
- node_modules caching in buildspec
- Incremental builds with Next.js
- Production optimizations enabled

### Application Performance
- Server-side rendering
- Code splitting
- Image optimization
- Static generation where applicable

### Infrastructure
- PM2 cluster mode for multi-core usage
- Prometheus metric caching
- Grafana query optimization

## Security Best Practices

1. **Credentials Management**
   - No credentials in code
   - Jenkins credentials store
   - SSH key-based authentication

2. **Network Security**
   - Security groups with least privilege
   - SSH limited to required ports
   - Application firewall rules

3. **Code Security**
   - SonarQube security scanning
   - Dependency vulnerability checks
   - Regular security updates

4. **Access Control**
   - IAM roles for AWS services
   - Jenkins user authentication
   - SonarQube access tokens

## Cost Optimization

### Current Monthly Cost: ~$72

**Breakdown:**
- 2x t2.medium: ~$48/month
- 1x t2.small: ~$17/month
- EBS storage (70GB): ~$7/month
- Data transfer: ~$0.45/month

**Optimization Strategies:**
- Stop instances when not in use
- Use Reserved Instances (save 30-70%)
- Implement auto-scaling
- Use Spot Instances for non-critical workloads
- Elastic IPs only when instances running
  

## Testing

### Local Testing
```bash
npm test                 # Run unit tests
npm run lint            # Lint code
npm run type-check      # TypeScript checks
```


## License

This project is part of the Ryzer DevOps internship assignment.
