# AWS DevOps Deployment Guide - Ryzer Tokenized Assets

Complete CI/CD pipeline implementation using Jenkins, SonarQube, and AWS infrastructure.

## Architecture

```
GitHub → Jenkins (CI/CD) → SonarQube (Code Quality) → EC2 (Next.js App) → Grafana (Monitoring)
```

## Infrastructure Components

| Server | Purpose | Instance Type | Services | Port |
|--------|---------|---------------|----------|------|
| Jenkins Server | CI/CD orchestration, monitoring | t2.medium | Jenkins, Grafana, Prometheus | 8080, 3000, 9090 |
| SonarQube Server | Code quality analysis | t2.medium | SonarQube (Docker) | 9000 |
| App Server | Application hosting | t2.small | Next.js, PM2 | 3000 |

---

## Prerequisites

### Tools
```bash
node --version    # v18+
npm --version     # v9+
git --version
aws --version
```

### AWS Setup
```bash
aws configure
# AWS Access Key ID: YOUR_KEY
# AWS Secret Access Key: YOUR_SECRET
# Region: us-east-1
# Output: json
```

### GitHub Repository
```bash
git clone https://github.com/yasheela-alla/Ryzer-Devops-assignment.git
cd Ryzer-Devops-assignment
```

---

## Part 1: Infrastructure Setup

### Step 1: Launch EC2 Instances

**Jenkins Server:**
- Name: `jenkins-server`
- AMI: Ubuntu Server 22.04 LTS
- Instance Type: t2.medium
- Key Pair: Create new `devops-key.pem`
- Security Group: `jenkins-sg`
  - SSH (22): 0.0.0.0/0
  - Custom TCP (8080): 0.0.0.0/0
  - Custom TCP (3000): 0.0.0.0/0
- Storage: 25 GiB

**SonarQube Server:**
- Name: `sonarqube-server`
- AMI: Ubuntu Server 22.04 LTS
- Instance Type: t2.medium
- Key Pair: Use existing `devops-key.pem`
- Security Group: `sonarqube-sg`
  - SSH (22): 0.0.0.0/0
  - Custom TCP (9000): 0.0.0.0/0
- Storage: 25 GiB

**App Server:**
- Name: `app-server`
- AMI: Ubuntu Server 22.04 LTS
- Instance Type: t2.small
- Key Pair: Use existing `devops-key.pem`
- Security Group: `app-sg`
  - SSH (22): 0.0.0.0/0
  - Custom TCP (3000): 0.0.0.0/0
- Storage: 20 GiB

---

## Part 2: Jenkins Server Setup

### SSH Connection
```bash
ssh -i devops-key.pem ubuntu@<JENKINS_IP>
```

### Install Java & Jenkins
```bash
sudo apt update
sudo apt install -y openjdk-17-jdk

curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt update
sudo apt install -y jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Get initial password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

### Access Jenkins
```
http://<JENKINS_IP>:8080
```
- Install suggested plugins
- Create admin user: `admin/admin123`

### Install Required Plugins
Navigate to: Manage Jenkins → Plugins → Available plugins

Install:
- NodeJS
- SonarQube Scanner
- SSH Agent
- Git
- Pipeline

Restart Jenkins after installation.

### Configure Tools

**Manage Jenkins → Tools:**

**NodeJS:**
- Name: `NodeJS-20`
- Install automatically: ✓
- Version: NodeJS 20.x.x

**SonarQube Scanner:**
- Name: `SonarQubeScanner`
- Install automatically: ✓
- Version: Latest

---

## Part 3: SonarQube Server Setup

### SSH Connection
```bash
ssh -i devops-key.pem ubuntu@<SONARQUBE_IP>
```

### Install Docker & SonarQube
```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
exit
```

Reconnect and start SonarQube:
```bash
ssh -i devops-key.pem ubuntu@<SONARQUBE_IP>
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts-community
```

### Access SonarQube
```
http://<SONARQUBE_IP>:9000
```
- Login: `admin/admin`
- Change password to: `admin123`

### Create Project
1. Projects → Create Project → Manually
2. Project display name: `Ryzer DevOps`
3. Project key: `ryzer-devops`
4. Main branch: `main`
5. Set Up → Use the global setting
6. Create project

### Generate Token
1. My Account → Security
2. Generate Token:
   - Name: `jenkins-scanner`
   - Type: Global Analysis Token
   - Expires: 30 days
3. Copy token (starts with `squ_`)

---

## Part 4: App Server Setup

### SSH Connection
```bash
ssh -i devops-key.pem ubuntu@<APP_IP>
```

### Install Node.js & Git
```bash
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git
```

### Clone & Setup Application
```bash
git clone https://github.com/yasheela-alla/Ryzer-Devops-assignment.git
cd Ryzer-Devops-assignment
```

### Fix Next.js Configuration
```bash
nano next.config.mjs
```
Remove or comment out: `output: 'export'`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',  // Removed for server-side rendering
};

export default nextConfig;
```

### Build & Deploy
```bash
npm install
npm run build
sudo npm install -g pm2
pm2 start npm --name "ryzer-app" -- start
pm2 save
pm2 startup
```

Verify:
```bash
pm2 status
curl localhost:3000
```

---

## Part 5: Jenkins Pipeline Configuration

### Configure SonarQube Connection

**Manage Jenkins → System → SonarQube servers:**
- Name: `SonarQube`
- Server URL: `http://<SONARQUBE_IP>:9000`
- Server authentication token:
  - Add → Jenkins → Secret text
  - Secret: `<SONARQUBE_TOKEN>`
  - ID: `sonarqube-scanner-token`
  - Description: `SonarQube Scanner Token`

### Add SSH Credentials

**Manage Jenkins → Credentials → System → Global credentials:**
- Add Credentials
- Kind: SSH Username with private key
- ID: `app-server-key`
- Description: `App Server SSH Key`
- Username: `ubuntu`
- Private Key: Enter directly (paste entire `devops-key.pem` content)

### Create Pipeline

**New Item:**
- Name: `Ryzer-DevOps-Pipeline`
- Type: Pipeline
- Description: `DevOps pipeline for Ryzer Next.js app with SonarQube analysis`

**General:**
- GitHub project: ✓
- Project url: `https://github.com/yasheela-alla/Ryzer-Devops-assignment/`

**Build Triggers:**
- GitHub hook trigger for GITScm polling: ✓

**Pipeline Script:**
copy from Jenkinsfile

Save and run: **Build Now**

---

## Part 6: Grafana & Prometheus Setup

### Install Grafana (Jenkins Server)
```bash
ssh -i devops-key.pem ubuntu@<JENKINS_IP>

sudo apt-get install -y apt-transport-https software-properties-common wget
sudo wget -q -O /usr/share/keyrings/grafana.key https://apt.grafana.com/gpg.key
echo "deb [signed-by=/usr/share/keyrings/grafana.key] https://apt.grafana.com stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list

sudo apt-get update
sudo apt-get install grafana
sudo systemctl daemon-reload
sudo systemctl start grafana-server
sudo systemctl enable grafana-server.service
```

### Install Prometheus & Node Exporter
```bash
cd ~
wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
tar xvfz node_exporter-1.6.1.linux-amd64.tar.gz
cd node_exporter-1.6.1.linux-amd64
nohup ./node_exporter > node_exporter.log 2>&1 &

cd ~
wget https://github.com/prometheus/prometheus/releases/download/v2.47.0/prometheus-2.47.0.linux-amd64.tar.gz
tar xvfz prometheus-2.47.0.linux-amd64.tar.gz
cd prometheus-2.47.0.linux-amd64
```

### Configure Prometheus
```bash
nano prometheus.yml
```

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node_exporter'
    static_configs:
      - targets: ['localhost:9100']

  - job_name: 'jenkins'
    metrics_path: '/prometheus'
    static_configs:
      - targets: ['localhost:8080']
```

Start Prometheus:
```bash
nohup ./prometheus --config.file=prometheus.yml > prometheus.log 2>&1 &
```

### Configure Grafana

Access: `http://<JENKINS_IP>:3000`
- Login: `admin/admin`
- Change password to: `admin123`

**Add Data Source:**
1. Connections → Data sources → Add data source
2. Select: Prometheus
3. URL: `http://localhost:9090`
4. Save & test

**Import Dashboard:**
1. Dashboards → Import
2. Dashboard ID: `1860` (Node Exporter Full)
3. Select Prometheus data source
4. Import

---

## Challenges & Solutions

### Challenge 1: SonarQube Authentication Error
**Error:** `Not authorized. Please provide a user token in sonar.login`

**Solution:**
- Added token to Jenkins credentials store
- Updated pipeline to use `withCredentials` for secure token injection

### Challenge 2: Next.js Static Export Conflict
**Error:** `"next start" does not work with "output: export" configuration`

**Solution:**
- Removed `output: 'export'` from `next.config.mjs`
- Used PM2 for proper Node.js process management

### Challenge 3: PM2 Process Management
**Issue:** App not persisting after server restart

**Solution:**
```bash
pm2 startup
pm2 save
```

### Challenge 4: Grafana GPG Key Error
**Error:** `GPG error: The following signatures couldn't be verified`

**Solution:**
```bash
sudo mkdir -p /etc/apt/keyrings/
wget -q -O - https://apt.grafana.com/gpg.key | gpg --dearmor | sudo tee /etc/apt/keyrings/grafana.gpg > /dev/null
echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] https://apt.grafana.com stable main" | sudo tee /etc/apt/sources.list.d/grafana.list
```

---

## Daily Startup Commands

### Check Instance IPs
AWS Console → EC2 → Instances → Note new public IPs

### Start Services

**Jenkins Server:**
```bash
ssh -i devops-key.pem ubuntu@<NEW_JENKINS_IP>
sudo systemctl start jenkins
sudo systemctl start grafana-server
cd ~/prometheus-2.47.0.linux-amd64 && nohup ./prometheus --config.file=prometheus.yml > prometheus.log 2>&1 &
```

**SonarQube Server:**
```bash
ssh -i devops-key.pem ubuntu@<NEW_SONARQUBE_IP>
sudo systemctl start docker
docker start sonarqube
```

**App Server:**
```bash
ssh -i devops-key.pem ubuntu@<NEW_APP_IP>
cd ~/Ryzer-Devops-assignment
pm2 restart ryzer-app
```

### Update Jenkins Pipeline
1. Jenkins → Ryzer-DevOps-Pipeline → Configure
2. Update `APP_SERVER_IP` environment variable
3. Update SonarQube URL in pipeline script
4. Manage Jenkins → System → Update SonarQube server URL

---

## Verification Commands

### System Health Check

**Jenkins Server:**
```bash
systemctl is-active jenkins
systemctl is-active grafana-server
ps aux | grep prometheus | grep -v grep
curl localhost:8080
curl localhost:3000
curl localhost:9090
```

**SonarQube Server:**
```bash
docker ps --filter name=sonarqube
curl localhost:9000
```

**App Server:**
```bash
pm2 status
pm2 logs ryzer-app --lines 20
curl localhost:3000
```

---

## Access URLs

Replace with your current IPs:

```
Jenkins:    http://<JENKINS_IP>:8080
SonarQube:  http://<SONARQUBE_IP>:9000
Grafana:    http://<JENKINS_IP>:3000
Application: http://<APP_IP>:3000
```

---

## Cost Breakdown (Monthly)

| Service | Usage | Cost |
|---------|-------|------|
| EC2 t2.medium (x2) | 730 hours | ~$48 |
| EC2 t2.small (x1) | 730 hours | ~$17 |
| EBS Storage (70GB) | - | ~$7 |
| Data Transfer | ~5GB | ~$0.45 |
| **Total** | | **~$72/month** |

**Cost Optimization:**
- Use Reserved Instances: Save 30-70%
- Stop instances when not in use
- Use Elastic IPs only when instances are running
- Implement auto-scaling for production

---

## Production Enhancements

### Security
- [ ] Enable HTTPS with ACM certificates
- [ ] Implement AWS Secrets Manager
- [ ] Configure WAF rules
- [ ] Enable CloudTrail logging
- [ ] Set up VPC with private subnets

### Scalability
- [ ] Add Application Load Balancer
- [ ] Configure Auto Scaling Groups
- [ ] Implement blue-green deployments
- [ ] Add CloudFront CDN
- [ ] Set up RDS for database

### Monitoring
- [ ] Configure CloudWatch alarms
- [ ] Add custom Grafana dashboards
- [ ] Implement ELK stack for logs
- [ ] Set up PagerDuty/Slack notifications
- [ ] Add APM tools (New Relic/DataDog)

### CI/CD
- [ ] Add automated testing stages
- [ ] Implement quality gates in SonarQube
- [ ] Add staging environment
- [ ] Configure rollback mechanisms
- [ ] Add approval steps for production

---

## Quick Reference

### Restart All Services
```bash
# Jenkins Server
sudo systemctl restart jenkins grafana-server
cd ~/prometheus-2.47.0.linux-amd64 && pkill prometheus && nohup ./prometheus --config.file=prometheus.yml > prometheus.log 2>&1 &

# SonarQube Server  
docker restart sonarqube

# App Server
pm2 restart ryzer-app
```

### View Logs
```bash
# Jenkins
sudo journalctl -u jenkins -f

# SonarQube
docker logs sonarqube -f

# App
pm2 logs ryzer-app

# Prometheus
tail -f ~/prometheus-2.47.0.linux-amd64/prometheus.log
```

### Troubleshooting
```bash
# Check ports
sudo netstat -tlnp | grep LISTEN

# Check processes
ps aux | grep -E 'jenkins|sonar|pm2|prometheus'

# Check disk space
df -h

# Check memory
free -h
```
