import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, LoginCredentials } from '../types';
import { authService } from '../services/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      try {
        const user = authService.getCurrentUser();
        setAuthState({
          user,
          isAuthenticated: user !== null,
          isLoading: false
        });
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const user = await authService.login(credentials);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook for role-based access control
export const useRole = () => {
  const { user } = useAuth();
  
  return {
    user,
    isIRAdmin: user?.role === 'IR_ADMIN',
    isAnalystManager: user?.role === 'ANALYST_MANAGER',
    isInvestmentAnalyst: user?.role === 'INVESTMENT_ANALYST',
    isAnalyst: user?.role === 'ANALYST_MANAGER' || user?.role === 'INVESTMENT_ANALYST'
  };
};