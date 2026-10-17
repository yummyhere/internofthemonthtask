import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi, RegisterPayload, LoginPayload } from '../api/auth';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { addToast } = useToast();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('vegist_access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authApi.getMe();
        setUser(userData);
      } catch (err) {
        localStorage.removeItem('vegist_access_token');
        localStorage.removeItem('vegist_refresh_token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const tokens = await authApi.login(payload);
      localStorage.setItem('vegist_access_token', tokens.access);
      localStorage.setItem('vegist_refresh_token', tokens.refresh);

      const userData = await authApi.getMe();
      setUser(userData);
      addToast(`Welcome back, ${userData.first_name || userData.username}!`, 'success');
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || 'Invalid username or password.';
      addToast(errMsg, 'error', 'Login Failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(payload);
      localStorage.setItem('vegist_access_token', res.tokens.access);
      localStorage.setItem('vegist_refresh_token', res.tokens.refresh);
      setUser(res.user);
      addToast('Welcome to Vegist Organic! Your account is active.', 'success');
    } catch (err: any) {
      const errors = err.response?.data;
      let msg = 'Registration failed. Please check your inputs.';
      if (errors && typeof errors === 'object') {
        const firstKey = Object.keys(errors)[0];
        msg = `${firstKey}: ${errors[firstKey]}`;
      }
      addToast(msg, 'error', 'Registration Error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem('vegist_refresh_token');
      if (refresh) {
        await authApi.logout(refresh);
      }
    } catch (e) {
      // Ignore error during logout
    } finally {
      localStorage.removeItem('vegist_access_token');
      localStorage.removeItem('vegist_refresh_token');
      setUser(null);
      addToast('Logged out successfully.', 'info');
    }
  };

  const updateUser = async (updatedData: Partial<User>) => {
    try {
      const updated = await authApi.updateProfile(updatedData);
      setUser(updated);
      addToast('Account profile updated successfully.', 'success');
    } catch (err: any) {
      addToast('Could not update profile information.', 'error');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
