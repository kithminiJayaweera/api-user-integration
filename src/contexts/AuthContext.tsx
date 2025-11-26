import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser, logout as apiLogout, AuthUser, LoginCredentials, RegisterData } from '@/apis/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount (via HTTP-only cookie)
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to get current user - the cookie will be sent automatically
        const response = await getCurrentUser();
        setUser(response.user);
      } catch {
        // No valid session/cookie - this is normal on first visit
        setUser(null);
      } finally {
        // Always set loading to false, regardless of success or failure
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Periodically check if cookie still exists (detect manual cookie deletion)
  useEffect(() => {
    if (!user) return; // Only check if user is logged in

    const checkAuth = async () => {
      try {
        await getCurrentUser();
      } catch {
        // Cookie was deleted or expired - log out
        console.log('🔓 Cookie deleted or expired - logging out');
        setUser(null);
        window.location.href = '/login';
      }
    };

    // Check every 5 seconds if cookie is still valid
    const interval = setInterval(checkAuth, 5000);

    return () => clearInterval(interval);
  }, [user]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await apiLogin(credentials);
      
      // No need to store in localStorage - cookie is set automatically by server
      // The browser will send the cookie automatically with every request
      
      setUser(response.user);
      toast.success(`Welcome back, ${response.user.name}!`);
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await apiRegister(data);
      
      // No need to store in localStorage - cookie is set automatically by server
      // The browser will send the cookie automatically with every request
      
      setUser(response.user);
      toast.success(`Welcome, ${response.user.name}!`);
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiLogout(); // This clears the HTTP-only cookie on the server
      setUser(null);
      toast.success('Logged out successfully');
    } catch {
      // Even if logout fails, clear local user state
      setUser(null);
      toast.error('Logout failed, but you were logged out locally');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
