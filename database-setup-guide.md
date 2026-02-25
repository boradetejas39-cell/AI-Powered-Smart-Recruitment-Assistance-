# MongoDB Database Setup Guide

## 🚨 Current Issue: MongoDB Atlas IP Whitelist

The MongoDB Atlas cluster is rejecting connections because your IP address isn't whitelisted.

## 🔧 Solution Options

### Option 1: Whitelist Your IP in MongoDB Atlas (Recommended)

1. **Go to MongoDB Atlas**: https://www.mongodb.com/atlas
2. **Login** to your account
3. **Navigate to your cluster**: `recruiter.vsvy6cx.mongodb.net`
4. **Go to Network Access** (left sidebar)
5. **Click "Add IP Address"**
6. **Select "Allow Access from Anywhere"** (0.0.0.0/0) for development
   - OR add your specific IP address for better security
7. **Click "Confirm"**
8. **Wait 2-3 minutes** for the changes to propagate
9. **Restart the server**: `npm start`

### Option 2: Use Local MongoDB (Easier for Development)

1. **Install MongoDB locally**:
   ```bash
   # Windows: Download and install from https://www.mongodb.com/try/download/community
   # Or use Chocolatey: choco install mongodb
   ```

2. **Start MongoDB service**:
   ```bash
   # Windows
   net start MongoDB
   
   # Or run mongod directly
   mongod
   ```

3. **Update .env file to use local MongoDB**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ai-recruiter
   ```

4. **Restart server**: `npm start`

### Option 3: Use MongoDB Compass (GUI Tool)

1. **Download MongoDB Compass**: https://www.mongodb.com/try/download/compass
2. **Connect with your connection string**:
   ```
   mongodb+srv://ai_smart_recruiter:recruiter123@recruiter.vsvy6cx.mongodb.net/?appName=Recruiter
   ```
3. **Test connection and whitelist IP through Compass**

## 🎯 Quick Fix for Development

If you want to get started immediately, use the local MongoDB option:

```bash
# 1. Install MongoDB (if not already installed)
# 2. Start MongoDB service
net start MongoDB

# 3. Update .env file
echo "MONGODB_URI=mongodb://localhost:27017/ai-recruiter" > .env

# 4. Restart server
npm start
```

## 🔍 Testing Connection

Once the database is connected, you should see:

```
✅ Connected to MongoDB
Database connection: Connected
Server is running on port 5000
```

Instead of:

```
❌ MongoDB connection error: Could not connect to any servers...
Database connection: Not connected (starting server without database)
```

## 📊 Database Features Available When Connected

- ✅ User persistence (accounts survive server restarts)
- ✅ Job postings storage
- ✅ Resume data storage
- ✅ Match results history
- ✅ Dashboard analytics
- ✅ File upload metadata
- ✅ User sessions and preferences

## 🚀 Production Considerations

For production deployment:
1. Use MongoDB Atlas with proper IP whitelisting
2. Enable authentication and encryption
3. Set up proper database indexes
4. Configure backup strategies
5. Monitor connection limits and performance

---

**Need help? Choose Option 1 (Atlas IP whitelist) or Option 2 (local MongoDB) to get started quickly!**
