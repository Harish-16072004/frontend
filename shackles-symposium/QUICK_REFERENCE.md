# 🎯 Quick Reference Card - Deployment Commands

## 🚀 EC2 Deployment (Path A)

### Initial Setup (One-time)

```bash
# Connect to server
ssh -i your-key.pem ubuntu@YOUR-EC2-IP

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 and Nginx
sudo npm install -g pm2
sudo apt install -y nginx

# Clone project
cd /home/ubuntu
git clone YOUR-REPO-URL shackles-symposium
cd shackles-symposium
```

### Backend Setup

```bash
# Configure backend
cd /home/ubuntu/shackles-symposium/backend
nano .env

# Install dependencies
npm install --production

# Start with PM2
pm2 start src/server.js --name shackles-backend
pm2 save
pm2 startup
```

### Frontend Setup

```bash
# Configure frontend
cd /home/ubuntu/shackles-symposium/frontend
nano .env

# Build
npm install
npm run build

# Configure Nginx
sudo nano /etc/nginx/sites-available/shackles

# Enable site
sudo ln -s /etc/nginx/sites-available/shackles /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔐 SSL Setup (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## 📊 Monitoring Commands

```bash
# Check PM2 status
pm2 status
pm2 logs shackles-backend
pm2 monit

# Check Nginx
sudo systemctl status nginx
sudo nginx -t

# Check MongoDB
sudo systemctl status mongod

# Check disk space
df -h

# Check memory
free -h

# Check processes
htop
```

---

## 🔄 Update & Restart Commands

```bash
# Pull latest code
cd /home/ubuntu/shackles-symposium
git pull origin main

# Update backend
cd backend
npm install --production
pm2 restart shackles-backend

# Update frontend
cd ../frontend
npm install
npm run build
sudo systemctl restart nginx

# Or restart everything
pm2 restart all
sudo systemctl restart nginx mongod
```

---

## 🐳 Docker Commands (Path B)

### Start Services

```bash
# Navigate to docker folder
cd /home/ubuntu/shackles-symposium/docker

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
```

### Update & Restart

```bash
# Pull latest code
cd /home/ubuntu/shackles-symposium
git pull origin main

# Rebuild and restart
cd docker
docker-compose down
docker-compose up -d --build

# Or update specific service
docker-compose up -d --build backend
```

### Monitoring

```bash
# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Check resource usage
docker stats

# Access container shell
docker exec -it shackles-backend sh
```

---

## 🗄️ Database Commands

### MongoDB (Local)

```bash
# Connect to MongoDB
mongosh

# Show databases
show dbs

# Use database
use shackles_symposium

# Show collections
show collections

# Count users
db.users.countDocuments()

# Find user by email
db.users.findOne({ email: "admin@example.com" })

# Backup database
mongodump --db shackles_symposium --out /home/ubuntu/backups/

# Restore database
mongorestore --db shackles_symposium /home/ubuntu/backups/shackles_symposium/
```

### MongoDB Atlas

```bash
# Connect to Atlas
mongosh "mongodb+srv://cluster.xxxxx.mongodb.net/shackles_symposium" --username your-user

# Same commands as above
```

---

## 📁 File Management Commands

```bash
# Upload file to server (from local)
scp -i your-key.pem local-file.txt ubuntu@YOUR-EC2-IP:/home/ubuntu/

# Upload folder
scp -i your-key.pem -r local-folder ubuntu@YOUR-EC2-IP:/home/ubuntu/

# Download from server (to local)
scp -i your-key.pem ubuntu@YOUR-EC2-IP:/home/ubuntu/file.txt ./

# Edit file on server
nano /path/to/file

# View file
cat /path/to/file
less /path/to/file
tail -f /path/to/file  # Follow logs
```

---

## 🛠️ Troubleshooting Commands

### Backend Not Working

```bash
# Check PM2
pm2 status
pm2 logs shackles-backend --lines 100

# Check if port is in use
sudo netstat -tulpn | grep :5000

# Kill process on port
sudo kill -9 $(sudo lsof -t -i:5000)

# Restart backend
pm2 restart shackles-backend

# Check backend health
curl http://localhost:5000/api/health
```

### Frontend Not Loading

```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx config
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Restart Nginx
sudo systemctl restart nginx

# Check if files exist
ls -la /home/ubuntu/shackles-symposium/frontend/dist
```

### Database Connection Issues

```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
sudo systemctl restart mongod

# Test connection
mongosh
```

### SSL Certificate Issues

```bash
# Check certificate expiry
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Force renewal
sudo certbot renew --force-renewal

# Restart Nginx after renewal
sudo systemctl restart nginx
```

---

## 🔒 Security Commands

```bash
# Generate strong secret
openssl rand -hex 32
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Check file permissions
ls -la .env

# Set proper permissions
chmod 600 .env

# Check open ports
sudo netstat -tulpn

# Check firewall (if using UFW)
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

---

## 🧹 Cleanup Commands

```bash
# Clear PM2 logs
pm2 flush

# Clear old logs
sudo rm /var/log/nginx/*.log.1
sudo rm /var/log/mongodb/*.log.1

# Clear old Docker images (if using Docker)
docker system prune -a

# Clear npm cache
npm cache clean --force

# Check disk usage
du -sh /home/ubuntu/*
df -h
```

---

## 📦 Backup Commands

```bash
# Backup database
mongodump --db shackles_symposium --out /home/ubuntu/backups/$(date +%Y%m%d)/

# Backup uploads folder
tar -czf /home/ubuntu/backups/uploads-$(date +%Y%m%d).tar.gz /home/ubuntu/shackles-symposium/backend/uploads/

# Backup to S3 (if AWS CLI configured)
aws s3 sync /home/ubuntu/backups/ s3://your-backup-bucket/backups/

# Restore database
mongorestore --db shackles_symposium /home/ubuntu/backups/20250105/shackles_symposium/

# Restore uploads
tar -xzf /home/ubuntu/backups/uploads-20250105.tar.gz -C /
```

---

## 🌐 Testing Commands

```bash
# Test backend API
curl http://localhost:5000/api/health
curl http://localhost:5000/api/events

# Test with authentication
curl -H "Authorization: Bearer YOUR-TOKEN" http://localhost:5000/api/users/profile

# Test frontend
curl http://localhost

# Check DNS
nslookup yourdomain.com
dig yourdomain.com

# Test SSL
curl -I https://yourdomain.com
openssl s_client -connect yourdomain.com:443
```

---

## 📊 Performance Commands

```bash
# Check CPU usage
top
htop

# Check memory
free -h
vmstat 1

# Check disk I/O
iostat

# Check network
netstat -i
iftop

# Monitor logs in real-time
tail -f /var/log/nginx/access.log
pm2 logs --lines 100
```

---

## 🔄 Git Commands

```bash
# Check status
git status
git log --oneline -10

# Pull latest changes
git pull origin main

# Stash local changes
git stash
git pull origin main
git stash pop

# Check branch
git branch

# Switch branch
git checkout staging
git checkout production
```

---

## ⚡ Quick Fixes

### "Port already in use"
```bash
sudo kill -9 $(sudo lsof -t -i:5000)
pm2 restart shackles-backend
```

### "Permission denied"
```bash
sudo chown -R ubuntu:ubuntu /home/ubuntu/shackles-symposium
chmod 600 .env
```

### "Cannot connect to MongoDB"
```bash
sudo systemctl restart mongod
# Update connection string in .env
pm2 restart shackles-backend
```

### "502 Bad Gateway"
```bash
pm2 status  # Check if backend is running
pm2 start src/server.js --name shackles-backend
sudo systemctl restart nginx
```

### "SSL certificate expired"
```bash
sudo certbot renew --force-renewal
sudo systemctl restart nginx
```

### "Out of disk space"
```bash
pm2 flush
sudo apt clean
docker system prune -a  # If using Docker
```

---

## 📱 Emergency Recovery

### If server is down:
```bash
# 1. Check if EC2 is running (AWS Console)
# 2. SSH into server
ssh -i your-key.pem ubuntu@YOUR-EC2-IP

# 3. Check all services
sudo systemctl status nginx mongod
pm2 status

# 4. Restart everything
sudo systemctl restart nginx mongod
pm2 restart all

# 5. Check logs
pm2 logs
sudo tail -f /var/log/nginx/error.log
```

### If database is corrupted:
```bash
# 1. Stop MongoDB
sudo systemctl stop mongod

# 2. Repair
sudo mongod --repair --dbpath /var/lib/mongodb

# 3. Start MongoDB
sudo systemctl start mongod

# 4. Or restore from backup
mongorestore --db shackles_symposium /home/ubuntu/backups/latest/
```

---

## 📞 Help Resources

- **AWS Console:** https://console.aws.amazon.com
- **MongoDB Atlas:** https://cloud.mongodb.com
- **PM2 Docs:** https://pm2.keymetrics.io/docs
- **Nginx Docs:** https://nginx.org/en/docs/
- **Certbot Docs:** https://certbot.eff.org/

---

**💡 Pro Tip:** Bookmark this page! You'll reference it often.

**Version:** 1.0  
**Last Updated:** January 2025
