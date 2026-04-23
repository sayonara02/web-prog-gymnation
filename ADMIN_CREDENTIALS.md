# Admin User Credentials (Premade)

**⚠️ IMPORTANT:** Change these credentials after first login!

---

## Default Admin Account

- **Email:** admin@pridefitgym.com
- **Password:** Admin@2024

---

## How to Create Admin User

### Option 1: Run Seed Script (Development)
```bash
# Make sure MongoDB is running and .env is configured
node seed-admin.js
```

### Option 2: Manually via MongoDB Compass
1. Connect to your MongoDB Atlas cluster
2. Navigate to `pridefitgym` database → `users` collection
3. Insert a new document:
```json
{
  "name": "Admin",
  "email": "admin@pridefitgym.com",
  "password": "$2b$12$<bcrypt-hash-of-Admin@2024>",
  "role": "admin",
  "status": "active",
  "bio": "System Administrator",
  "profilePic": "",
  "createdAt": "2026-04-23T00:00:00.000Z",
  "updatedAt": "2026-04-23T00:00:00.000Z"
}
```
Use bcrypt to hash: `bcrypt.hash('Admin@2024', 12)`

---

## Security Notes

1. **Change the admin password** immediately after first login
2. Use a strong, unique password
3. Enable 2FA if available
4. Never share admin credentials
5. Consider creating additional admin accounts with unique credentials
