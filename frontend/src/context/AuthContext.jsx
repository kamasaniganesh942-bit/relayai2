import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/auth';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('relay_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('relay_token'));
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const currentToken = localStorage.getItem('relay_token');
    if (!currentToken) {
      setLoading(false);
      return;
    }
    try {
      const res = await authService.getProfile();
      const userData = res.data?.data?.user || res.data?.data || res.data?.user || res.data;
      setUser(userData);
      localStorage.setItem('relay_user', JSON.stringify(userData));
    } catch {
      localStorage.removeItem('relay_token');
      localStorage.removeItem('relay_user');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const payload = res.data?.data || res.data;
    const jwt = payload.token;
    const userData = payload.user;
    if (jwt) {
      localStorage.setItem('relay_token', jwt);
      localStorage.setItem('relay_user', JSON.stringify(userData));
      setToken(jwt);
      setUser(userData);
    }
    return payload;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    const payload = res.data?.data || res.data;
    const jwt = payload.token;
    const userData = payload.user;
    if (jwt) {
      localStorage.setItem('relay_token', jwt);
      localStorage.setItem('relay_user', JSON.stringify(userData));
      setToken(jwt);
      setUser(userData);
    }
    return payload;
  };

  const logout = () => {
    localStorage.removeItem('relay_token');
    localStorage.removeItem('relay_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('relay_user', JSON.stringify(updated));
  };

  const isAdmin = user?.role === 'super_admin' || user?.role === 'org_admin';
  const isManager = user?.role === 'dept_manager' || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshProfile: fetchProfile,
        isAuthenticated: !!token && !!user,
        isAdmin,
        isManager,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
