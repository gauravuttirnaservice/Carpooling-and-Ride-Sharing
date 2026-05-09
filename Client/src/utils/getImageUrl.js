/**
 * Returns the correct image URL regardless of whether it is:
 * - An absolute Cloudinary URL  (https://res.cloudinary.com/...)  → returned as-is
 * - A legacy relative path      (/uploads/filename.jpg)           → prefixed with VITE_BACKEND_URL
 * - Null / undefined                                              → returns fallback avatar
 *
 * @param {string|null} url - The profilePicture value from the API
 * @param {string} [name="User"] - Name used for the fallback avatar initials
 * @returns {string} A fully-qualified image URL safe to use in <img src>
 */
export function getImageUrl(url, name = "User") {
    if (!url) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    }

    // Already an absolute URL (Cloudinary, S3, etc.) — use directly
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    // Legacy relative path from old /uploads/ local storage
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    return `${backendUrl}${url}`;
}
