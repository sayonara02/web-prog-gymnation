# PrideFitGym 🏋️

A full-stack social fitness platform for sharing workout progress, connecting with fitness enthusiasts, and building a community. Built with the MERN stack (MongoDB, Express, React, Node.js).

![PrideFitGym Banner](https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge&logo=mongodb&logo=express&logo=react&logo=node.js)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 👤 User Authentication
- User registration & login with JWT
- Protected routes for authenticated users
- Role-based access (User/Admin)

### 👤 Profile Management
- View and edit profile information
- Upload profile picture (file or URL)
- Add bio and personal details

### 📸 Social Feed
- Create posts with text and images
- View all community posts in a feed
- Like and comment on posts
- Real-time updates

### 🏋️ Workout Tracking
- Plan workout routines
- Track exercise progress
- View personal fitness history

### 🏆 Community Features
- Follow other users
- Browse community posts
- Engage with fitness content

---

## 🛠 Tech Stack

### Frontend
- **React 18** – UI library
- **React Router v6** – Client-side routing
- **Axios** – HTTP client
- **CSS3** – Styling with modern features
- **Create React App** – Build tool

### Backend
- **Node.js** – Runtime environment
- **Express.js** – Web framework
- **MongoDB** – Database
- **Mongoose** – ODM for MongoDB
- **Multer** – File upload handling
- **JWT (jsonwebtoken)** – Authentication
- **bcryptjs** – Password hashing
- **dotenv** – Environment variables
- **cors** – Cross-origin resource sharing

---

## 📁 Project Structure

```
PRIDEFITGYM/
│
├── backend/                    # Express API server
│   ├── config/                # Database & middleware config
│   │   ├── db.js
│   │   └── role.middleware.js
│   ├── middleware/            # Express middleware
│   │   └── auth.middleware.js
│   ├── models/                # Mongoose models
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   └── Workout.js
│   ├── routes/                # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── post.routes.js
│   │   ├── comment.routes.js
│   │   └── admin.routes.js
│   ├── utils/                 # Utility functions
│   │   └── upload.js          # Multer configuration
│   ├── uploads/               # Uploaded files (auto-created)
│   │   ├── profiles/
│   │   └── posts/
│   ├── .env                   # Environment variables (create this)
│   ├── package.json
│   └── server.js              # Entry point
│
├── frontend/                  # React application
│   ├── public/
│   ├── src/
│   │   ├── api/              # Axios configuration
│   │   │   └── axios.js
│   │   ├── components/       # Reusable React components
│   │   │   ├── Navbar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/          # React Context
│   │   │   └── AuthContext.js
│   │   ├── pages/            # Page components
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── ProfilePage.js
│   │   │   ├── CreatePostPage.js
│   │   │   └── AdminPage.js
│   │   ├── utils/            # Utility functions
│   │   │   └── imageUrl.js
│   │   ├── App.js           # Main App component
│   │   ├── App.css          # Global styles
│   │   └── index.js         # Entry point
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local instance or MongoDB Atlas account)
- **npm** or **yarn**

---

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd PRIDEFITGYM
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (see Environment Variables section)
# Create uploads directory (the server will auto-create on first run)

# Start development server
npm run dev
# or
nodemon server.js
```

Backend will run at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# or
npm start
```

Frontend will run at: `http://localhost:3000`

---

## 🔧 Environment Variables

### Backend `.env` (create in `/backend` folder)

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.u1mmbmk.mongodb.net/pridefitgym?appName=Cluster0

# Server Port
PORT=5000

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_this

# Node Environment
NODE_ENV=development
```

**⚠️ Important:**
- Replace `<username>` and `<password>` with your actual MongoDB Atlas credentials
- Generate a strong `JWT_SECRET` (use: `openssl rand -base64 64` or similar)
- **Never commit `.env` to version control** (already in `.gitignore`)

---

## ▶️ Running the Application

### Development Mode

**Terminal 1 – Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 – Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:3000`

---

### Production Mode (Build Frontend)

```bash
cd frontend
npm run build
# Copy build folder to backend or serve via nginx
```

---

## 📡 API Documentation

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/me` | Get current user |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/profile` | Get user profile |
| PUT | `/users/profile` | Update profile (authenticated) |

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts` | Get all posts |
| GET | `/posts/:id` | Get single post |
| POST | `/posts` | Create new post (authenticated) |
| DELETE | `/posts/:id` | Delete post (owner/admin) |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/comments/post/:postId` | Get comments for a post |
| POST | `/comments` | Add comment (authenticated) |
| DELETE | `/comments/:id` | Delete comment (owner/admin) |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | Get all users (admin only) |
| DELETE | `/admin/users/:id` | Delete user (admin only) |

---

## 📸 Screenshots

> *(Add screenshots of your app here)*

- **Home Feed** – View posts from the community
- **Profile Page** – Edit and view your profile
- **Create Post** – Share your fitness journey
- **Admin Dashboard** – Manage users (admin only)

---

## 🏗 Build & Deployment

### Frontend Build

```bash
cd frontend
npm run build
# Output: frontend/build/
```

### Backend Start (Production)

```bash
cd backend
npm start
# or
node server.js
```

---

## 🐛 Known Issues & Troubleshooting

### "Server Error" on Create Post
- Ensure `backend/uploads/posts` folder exists (auto-created on server start)
- Check MongoDB connection
- Verify form data is being sent as `multipart/form-data`

### Cannot Edit Profile
- Ensure you are logged in (token in localStorage)
- Check that `Content-Type: undefined` is set for FormData requests
- Verify backend `/users/profile` PUT endpoint is accessible

### Images Not Loading
- Ensure backend serves static files: `app.use('/uploads', express.static(...))`
- Check `getImageUrl()` utility in frontend

### MongoDB Connection Fails
- Verify `MONGODB_URI` includes database name before `?`
- Whitelist your IP address in MongoDB Atlas
- Ensure user has correct roles and permissions

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. Create a **feature branch**: `git checkout -b feature/new-feature`
3. **Commit** changes: `git commit -m "Add new feature"`
4. **Push** to branch: `git push origin feature/new-feature`
5. **Open a Pull Request**

---

## 📄 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**marcdarylladress**

---

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Vercel/Netlify for frontend hosting suggestions
- The open-source community for amazing tools

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the **Troubleshooting** section above
2. Search existing GitHub Issues
3. Open a new Issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser console & server logs
   - Screenshots if applicable

---

**Made with ❤️ and caffeine**
