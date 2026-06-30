import { useState } from 'react';

const API_BASE = '';

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.reload();
  };

  const authFetch = async (url, options = {}) => {
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      logout();
      throw new Error('Unauthorized');
    }

    return response;
  };

  return { token, logout, authFetch };
};
