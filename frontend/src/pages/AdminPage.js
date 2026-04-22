import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AdminPage = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/admin/users');
      setUsers(res.data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
      setMessage('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axiosInstance.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      setMessage('User role updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await axiosInstance.put(`/admin/users/${userId}/status`, { status: newStatus });
      setUsers(users.map((u) => (u._id === userId ? { ...u, status: newStatus } : u)));
      setMessage('User status updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also delete all their posts and comments.')) {
      return;
    }

    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
      setMessage('User deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="admin-page" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>

      {message && (
        <p
          style={{
            color: message.includes('success') || message.includes('updated') || message.includes('deleted') ? 'green' : 'red',
            padding: '10px',
            background: message.includes('success') || message.includes('updated') || message.includes('deleted') ? '#d4edda' : '#f8d7da',
            borderRadius: '5px',
            marginBottom: '15px',
          }}
        >
          {message}
        </p>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#4ecdc4', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#4ecdc4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '10px',
                        overflow: 'hidden',
                      }}
                    >
                      {u.profilePic ? (
                        <img src={u.profilePic} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span>{u.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    {u.name}
                  </div>
                </td>
                <td style={{ padding: '12px' }}>{u.email}</td>
                <td style={{ padding: '12px' }}>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    disabled={u._id === user?._id}
                    style={{
                      padding: '5px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      background: u._id === user?._id ? '#ccc' : 'white',
                    }}
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={{ padding: '12px' }}>
                  <select
                    value={u.status}
                    onChange={(e) => handleStatusChange(u._id, e.target.value)}
                    disabled={u._id === user?._id}
                    style={{
                      padding: '5px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      background: u._id === user?._id ? '#ccc' : 'white',
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                <td style={{ padding: '12px' }}>
                  {u._id !== user?._id && (
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      style={{
                        padding: '5px 10px',
                        background: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && <p style={{ marginTop: '20px' }}>No users found.</p>}
    </div>
  );
};

export default AdminPage;
