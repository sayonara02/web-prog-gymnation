/**
 * Utility to construct full image URL for uploaded files
 * Backend serves uploads at: http://localhost:5000/uploads/...
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // Convert to string to avoid errors if non-string (e.g., number, object)
  const path = String(imagePath);

  // If it's already a full URL (http or https), return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Otherwise, construct full URL for local uploads
  const BACKEND_URL = 'http://localhost:5000';
  // Ensure we don't double slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_URL}${cleanPath}`;
};
