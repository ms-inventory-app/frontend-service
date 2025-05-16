import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('inventoryAppUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      // Call the auth service login method
      const response = await authService.login({
        email: userData.email,
        password: userData.password
      });
      
      // Extract user data from response
      const { name, role, accesstoken } = response;
      
      const user = {
        name,
        email: userData.email,
        role,
        accesstoken
      };
      
      setUser(user);
      localStorage.setItem('inventoryAppUser', JSON.stringify(user));
      setLoading(false);
      return user;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      // Call the auth service register method
      await authService.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'user'
      });
      
      setLoading(false);
      // After registration, log the user in
      return await login({
        email: userData.email,
        password: userData.password
      });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Get user analytics
  const getUserAnalytics = async () => {
    try {
      return await authService.getUserAnalytics();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user analytics');
      throw err;
    }
  };

  // Get all users
  const getAllUsers = async () => {
    try {
      return await authService.getAllUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      throw err;
    }
  };

  // Update user
  const updateUser = async (userData) => {
    try {
      return await authService.updateUser(userData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
      throw err;
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      return await authService.deleteUser(userId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('inventoryAppUser');
  };

  // Auth context value
  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    getUserAnalytics,
    getAllUsers,
    updateUser,
    deleteUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
