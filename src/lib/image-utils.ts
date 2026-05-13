
/**
 * Normalizes image URLs to ensure they are browser-ready.
 * Strips 'public/' prefix and ensures a leading slash.
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  
  // If it's a data URL or absolute URL, return as is
  if (url.startsWith("data:") || url.startsWith("http")) return url;
  
  // Standardize backslashes to forward slashes
  let cleanUrl = url.replace(/\\/g, "/");
  
  // Strip 'public/' if it exists at the start
  cleanUrl = cleanUrl.replace(/^public\//, "");
  
  // Ensure it starts with /
  if (!cleanUrl.startsWith("/")) {
    cleanUrl = "/" + cleanUrl;
  }
  
  // Add a small cache-buster timestamp if it's an upload
  if (cleanUrl.includes('/uploads/')) {
    const buster = Date.now();
    cleanUrl += (cleanUrl.includes('?') ? '&' : '?') + 'v=' + buster;
  }
  
  return cleanUrl;
}
