import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  getPassword: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState<string | null>(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_authenticated');
    const savedPassword = sessionStorage.getItem('admin_password');
    if (savedAuth === 'true' && savedPassword) {
      setIsAuthenticated(true);
      setPassword(savedPassword);
    }
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://txfneraypshxauouxzra.supabase.co/functions/v1/admin-auth`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            action: 'verify',
            password 
          }),
        }
      );

      if (response.ok) {
        setIsAuthenticated(true);
        setPassword(password);
        localStorage.setItem('admin_authenticated', 'true');
        sessionStorage.setItem('admin_password', password);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPassword(null);
    localStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_password');
  };

  const getPassword = () => password;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, getPassword }}>
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