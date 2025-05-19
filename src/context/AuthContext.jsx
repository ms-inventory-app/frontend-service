import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/api";

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
    const storedUser = localStorage.getItem("inventoryAppUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (userData) => {
    setError(null);
    setLoading(true);

    try {
      // Call the auth service login method with a custom axios instance to prevent console errors
      const originalConsoleError = console.error;
      console.error = () => {}; // Temporarily disable console.error
      
      // Create a custom fetch function to avoid console errors
      const response = await fetch(`${import.meta.env.VITE_AUTH_SERVICE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password
        })
      });
      
      // Restore console.error
      console.error = originalConsoleError;
      
      // Check status code
      if (response.status === 403) {
        setLoading(false);
        setError("Invalid email or password. Please try again.");
        return null;
      }
      
      if (!response.ok) {
        setLoading(false);
        setError("An error occurred during login. Please try again.");
        return null;
      }
      
      // Parse the JSON response
      const data = await response.json();
      const { name, role, accesstoken } = data;

      const user = {
        name,
        email: userData.email,
        role,
        accesstoken,
      };
      
      setUser(user);
      localStorage.setItem("inventoryAppUser", JSON.stringify(user));
      setLoading(false);
      return user;
    } catch (error) {
      // Actually using the error variable for logging
      console.log("Login error:", error);
      setLoading(false);
      setError("An error occurred during login. Please try again.");
      return null;
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
        role: userData.role || "user",
      });

      setLoading(false);
      // After registration, log the user in
      return await login({
        email: userData.email,
        password: userData.password,
      });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  // Get user analytics
  const getUserAnalytics = async () => {
    try {
      return await authService.getUserAnalytics();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user analytics");
      throw err;
    }
  };

  // Get all users
  const getAllUsers = async () => {
    try {
      return await authService.getAllUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
      throw err;
    }
  };

  // Update user
  const updateUser = async (userData) => {
    try {
      return await authService.updateUser(userData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
      throw err;
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      return await authService.deleteUser(userId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("inventoryAppUser");
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
    deleteUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
