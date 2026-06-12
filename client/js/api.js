/**
 * GrowTrack — API Client (Fetch Wrapper)
 * Handles JWT injection, token refresh, and error formatting
 */

const API_BASE = window.location.protocol === 'file:' 
  ? 'http://localhost:5000/api/v1' 
  : '/api/v1';

const api = {
  /**
   * Core fetch with auth token
   */
  async request(endpoint, options = {}) {
    const token = storageGet('access_token');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    };

    // Don't override body if it's already a string
    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      let response = await fetch(`${API_BASE}${endpoint}`, config);

      let responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        result = { success: false, message: responseText || `HTTP Error ${response.status}: ${response.statusText}` };
      }

      // If 401 with TOKEN_EXPIRED, try refresh
      if (response.status === 401 && result && result.code === 'TOKEN_EXPIRED') {
        const refreshed = await api.refreshToken();
        if (refreshed) {
          // Retry original request with new token
          config.headers.Authorization = `Bearer ${storageGet('access_token')}`;
          response = await fetch(`${API_BASE}${endpoint}`, config);
          responseText = await response.text();
          try {
            result = JSON.parse(responseText);
          } catch (e) {
            result = { success: false, message: responseText || `HTTP Error ${response.status}: ${response.statusText}` };
          }
        } else {
          // Refresh failed — logout
          handleLogout();
          throw new Error('Session expired. Please login again.');
        }
      }

      if (!response.ok) {
        throw { ...result, status: response.status };
      }

      return result;
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw { success: false, message: 'Network error. Are you offline?', offline: true };
      }
      throw error;
    }
  },

  // Shorthand methods
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body = {}) {
    return this.request(endpoint, { method: 'POST', body });
  },

  put(endpoint, body = {}) {
    return this.request(endpoint, { method: 'PUT', body });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  /**
   * Refresh access token
   */
  async refreshToken() {
    const refreshToken = storageGet('refresh_token');
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return false;

      const text = await response.text();
      const data = JSON.parse(text);
      if (data.success) {
        storageSet('access_token', data.data.accessToken);
        storageSet('refresh_token', data.data.refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
};
