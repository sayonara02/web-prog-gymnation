/**
 * Utility to construct full image URL for uploaded files
 * Backend serves uploads at: [API_URL]/uploads/...
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // Convert to string to avoid errors if non-string (e.g., number, object)
  const path = String(imagePath);

  // If it's already a full URL (http or https), return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Otherwise, construct full URL using environment variable or default
  const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};
