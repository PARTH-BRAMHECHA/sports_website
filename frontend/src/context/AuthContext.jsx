import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/api/auth/me');
      setUser(data);
    } catch (error) {
      console.error("❌ Auth Check Failed:", error.response?.data || error.message);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    console.log("🔹 Sending login request:", credentials); // ✅ Debugging

    try {
      const { data } = await axios.post('http://localhost:4000/api/auth/login', { 
        ...credentials, 
        userType: credentials.userType || 'student' // Ensure userType is always sent 
      });

      console.log("✅ Login Response:", data); // ✅ Debugging

      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
    } catch (error) {
      console.error("❌ Login Failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const signup = async (userData) => {
    console.log("🔹 Sending signup request:", userData); // ✅ Debugging

    try {
      await axios.post('http://localhost:4000/api/auth/register', { 
        ...userData, 
        userType: userData.userType || 'student' // Ensure userType is always sent
      });

      console.log("✅ Signup Successful");
    } catch (error) {
      console.error("❌ Signup Failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    console.log("🔹 Logging out...");
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
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
