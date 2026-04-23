# Admin Account - Quick Start

## ✅ Admin Credentials (Auto-Created)

| Field | Value |
|-------|-------|
| Email | `admin@pridefitgym.com` |
| Password | `Admin@2024` |

**The admin account is automatically created** when the backend server starts for the first time (if no admin exists). No manual steps needed.

---

## 🚀 How to Access Admin Dashboard

1. **Backend deployed to Render** with MongoDB connected
2. **Frontend deployed to Vercel** at `https://web-prog-gymnation-ten.vercel.app`
3. Click **Login** → Enter credentials above
4. After login, see **Admin** link in navbar
5. Click **Admin** → Opens Admin Dashboard with 3 tabs:
   - **👥 Users** - Manage users (edit role/status, delete)
   - **📝 Posts** - View & delete posts
   - **📧 Messages** - View contact form submissions, update status

---

## 🔐 Change Admin Password (Required)

After first login, change password immediately:

1. Login as admin
2. Go to **Profile** page
3. Use "Update Password" form
4. Enter current password: `Admin@2024`
5. Enter new strong password
6. Save

---

## 📁 Implementation Details

- Admin auto-creation code: `backend/server.js` lines 79-105
- Admin dashboard: `frontend/src/pages/AdminPage.js` + `AdminPage.css`
- Admin routes: `backend/routes/admin.routes.js`
- Protected by: `backend/middleware/auth.middleware.js` (admin middleware)

---

## ⚠️ Security Notes

- Credentials are **hardcoded** for demo purposes
- **Production fix:** Change credentials in `server.js` before deploying, or use environment variables
- Remove hardcoded credentials from source before making repo public
- Change admin password immediately after first login
- Enable JWT secret to be strong random value
