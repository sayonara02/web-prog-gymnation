# Admin User Credentials (Premade)

**⚠️ IMPORTANT:** Change these credentials after first login!

---

## Default Admin Account

- **Email:** admin@pridefitgym.com
- **Password:** Admin@2024

---

## How to Create Admin User

### Method 1: Temporary API Endpoint (Easiest - No Shell Needed)

Your backend includes a temporary endpoint to create the admin user:

**Endpoint:**
```
POST https://web-prog-gymnation.onrender.com/api/auth/create-admin
```

**Steps:**
1. Deploy your backend to Render (with MongoDB configured and IP whitelisted)
2. Once deployed, open browser console or use curl/Postman:
   ```bash
   curl -X POST https://web-prog-gymnation.onrender.com/api/auth/create-admin
   ```
3. Expected response:
   ```json
   {
     "success": true,
     "message": "Admin user created successfully",
     "credentials": {
       "email": "admin@pridefitgym.com",
       "password": "Admin@2024"
     }
   }
   ```
4. **IMPORTANT:** After creating admin, **remove the `/create-admin` route** from `backend/routes/auth.routes.js` to prevent security issues.

---

### Method 2: MongoDB Atlas UI

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) → **Browse Collections**
2. Navigate to `pridefitgym` → `users` collection
3. Click **Insert Document** and paste:
```json
{
  "name": "Admin",
  "email": "admin@pridefitgym.com",
  "password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/qN8MD4.KC",
  "role": "admin",
  "status": "active",
  "bio": "System Administrator - PrideFitGym",
  "profilePic": "",
  "createdAt": { "$date": { "$numberLong": "1745400000000" } },
  "updatedAt": { "$date": { "$numberLong": "1745400000000" } }
}
```
4. Click **Insert**

---

### Method 3: MongoDB Shell in Atlas

1. Atlas → **Database** → **Connect** → **MongoDB Shell**
2. Run:
```javascript
use pridefitgym
db.users.insertOne({
  name: "Admin",
  email: "admin@pridefitgym.com",
  password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/qN8MD4.KC",
  role: "admin",
  status: "active",
  bio: "System Administrator - PrideFitGym",
  profilePic: "",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## Security Notes

1. **Change the admin password** immediately after first login
2. **Remove the temporary endpoint** from production code after creating admin
3. Use a strong, unique password
4. Never share admin credentials
5. Consider creating additional admin accounts with unique credentials

