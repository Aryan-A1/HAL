import { User } from '../store/useAuthStore';

// We rely on the Vite proxy so we don't need a hardcoded domain
const API_BASE = '/api/auth';

export interface AuthResponse {
  message?: string;
  detail?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authApi = {
  async signup(data: any): Promise<User> {
    try {
      const response = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        throw new Error(result?.error || result?.detail || result?.message || 'Signup failed');
      }
      
      return result;
    } catch (error: any) {
      // Re-throw so the form can handle it
      throw new Error(error.message || 'Network error occurred');
    }
  },

  async login(data: any): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        throw new Error(result?.error || result?.detail || result?.message || 'Login failed');
      }
      
      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Network error occurred');
    }
  },

  async logout(): Promise<void> {
    try {
      // Best-effort logout notification to backend
      const token = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token;
      
      if (token) {
        await fetch(`${API_BASE}/logout`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
        });
      }
    } catch {
      // Ignore errors for logout (stateless anyway)
    }
  }
};
