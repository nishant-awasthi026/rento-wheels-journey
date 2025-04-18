
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

// Vehicle Management APIs
export const vehicleAPI = {
  // Get all vehicles (public)
  getVehicles: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, String(value));
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchWithAuth(`/vehicles${queryString}`, { method: 'GET' });
  },
  
  // Get owner's vehicles
  getOwnerVehicles: async () => {
    return fetchWithAuth('/vehicles/owner', { method: 'GET' });
  },
  
  // Get single vehicle by ID
  getVehicleById: async (id: string) => {
    return fetchWithAuth(`/vehicles/${id}`, { method: 'GET' });
  },
  
  // Add vehicle (owner only)
  addVehicle: async (vehicleData: FormData) => {
    const token = localStorage.getItem('rento-token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          // NOTE: Don't set Content-Type with FormData
        },
        body: vehicleData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to add vehicle:', error);
      throw error;
    }
  },
  
  // Update vehicle (owner only)
  updateVehicle: async (id: string, vehicleData: FormData) => {
    const token = localStorage.getItem('rento-token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'PUT',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: vehicleData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Failed to update vehicle ${id}:`, error);
      throw error;
    }
  },
  
  // Toggle vehicle availability (owner only)
  toggleAvailability: async (id: string, availability: boolean) => {
    return fetchWithAuth(`/vehicles/${id}/availability`, {
      method: 'PATCH',
      body: JSON.stringify({ availability })
    });
  },
  
  // Delete vehicle (owner only)
  deleteVehicle: async (id: string) => {
    return fetchWithAuth(`/vehicles/${id}`, { method: 'DELETE' });
  }
};

// Booking Management APIs
export const bookingAPI = {
  // Create new booking (renter only)
  createBooking: async (bookingData: {
    vehicleId: string;
    startDate: string;
    endDate: string;
  }) => {
    return fetchWithAuth('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  },
  
  // Get user's bookings (both owner and renter)
  getUserBookings: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, String(value));
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchWithAuth(`/bookings${queryString}`, { method: 'GET' });
  },
  
  // Update booking status (accept/reject/cancel)
  updateBookingStatus: async (id: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    return fetchWithAuth(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }
};

// User Management APIs
export const userAPI = {
  // Register a new user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'owner' | 'renter';
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Registration failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
  
  // Login user
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Login failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  // Upload KYC documents (renter only)
  uploadDocument: async (documentData: FormData) => {
    const token = localStorage.getItem('rento-token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/renters/documents`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: documentData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Document upload failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Document upload failed:', error);
      throw error;
    }
  }
};
