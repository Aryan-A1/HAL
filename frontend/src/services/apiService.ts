
export const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    // Remove trailing slash if present
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  return ''; // Default to relative path (handled by Vite proxy in dev)
};

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
    // Throw instead of forcing a redirect — let the calling component decide
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
    const response = await fetch(`${getBaseUrl()}${url}`, {
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
    const response = await fetch(`${getBaseUrl()}${url}`, {
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
    const response = await fetch(`${getBaseUrl()}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  postFormData: async (url: string, formData: FormData) => {
    const token = getAuthToken();
    const response = await fetch(`${getBaseUrl()}${url}`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        // Important: DO NOT set Content-Type to multipart/form-data here. 
        // Let fetch set it automatically with the correct boundary when passing FormData.
      },
      body: formData,
    });
    return handleResponse(response);
  },

  delete: async (url: string) => {
    const token = getAuthToken();
    const response = await fetch(`${getBaseUrl()}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });
    return handleResponse(response);
  },
};
