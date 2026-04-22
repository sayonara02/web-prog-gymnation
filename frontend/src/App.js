import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePostPage from './pages/CreatePostPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Minigame from './pages/Minigame';
import './App.css';

// Navbar component with auth-aware links
const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    document.body.classList.toggle('dark-mode');
    const newTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <header className="app-header">
      <div className="logo">
        <div className="logo-placeholder" style={{
          width: '50px',
          height: '50px',
          background: 'white',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          🏳️‍🌈
        </div>
        <h2>PrideFit Gym</h2>
      </div>
      <nav className="nav-links">
        <Link to="/home" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
        {isAuthenticated ? (
          <>
            <Link to="/create-post" className="nav-link">Create Post</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            {user?.role === 'admin' && <Link to="/admin" className="nav-link admin-link">Admin</Link>}
            <button onClick={logout} className="nav-button logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-button register-button">
              Register
            </Link>
          </>
        )}
      </nav>
      <button
        onClick={toggleTheme}
        className="theme-toggle"
        style={{
          background: '#4ecdc4',
          border: 'none',
          borderRadius: '50px',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          fontSize: '1.5rem',
          color: 'white',
          marginLeft: 'auto'
        }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </header>
  );
};

function AppContent() {
  return (
    <div>
      <Navbar />
      <main className="app-main">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/minigame" element={<Minigame />} />

          {/* Protected routes */}
          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>© 2026 PrideFit Gym Portfolio | Building stronger bodies and communities</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
