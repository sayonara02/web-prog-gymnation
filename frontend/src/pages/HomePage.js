import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';
import './HomePage.css';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loadingMore, setLoadingMore] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const fetchPosts = async (page = 1) => {
    try {
      const currentLimit = pagination.limit || 10;
      const res = await axiosInstance.get('/posts', { params: { page, limit: currentLimit } });
      if (page === 1) {
        setPosts(res.data.posts);
      } else {
        setPosts(prev => [...prev, ...res.data.posts]);
      }
      setPagination(prev => ({ ...prev, ...res.data.pagination }));
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    fetchPosts(pagination.page + 1);
  };

  const handleCommentSubmit = async (postId) => {
    const content = commentInputs[postId];
    if (!content?.trim()) return;

    try {
      const res = await axiosInstance.post('/comments', {
        postId,
        content,
      });

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, res.data.comment] }
            : post
        )
      );

      setCommentInputs({ ...commentInputs, [postId]: '' });
    } catch (err) {
      console.error('Error adding comment:', err);
      alert(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axiosInstance.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="home-page" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Community Feed</h1>
        <div className="skeleton-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-post">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <div className="skeleton-avatar"></div>
                <div style={{ flex: 1 }}>
                  <div className="skeleton-line" style={{ width: '120px', height: '16px' }}></div>
                  <div className="skeleton-line" style={{ width: '80px', height: '12px', marginTop: '5px' }}></div>
                </div>
              </div>
              <div className="skeleton-line" style={{ width: '100%', height: '200px', marginBottom: '15px' }}></div>
              <div className="skeleton-line" style={{ width: '100%', height: '16px' }}></div>
              <div className="skeleton-line" style={{ width: '60%', height: '16px', marginTop: '10px' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="home-page" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Community Feed</h1>

      {posts.length === 0 ? (
        <p>No posts yet. Be the first to share!</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="post-card"
            style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '20px',
              marginBottom: '20px',
              background: '#fff',
            }}
          >
            {/* Post Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
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
                }}
              >
                  {post.user?.profilePic ? (
                    <img
                      src={getImageUrl(post.user.profilePic)}
                      alt={post.user.name}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                  <span>{post.user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                )}
              </div>
              <div>
                <strong>{post.user?.name || 'Anonymous'}</strong>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Post Image */}
            {post.image && (
              <div style={{ marginBottom: '15px' }}>
                <img
                  src={getImageUrl(post.image)}
                  alt="Post"
                  loading="lazy"
                  style={{
                    width: '100%',
                    maxHeight: '500px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    background: '#f0f0f0',
                    transition: 'opacity 0.3s ease',
                  }}
                  onLoad={(e) => { e.target.style.opacity = '1'; }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Post Description */}
            <p style={{ fontSize: '16px', marginBottom: '15px' }}>{post.description}</p>

            {/* Delete Button (only for post owner) */}
            {user && post.user?._id === user._id && (
              <button
                onClick={() => handleDeletePost(post._id)}
                style={{
                  background: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginBottom: '15px',
                }}
              >
                Delete Post
              </button>
            )}

            {/* Comments Section */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <h4>Comments ({post.comments?.length || 0})</h4>

              {/* Comment Input */}
              {user ? (
                <div style={{ marginBottom: '15px' }}>
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputs[post._id] || ''}
                    onChange={(e) =>
                      setCommentInputs({
                        ...commentInputs,
                        [post._id]: e.target.value,
                      })
                    }
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCommentSubmit(post._id);
                      }
                    }}
                    style={{
                      width: '80%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                    }}
                  />
                  <button
                    onClick={() => handleCommentSubmit(post._id)}
                    style={{
                      padding: '8px 15px',
                      background: '#4ecdc4',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginLeft: '10px',
                    }}
                  >
                    Post
                  </button>
                </div>
              ) : (
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                  <a href="/login" style={{ color: '#4ecdc4', textDecoration: 'none' }}>Login</a> to comment
                </p>
              )}

              {/* Comments List */}
              {post.comments?.length > 0 ? (
                <div>
                  {post.comments.map((comment) => (
                    <div
                      key={comment._id}
                      style={{
                        background: '#f9f9f9',
                        padding: '10px',
                        borderRadius: '5px',
                        marginBottom: '8px',
                      }}
                    >
                      <strong>{comment.user?.name || 'Anonymous'}</strong>
                      <p style={{ margin: '5px 0' }}>{comment.content}</p>
                      <small style={{ color: '#999' }}>
                        {new Date(comment.createdAt).toLocaleString()}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#999' }}>No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>
        ))
      )}

      {/* Load More Button */}
      {pagination.pages > 1 && pagination.page < pagination.pages && !loadingMore && (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <button
            onClick={handleLoadMore}
            style={{
              padding: '12px 30px',
              background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(78, 205, 196, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Load More Posts
          </button>
        </div>
      )}

      {loadingMore && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading more posts...</p>
        </div>
      )}

      {pagination.pages > 1 && pagination.page >= pagination.pages && (
        <p style={{ textAlign: 'center', color: '#999', margin: '2rem 0' }}>
          You've reached the end
        </p>
      )}
    </div>
  );
};

export default HomePage;
