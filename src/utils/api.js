import { useNavigate } from 'react-router-dom';

// Utility function for making authenticated API requests
export const makeAuthenticatedRequest = async (url, options = {}, navigate) => {
  const token = localStorage.getItem('token');
  if (!token) {
    if (navigate) navigate('/login');
    throw new Error('No authentication token found. Please log in.');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      localStorage.removeItem('token');
      if (navigate) navigate('/login');
      throw new Error('Session expired. Please log in again.');
    }
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Request failed with status ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('API request error:', error); // Debug log
    throw error;
  }
};
