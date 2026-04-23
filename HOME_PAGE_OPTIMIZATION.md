# Home Page Image & Post Loading Optimizations

## Problems Fixed

### 1. Slow Initial Load (All Posts At Once)

**Issue:** Home page fetched ALL posts with ALL comments on initial load, causing significant delay even with few posts.

**Fix:** Added pagination to posts endpoint.

**Backend changes** (`backend/routes/post.routes.js`):
- Added `?page=1&limit=10` query support
- Default: 10 posts per page
- Returns pagination metadata: `{ page, limit, total, pages }`
- Only fetches comments for the current page's posts (reduces DB load)

**Frontend changes** (`frontend/src/pages/HomePage.js`):
- Added pagination state
- "Load More" button at bottom
- Loads 10 posts initially, more on demand
- Merges new posts with existing (no flicker)

**Result:** Initial page load now fast regardless of total post count.

---

### 2. Image Loading Delays

**Issue:** Post images and user avatars took time to appear, especially on slow connections.

**Fixes applied:**

#### a) Lazy Loading
Added `loading="lazy"` to all images:
```html
<img src="..." loading="lazy" />
```
Images below the fold only load when scrolled into view.

#### b) Image URL Utility (Already existed)
Uses `getImageUrl()` to correctly construct full backend URL.
Already in place - verified working.

#### c) Fade-in Effect
Added opacity transition on image load:
```css
transition: opacity 0.3s ease;
```

#### d) Background Placeholder
Grey background (`#f0f0f0`) shows while image loads, preventing layout shift.

#### e) Browser Caching
Backend now sends cache headers for `/uploads` (1 day expiry). Images cached in browser.

---

### 3. Visual Feedback During Loading

**Added:** Skeleton loading screens while initial posts load.

`HomePage.css` includes:
- Animated shimmer effect on placeholder elements
- Matches post card layout
- Improves perceived performance

---

## Configuration

**Backend** (`backend/server.js`):
```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: 24 * 60 * 60 * 1000, // 1 day cache
  etag: true,
  lastModified: true,
}));
```

**Frontend** (`frontend/.env`):
```
REACT_APP_API_URL=https://web-prog-gymnation.onrender.com/api
```

---

## Usage After Deploy

1. Initial load: 10 posts + images visible quickly
2. Scroll down: Lazy-loaded images appear
3. Click "Load More Posts" to fetch next 10
4. Images cached on second view

---

## Files Modified

| File | Change |
|------|--------|
| `backend/routes/post.routes.js` | Added pagination + lean queries |
| `backend/server.js` | Cache headers for static files |
| `frontend/src/pages/HomePage.js` | Pagination, lazy loading, skeleton UI |
| `frontend/src/pages/HomePage.css` | Skeleton animation styles |

---

## Additional Notes

- Admin posts tab already has pagination (20 per page) from earlier
- Images served from Render's `/uploads` route with caching
- For even faster images, consider Cloudinary CDN or Render's CDN features
- Mobile: lazy loading critical for data savings
