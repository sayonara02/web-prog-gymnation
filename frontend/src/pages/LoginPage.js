import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h2>Welcome Back! 💪</h2>
      <p style={{ color: '#666', marginBottom: '30px', textAlign: 'center' }}>
        Login to continue your fitness journey
      </p>
      {error && (
        <div className="error-msg" style={{
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          background: '#ffe0e0',
          color: '#ff6b6b',
          border: '1px solid #ffcbcb'
        }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            border: '2px solid #e0e0e0',
            borderRadius: '10px',
            fontSize: '16px',
            transition: 'border-color 0.3s ease'
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            border: '2px solid #e0e0e0',
            borderRadius: '10px',
            fontSize: '16px',
            transition: 'border-color 0.3s ease'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            background: 'linear-gradient(135deg, #ff6fb1, #c77dff)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            marginTop: '10px'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 5px 15px rgba(255, 111, 177, 0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '25px', fontSize: '15px' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{
          color: '#4ecdc4',
          textDecoration: 'none',
          fontWeight: '600',
          borderBottom: '2px solid transparent'
        }}>
          Create one here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;