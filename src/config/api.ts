// API Configuration
// For local development, set VITE_API_URL=http://localhost:5000 in .env file
// Or it will default to localhost:5000 in development mode

const getApiBaseUrl = (): string => {
  // Check for explicit API URL in environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Default to localhost in development, production URL in production
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }
  
  // Production URL
  return 'https://futurappapi-staging.up.railway.app';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to build API URLs
export const apiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

