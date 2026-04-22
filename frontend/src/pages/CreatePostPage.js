import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadMethod, setUploadMethod] = useState('file');
  const [imageUrl, setImageUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const MAX_DESCRIPTION_LENGTH = 1000;
  const MAX_FILE_SIZE_MB = 5;
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

  const handleFileSelect = (file) => {
    setError('');
    setImagePreview('');

    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError('Invalid file type. Only JPG, PNG, JPEG, and GIF are allowed.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setSelectedFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files[0]);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleUploadMethod = (method) => {
    setUploadMethod(method);
    setError('');
    if (method === 'file') {
      setImageUrl('');
    } else {
      setSelectedFile(null);
      setImagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!description.trim()) {
      setError('Please write something for your post.');
      return;
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      setError(`Description exceeds ${MAX_DESCRIPTION_LENGTH} character limit.`);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('description', description.trim());

      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (imageUrl.trim() && uploadMethod === 'url') {
        formData.append('image', imageUrl.trim());
      }

      const response = await axiosInstance.post('/posts', formData, {
        headers: {
          'Content-Type': undefined,
        },
      });

      setSuccess('Post created successfully!');

      setTimeout(() => {
        navigate('/home');
      }, 1000);
    } catch (err) {
      console.error('Post creation error:', err);
      const errMsg = err.response?.data?.message || 'Failed to create post. Please try again.';
      const detailedError = err.response?.data?.error ? `${errMsg} (${err.response.data.error})` : errMsg;
      setError(detailedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-wrapper" style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div className="create-post-card" style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        maxWidth: '700px',
        width: '100%',
      }}>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '2rem',
            background: 'linear-gradient(135deg, #ff6fb1, #c77dff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px',
          }}>
            Create New Post
          </h1>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>
            Share your fitness journey with the community
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px 20px',
            background: '#ffe0e0',
            color: '#d32f2f',
            borderRadius: '10px',
            marginBottom: '20px',
            border: '1px solid #ffcdd2',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '12px 20px',
            background: '#d4edda',
            color: '#155724',
            borderRadius: '10px',
            marginBottom: '20px',
            border: '1px solid #c3e6cb',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ fontSize: '1.2rem' }}>✓</span>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '0.95rem',
            }}>
              What's on your mind? <span style={{ color: '#ff6b6b' }}>*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share your workout, progress, or fitness tips..."
              required
              disabled={loading}
              rows={5}
              maxLength={MAX_DESCRIPTION_LENGTH}
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                fontSize: '15px',
                lineHeight: '1.5',
                resize: 'vertical',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4ecdc4';
                e.target.style.boxShadow = '0 0 0 3px rgba(78, 205, 196, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.boxShadow = 'none';
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '5px',
              fontSize: '0.85rem',
              color: '#666',
            }}>
              <span>Tell your story</span>
              <span style={{
                color: description.length > MAX_DESCRIPTION_LENGTH * 0.9 ? '#ff6b6b' : '#999',
                fontWeight: description.length > MAX_DESCRIPTION_LENGTH * 0.9 ? '600' : 'normal',
              }}>
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '0.95rem',
            }}>
              Add Photo (optional)
            </label>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <button
                type="button"
                onClick={() => toggleUploadMethod('file')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '2px solid #4ecdc4',
                  background: uploadMethod === 'file' ? '#4ecdc4' : 'transparent',
                  color: uploadMethod === 'file' ? 'white' : '#4ecdc4',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                📁 Upload File
              </button>
              <button
                type="button"
                onClick={() => toggleUploadMethod('url')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '2px solid #c77dff',
                  background: uploadMethod === 'url' ? '#c77dff' : 'transparent',
                  color: uploadMethod === 'url' ? 'white' : '#c77dff',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
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
                role="button"
                tabIndex={0}
                aria-label="Upload image by clicking or dragging and dropping"
                style={{
                  border: isDragging ? '3px dashed #4ecdc4' : '2px dashed #ccc',
                  borderRadius: '12px',
                  padding: '40px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: isDragging ? 'rgba(78, 205, 196, 0.05)' : '#f9f9f9',
                  transition: 'all 0.3s ease',
                  marginBottom: selectedFile ? '15px' : '0',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📸</div>
                <p style={{ color: '#666', marginBottom: '5px' }}>
                  {isDragging ? 'Drop your image here' : 'Drag & drop your image here'}
                </p>
                <p style={{ color: '#999', fontSize: '0.85rem' }}>
                  or click to browse (JPG, PNG, GIF up to {MAX_FILE_SIZE_MB}MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleFileInputChange}
                  disabled={loading}
                  style={{ display: 'none' }}
                  aria-label="Choose image file"
                />
              </div>
            )}

            {uploadMethod === 'url' && (
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/your-image.jpg"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '14px',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#c77dff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                  }}
                />
                <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '5px' }}>
                  Paste a direct link to an image
                </p>
              </div>
            )}

            {imagePreview && (
              <div style={{
                marginTop: '20px',
                position: 'relative',
                display: 'inline-block',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
              }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '12px',
                    objectFit: 'contain',
                    background: '#f5f5f5',
                  }}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  disabled={loading}
                  aria-label="Remove image"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.8)'}
                  onMouseOut={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.6)'}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !description.trim()}
            style={{
              width: '100%',
              padding: '16px',
              background: loading || !description.trim()
                ? 'linear-gradient(135deg, #ccc, #ddd)'
                : 'linear-gradient(135deg, #ff6fb1, #c77dff)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading || !description.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: loading || !description.trim() ? 'none' : '0 5px 15px rgba(255, 111, 177, 0.3)',
            }}
            onMouseOver={(e) => {
              if (!loading && description.trim()) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(255, 111, 177, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 5px 15px rgba(255, 111, 177, 0.3)';
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}></span>
                Posting...
              </span>
            ) : (
              'Share Post'
            )}
          </button>
        </form>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .drop-zone:hover,
          .drop-zone.dragging {
            border-color: #4ecdc4 !important;
            background: rgba(78, 205, 196, 0.05) !important;
          }
        `}</style>
      </div>
    </div>
  );
};

export default CreatePostPage;
