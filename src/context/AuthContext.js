import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));

  const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE_URL || 'http://localhost:8081';

  useEffect(() => {
    if (token) {
      // Optionally validate token or fetch user details
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // For now, just assume token is valid and set a dummy user
      setUser({ username: 'loggedInUser' }); 
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/api/auth/signin`, {
        username,
        password,
      });
      const { accessToken, username: loggedInUsername, roles } = response.data;
      localStorage.setItem('jwtToken', accessToken);
      setToken(accessToken);
      setUser({ username: loggedInUsername, roles });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setToken(null);
      setUser(null);
      localStorage.removeItem('jwtToken');
      throw error; // Re-throw to be handled by the component
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/api/auth/signup`, {
        username,
        email,
        password,
      });
      return response.data; // Return success message or user data
    } catch (error) {
      console.error('Signup failed:', error);
      throw error; // Re-throw to be handled by the component
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwtToken');
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = () => !!token;
  const isAdmin = () => user && user.roles && user.roles.includes('ROLE_ADMIN');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};