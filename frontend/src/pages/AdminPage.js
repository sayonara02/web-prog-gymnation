import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';
import './AdminPage.css';

const AdminPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Data states
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [postPagination, setPostPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  // Fetch all data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, postsRes, contactsRes] = await Promise.all([
        axiosInstance.get('/admin/users'),
        axiosInstance.get('/admin/posts', { params: { page: postPagination.page, limit: postPagination.limit } }),
        axiosInstance.get('/admin/contacts'),
      ]);
      setUsers(usersRes.data.users);
      setPosts(postsRes.data.posts);
      setPostPagination(prev => ({ ...prev, ...postsRes.data.pagination }));
      setContacts(contactsRes.data.contacts);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setMessage({ text: 'Failed to load data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (page = 1) => {
    try {
      const res = await axiosInstance.get('/admin/posts', { params: { page, limit: postPagination.limit } });
      setPosts(res.data.posts);
      setPostPagination(prev => ({ ...prev, ...res.data.pagination }));
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handlePageChange = (newPage) => {
    fetchPosts(newPage);
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // User actions
  const handleRoleChange = async (userId, newRole) => {
    try {
      await axiosInstance.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      showMessage('User role updated!');
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to update role', 'error');
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await axiosInstance.put(`/admin/users/${userId}/status`, { status: newStatus });
      setUsers(users.map((u) => (u._id === userId ? { ...u, status: newStatus } : u)));
      showMessage('User status updated!');
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user? All their posts & comments will be permanently removed.')) return;
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
      showMessage('User deleted!');
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  // Post actions
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post permanently?')) return;
    try {
      await axiosInstance.delete(`/admin/posts/${postId}`);
      setPosts(posts.filter((p) => p._id !== postId));
      showMessage('Post deleted!');
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to delete post', 'error');
    }
  };

  // Contact actions
  const handleUpdateContactStatus = async (contactId, status) => {
    try {
      await axiosInstance.put(`/admin/contacts/${contactId}/status`, { status });
      setContacts(contacts.map((c) => (c._id === contactId ? { ...c, status } : c)));
      showMessage('Contact status updated!');
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Delete this contact message?')) return;
    try {
      await axiosInstance.delete(`/admin/contacts/${contactId}`);
      setContacts(contacts.filter((c) => c._id !== contactId));
      showMessage('Contact deleted!');
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to delete contact', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <h1>Admin Dashboard</h1>
          <p className="admin-subtitle">Welcome back, {user?.name}. Manage your platform.</p>
        </div>
        <button onClick={handleLogout} className="admin-logout-btn">
          Logout
        </button>
      </div>

      {/* Alert Message */}
      {message.text && (
        <div className={`admin-alert admin-alert-${message.type}`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ text: '', type: '' })}>✕</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">{users.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <span className="stat-value">{posts.length}</span>
            <span className="stat-label">Total Posts</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-info">
            <span className="stat-value">{contacts.length}</span>
            <span className="stat-label">Messages</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔔</div>
          <div className="stat-info">
            <span className="stat-value">{contacts.filter(c => c.status === 'new').length}</span>
            <span className="stat-label">New Messages</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          📝 Posts
        </button>
        <button
          className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          📧 Messages
        </button>
      </div>

      {/* Tab Panels */}
      <div className="admin-content">
        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="tab-panel">
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {u.profilePic ? (
                              <img src={getImageUrl(u.profilePic)} alt={u.name} loading="lazy" />
                            ) : (
                              <span>{u.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                            )}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          disabled={u._id === user?._id}
                          className="role-select"
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <select
                          value={u.status}
                          onChange={(e) => handleStatusChange(u._id, e.target.value)}
                          disabled={u._id === user?._id}
                          className={`status-select status-${u.status}`}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        {u._id !== user?._id && (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="action-btn delete"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="empty-state">No users found.</p>}
            </div>
          </div>
        )}

        {/* POSTS TAB */}
        {activeTab === 'posts' && (
          <div className="tab-panel">
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Author</th>
                    <th>Description</th>
                    <th>Likes</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post._id}>
                       <td>
                         {post.image ? (
                           <img src={getImageUrl(post.image)} alt="Post" className="post-thumb" loading="lazy" />
                         ) : (
                           <div className="no-image">No img</div>
                         )}
                       </td>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar small">
                            {post.user?.profilePic ? (
                              <img src={getImageUrl(post.user.profilePic)} alt={post.user.name} loading="lazy" />
                            ) : (
                              <span>{post.user?.name?.charAt(0) || 'U'}</span>
                            )}
                          </div>
                          <span>{post.user?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="post-desc">
                        {post.description.length > 50
                          ? `${post.description.substring(0, 50)}...`
                          : post.description}
                      </td>
                      <td>{post.likes?.length || post.like?.length || 0}</td>
                      <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="action-btn delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {posts.length === 0 ? (
                <p className="empty-state">No posts yet.</p>
              ) : (
                <div className="pagination-controls">
                  <button
                    onClick={() => handlePageChange(postPagination.page - 1)}
                    disabled={postPagination.page <= 1}
                    className="pagination-btn"
                  >
                    ← Previous
                  </button>
                  <span className="pagination-info">
                    Page {postPagination.page} of {postPagination.pages} 
                    ({postPagination.total} total posts)
                  </span>
                  <button
                    onClick={() => handlePageChange(postPagination.page + 1)}
                    disabled={postPagination.page >= postPagination.pages}
                    className="pagination-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONTACTS TAB */}
        {activeTab === 'contacts' && (
          <div className="tab-panel">
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact._id}>
                      <td><strong>{contact.name}</strong></td>
                      <td>{contact.email}</td>
                      <td>{contact.subject}</td>
                      <td className="contact-message">
                        {contact.message.length > 60
                          ? `${contact.message.substring(0, 60)}...`
                          : contact.message}
                      </td>
                      <td>
                        <select
                          value={contact.status}
                          onChange={(e) => handleUpdateContactStatus(contact._id, e.target.value)}
                          className={`status-select status-${contact.status}`}
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteContact(contact._id)}
                          className="action-btn delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {contacts.length === 0 && <p className="empty-state">No contact messages.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
