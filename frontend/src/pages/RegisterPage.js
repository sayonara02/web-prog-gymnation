import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/home');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <h2>Join PrideFit Gym 🏳️‍🌈</h2>
      <p style={{ color: '#666', marginBottom: '30px', textAlign: 'center' }}>
        Create your account and start your fitness journey today
      </p>
      {error && (
        <div className="error-msg" style={{
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          background: '#ffe0e0',
          color: '#ff6b6b',
          border: '1px solid #ffcbcb',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
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
          placeholder="Password (min 6 characters)"
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
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
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: '25px', fontSize: '15px' }}>
        Already have an account?{' '}
        <Link to="/login" style={{
          color: '#4ecdc4',
          textDecoration: 'none',
          fontWeight: '600',
          borderBottom: '2px solid transparent'
        }}>
          Sign in here
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;