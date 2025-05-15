import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HomeIcon, 
  CubeIcon, 
  ShoppingCartIcon, 
  ExclamationCircleIcon, 
  ChartBarIcon,
  ListBulletIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({
    users: false,
    inventory: false,
    sales: false
  });
  
  useEffect(() => {
    // Auto-expand the relevant menu based on current path
    const path = location.pathname;
    let updatedMenus = {
      users: false,
      inventory: false,
      sales: false
    };
    
    if (path === '/dashboard' || path === '/user-management') {
      updatedMenus.users = true;
    } else if (path === '/inventory-dashboard' || path === '/inventory/management') {
      updatedMenus.inventory = true;
    } else if (path.startsWith('/sales')) {
      updatedMenus.sales = true;
    }
    
    setExpandedMenus(updatedMenus);
  }, [location.pathname]);
  
  // Direct navigation functions
  const navigateTo = (path) => {
    navigate(path);
  };
  
  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      users: false,
      inventory: false,
      sales: false,
      [menu]: !prev[menu]
    }));
  };
  
  const isActive = (path) => {
    if (path === '/inventory-dashboard') {
      return location.pathname === '/inventory-dashboard';
    } else if (path === '/inventory/management') {
      return location.pathname === '/inventory/management';
    } else if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    } else if (path === '/user-management') {
      return location.pathname === '/user-management';
    } else {
      return location.pathname === path;
    }
  };
  
  // Only render sidebar for admin users
  if (user && user.role !== 'admin') {
    return null;
  }
  
  return (
    <div className="h-screen w-64 bg-white shadow-md fixed left-0 top-0 pt-16 overflow-y-auto">
      <div className="p-4">
        <ul className="space-y-2">
          {/* User Dashboard */}
          <li className="space-y-1">
            <div 
              className={`flex items-center justify-between p-2 ${(location.pathname === '/dashboard' || location.pathname === '/user-management') ? 'text-blue-600 bg-blue-50' : 'text-gray-600'} hover:text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer transition-colors duration-200`}
              onClick={() => toggleMenu('users')}
            >
              <div className="flex items-center">
                <HomeIcon className="h-5 w-5 mr-3" />
                <span>User</span>
              </div>
              <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${expandedMenus.users ? 'rotate-180' : ''}`} />
            </div>
            
            {expandedMenus.users && (
              <ul className="pl-10 space-y-1">
                <li>
                  <Link 
                    to="/dashboard" 
                    className={`flex items-center p-2 ${isActive('/dashboard') ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'} rounded-md transition-colors duration-200`}
                  >
                    <ChartBarIcon className="h-4 w-4 mr-2" />
                    User Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/user-management" 
                    className={`flex items-center p-2 ${isActive('/user-management') ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'} rounded-md transition-colors duration-200`}
                  >
                    <ListBulletIcon className="h-4 w-4 mr-2" />
                    User Management
                  </Link>
                </li>
              </ul>
            )}
          </li>
          
          {/* Inventory Section */}
          <li className="space-y-1">
            <div 
              className={`flex items-center justify-between p-2 ${(location.pathname === '/inventory-dashboard' || location.pathname === '/inventory/management') ? 'text-blue-600 bg-blue-50' : 'text-gray-600'} hover:text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer transition-colors duration-200`}
              onClick={() => toggleMenu('inventory')}
            >
              <div className="flex items-center">
                <CubeIcon className="h-5 w-5 mr-3" />
                <span>Inventory</span>
              </div>
              <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${expandedMenus.inventory ? 'rotate-180' : ''}`} />
            </div>
            
            {expandedMenus.inventory && (
              <ul className="pl-10 space-y-1">
                <li>
                  <Link 
                    to="/inventory-dashboard" 
                    className={`flex items-center p-2 ${isActive('/inventory-dashboard') ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'} rounded-md transition-colors duration-200`}
                  >
                    <ChartBarIcon className="h-4 w-4 mr-2" />
                    Inventory Dashboard
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('/inventory/management')}
                    className={`flex items-center p-2 w-full text-left ${isActive('/inventory/management') ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'} rounded-md transition-colors duration-200`}
                  >
                    <ListBulletIcon className="h-4 w-4 mr-2" />
                    Products Management
                  </button>
                </li>
              </ul>
            )}
          </li>
          
          {/* Sales Section */}
          <li className="space-y-1">
            <div 
              className={`flex items-center justify-between p-2 ${location.pathname.startsWith('/sales') ? 'text-blue-600 bg-blue-50' : 'text-gray-600'} hover:text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer transition-colors duration-200`}
              onClick={() => toggleMenu('sales')}
            >
              <div className="flex items-center">
                <ShoppingCartIcon className="h-5 w-5 mr-3" />
                <span>Sales</span>
              </div>
              <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${expandedMenus.sales ? 'rotate-180' : ''}`} />
            </div>
            
            {expandedMenus.sales && (
              <ul className="pl-10 space-y-1">
                <li>
                  <Link 
                    to="/sales" 
                    className={`flex items-center p-2 ${isActive('/sales') && !isActive('/sales/history') && !isActive('/sales/add') ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'} rounded-md transition-colors duration-200`}
                  >
                    <ChartBarIcon className="h-4 w-4 mr-2" />
                    Sales Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/sales/management" 
                    className={`flex items-center p-2 ${isActive('/sales/management') ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'} rounded-md transition-colors duration-200`}
                  >
                    <ListBulletIcon className="h-4 w-4 mr-2" />
                    Sales Management
                  </Link>
                </li>
              </ul>
            )}
          </li>
          

        </ul>
      </div>
      <div className="absolute bottom-0 w-full p-4 border-t">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
            <span className="font-medium">SM</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Store Manager</p>
            <p className="text-xs text-gray-500">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
