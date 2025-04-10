
/**
 * Centralized API configuration and utility functions
 */

// API base URL - update this if your server runs on a different port or host
export const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for making authenticated API requests
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('rento-token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}
