import axios from 'axios';

// API URLs from environment variables
const AUTH_API_URL = import.meta.env.VITE_AUTH_SERVICE_URL;
const SALES_API_URL = import.meta.env.VITE_SALES_SERVICE_URL;
const INVENTORY_API_URL = import.meta.env.VITE_INVENTORY_SERVICE_URL;

// Create axios instances with authentication
const createAuthenticatedAxios = (baseURL) => {
  const instance = axios.create({ baseURL });
  
  // Add request interceptor to include token in requests
  instance.interceptors.request.use(
    (config) => {
      const user = JSON.parse(localStorage.getItem('inventoryAppUser') || '{}');
      if (user?.accesstoken) {
        config.headers.Authorization = `Bearer ${user.accesstoken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  return instance;
};

// Create authenticated instances for each service
const authApi = createAuthenticatedAxios(AUTH_API_URL);
const salesApi = createAuthenticatedAxios(SALES_API_URL);
const inventoryApi = createAuthenticatedAxios(INVENTORY_API_URL);

// Auth Service API
export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await axios.post(`${AUTH_API_URL}/login`, credentials);
    return response.data;
  },
  
  // Register user
  register: async (userData) => {
    const response = await axios.post(`${AUTH_API_URL}/register`, userData);
    return response.data;
  },
  
  // Get user analytics with caching
  getUserAnalytics: async () => {
    // Check if we have cached data and it's less than 5 minutes old
    const cachedData = localStorage.getItem('userAnalyticsCache');
    const cacheTimestamp = localStorage.getItem('userAnalyticsCacheTime');
    
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
    const now = new Date().getTime();
    
    if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < CACHE_DURATION) {
      return JSON.parse(cachedData);
    }
    
    // If no valid cache, fetch from API
    const response = await authApi.get('/analytics');
    
    // Cache the response
    localStorage.setItem('userAnalyticsCache', JSON.stringify(response.data));
    localStorage.setItem('userAnalyticsCacheTime', now.toString());
    
    return response.data;
  },
  
  // Get all users
  getAllUsers: async () => {
    const response = await authApi.get('/all');
    // Handle both array response and object with users property
    return Array.isArray(response.data) ? response.data : (response.data.users || []);
  },
  
  // Update user
  updateUser: async (userData) => {
    const response = await authApi.put('/update', userData);
    return response.data;
  },
  
  // Delete user
  deleteUser: async (userId) => {
    const response = await authApi.delete('/delete', { data: { userId } });
    return response.data;
  }
};

// Sales Service API
export const salesService = {
  // Add a new sale
  addSale: async (saleData) => {
    const response = await salesApi.post('/add', saleData);
    return response.data;
  },
  
  // Get all sales
  getAllSales: async () => {
    const response = await salesApi.get('/all');
    return response.data;
  },
  
  // Get user sales
  getUserSales: async () => {
    const response = await salesApi.get('/user');
    return response.data;
  },
  
  // Get user sales analytics
  getUserSalesAnalytics: async () => {
    const response = await salesApi.get('/user/analytics');
    return response.data;
  },
  
  // Get all sales analytics
  getAllSalesAnalytics: async () => {
    const response = await salesApi.get('/analytics');
    return response.data;
  },
  
  // Get all inventory products for sales
  getInventoryProducts: async () => {
    const response = await salesApi.get('/products');
    return response.data;
  }
};

// Inventory Service API
export const inventoryService = {
  // Add a new product
  addProduct: async (productData) => {
    const response = await inventoryApi.post('/add', productData);
    return response.data;
  },
  
  // Update a product
  updateProduct: async (productId, productData) => {
    const response = await inventoryApi.put(`/${productId}`, productData);
    return response.data;
  },
  
  // Delete a product
  deleteProduct: async (productId) => {
    const response = await inventoryApi.delete(`/${productId}`);
    return response.data;
  },
  
  // Get all products
  getAllProducts: async () => {
    const response = await inventoryApi.get('/all');
    return response.data;
  },
  
  // Get product by ID
  getProductById: async (productId) => {
    const response = await inventoryApi.get(`/${productId}`);
    return response.data;
  }
};
