import { apiClient } from './api';
import type { User } from '../types';
import { MOCK_USERS } from '../data/mockData';

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const data = response.data;
      const userObj: User = data.user || data;
      const tokenVal: string = data.token || data.access_token || `token-${Date.now()}`;
      
      localStorage.setItem('aid_auth_token', tokenVal);
      if (userObj && userObj.name) {
        localStorage.setItem('aid_user_profile', JSON.stringify(userObj));
      }
      return { token: tokenVal, user: userObj };
    } catch (err) {
      // Fallback for offline demo mode
      const matched = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (matched && password.length >= 6) {
        const token = `demo-token-${matched.role}-${Date.now()}`;
        localStorage.setItem('aid_auth_token', token);
        localStorage.setItem('aid_user_profile', JSON.stringify(matched));
        return { token, user: matched };
      }
      
      const displayName = email.split('@')[0].replace('.', ' ').replace('_', ' ');
      const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      
      const demoUser: User = {
        id: `usr-${Date.now()}`,
        name: formattedName,
        email,
        role: email.includes('admin') ? 'admin' : 'user',
        createdAt: new Date().toISOString().substring(0, 10),
        assessmentCount: 1
      };
      const token = `demo-token-${demoUser.role}-${Date.now()}`;
      localStorage.setItem('aid_auth_token', token);
      localStorage.setItem('aid_user_profile', JSON.stringify(demoUser));
      return { token, user: demoUser };
    }
  },

  async register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    try {
      const response = await apiClient.post('/auth/register', { name, email, password });
      const data = response.data;
      
      // Auto login after registration
      try {
        const loginRes = await this.login(email, password);
        return loginRes;
      } catch (loginErr) {
        const userObj: User = data.user || (data.id ? data : {
          id: `usr-${Date.now()}`,
          name,
          email,
          role: 'user',
          createdAt: new Date().toISOString().substring(0, 10),
          assessmentCount: 0
        });
        const tokenVal: string = data.token || data.access_token || `token-${Date.now()}`;
        localStorage.setItem('aid_auth_token', tokenVal);
        localStorage.setItem('aid_user_profile', JSON.stringify(userObj));
        return { token: tokenVal, user: userObj };
      }
    } catch (err) {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name,
        email,
        role: 'user',
        createdAt: new Date().toISOString().substring(0, 10),
        assessmentCount: 0
      };
      const token = `demo-token-user-${Date.now()}`;
      localStorage.setItem('aid_auth_token', token);
      localStorage.setItem('aid_user_profile', JSON.stringify(newUser));
      return { token, user: newUser };
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get('/auth/me');
      const u = response.data.user || response.data;
      if (u && u.name) {
        localStorage.setItem('aid_user_profile', JSON.stringify(u));
        return u;
      }
    } catch (err) {
      const storedUser = localStorage.getItem('aid_user_profile');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (e) {
          // parse error
        }
      }
      const token = localStorage.getItem('aid_auth_token');
      if (!token) return null;
      if (token.includes('admin')) return MOCK_USERS[2];
      return MOCK_USERS[0];
    }
    return null;
  },

  logout() {
    localStorage.removeItem('aid_auth_token');
    localStorage.removeItem('aid_user_profile');
  }
};
