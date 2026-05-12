/**
 * Safely constructs a database connection string from environment variables.
 * Handles URL encoding for special characters in passwords and protocol replacement.
 */
export function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  
  if (url) {
    // If a full URL is provided, return it (it should already be encoded by the user)
    return url;
  }

  // Otherwise, construct it from individual components
  const user = encodeURIComponent(process.env.DB_USER || 'root');
  const password = encodeURIComponent(process.env.DB_PASSWORD || '');
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = process.env.DB_PORT || '3306';
  const name = process.env.DB_NAME || 'auxiron_ghee';

  // Return formatted mysql string (the caller will replace protocol if needed)
  return `mysql://${user}:${password}@${host}:${port}/${name}`;
}
