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
      // Check local registered users database
      const regDb = JSON.parse(localStorage.getItem('aid_registered_users_db') || '[]');
      const regMatch = regDb.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (regMatch) {
        if (regMatch.password === password) {
          const token = `token-${regMatch.user.role}-${Date.now()}`;
          localStorage.setItem('aid_auth_token', token);
          localStorage.setItem('aid_user_profile', JSON.stringify(regMatch.user));
          return { token, user: regMatch.user };
        } else {
          throw new Error('Invalid password credentials for this account.');
        }
      }

      // Fallback for demo users
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

  async register(name: string, email: string, password: string): Promise<{ success: boolean; user: User }> {
    try {
      const response = await apiClient.post('/auth/register', { name, email, password });
      const data = response.data;
      const userObj: User = data.user || (data.id ? data : {
        id: `usr-${Date.now()}`,
        name,
        email,
        role: 'user',
        createdAt: new Date().toISOString().substring(0, 10),
        assessmentCount: 0
      });

      // Register user into local DB pool for login validation
      const existing = JSON.parse(localStorage.getItem('aid_registered_users_db') || '[]');
      const filtered = existing.filter((u: any) => u.email.toLowerCase() !== email.toLowerCase());
      filtered.push({ name, email: email.toLowerCase(), password, user: userObj });
      localStorage.setItem('aid_registered_users_db', JSON.stringify(filtered));

      return { success: true, user: userObj };
    } catch (err) {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name,
        email,
        role: 'user',
        createdAt: new Date().toISOString().substring(0, 10),
        assessmentCount: 0
      };

      const existing = JSON.parse(localStorage.getItem('aid_registered_users_db') || '[]');
      if (existing.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email is already registered. Please sign in with your credentials.');
      }
      existing.push({ name, email: email.toLowerCase(), password, user: newUser });
      localStorage.setItem('aid_registered_users_db', JSON.stringify(existing));

      return { success: true, user: newUser };
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
