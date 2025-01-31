import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 w-full top-0 fixed text-white shadow-md">
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo 
          <div className="flex-shrink-0">
            <NavLink to="/admin/dashboard" 
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            activeclassname="text-white font-bold"
            >
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </NavLink>
          </div>
          {/* Navigation Links
          <div className="hidden md:flex space-x-8">
            <NavLink
              to="/admin/users"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              activeclassname="text-white font-bold"
            >
              Users
            </NavLink>
            <NavLink
              to="/admin/category"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              activeclassname="text-white font-bold"
            >
              Category
            </NavLink>
            <NavLink
              to="/admin/orders"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              activeclassname="text-white font-bold"
            >
              Orders
            </NavLink>
            <NavLink
              to="/admin/crud"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              activeclassname="text-white font-bold"
            >
              CRUD Operations
            </NavLink>
          </div>
          {/* Mobile Menu Toggle 
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Toggle menu"
              onClick={() => document.getElementById('mobile-menu').classList.toggle('hidden')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu 
      <div className="md:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink
            to="/admin/users"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            activeclassname="text-white font-bold"
          >
            Users
          </NavLink>
          <NavLink
            to="/admin/orders"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            activeclassname="text-white font-bold"
          >
            Orders
          </NavLink>
          <NavLink
            to="/admin/crud"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            activeclassname="text-white font-bold"
          >
            CRUD Operations
          </NavLink>
        </div>
      </div> */}
      <main className='flex-1 p-8'>

      <header className="flex items-center justify-between mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="bg-teal-500 text-white rounded-full h-10 w-10 flex items-center justify-center">
            a
          </div>
        </header>
        </main>
    </nav>
  );
};

export default Navbar;
