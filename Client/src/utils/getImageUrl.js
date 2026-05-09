/**
 * Returns the correct image URL for display.
 *
 * - Absolute Cloudinary/external URL (starts with http/https) → returned as-is
 * - Null / undefined / relative legacy path                   → returns fallback avatar
 *
 * All images are now stored on Cloudinary. There is no local /uploads/ folder.
 *
 * @param {string|null} url  - The profilePicture / image value from the API
 * @param {string} [name="User"] - Name used for the fallback avatar initials
 * @returns {string} A fully-qualified image URL safe to use in <img src>
 */
export function getImageUrl(url, name = "User") {
    // Already an absolute Cloudinary / CDN URL — use directly
    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
        return url;
    }

    // No URL (null, undefined, empty, or old legacy relative path) → fallback avatar
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=random&color=fff`;
}
