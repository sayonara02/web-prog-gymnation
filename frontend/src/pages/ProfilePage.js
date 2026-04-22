import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';

const ProfilePage = () => {
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('file');

  const MAX_BIO_LENGTH = 500;
  const MAX_FILE_SIZE_MB = 5;

  useEffect(() => {
    if (currentUser) {
      console.log('ProfilePage: currentUser loaded', currentUser);
      setProfile(currentUser);
      setName(currentUser.name || '');
      setBio(currentUser.bio || '');
      setProfilePicUrl(currentUser.profilePic || '');
      if (currentUser.profilePic) {
        setProfilePicPreview(getImageUrl(currentUser.profilePic));
      }
      setLoading(false);
    }
  }, [currentUser]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      showMessage('error', 'Invalid file type. Only JPG, PNG, JPEG, and GIF are allowed.');
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      showMessage('error', `File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfilePicPreview(e.target.result);
      setProfilePicFile(file);
      setProfilePicUrl('');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files[0]);
  };

  const removeProfilePic = () => {
    setProfilePicFile(null);
    setProfilePicUrl('');
    setProfilePicPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleUploadMethod = (method) => {
    setUploadMethod(method);
    if (method === 'file') {
      setProfilePicUrl('');
      setProfilePicFile(null);
      if (profile?.profilePic) {
        setProfilePicPreview(getImageUrl(profile.profilePic));
      } else {
        setProfilePicPreview('');
      }
    } else {
      setProfilePicFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (profile?.profilePic) {
        setProfilePicPreview(getImageUrl(profile.profilePic));
        setProfilePicUrl(profile.profilePic);
      } else {
        setProfilePicPreview('');
        setProfilePicUrl('');
      }
    }
  };

  const handleEdit = () => {
    console.log('Edit clicked, profile:', profile);
    setIsEditing(true);
    setName(profile?.name || '');
    setBio(profile?.bio || '');
    setProfilePicUrl(profile?.profilePic || '');
    setProfilePicFile(null);
    setProfilePicPreview(profile?.profilePic ? getImageUrl(profile.profilePic) : '');
    setUploadMethod('file');
    showMessage('', '');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(profile?.name || '');
    setBio(profile?.bio || '');
    setProfilePicFile(null);
    setProfilePicPreview(profile?.profilePic ? getImageUrl(profile.profilePic) : '');
    setProfilePicUrl(profile?.profilePic || '');
    showMessage('', '');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    showMessage('', '');
    console.log('Saving profile...', { name, bio, profilePicFile, profilePicUrl });

    if (!name.trim()) {
      showMessage('error', 'Name is required');
      return;
    }
    if (name.trim().length < 2) {
      showMessage('error', 'Name must be at least 2 characters');
      return;
    }
    if (bio.length > MAX_BIO_LENGTH) {
      showMessage('error', `Bio cannot exceed ${MAX_BIO_LENGTH} characters`);
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('bio', bio.trim());

      if (profilePicFile) {
        formData.append('profilePic', profilePicFile);
      } else if (profilePicUrl.trim()) {
        formData.append('profilePic', profilePicUrl.trim());
      }

      const response = await axiosInstance.put('/users/profile', formData, {
        headers: { 'Content-Type': undefined },
      });

      console.log('Profile update response:', response.data);

      const updatedUser = response.data.user;
      setProfile(updatedUser);
      setProfilePicPreview(updatedUser.profilePic ? getImageUrl(updatedUser.profilePic) : '');

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      storedUser.name = updatedUser.name;
      storedUser.bio = updatedUser.bio;
      storedUser.profilePic = updatedUser.profilePic;
      localStorage.setItem('user', JSON.stringify(storedUser));

      setIsEditing(false);
      showMessage('success', 'Profile updated successfully!');
    } catch (err) {
      console.error('Profile update error:', err);
      const errMsg = err.response?.data?.message || 'Failed to update profile.';
      showMessage('error', errMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner-large"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-error">
        <p>Profile not found</p>
        <button className="btn-primary" onClick={() => navigate('/home')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-container">
            <div className={`avatar ${isEditing ? 'editing' : ''}`}>
              {profilePicPreview ? (
                <img src={profilePicPreview} alt="Profile" />
              ) : (
                <span className="avatar-initial">
                  {profile?.name ? String(profile.name).charAt(0).toUpperCase() : 'U'}
                </span>
              )}
              {isEditing && (
                <div
                  className="avatar-overlay"
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Change profile picture"
                >
                  <span className="overlay-icon">📷</span>
                  <span>Change Photo</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={handleFileInputChange}
              disabled={!isEditing || saving}
              style={{ display: 'none' }}
              aria-label="Upload profile picture"
            />
          </div>
        </div>

        <div className="profile-body">
          <div className="profile-header-section">
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                disabled={saving}
                className="name-input"
                aria-label="Name"
                aria-required="true"
              />
            ) : (
              <h1 className="profile-name">{profile?.name || 'Anonymous'}</h1>
            )}
            <p className="profile-role">{profile?.role === 'admin' ? '👑 Admin' : 'Member'}</p>
          </div>

          {/* Edit Button - Outside Form */}
          {!isEditing && (
            <button type="button" onClick={handleEdit} className="btn btn-edit">
              ✏️ Edit Profile
            </button>
          )}

          {isEditing && (
            <form onSubmit={handleSave} className="profile-form">
              <div className="form-group">
                <label className="form-label">Email</label>
                <div className="form-readonly">{profile?.email}</div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Bio <span className="optional">(optional)</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  disabled={saving}
                  rows={4}
                  maxLength={MAX_BIO_LENGTH}
                  className="form-textarea"
                  aria-label="Bio"
                />
                <div className="char-counter">
                  <span>{bio.length}/{MAX_BIO_LENGTH}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Profile Picture</label>
                <div className="upload-toggle">
                  <button type="button" onClick={() => toggleUploadMethod('file')} className={`toggle-btn ${uploadMethod === 'file' ? 'active' : ''}`}>
                    📁 Upload File
                  </button>
                  <button type="button" onClick={() => toggleUploadMethod('url')} className={`toggle-btn ${uploadMethod === 'url' ? 'active' : ''}`}>
                    🔗 Image URL
                  </button>
                </div>

                {uploadMethod === 'file' && (
                  <div
                    className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload profile picture"
                  >
                    <div className="drop-icon">📸</div>
                    <p className="drop-text">{isDragging ? 'Drop your image here' : 'Drag & drop or click to upload'}</p>
                    <p className="drop-hint">JPG, PNG, GIF up to {MAX_FILE_SIZE_MB}MB</p>
                  </div>
                )}

                {uploadMethod === 'url' && (
                  <input
                    type="url"
                    value={profilePicUrl}
                    onChange={(e) => {
                      setProfilePicUrl(e.target.value);
                      setProfilePicPreview(e.target.value);
                      setProfilePicFile(null);
                    }}
                    placeholder="https://example.com/profile.jpg"
                    disabled={saving}
                    className="url-input"
                  />
                )}

                {profilePicPreview && (
                  <div className="image-preview">
                    <img src={profilePicPreview} alt="Preview" />
                    <button type="button" onClick={removeProfilePic} disabled={saving} className="remove-btn" aria-label="Remove profile picture">
                      ×
                    </button>
                  </div>
                )}
              </div>

              <div className="button-group">
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? <><span className="spinner-small"></span>Saving...</> : '✓ Save Changes'}
                </button>
                <button type="button" onClick={handleCancel} disabled={saving} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {!isEditing && (
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          )}

          {message.text && (
            <div className={`alert alert-${message.type}`}>
              <span className="alert-icon">{message.type === 'success' ? '✓' : '⚠️'}</span>
              {message.text}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .profile-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          color: #4ecdc4;
          font-size: 1.2rem;
          gap: 20px;
        }
        .spinner-large {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(78, 205, 196, 0.2);
          border-top-color: #4ecdc4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .profile-error {
          text-align: center;
          padding: 60px 20px;
        }
        .profile-error p {
          color: #666;
          margin-bottom: 20px;
          font-size: 1.1rem;
        }
        .profile-page {
          min-height: calc(100vh - 200px);
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 40px 20px;
        }
        .profile-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 10px 50px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          width: 100%;
          overflow: hidden;
        }
        .profile-header {
          background: linear-gradient(135deg, #ff6fb1 0%, #c77dff 50%, #4ecdc4 100%);
          padding: 40px 20px 80px;
          text-align: center;
          position: relative;
        }
        .avatar-container {
          position: absolute;
          bottom: -60px;
          left: 50%;
          transform: translateX(-50%);
        }
        .avatar {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: white;
          border: 5px solid white;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }
        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .avatar-initial {
          font-size: 3.5rem;
          font-weight: bold;
          color: #4ecdc4;
        }
        .avatar-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: white;
          font-size: 0.9rem;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .avatar.editing .avatar-overlay {
          opacity: 1;
        }
        .avatar:hover .avatar-overlay {
          opacity: 1;
        }
        .avatar-overlay:hover {
          background: rgba(0, 0, 0, 0.7);
        }
        .overlay-icon {
          font-size: 1.5rem;
        }
        .profile-body {
          padding: 70px 40px 40px;
          margin-top: -50px;
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        .profile-header-section {
          text-align: center;
          margin-bottom: 10px;
        }
        .profile-name {
          font-size: 1.8rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }
        .profile-role {
          color: #666;
          font-size: 0.95rem;
        }
        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-label {
          font-weight: 600;
          color: #555;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .optional {
          color: #999;
          font-weight: normal;
        }
        .form-readonly {
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          background: #f9f9f9;
          color: #666;
          font-size: 1rem;
        }
        .name-input {
          width: 100%;
          max-width: 300px;
          padding: 12px 16px;
          border: 2px solid #4ecdc4;
          border-radius: 10px;
          font-size: 1.5rem;
          font-weight: bold;
          text-align: center;
          margin: 0 auto;
          color: #333;
          outline: none;
        }
        .name-input:focus {
          border-color: #44a08d;
          box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
        }
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #4ecdc4;
          border-radius: 10px;
          font-size: 1rem;
          resize: vertical;
          font-family: inherit;
          outline: none;
        }
        .form-textarea:focus {
          border-color: #44a08d;
          box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
        }
        .char-counter {
          font-size: 0.8rem;
          color: #666;
          text-align: right;
        }
        .upload-toggle {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }
        .toggle-btn {
          padding: 8px 16px;
          border-radius: 20px;
          border: 2px solid;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          background: transparent;
        }
        .file-btn.active,
        .file-btn:hover {
          background: #4ecdc4;
          border-color: #4ecdc4;
          color: white;
        }
        .url-btn.active,
        .url-btn:hover {
          background: #c77dff;
          border-color: #c77dff;
          color: white;
        }
        .drop-zone {
          border: 2px dashed #ccc !important;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          cursor: pointer;
          background: #f9f9f9;
          transition: all 0.3s ease;
        }
        .drop-zone.dragging,
        .drop-zone:hover {
          border-color: #4ecdc4 !important;
          background: rgba(78, 205, 196, 0.05);
        }
        .drop-icon {
          font-size: 2rem;
          margin-bottom: 8px;
        }
        .drop-text {
          color: #666;
          margin: 0;
        }
        .drop-hint {
          color: #999;
          font-size: 0.8rem;
          margin-top: 5px;
        }
        .url-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #c77dff;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
        }
        .url-input:focus {
          border-color: #b86eff;
          box-shadow: 0 0 0 3px rgba(199, 125, 255, 0.1);
        }
        .image-preview {
          margin-top: 15px;
          display: inline-block;
          position: relative;
        }
        .image-preview img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid white;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        .remove-btn {
          position: absolute;
          top: 0;
          right: 0;
          background: #ff6b6b;
          color: white;
          border: none;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .remove-btn:hover:not(:disabled) {
          transform: scale(1.1);
        }
        .btn {
          padding: 14px 24px;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn-edit {
          width: 100%;
          background: linear-gradient(135deg, #ff6fb1, #c77dff);
          color: white;
        }
        .btn-edit:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 111, 177, 0.3);
        }
        .btn-primary {
          flex: 1;
          background: linear-gradient(135deg, #4ecdc4, #44a08d);
          color: white;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(78, 205, 196, 0.3);
        }
        .btn-secondary {
          flex: 1;
          background: #f0f0f0;
          color: #666;
        }
        .btn-secondary:hover:not(:disabled) {
          background: #e0e0e0;
        }
        .btn-logout {
          width: 100%;
          margin-top: 20px;
          padding: 10px 24px;
          background: transparent;
          color: #ff6b6b;
          border: 2px solid #ff6b6b;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-logout:hover {
          background: #ff6b6b;
          color: white;
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed !important;
          transform: none !important;
        }
        .alert {
          margin-top: 20px;
          padding: 12px 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          animation: fadeIn 0.3s ease;
        }
        .alert-success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .alert-error {
          background: #ffe0e0;
          color: #d32f2f;
          border: 1px solid #ffcdd2;
        }
        .spinner-small {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          .profile-page { padding: 20px 10px; }
          .profile-card { border-radius: 16px; }
          .profile-header { padding: 30px 15px 60px; }
          .avatar { width: 120px; height: 120px; }
          .avatar-initial { font-size: 2.8rem; }
          .profile-body { padding: 50px 20px 30px; }
          .profile-name { font-size: 1.5rem; }
          .upload-toggle { flex-direction: column; }
          .btn { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
