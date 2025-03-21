import { axiosInstance } from "../config/config";
import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import LoginPage from "../pages/globals/LoginPage/LoginPage";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    try {
      setError(null);
      const response = await axiosInstance.get('/api/v1/user/currentUser', {
        timeout: 5000, // 5 second timeout
        retry: 3, // Retry 3 times
        retryDelay: 1000 // Wait 1 second between retries
      });

      if (response.data.success) {
        setUser(response.data.data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setError('Authentication failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Network connection failed';
      console.error("Auth Error:", errorMessage);
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      
      // Redirect to login if unauthorized or network error
      if (error.response?.status === 401 || error.code === 'ERR_NETWORK') {
        navigate('/', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const response = await axiosInstance.post('/api/v1/user/logout');
      if (response.data.success) {
        setUser(null);
        setIsAuthenticated(false);
        navigate("/", { replace: true });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Logout failed';
      console.error("Logout Error:", errorMessage);
      setError(errorMessage);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ 
        isAuthenticated, 
        logout, 
        loading, 
        user, 
        fetchCurrentUser,
        error 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
