
export const getAuthToken = () => {
  try {
    const storageString = localStorage.getItem('auth-storage');
    if (!storageString) return null;
    const authData = JSON.parse(storageString);
    return authData?.state?.token || null;
  } catch (error) {
    console.error('Error reading auth token', error);
    return null;
  }
};

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    // Optional: Clear storage and redirect to login
    localStorage.removeItem('auth-storage');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  let result;
  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    throw new Error(result?.detail || result?.message || result?.error || 'API request failed');
  }
  return result;
};

export const apiService = {
  get: async (url: string) => {
    const token = getAuthToken();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });
    return handleResponse(response);
  },

  post: async (url: string, data: any) => {
    const token = getAuthToken();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  put: async (url: string, data: any) => {
    const token = getAuthToken();
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (url: string) => {
    const token = getAuthToken();
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });
    return handleResponse(response);
  },
};
