# 🔐 Secrets Management Guide

## Table of Contents
1. [Understanding Secrets](#understanding-secrets)
2. [Development Environment](#development-environment)
3. [Production Environment](#production-environment)
4. [AWS Secrets Manager](#aws-secrets-manager)
5. [Environment Variables](#environment-variables)
6. [Security Best Practices](#security-best-practices)

---

## Understanding Secrets

**What are secrets?**
Sensitive information that your application needs to function:
- Database passwords
- API keys (AWS, payment gateways)
- JWT secrets
- Email passwords
- Third-party service credentials

**Why separate secrets management?**
- ❌ NEVER commit secrets to Git
- ❌ NEVER hardcode secrets in code
- ✅ Store secrets securely
- ✅ Different secrets for dev/production
- ✅ Easy to rotate/update

---

## Development Environment

### Using .env Files (Local Development)

**1. Create .env file:**

```bash
# Backend/.env (NEVER commit to Git!)
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb://localhost:27017/shackles_dev
JWT_SECRET=dev-secret-key-change-this-in-production
JWT_EXPIRE=7d

AWS_ACCESS_KEY_ID=your-dev-key
AWS_SECRET_ACCESS_KEY=your-dev-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=shackles-dev-uploads

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-dev-email@gmail.com
EMAIL_PASS=your-dev-app-password
```

**2. Add to .gitignore:**

```bash
# .gitignore (already in your project)
.env
.env.local
.env.*.local
*.env
```

**3. Create .env.example (safe to commit):**

```bash
# Backend/.env.example (commit this!)
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb://localhost:27017/your_database
JWT_SECRET=your-jwt-secret-minimum-32-characters
JWT_EXPIRE=7d

AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

**4. Load in your app:**

```javascript
// backend/src/config/database.js
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
```

---

## Production Environment

### Method 1: Server Environment Variables (Recommended for EC2)

**1. SSH into your server:**

```bash
ssh -i your-key.pem ubuntu@your-server-ip
```

**2. Create .env file on server:**

```bash
cd /home/ubuntu/shackles-symposium/backend
nano .env
```

**3. Paste production secrets:**

```env
NODE_ENV=production
PORT=5000

MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/prod_db
JWT_SECRET=super-secure-production-jwt-secret-minimum-32-characters-random
JWT_EXPIRE=7d

AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-1
AWS_S3_BUCKET=shackles-prod-uploads

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASS=production-app-password

FRONTEND_URL=https://yourdomain.com
```

**4. Secure the file:**

```bash
# Set file permissions (only owner can read)
chmod 600 .env

# Verify
ls -la .env
# Should show: -rw------- (600)
```

**5. Restart application:**

```bash
pm2 restart all
```

### Method 2: AWS Secrets Manager (Advanced)

**Benefits:**
- Centralized secret storage
- Automatic rotation
- Audit trail
- Version control
- Access control via IAM

**Setup:**

**1. Create Secret in AWS Console:**

```bash
# Go to AWS Console → Secrets Manager → Store a new secret
# Choose: Other type of secret
# Add key-value pairs:
```

```json
{
  "MONGODB_URI": "mongodb+srv://...",
  "JWT_SECRET": "your-secret",
  "AWS_ACCESS_KEY_ID": "...",
  "AWS_SECRET_ACCESS_KEY": "...",
  "EMAIL_PASS": "..."
}
```

**2. Name it:** `shackles-symposium/production`

**3. Install AWS SDK:**

```bash
cd /home/ubuntu/shackles-symposium/backend
npm install @aws-sdk/client-secrets-manager
```

**4. Create secrets loader:**

```javascript
// backend/src/config/secrets.js
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const client = new SecretsManagerClient({ region: 'us-east-1' });

async function loadSecrets() {
  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: 'shackles-symposium/production',
      })
    );

    const secrets = JSON.parse(response.SecretString);
    
    // Set as environment variables
    process.env.MONGODB_URI = secrets.MONGODB_URI;
    process.env.JWT_SECRET = secrets.JWT_SECRET;
    process.env.AWS_ACCESS_KEY_ID = secrets.AWS_ACCESS_KEY_ID;
    process.env.AWS_SECRET_ACCESS_KEY = secrets.AWS_SECRET_ACCESS_KEY;
    process.env.EMAIL_PASS = secrets.EMAIL_PASS;
    
    console.log('✅ Secrets loaded successfully');
  } catch (error) {
    console.error('❌ Failed to load secrets:', error);
    process.exit(1);
  }
}

module.exports = { loadSecrets };
```

**5. Update server.js:**

```javascript
// backend/src/server.js
const { loadSecrets } = require('./config/secrets');

async function start() {
  // Load secrets first
  if (process.env.NODE_ENV === 'production') {
    await loadSecrets();
  } else {
    require('dotenv').config();
  }
  
  // Then start server
  const app = require('./app');
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
```

**6. Grant EC2 IAM role access:**

```bash
# AWS Console → IAM → Roles → Create Role
# Choose: EC2
# Attach policy: SecretsManagerReadWrite
# Name: shackles-ec2-secrets-role

# Attach to EC2 instance:
# EC2 Console → Actions → Security → Modify IAM Role
# Select: shackles-ec2-secrets-role
```

---

## Environment Variables

### How to Access in Your Code

**Backend (Node.js):**

```javascript
// Load dotenv at app startup
require('dotenv').config();

// Access variables
const dbURI = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
const awsKey = process.env.AWS_ACCESS_KEY_ID;

// With defaults
const port = process.env.PORT || 5000;
const nodeEnv = process.env.NODE_ENV || 'development';

// Check if required variables exist
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined');
  process.exit(1);
}
```

**Frontend (React + Vite):**

```javascript
// Vite only exposes variables starting with VITE_
// frontend/.env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Shackles Symposium

// Access in code
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const appName = import.meta.env.VITE_APP_NAME;

// Check if defined
if (!import.meta.env.VITE_API_BASE_URL) {
  console.error('API URL not configured');
}
```

### Different Environments

**Development (.env):**
```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/dev_db
FRONTEND_URL=http://localhost:3000
```

**Staging (.env.staging):**
```env
NODE_ENV=staging
MONGODB_URI=mongodb+srv://...staging-cluster...
FRONTEND_URL=https://staging.yourdomain.com
```

**Production (.env.production):**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...production-cluster...
FRONTEND_URL=https://yourdomain.com
```

**Load specific environment:**
```bash
# Development (default)
npm run dev

# Staging
NODE_ENV=staging npm start

# Production
NODE_ENV=production npm start
```

---

## Security Best Practices

### ✅ DO's

**1. Use Strong Secrets:**
```bash
# Generate secure random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Output: 8f3b2c1a5d4e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7

# Use this for JWT_SECRET, SESSION_SECRET, etc.
```

**2. Different Secrets per Environment:**
```bash
# Development
JWT_SECRET=dev-secret-key

# Production
JWT_SECRET=8f3b2c1a5d4e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7
```

**3. Rotate Secrets Regularly:**
```bash
# Every 90 days, generate new secrets
# Update in production
# Deploy with zero downtime
```

**4. Least Privilege Access:**
```bash
# AWS IAM user for S3 only
- AmazonS3FullAccess (only for specific bucket)

# Not this:
- AdministratorAccess (too much access!)
```

**5. Use .env.example:**
```bash
# Commit .env.example (no real secrets)
# Team members copy to .env and add real secrets
cp .env.example .env
```

**6. Audit Secret Access:**
```bash
# AWS Secrets Manager logs who accessed secrets
# CloudTrail logs all API calls
# Review regularly
```

### ❌ DON'Ts

**1. NEVER Commit Secrets to Git:**
```bash
# Check before commit
git status
git diff

# Remove if accidentally committed
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

**2. NEVER Hardcode Secrets:**
```javascript
// ❌ BAD
const jwtSecret = 'my-secret-key';
const dbURI = 'mongodb://user:pass@localhost';

// ✅ GOOD
const jwtSecret = process.env.JWT_SECRET;
const dbURI = process.env.MONGODB_URI;
```

**3. NEVER Share Secrets via Email/Chat:**
```bash
# Use secure channels:
- AWS Secrets Manager
- 1Password / LastPass
- Encrypted files
- In-person transfer
```

**4. NEVER Use Same Secrets Everywhere:**
```bash
# ❌ BAD - Same secret for dev and prod
JWT_SECRET=my-secret

# ✅ GOOD - Different secrets
# Dev:  JWT_SECRET=dev-secret-12345
# Prod: JWT_SECRET=8f3b2c1a5d4e6f7g8h9i0j1k2l3m4n5o
```

**5. NEVER Log Secrets:**
```javascript
// ❌ BAD
console.log('DB URI:', process.env.MONGODB_URI);
console.log('JWT Secret:', process.env.JWT_SECRET);

// ✅ GOOD
console.log('DB URI:', process.env.MONGODB_URI ? '***hidden***' : 'not set');
console.log('JWT Secret:', process.env.JWT_SECRET ? 'configured' : 'missing');
```

---

## Quick Reference: Managing Secrets

### Generate Secure Secrets

```bash
# 32-character random string
openssl rand -hex 32

# 64-character random string
openssl rand -hex 64

# Node.js method
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# UUID (for API keys)
node -e "console.log(require('crypto').randomUUID())"
```

### Check What Secrets Are Used

```bash
# Search codebase for process.env usage
grep -r "process.env" backend/src/

# List all env variables in .env.example
cat backend/.env.example | grep -v "^#" | grep "="
```

### Update Production Secrets

```bash
# Method 1: Direct edit
ssh into server
nano /home/ubuntu/shackles-symposium/backend/.env
# Edit secret
pm2 restart all

# Method 2: AWS Secrets Manager
# AWS Console → Secrets Manager → Your Secret → Retrieve/Update
# No server restart needed if using loadSecrets()
```

### Backup Secrets Securely

```bash
# Export secrets (encrypted)
gpg --symmetric --cipher-algo AES256 .env
# Creates: .env.gpg (encrypted file)

# Decrypt later
gpg --decrypt .env.gpg > .env
```

---

## Checklist: Secrets Security

Before deploying to production:

- [ ] All secrets in `.env` files (not in code)
- [ ] `.env` added to `.gitignore`
- [ ] `.env.example` created with placeholders
- [ ] Production secrets different from development
- [ ] Strong, randomly generated secrets (32+ characters)
- [ ] File permissions set to 600 (`-rw-------`)
- [ ] AWS IAM users have minimal permissions
- [ ] MongoDB Atlas network access restricted
- [ ] Email app passwords used (not main password)
- [ ] S3 bucket access restricted
- [ ] Secrets backed up securely (encrypted)
- [ ] Team members know how to handle secrets
- [ ] Audit trail enabled (Secrets Manager/CloudTrail)
- [ ] Secret rotation plan in place (every 90 days)
- [ ] No secrets in logs or error messages

---

## Emergency: Secret Compromised

If a secret is exposed (committed to Git, leaked, etc.):

**1. Rotate Immediately:**

```bash
# Generate new secret
NEW_SECRET=$(openssl rand -hex 32)

# Update on server
ssh into server
nano .env
# Replace old secret with new
pm2 restart all

# Update AWS IAM keys
# AWS Console → IAM → Users → Security credentials → Create new access key
# Deactivate old key after confirming new key works
```

**2. Revoke Old Secret:**

```bash
# AWS IAM keys: Deactivate old key
# MongoDB: Change user password
# Email: Revoke app password, generate new one
```

**3. Check for Damage:**

```bash
# Review AWS CloudTrail logs
# Check for unauthorized access
# Review MongoDB Atlas activity log
```

**4. Remove from Git History (if committed):**

```bash
# Use BFG Repo-Cleaner or git-filter-repo
# Force push to remove from history
# Notify team to re-clone repository
```

---

## Resources

- **AWS Secrets Manager:** https://aws.amazon.com/secrets-manager/
- **dotenv Documentation:** https://github.com/motdotla/dotenv
- **OWASP Secrets Management:** https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- **Generate Secrets:** https://randomkeygen.com/

---

**Version:** 1.0  
**Last Updated:** January 2025  
**Author:** Shackles Symposium Team
