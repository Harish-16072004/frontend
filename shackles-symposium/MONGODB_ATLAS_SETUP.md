# MongoDB Atlas Setup Guide for SHACKLES 25-26

## Quick Setup Checklist

- [ ] Create MongoDB Atlas account
- [ ] Create free M0 cluster
- [ ] Create database user
- [ ] Configure network access
- [ ] Get connection string
- [ ] Update .env file
- [ ] Test connection

---

## Detailed Setup Steps

### 1. Create MongoDB Atlas Account

1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Sign up using email or Google/GitHub
3. Verify your email address

### 2. Create Free Cluster

1. Click **"Build a Database"**
2. Choose **M0 FREE** tier
3. Cloud Provider: **AWS**
4. Region: **Mumbai (ap-south-1)** - Closest to India
5. Cluster Name: `shackles-cluster`
6. Click **"Create Deployment"**

### 3. Database Access (Create User)

1. Username: `shackles_admin`
2. Password: Create strong password (save it!)
3. Database User Privileges: **"Read and write to any database"**
4. Click **"Add User"**

**Example credentials:**
```
Username: shackles_admin
Password: Shackles2025@Secure!
```

### 4. Network Access

**For Development:**
1. Go to **Network Access** tab
2. Click **"Add IP Address"**
3. Select **"Allow access from anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

**For Production:**
1. Add your server's specific IP address
2. Add Vercel/Render deployment IPs if using those platforms

### 5. Get Connection String

1. Go to **Database** tab
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy connection string:

```
mongodb+srv://shackles_admin:<password>@shackles-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 6. Configure Backend Environment

Create/Update `server/.env` file:

```env
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://shackles_admin:YOUR_PASSWORD_HERE@shackles-cluster.xxxxx.mongodb.net/shackles_db?retryWrites=true&w=majority

# Database Name
DB_NAME=shackles_db

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# JWT Expire Time
JWT_EXPIRE=7d

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# Email Configuration (for later)
EMAIL_SERVICE=gmail
EMAIL_USER=shackles2k25@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Payment Gateway (for later)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

---

## Database Structure

Your MongoDB database will have these collections:

### Collections to be created automatically:

1. **users** - User accounts and authentication
2. **events** - All event information
3. **registrations** - Event registrations
4. **accommodations** - Accommodation bookings
5. **workshops** - Workshop data
6. **contactmessages** - Contact form submissions
7. **notifications** - System notifications
8. **teammembers** - Team member information
9. **settings** - Application settings
10. **analytics** - Usage analytics

---

## Connection String Format Explained

```
mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER-URL]/[DATABASE]?retryWrites=true&w=majority
```

**Replace:**
- `[USERNAME]`: Your database username (e.g., shackles_admin)
- `[PASSWORD]`: Your database password (URL encode special characters!)
- `[CLUSTER-URL]`: Provided by Atlas (e.g., shackles-cluster.xxxxx.mongodb.net)
- `[DATABASE]`: Database name (e.g., shackles_db)

**Special Character Encoding:**
If your password contains special characters, encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`

Example:
- Password: `Pass@123#`
- Encoded: `Pass%40123%23`

---

## Testing Your Connection

### Method 1: Using Node.js Script

Create `server/test-connection.js`:

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Atlas connected successfully!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📂 Collections:', collections.map(c => c.name).join(', '));
    
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();
```

Run:
```bash
cd server
node test-connection.js
```

### Method 2: Using MongoDB Compass (GUI)

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Open Compass
3. Paste your connection string
4. Click **"Connect"**
5. Browse your database visually

---

## Common Issues & Solutions

### Issue 1: Authentication Failed
**Solution:** 
- Check username/password are correct
- Encode special characters in password
- Ensure user has correct privileges

### Issue 2: Connection Timeout
**Solution:**
- Check network access settings (0.0.0.0/0 for dev)
- Verify your IP is whitelisted
- Check firewall settings

### Issue 3: Cannot Connect from Server
**Solution:**
- Add server IP to Network Access whitelist
- For cloud hosting (Vercel/Render), add their IP ranges
- Use 0.0.0.0/0 for development only

### Issue 4: Wrong Database Name
**Solution:**
- Ensure database name in connection string matches
- Check MONGO_URI has `/shackles_db` before the `?`

---

## Security Best Practices

### ✅ DO:
- Use strong passwords (16+ characters, mixed case, numbers, symbols)
- Store credentials in `.env` file only
- Add `.env` to `.gitignore`
- Use specific IP whitelisting in production
- Enable MongoDB Atlas alerts
- Regularly rotate passwords
- Use separate users for different environments

### ❌ DON'T:
- Commit `.env` to git
- Use 0.0.0.0/0 in production
- Share database credentials publicly
- Use simple passwords
- Use same credentials for all environments

---

## MongoDB Atlas Features to Explore

1. **Metrics** - Monitor database performance
2. **Alerts** - Set up notifications for issues
3. **Backups** - Automated backups (paid tiers)
4. **Data Explorer** - Browse and edit data visually
5. **Performance Advisor** - Get optimization suggestions
6. **Charts** - Create data visualizations

---

## Free Tier Limits (M0)

- **Storage**: 512 MB
- **RAM**: Shared
- **Connections**: 500 concurrent
- **Perfect for**: Development and small production apps
- **Cost**: $0 forever

---

## Next Steps After Setup

1. ✅ Update `server/.env` with connection string
2. ✅ Test connection using test script
3. ✅ Run backend server: `npm run dev`
4. ✅ Check console for "MongoDB connected" message
5. ✅ Start implementing API endpoints
6. ✅ Share database with collaborator

---

## Support & Resources

- **MongoDB University**: https://university.mongodb.com/ (Free courses)
- **Documentation**: https://www.mongodb.com/docs/atlas/
- **Community Forums**: https://www.mongodb.com/community/forums/
- **Status Page**: https://status.cloud.mongodb.com/

---

## Collaborator Access

To give your backend developer access:

1. Go to **Access Manager** in Atlas
2. Click **"Invite to Organization"**
3. Enter their email
4. Set role: **"Organization Member"** or **"Project Data Access Read/Write"**
5. They'll receive invitation email

**OR** simply share:
- Connection string (via secure method)
- Username/Password
- They can use same credentials

---

**Created for SHACKLES 25-26 Symposium**
**Department of Mechanical Engineering, ACGCET**
