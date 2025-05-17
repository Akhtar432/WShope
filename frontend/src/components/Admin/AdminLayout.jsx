import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';  // Add Outlet to imports
import { HiMenu, HiX } from 'react-icons/hi';

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 fixed inset-y-0 left-0 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-50`}
      >
        {/* Close button (mobile only) */}
        <button 
          onClick={toggleSidebar} 
          className="md:hidden absolute top-2 right-2 text-white"
        >
          <HiX className="h-6 w-6" />
        </button>

        {/* Brand/Logo */}
        <div className="text-white flex items-center space-x-2 px-4">
          <span className="text-2xl font-bold">Admin Panel</span>
        </div>

        {/* Navigation */}
        <nav>
          <Link 
            to="/admin/dashboard" 
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/products" 
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
          >
            Products
          </Link>
          <Link 
            to="/admin/orders" 
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
          >
            Orders
          </Link>
          <Link 
            to="/admin/users" 
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
          >
            Users
          </Link>
        </nav>
          <button className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
              Log Out
            </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile menu button */}
            <button 
              onClick={toggleSidebar} 
              className="md:hidden text-gray-500 focus:outline-none"
            >
              <HiMenu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className='text-xl font-bold'>Welcome, Admin!</div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet /> {/* This will render the matched child route */}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;