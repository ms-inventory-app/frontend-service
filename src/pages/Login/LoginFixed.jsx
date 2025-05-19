import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';

const LoginFixed = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Direct login function - no form submission
  const handleLogin = async () => {
    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // Make direct fetch request to avoid console errors
      const response = await fetch(`${import.meta.env.VITE_AUTH_SERVICE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      
      // Check status code
      if (response.status === 403) {
        setLoading(false);
        setError("Invalid email or password. Please try again.");
        // Clear password field on invalid credentials
        setPassword('');
        return;
      }
      
      if (!response.ok) {
        setLoading(false);
        setError("An error occurred during login. Please try again.");
        // Clear password field on error
        setPassword('');
        return;
      }
      
      // Parse the JSON response
      const data = await response.json();
      const { name, role, accesstoken } = data;

      const user = {
        name,
        email: email,
        role,
        accesstoken,
      };
      
      // Set user in auth context
      localStorage.setItem("inventoryAppUser", JSON.stringify(user));
      
      // Redirect based on user role
      if (role === 'admin') {
        navigate('/dashboard');
      } else if (role === 'sales') {
        navigate('/sales');
      } else if (role === 'inventory') {
        navigate('/inventory-dashboard');
      } else {
        navigate('/dashboard');
      }
    // eslint-disable-next-line no-empty
    } catch {
      // Handle login error without console logging
      setError("An error occurred during login. Please try again.");
      // Clear password field on error
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to access your inventory dashboard
              </p>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <button
                  type="button" 
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to the system?</span>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFixed;
