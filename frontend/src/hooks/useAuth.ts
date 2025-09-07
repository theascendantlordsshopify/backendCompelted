'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api';
import { User } from '@/types';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/lib/utils';
import { STORAGE_KEYS } from '@/lib/constants';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = getStorageItem(STORAGE_KEYS.AUTH_TOKEN);
      const userData = getStorageItem(STORAGE_KEYS.USER_DATA);

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Verify token is still valid by fetching fresh user data
          await refreshUser();
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          // Clear invalid data
          removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
          removeStorageItem(STORAGE_KEYS.USER_DATA);
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      const response = await ApiClient.auth.login({
        email,
        password,
        remember_me: rememberMe,
      });

      const { user: userData, token } = response.data;

      // Store auth data
      setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token);
      setStorageItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      
      setUser(userData);
      
      // Redirect based on account status
      if (userData.account_status === 'pending_verification') {
        router.push('/verify-email');
      } else if (userData.account_status === 'password_expired_grace_period') {
        router.push('/force-password-change');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.data?.code === 'password_expired') {
        router.push('/reset-password');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await ApiClient.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth data regardless of API call success
      removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
      removeStorageItem(STORAGE_KEYS.USER_DATA);
      setUser(null);
      router.push('/login');
    }
  };

  const register = async (data: any) => {
    const response = await ApiClient.auth.register(data);
    const { user: userData, token } = response.data;

    // Store auth data
    setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token);
    setStorageItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    
    setUser(userData);
    
    // Redirect to email verification
    router.push('/verify-email');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      setStorageItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
    }
  };

  const refreshUser = async () => {
    try {
      const response = await ApiClient.users.getProfile();
      const userData = response.data;
      
      setUser(userData);
      setStorageItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // If refresh fails, user might be logged out
      if (error.response?.status === 401) {
        await logout();
      }
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for protected routes
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
}

// Hook for checking permissions
export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Check if user has the permission through their roles
    return user.roles.some(role => 
      role.role_permissions.some(perm => perm.codename === permission)
    );
  };

  const hasRole = (roleName: string): boolean => {
    if (!user) return false;
    return user.roles.some(role => role.name === roleName);
  };

  const isAdmin = (): boolean => {
    return hasRole('admin') || user?.is_staff || false;
  };

  const isOrganizer = (): boolean => {
    return user?.is_organizer || false;
  };

  return {
    hasPermission,
    hasRole,
    isAdmin,
    isOrganizer,
    userRoles: user?.roles || [],
  };
}