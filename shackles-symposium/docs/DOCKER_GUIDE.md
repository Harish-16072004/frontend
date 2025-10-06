# 🐳 Docker Deployment Guide (Step by Step for Beginners)

## Table of Contents
1. [What is Docker?](#what-is-docker)
2. [Why Use Docker?](#why-use-docker)
3. [Installing Docker](#installing-docker)
4. [Understanding Docker Concepts](#understanding-docker-concepts)
5. [Dockerizing Your Application](#dockerizing-your-application)
6. [Docker Compose Setup](#docker-compose-setup)
7. [Deploying to AWS EC2 with Docker](#deploying-to-aws-ec2-with-docker)
8. [Docker Commands Cheat Sheet](#docker-commands-cheat-sheet)
9. [Troubleshooting](#troubleshooting)

---

## What is Docker?

**Simple Explanation:**
Think of Docker as a "shipping container" for your application.

**Traditional Way:**
```
Your Computer → Install Node.js → Install MongoDB → Run App
Server → Install Node.js (different version?) → Install MongoDB → Run App (breaks!)
```

**Docker Way:**
```
Your Computer → Package app in container → Ship container → Run anywhere!
Server → Run same container → Works perfectly!
```

**Key Benefits:**
- 📦 Package app + all dependencies together
- 🚢 Runs the same on any computer (Windows, Mac, Linux, server)
- 🔄 Easy to update and rollback
- 🏗️ No "it works on my machine" problems

---

## Why Use Docker?

### Without Docker (Current Setup)

```bash
# On EC2 server, you need to:
1. Install Node.js
2. Install MongoDB
3. Install Redis (if using)
4. Install Nginx
5. Configure everything manually
6. Manage updates separately
7. If something breaks, hard to fix
```

### With Docker

```bash
# Just run:
docker-compose up -d

# Everything starts:
- Backend (Node.js)
- Frontend (Nginx)
- MongoDB
- Redis
- All configured automatically!
```

**When to Use Docker:**
- ✅ Multiple services (backend, database, cache)
- ✅ Easy deployment and updates
- ✅ Development/production parity
- ✅ Team collaboration
- ✅ Microservices architecture

---

## Installing Docker

### On Your Local Machine (Windows)

**1. Download Docker Desktop:**
- Go to: https://www.docker.com/products/docker-desktop/
- Download for Windows
- Run installer (requires restart)

**2. Verify Installation:**

```powershell
# Open PowerShell and run:
docker --version
# Should show: Docker version 24.x.x

docker-compose --version
# Should show: Docker Compose version 2.x.x
```

**3. Test Docker:**

```powershell
# Run a test container
docker run hello-world

# If you see "Hello from Docker!", it works! 🎉
```

### On AWS EC2 (Ubuntu)

```bash
# SSH into your server
ssh -i your-key.pem ubuntu@your-server-ip

# Update system
sudo apt update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group (no need for sudo)
sudo usermod -aG docker ubuntu

# Logout and login again
exit
# SSH back in

# Verify
docker --version

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker-compose --version
```

---

## Understanding Docker Concepts

### 1. Docker Image

**What:** A blueprint/template for your application
**Like:** Recipe for cooking a dish

```bash
# List images
docker images

# Example output:
REPOSITORY          TAG       SIZE
node               18        900MB
mongodb            latest    600MB
shackles-backend   latest    1.2GB
```

### 2. Docker Container

**What:** Running instance of an image
**Like:** Actual dish cooked from recipe

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Example output:
CONTAINER ID   IMAGE              STATUS      PORTS
abc123         shackles-backend   Up 2 hours  0.0.0.0:5000->5000/tcp
def456         mongo              Up 2 hours  27017/tcp
```

### 3. Dockerfile

**What:** Instructions to build an image
**Like:** Step-by-step recipe

```dockerfile
# Example Dockerfile
FROM node:18          # Start with Node.js base image
WORKDIR /app          # Set working directory
COPY package*.json ./ # Copy package files
RUN npm install       # Install dependencies
COPY . .              # Copy application code
CMD ["npm", "start"]  # Command to run app
```

### 4. Docker Compose

**What:** Tool to run multiple containers together
**Like:** Running entire restaurant kitchen (multiple stations)

```yaml
# Example docker-compose.yml
services:
  backend:
    image: shackles-backend
    ports:
      - "5000:5000"
  
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
```

---

## Dockerizing Your Application

### Step 1: Create Backend Dockerfile

Already created at `docker/Dockerfile.backend`, but let's understand it:

```dockerfile
# ===== Stage 1: Dependencies =====
FROM node:18-alpine AS dependencies

# Why alpine? Smaller image size (150MB vs 900MB)
# Set working directory inside container
WORKDIR /app

# Copy package files first (for caching)
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# ===== Stage 2: Build =====
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY backend/ ./

# ===== Stage 3: Production =====
FROM node:18-alpine

WORKDIR /app

# Copy only what's needed for production
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app ./

# Create non-root user (security)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start application
CMD ["node", "src/server.js"]
```

**Build the image:**

```bash
# From project root
cd C:\Users\Harish J\Desktop\shackles-master\shackles-symposium

# Build backend image
docker build -f docker/Dockerfile.backend -t shackles-backend:latest .

# This creates an image named "shackles-backend"
```

### Step 2: Create Frontend Dockerfile

Already created at `docker/Dockerfile.frontend`:

```dockerfile
# ===== Stage 1: Build =====
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY frontend/ ./

# Build production bundle
RUN npm run build

# ===== Stage 2: Production with Nginx =====
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx-frontend.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

**Build the image:**

```bash
# Build frontend image
docker build -f docker/Dockerfile.frontend -t shackles-frontend:latest .
```

### Step 3: Test Individual Containers

**Run backend:**

```bash
# Run backend container
docker run -d \
  --name shackles-backend \
  -p 5000:5000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/shackles \
  -e JWT_SECRET=test-secret \
  shackles-backend:latest

# Check logs
docker logs shackles-backend

# Test
curl http://localhost:5000/api/health
```

**Run frontend:**

```bash
# Run frontend container
docker run -d \
  --name shackles-frontend \
  -p 80:80 \
  shackles-frontend:latest

# Test
# Open browser: http://localhost
```

**Stop containers:**

```bash
docker stop shackles-backend shackles-frontend
docker rm shackles-backend shackles-frontend
```

---

## Docker Compose Setup

Instead of running containers individually, use Docker Compose!

### Understanding docker-compose.yml

Already created at `docker/docker-compose.yml`:

```yaml
version: '3.8'

services:
  # MongoDB Database
  mongodb:
    image: mongo:latest
    container_name: shackles-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin123
      MONGO_INITDB_DATABASE: shackles_symposium
    volumes:
      - mongodb_data:/data/db  # Persist data
    networks:
      - shackles-network
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:alpine
    container_name: shackles-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - shackles-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ..
      dockerfile: docker/Dockerfile.backend
    container_name: shackles-backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      PORT: 5000
      MONGODB_URI: mongodb://admin:admin123@mongodb:27017/shackles_symposium?authSource=admin
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-jwt-secret-change-this
      JWT_EXPIRE: 7d
      FRONTEND_URL: http://localhost
    depends_on:
      mongodb:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - shackles-network
    volumes:
      - ../backend/uploads:/app/uploads  # Persist uploads

  # Frontend (Nginx)
  frontend:
    build:
      context: ..
      dockerfile: docker/Dockerfile.frontend
    container_name: shackles-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - shackles-network

# Persist data across container restarts
volumes:
  mongodb_data:
  redis_data:

# Network for containers to communicate
networks:
  shackles-network:
    driver: bridge
```

### Running with Docker Compose

**Start all services:**

```bash
# Navigate to docker folder
cd docker

# Start in background (-d = detached)
docker-compose up -d

# Output:
# Creating network "docker_shackles-network"
# Creating volume "docker_mongodb_data"
# Creating volume "docker_redis_data"
# Creating shackles-mongodb ... done
# Creating shackles-redis   ... done
# Creating shackles-backend ... done
# Creating shackles-frontend ... done
```

**Check status:**

```bash
# See all containers
docker-compose ps

# Output:
# NAME                STATUS       PORTS
# shackles-mongodb    Up 2 min     0.0.0.0:27017->27017/tcp
# shackles-redis      Up 2 min     0.0.0.0:6379->6379/tcp
# shackles-backend    Up 2 min     0.0.0.0:5000->5000/tcp
# shackles-frontend   Up 2 min     0.0.0.0:80->80/tcp
```

**View logs:**

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend

# Follow logs (-f = follow)
docker-compose logs -f backend
```

**Stop services:**

```bash
# Stop (data persists)
docker-compose stop

# Stop and remove containers (data persists)
docker-compose down

# Stop and remove everything (including data!)
docker-compose down -v
```

**Update and restart:**

```bash
# Rebuild images
docker-compose build

# Restart specific service
docker-compose restart backend

# Update and restart
docker-compose up -d --build
```

---

## Deploying to AWS EC2 with Docker

### Step 1: Prepare EC2 Instance

**1. Create EC2 instance** (same as Step 2 guide)
- Ubuntu 22.04
- t2.micro (or larger for better performance)
- Security groups: 22, 80, 443, 5000

**2. Install Docker** (see above)

### Step 2: Upload Project to EC2

**Option 1: Git Clone**

```bash
# On EC2
cd /home/ubuntu
git clone https://github.com/Harish-16072004/frontend.git shackles-symposium
cd shackles-symposium
```

**Option 2: SCP Upload**

```powershell
# On your local machine
scp -i your-key.pem -r C:\Users\Harish J\Desktop\shackles-master\shackles-symposium ubuntu@YOUR-EC2-IP:/home/ubuntu/
```

### Step 3: Configure Environment

```bash
# On EC2
cd /home/ubuntu/shackles-symposium/docker

# Create .env file
nano .env
```

Add:

```env
# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=your-secure-password-change-this

# Backend
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
MONGODB_URI=mongodb://admin:your-secure-password-change-this@mongodb:27017/shackles_symposium?authSource=admin
REDIS_URL=redis://redis:6379
FRONTEND_URL=http://your-domain.com

# AWS S3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Step 4: Deploy with Docker Compose

```bash
# Build and start
docker-compose up -d --build

# Check status
docker-compose ps

# Check logs
docker-compose logs -f
```

### Step 5: Setup Nginx Reverse Proxy (Optional)

If you want to use a domain and SSL:

```bash
# Install Nginx on host
sudo apt install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/shackles
```

Add:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable:

```bash
sudo ln -s /etc/nginx/sites-available/shackles /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

**Get SSL:**

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Docker Commands Cheat Sheet

### Images

```bash
# List images
docker images

# Build image
docker build -t image-name:tag .

# Remove image
docker rmi image-name:tag

# Pull image from Docker Hub
docker pull mongo:latest

# Push image to Docker Hub
docker push username/image-name:tag
```

### Containers

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Run container
docker run -d --name container-name -p 8080:80 image-name

# Stop container
docker stop container-name

# Start container
docker start container-name

# Restart container
docker restart container-name

# Remove container
docker rm container-name

# Remove all stopped containers
docker container prune
```

### Logs & Debugging

```bash
# View logs
docker logs container-name

# Follow logs
docker logs -f container-name

# Last 100 lines
docker logs --tail 100 container-name

# Execute command in container
docker exec -it container-name /bin/sh

# Example: Access MongoDB shell
docker exec -it shackles-mongodb mongosh
```

### Docker Compose

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose stop

# Stop and remove
docker-compose down

# Rebuild
docker-compose build

# View logs
docker-compose logs -f service-name

# Scale services
docker-compose up -d --scale backend=3

# List services
docker-compose ps
```

### Cleanup

```bash
# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a

# Check disk usage
docker system df
```

---

## Troubleshooting

### Container Won't Start

**Check logs:**
```bash
docker-compose logs backend

# Common issues:
# - Port already in use
# - Environment variables missing
# - Database connection failed
```

**Solution:**
```bash
# Stop conflicting services
sudo systemctl stop mongodb  # If MongoDB running on host

# Check ports
sudo netstat -tulpn | grep :5000

# Restart with fresh state
docker-compose down -v
docker-compose up -d --build
```

### Cannot Connect to Database

**Check container network:**
```bash
# List networks
docker network ls

# Inspect network
docker network inspect docker_shackles-network

# Check MongoDB is running
docker-compose ps mongodb
docker-compose logs mongodb
```

**Solution:**
```bash
# Use container name, not localhost
# In backend .env:
MONGODB_URI=mongodb://mongodb:27017/shackles  # ✅ CORRECT
MONGODB_URI=mongodb://localhost:27017/shackles  # ❌ WRONG
```

### Out of Disk Space

**Check usage:**
```bash
docker system df

# Output:
# TYPE            TOTAL   ACTIVE   SIZE
# Images          10      5        3.5GB
# Containers      20      4        1.2GB
# Volumes         5       3        800MB
```

**Clean up:**
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything
docker system prune -a --volumes
```

### Permission Denied

**Issue:** Cannot access files in container

**Solution:**
```bash
# Run as specific user
docker run --user 1000:1000 image-name

# Or in Dockerfile:
USER node
```

### Container Exits Immediately

**Check exit code:**
```bash
docker ps -a
# Look at STATUS column

docker logs container-name
```

**Common causes:**
- Application crashed
- Missing environment variables
- Port conflict
- Command not found

---

## Best Practices

### 1. Multi-Stage Builds ✅

```dockerfile
# Good: Smaller final image
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM node:18-alpine
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]
```

### 2. Use .dockerignore ✅

```
# .dockerignore
node_modules
npm-debug.log
.env
.git
.vscode
dist
coverage
```

### 3. Health Checks ✅

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:5000/health || exit 1
```

### 4. Non-Root User ✅

```dockerfile
RUN adduser -D appuser
USER appuser
```

### 5. Environment Variables ✅

```yaml
# docker-compose.yml
services:
  backend:
    env_file:
      - .env
    environment:
      NODE_ENV: production
```

---

## Next Steps

Once comfortable with Docker:

1. **Docker Swarm** - Orchestrate multiple servers
2. **Kubernetes** - Enterprise-grade orchestration
3. **CI/CD Integration** - Auto-build and deploy
4. **Container Registry** - AWS ECR, Docker Hub
5. **Monitoring** - Prometheus, Grafana

---

## Resources

- **Docker Documentation:** https://docs.docker.com/
- **Docker Hub:** https://hub.docker.com/
- **Docker Compose:** https://docs.docker.com/compose/
- **Best Practices:** https://docs.docker.com/develop/dev-best-practices/

---

**Version:** 1.0  
**Last Updated:** January 2025  
**Author:** Shackles Symposium Team
