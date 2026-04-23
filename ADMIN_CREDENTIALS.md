# Admin User Credentials (Premade)

**⚠️ IMPORTANT:** Change this password immediately after first login!

---

## Default Admin Account

The admin user is **automatically created** when the backend server starts (if no admin exists).

**Credentials:**
- **Email:** admin@pridefitgym.com
- **Password:** Admin@2024

---

## How It Works

On server startup (`server.js`), the code checks if any user with `role: 'admin'` exists. If not, it creates the default admin automatically.

This means **no manual steps required** - just deploy and the admin account exists.

---

## First Login Steps

1. Deploy backend to Render (with MongoDB connected)
2. Backend starts → admin user is created automatically (check Render logs)
3. Deploy frontend to Vercel
4. Go to `https://web-prog-gymnation-ten.vercel.app`
5. Click **Login**
6. Use credentials:
   - Email: `admin@pridefitgym.com`
   - Password: `Admin@2024`
7. After login, you'll see **Admin** link in navbar
8. Click it to access the Admin Dashboard (Users, Posts, Messages management)

---

## Security: Change Admin Password

**Immediately change the admin password after first login:**

### Option 1: Via Profile Page (Easiest)
1. Login as admin
2. Navigate to **Profile** page
3. Use "Update Password" section
4. Enter current password: `Admin@2024`
5. Enter new strong password
6. Save

### Option 2: Directly in MongoDB Atlas
```javascript
use pridefitgym
const bcrypt = require('bcryptjs');
const salt = await bcrypt.genSalt(12);
const hash = await bcrypt.hash('YourNewPassword', salt);
db.users.updateOne(
  { email: "admin@pridefitgym.com" },
  { $set: { password: hash } }
)
```

---

## Manual Creation (Backup Method)

If auto-creation fails for any reason, manually insert the admin user:

### MongoDB Atlas UI
1. Atlas → **Browse Collections** → `pridefitgym` → `users`
2. Click **Insert Document**
3. Paste:
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

**Password explanation:** The hash above is `Admin@2024` hashed with bcrypt (12 rounds).

---

## Important Notes

- Admin user is created **once** on first server start (if no admin exists)
- Credentials are hardcoded in `server.js` for demo purposes
- **For production:** Change the hardcoded credentials in `server.js` before deploying, or use environment variables
- Logs will show: `✅ Default admin user created: admin@pridefitgym.com / Admin@2024`
- If admin already exists, logs show: `✅ Admin user already exists`
- Never commit real credentials to a public repository
