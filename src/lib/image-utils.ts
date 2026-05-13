
/**
 * Normalizes image URLs to ensure they are browser-ready.
 * Strips 'public/' prefix and ensures a leading slash.
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  
  // If it's a data URL or absolute URL, return as is
  if (url.startsWith("data:") || url.startsWith("http")) return url;
  
  // Strip 'public/' if it exists at the start
  let cleanUrl = url.replace(/^public\//, "");
  
  // Ensure it starts with /
  if (!cleanUrl.startsWith("/")) {
    cleanUrl = "/" + cleanUrl;
  }
  
  return cleanUrl;
}
