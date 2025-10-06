# 🚀 Step 2: Complete Deployment Guide for Beginners

## 📋 Table of Contents
1. [Prerequisites Check](#prerequisites-check)
2. [Choosing Your Deployment Path](#choosing-your-deployment-path)
3. [Path A: Simple EC2 Deployment (Recommended for Beginners)](#path-a-simple-ec2-deployment)
4. [Path B: Docker Deployment on EC2](#path-b-docker-deployment)
5. [Path C: Full Kubernetes Deployment](#path-c-kubernetes-deployment)
6. [Domain & SSL Setup](#domain--ssl-setup)
7. [MongoDB Atlas Setup](#mongodb-atlas-setup)
8. [AWS S3 Setup](#aws-s3-setup)
9. [Email Configuration](#email-configuration)
10. [Monitoring & Backup](#monitoring--backup)
11. [Production Checklist](#production-checklist)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites Check

Before starting, ensure you have:
- ✅ AWS Free Tier account
- ✅ Domain name (e.g., shackles-symposium.com)
- ✅ Credit/Debit card (for AWS verification, won't be charged on Free Tier)
- ✅ Your project code ready locally
- ✅ Basic terminal/command prompt knowledge

**AWS Free Tier Includes:**
- 750 hours/month of EC2 t2.micro instance (12 months)
- 5 GB S3 storage
- 750 hours/month RDS database (we'll use MongoDB Atlas instead)
- Free SSL certificates via AWS Certificate Manager

---

## Choosing Your Deployment Path

### Path A: Simple EC2 Deployment ⭐ **RECOMMENDED FOR BEGINNERS**
- **Difficulty:** Beginner
- **Time:** 2-3 hours
- **Knowledge Required:** Basic Linux commands
- **Cost:** Free (within Free Tier)
- **Best For:** Learning, small projects, getting started

### Path B: Docker Deployment
- **Difficulty:** Intermediate
- **Time:** 3-4 hours
- **Knowledge Required:** Docker basics
- **Cost:** Free (within Free Tier)
- **Best For:** Better isolation, easier updates

### Path C: Kubernetes Deployment
- **Difficulty:** Advanced
- **Time:** 6-8 hours
- **Knowledge Required:** Docker + Kubernetes
- **Cost:** $70-150/month (EKS cluster)
- **Best For:** Production, scalability, high availability

**For your first deployment, I strongly recommend Path A!**

---

## Path A: Simple EC2 Deployment

This is the simplest way to get your application online.

### Step 1: Create an EC2 Instance

1. **Login to AWS Console**
   - Go to https://console.aws.amazon.com
   - Search for "EC2" in the top search bar
   - Click "EC2"

2. **Launch Instance**
   - Click orange "Launch Instance" button
   - **Name:** `shackles-symposium-server`
   
3. **Choose AMI (Operating System)**
   - Select: **Ubuntu Server 22.04 LTS (Free tier eligible)**
   - Architecture: **64-bit (x86)**

4. **Choose Instance Type**
   - Select: **t2.micro** (Free tier eligible - 1 vCPU, 1 GB RAM)
   - Click "Next"

5. **Create Key Pair** (IMPORTANT!)
   - Click "Create new key pair"
   - Name: `shackles-key`
   - Type: **RSA**
   - Format: **pem** (for Mac/Linux) or **ppk** (for Windows PuTTY)
   - Click "Create key pair"
   - **SAVE THIS FILE SAFELY!** You can't download it again

6. **Configure Network Settings**
   - Keep default VPC
   - **Enable** "Auto-assign public IP"
   - Create security group: `shackles-security-group`
   - Add these rules:
     - ✅ SSH (port 22) - Your IP
     - ✅ HTTP (port 80) - Anywhere (0.0.0.0/0)
     - ✅ HTTPS (port 443) - Anywhere (0.0.0.0/0)
     - ✅ Custom TCP (port 5000) - Anywhere (for testing backend)
     - ✅ Custom TCP (port 3000) - Anywhere (for testing frontend)

7. **Configure Storage**
   - **30 GB** gp3 (Free tier: up to 30 GB)
   - Leave other settings default

8. **Launch Instance**
   - Review everything
   - Click "Launch Instance"
   - Wait 2-3 minutes for instance to start

9. **Get Your Instance IP**
   - Go to EC2 Dashboard
   - Click on your instance
   - Copy the **Public IPv4 address** (e.g., 54.123.45.67)

### Step 2: Connect to Your Server

#### For Windows Users (Using PowerShell):

```powershell
# Navigate to where you saved your key
cd C:\Users\YourName\Downloads

# Fix key permissions (IMPORTANT!)
icacls shackles-key.pem /inheritance:r
icacls shackles-key.pem /grant:r "%USERNAME%:R"

# Connect to server (replace with YOUR IP)
ssh -i shackles-key.pem ubuntu@YOUR-EC2-IP
```

#### For Mac/Linux Users:

```bash
# Navigate to where you saved your key
cd ~/Downloads

# Fix key permissions
chmod 400 shackles-key.pem

# Connect to server (replace with YOUR IP)
ssh -i shackles-key.pem ubuntu@YOUR-EC2-IP
```

**First Connection:**
- Type "yes" when asked about fingerprint
- You should see a Ubuntu welcome message
- You're now inside your server! 🎉

### Step 3: Install Required Software on Server

Copy and paste these commands **one by one** in your SSH session:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x

# Install Git
sudo apt install -y git

# Install MongoDB (local instance)
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx (Reverse Proxy)
sudo apt install -y nginx

# Verify Nginx is running
sudo systemctl status nginx
```

### Step 4: Upload Your Project to Server

**Option 1: Using Git (Recommended)**

If your code is on GitHub:

```bash
# On the server
cd /home/ubuntu
git clone https://github.com/Harish-16072004/frontend.git shackles-symposium
cd shackles-symposium
```

**Option 2: Using SCP (if not on GitHub)**

On your **local machine** (not server):

```powershell
# Windows PowerShell
scp -i shackles-key.pem -r "C:\Users\Harish J\Desktop\shackles-master\shackles-symposium" ubuntu@YOUR-EC2-IP:/home/ubuntu/

# Mac/Linux
scp -i shackles-key.pem -r /path/to/shackles-symposium ubuntu@YOUR-EC2-IP:/home/ubuntu/
```

### Step 5: Configure Environment Variables

On the server:

```bash
# Navigate to backend
cd /home/ubuntu/shackles-symposium/BACKEND

# Create .env file
nano .env
```

Paste this configuration (update with YOUR values):

```env
# Server
NODE_ENV=production
PORT=5000

# Database (use MongoDB Atlas - see section below)
MONGODB_URI=mongodb://localhost:27017/shackles_symposium

# JWT (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-change-this
JWT_EXPIRE=7d

# Frontend URL (will update after domain setup)
FRONTEND_URL=http://YOUR-EC2-IP

# AWS S3 (see AWS S3 Setup section)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=shackles-uploads

# Email (see Email Configuration section)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Save and exit:** Press `Ctrl+X`, then `Y`, then `Enter`

Now configure frontend:

```bash
# Navigate to frontend
cd /home/ubuntu/shackles-symposium/FRONTEND

# Create .env file
nano .env
```

Paste:

```env
VITE_API_BASE_URL=http://YOUR-EC2-IP:5000/api
```

**Save and exit:** `Ctrl+X`, `Y`, `Enter`

### Step 6: Install Dependencies and Build

```bash
# Backend
cd /home/ubuntu/shackles-symposium/BACKEND
npm install --production

# Frontend
cd /home/ubuntu/shackles-symposium/FRONTEND
npm install
npm run build
```

This will take 5-10 minutes. Wait for completion.

### Step 7: Start Backend with PM2

```bash
cd /home/ubuntu/shackles-symposium/BACKEND

# Start backend
pm2 start src/server.js --name shackles-backend

# Save PM2 process list
pm2 save

# Setup PM2 to start on system reboot
pm2 startup
# Copy and run the command it shows

# Check status
pm2 status
pm2 logs shackles-backend
```

### Step 8: Configure Nginx for Frontend

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/shackles
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name YOUR-EC2-IP;  # Replace with your EC2 IP or domain

    # Frontend
    location / {
        root /home/ubuntu/shackles-symposium/FRONTEND/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**Save and exit:** `Ctrl+X`, `Y`, `Enter`

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/shackles /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 9: Test Your Deployment

1. Open browser and visit: `http://YOUR-EC2-IP`
2. You should see your frontend!
3. Test backend: `http://YOUR-EC2-IP/api/health`

**If it doesn't work, check logs:**

```bash
# Backend logs
pm2 logs shackles-backend

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

---

## Domain & SSL Setup

Now let's connect your domain and add HTTPS!

### Step 1: Point Domain to EC2

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find **DNS Settings** or **DNS Management**
3. Add these records:

```
Type: A
Name: @
Value: YOUR-EC2-IP
TTL: 3600

Type: A
Name: www
Value: YOUR-EC2-IP
TTL: 3600

Type: CNAME
Name: api
Value: yourdomain.com
TTL: 3600
```

Wait 5-30 minutes for DNS propagation.

### Step 2: Install SSL Certificate (Let's Encrypt - FREE!)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with YOUR domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (option 2)
```

Certbot will automatically configure Nginx for HTTPS!

### Step 3: Update Environment Variables

```bash
# Update backend .env
cd /home/ubuntu/shackles-symposium/BACKEND
nano .env
```

Change:
```env
FRONTEND_URL=https://yourdomain.com
```

Rebuild frontend:

```bash
cd /home/ubuntu/shackles-symposium/FRONTEND
nano .env
```

Change:
```env
VITE_API_BASE_URL=https://yourdomain.com/api
```

Rebuild:
```bash
npm run build
pm2 restart shackles-backend
```

### Step 4: Setup Auto-Renewal

SSL certificates expire every 90 days. Setup auto-renewal:

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically creates a cron job for renewal
# Check it's there:
sudo systemctl status certbot.timer
```

---

## MongoDB Atlas Setup

**Why MongoDB Atlas?**
- Free 512MB database
- Automatic backups
- Better than local MongoDB on EC2
- No maintenance required

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with email
3. Choose **FREE** tier (M0 Sandbox)

### Step 2: Create a Cluster

1. Click "Build a Database"
2. Choose **FREE** Shared Cluster
3. Select **AWS** as provider
4. Choose region closest to your EC2 (e.g., US East)
5. Name: `shackles-cluster`
6. Click "Create Cluster"

### Step 3: Create Database User

1. Go to "Database Access" (left sidebar)
2. Click "Add New Database User"
3. **Username:** `shackles_admin`
4. **Password:** Generate a strong password (SAVE IT!)
5. **Database User Privileges:** Read and write to any database
6. Click "Add User"

### Step 4: Whitelist IP Address

1. Go to "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, add only your EC2 IP
4. Click "Confirm"

### Step 5: Get Connection String

1. Go to "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string:
   ```
   mongodb+srv://shackles_admin:<password>@shackles-cluster.xxxxx.mongodb.net/shackles_symposium
   ```
5. Replace `<password>` with your actual password

### Step 6: Update Backend .env

```bash
cd /home/ubuntu/shackles-symposium/BACKEND
nano .env
```

Update:
```env
MONGODB_URI=mongodb+srv://shackles_admin:your-password@shackles-cluster.xxxxx.mongodb.net/shackles_symposium?retryWrites=true&w=majority
```

Restart backend:
```bash
pm2 restart shackles-backend
pm2 logs
```

---

## AWS S3 Setup

For storing user uploads (profile pictures, QR codes, etc.)

### Step 1: Create S3 Bucket

1. Go to AWS Console → Search "S3"
2. Click "Create bucket"
3. **Bucket name:** `shackles-symposium-uploads` (must be globally unique)
4. **Region:** Same as your EC2 (e.g., us-east-1)
5. **Block Public Access:** UNCHECK all (we'll use bucket policy)
6. Click "Create bucket"

### Step 2: Configure Bucket Policy

1. Click on your bucket
2. Go to "Permissions" tab
3. Scroll to "Bucket Policy"
4. Click "Edit"
5. Paste this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::shackles-symposium-uploads/*"
    }
  ]
}
```

6. Click "Save changes"

### Step 3: Enable CORS

1. In bucket, go to "Permissions" tab
2. Scroll to "Cross-origin resource sharing (CORS)"
3. Click "Edit"
4. Paste:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

5. Click "Save changes"

### Step 4: Create IAM User for S3 Access

1. Go to AWS Console → Search "IAM"
2. Click "Users" → "Add users"
3. **Username:** `shackles-s3-user`
4. **Access type:** Programmatic access
5. Click "Next: Permissions"
6. Click "Attach policies directly"
7. Search and select: **AmazonS3FullAccess**
8. Click "Next" → "Create user"
9. **IMPORTANT:** Download CSV with Access Key ID and Secret Access Key
10. Save these credentials safely!

### Step 5: Update Backend .env

```bash
cd /home/ubuntu/shackles-symposium/BACKEND
nano .env
```

Add:
```env
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=shackles-symposium-uploads
```

Restart backend:
```bash
pm2 restart shackles-backend
```

---

## Email Configuration

For sending registration confirmations, password resets, etc.

### Option 1: Gmail (Easiest for Beginners)

1. **Enable 2-Step Verification**
   - Go to https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other" → Type "Shackles"
   - Click "Generate"
   - Copy the 16-character password (save it!)

3. **Update Backend .env**

```bash
nano /home/ubuntu/shackles-symposium/BACKEND/.env
```

Add:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=noreply@yourdomain.com
```

Restart:
```bash
pm2 restart shackles-backend
```

### Option 2: AWS SES (Free Tier: 62,000 emails/month)

Coming in advanced guide...

---

## Monitoring & Backup

### Server Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop

# Check server resources
htop

# Monitor PM2 processes
pm2 monit

# Check disk space
df -h

# Check memory
free -h
```

### Setup Monitoring Dashboard

```bash
# Install PM2 web dashboard
pm2 install pm2-server-monit

# View at: http://your-domain.com:9615
```

### Backup Strategy

1. **Database Backup (MongoDB Atlas)**
   - Atlas automatically creates backups
   - Go to Atlas Dashboard → Backups
   - Backups retained for 2 days on free tier

2. **Code Backup**
   - Your code is on GitHub (already backed up!)
   - EC2 instance can be recreated anytime

3. **S3 Backup**
   - S3 data is automatically replicated by AWS
   - Enable versioning: Bucket → Properties → Versioning → Enable

### Setup Automatic Backups

```bash
# Create backup script
nano /home/ubuntu/backup.sh
```

Paste:
```bash
#!/bin/bash
# Backup MongoDB locally (if using local MongoDB)
mongodump --out /home/ubuntu/backups/$(date +%Y%m%d)

# Upload to S3 (optional)
aws s3 sync /home/ubuntu/backups/ s3://shackles-symposium-backups/
```

Make executable and schedule:
```bash
chmod +x /home/ubuntu/backup.sh

# Add to crontab (runs daily at 2 AM)
crontab -e
```

Add line:
```
0 2 * * * /home/ubuntu/backup.sh
```

---

## Production Checklist

Before going live, verify:

### Security ✅
- [ ] Changed all default passwords
- [ ] Generated strong JWT secret (32+ characters)
- [ ] Removed test/sample data from database
- [ ] Configured firewall (Security Groups)
- [ ] HTTPS enabled with valid SSL certificate
- [ ] MongoDB not exposed to public (using Atlas)
- [ ] Environment variables secured (.env not in git)
- [ ] AWS IAM user has minimal permissions

### Performance ✅
- [ ] Frontend built with `npm run build` (production mode)
- [ ] Backend running with PM2 (auto-restart on crash)
- [ ] Nginx configured as reverse proxy
- [ ] Database indexes created for common queries
- [ ] S3 bucket configured for static assets
- [ ] Compression enabled (gzip)

### Monitoring ✅
- [ ] PM2 monitoring enabled
- [ ] Server logs accessible (`pm2 logs`)
- [ ] Nginx logs monitored
- [ ] Disk space monitoring setup
- [ ] Email notifications working
- [ ] Backup strategy implemented

### DNS & Domain ✅
- [ ] Domain points to EC2 IP
- [ ] www subdomain configured
- [ ] SSL certificate auto-renewal enabled
- [ ] All URLs updated to use domain (not IP)

### Testing ✅
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] Login/logout works
- [ ] Event registration works
- [ ] File uploads work (S3)
- [ ] Email sending works
- [ ] Admin dashboard accessible
- [ ] QR code generation works
- [ ] Payment gateway works (if enabled)

### Documentation ✅
- [ ] Admin credentials saved securely
- [ ] AWS credentials saved securely
- [ ] Database connection string saved
- [ ] Server SSH key backed up
- [ ] Deployment steps documented
- [ ] Recovery procedures documented

---

## Troubleshooting

### Website Not Loading

**Check Nginx:**
```bash
sudo systemctl status nginx
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

**Check Security Group:**
- AWS Console → EC2 → Security Groups
- Ensure ports 80, 443 are open to 0.0.0.0/0

### Backend Not Working

**Check PM2:**
```bash
pm2 status
pm2 logs shackles-backend
pm2 restart shackles-backend
```

**Check MongoDB Connection:**
```bash
# If using local MongoDB
sudo systemctl status mongod

# Test connection
mongosh
```

### Database Connection Error

**MongoDB Atlas:**
- Check Network Access whitelist
- Verify username/password in connection string
- Test connection: `mongosh "your-connection-string"`

### S3 Upload Failing

**Check IAM Permissions:**
- AWS Console → IAM → Users → shackles-s3-user
- Ensure AmazonS3FullAccess policy attached

**Check Bucket Policy:**
- S3 Console → Bucket → Permissions → Bucket Policy
- Verify policy allows public read access

### Email Not Sending

**Gmail:**
- Verify 2-Step Verification enabled
- Check App Password is correct (16 characters)
- Check EMAIL_USER and EMAIL_PASS in .env

**Test Email:**
```bash
cd /home/ubuntu/shackles-symposium/BACKEND
node -e "require('./src/utils/emailService').sendEmail({to:'test@example.com',subject:'Test',text:'Works!'})"
```

### SSL Certificate Error

**Renew Certificate:**
```bash
sudo certbot renew --force-renewal
sudo systemctl restart nginx
```

### Server Running Slow

**Check Resources:**
```bash
htop  # Check CPU/RAM usage
df -h  # Check disk space
```

**Clear Logs:**
```bash
pm2 flush  # Clear PM2 logs
sudo rm /var/log/nginx/*.log.1  # Remove old nginx logs
```

### Instance Stopped/Terminated

**Elastic IP (Prevent IP Change):**
1. AWS Console → EC2 → Elastic IPs
2. Allocate new Elastic IP
3. Associate with your instance
4. Update DNS records with new IP

---

## Cost Monitoring

### Free Tier Limits

Monitor your usage to stay within free tier:

1. **AWS Console → Billing Dashboard**
2. Enable "Free Tier Alerts"
3. Set budget alerts at $5, $10

**Monthly Free Tier:**
- EC2: 750 hours t2.micro (enough for 1 instance 24/7)
- S3: 5 GB storage, 20,000 GET requests
- Data Transfer: 15 GB out
- MongoDB Atlas: 512 MB storage (free forever)

### Cost Optimization Tips

1. **Stop EC2 when not needed** (testing only)
   ```bash
   # Stop instance from AWS Console
   # You keep your data, only pay for storage
   ```

2. **Use CloudFront CDN** (free tier: 50 GB/month)
   - Reduces S3 transfer costs
   - Speeds up your site

3. **Delete old S3 files**
   ```bash
   # Setup lifecycle policy to delete old uploads
   ```

---

## Next Steps & Advanced Topics

Once comfortable with basic deployment, explore:

### Path B: Docker Deployment
- See `DOCKER_DEPLOYMENT_GUIDE.md` (to be created)
- Benefits: Easier updates, isolation, consistency

### Path C: Kubernetes Deployment
- See `KUBERNETES_DEPLOYMENT_GUIDE.md` (to be created)
- Benefits: Auto-scaling, high availability, zero-downtime updates

### CI/CD Pipeline
- Setup GitHub Actions for automatic deployment
- Push code → Auto-deploy to server

### Advanced Monitoring
- Setup CloudWatch alerts
- Install Grafana for metrics
- Setup error tracking (Sentry)

### Load Balancing
- Add multiple EC2 instances
- Setup AWS Application Load Balancer
- Auto-scaling based on traffic

### Database Optimization
- Add database indexes
- Setup read replicas
- Implement caching with Redis

---

## Support & Resources

### Official Documentation
- **AWS:** https://docs.aws.amazon.com/
- **MongoDB Atlas:** https://docs.atlas.mongodb.com/
- **Let's Encrypt:** https://letsencrypt.org/docs/
- **Nginx:** https://nginx.org/en/docs/

### Video Tutorials
- AWS EC2 Setup: YouTube search "AWS EC2 Node.js deployment"
- MongoDB Atlas: YouTube search "MongoDB Atlas setup"
- Domain & SSL: YouTube search "Certbot SSL setup"

### Community Help
- **Stack Overflow:** https://stackoverflow.com/
- **AWS Forums:** https://forums.aws.amazon.com/
- **MongoDB Community:** https://www.mongodb.com/community/forums/

---

## Conclusion

🎉 **Congratulations!** You now have a production-ready deployment!

**What You've Accomplished:**
- ✅ Deployed frontend and backend to AWS EC2
- ✅ Configured custom domain with HTTPS
- ✅ Setup MongoDB Atlas database
- ✅ Configured AWS S3 for file storage
- ✅ Enabled email notifications
- ✅ Implemented monitoring and backups
- ✅ Secured your application

**Your Site is Live at:** https://yourdomain.com

**Admin Panel:** https://yourdomain.com/admin/dashboard

---

**Need Help?**
- 📧 Email: harish16072004@gmail.com
- 🐛 Issues: GitHub repository issues page
- 📖 Docs: See `/docs` folder in your project

**Version:** 1.0  
**Last Updated:** January 2025  
**Author:** Shackles Symposium Team
