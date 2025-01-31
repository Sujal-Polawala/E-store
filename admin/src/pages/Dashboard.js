// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { FiUsers, FiFileText, FiShoppingCart } from 'react-icons/fi';

// const AdminDashboard = () => {
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const [totalOrders, setTotalOrders] = useState(0); 
//   const [ordersToday, setOrdersToday] = useState(45); 

//   useEffect(() => {
//     const fetchTotalUsers = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/admin/total-users');
//         setTotalUsers(res.data.totalUsers);
//       } catch (error) {
//         console.error('Error fetching total users:', error);
//       }
//     };

//     const fetchTotalProducts = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/admin/total-products');
//         setTotalProducts(res.data.totalProducts);
//       } catch (error) {
//         console.error('Error fetching total products:', error);
//       }
//     };

//     const fetchTotalOrders = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/admin/total-orders');
//         setTotalOrders(res.data.totalOrders);
//       } catch (error) {
//         console.error('Error fetching total orders:', error);
//       }
//     };

//     fetchTotalUsers();
//     fetchTotalProducts();
//     fetchTotalOrders();
//   }, []);

//   return (
//     <div className="flex mt-5 min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className="w-64 bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-6">
//         <h2 className="text-3xl font-bold mb-6">Admin Panel</h2>
//         <nav className="space-y-4">
//           <Link to="/admin/users" className="block py-3 px-4 rounded-lg hover:bg-indigo-400 transition">
//             Total Users
//           </Link>
//           <Link to="/admin/crud" className="block py-3 px-4 rounded-lg hover:bg-indigo-400 transition">
//             CRUD Operations
//           </Link>
//           <Link to="/admin/orders" className="block py-3 px-4 rounded-lg hover:bg-indigo-400 transition">
//             View Orders
//           </Link>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-10">
//         <h1 className="text-5xl font-semibold text-gray-800 mb-8">Admin Dashboard</h1>

//         {/* Statistics Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="p-6 bg-white rounded-xl shadow-lg flex items-center hover:shadow-xl transition-shadow">
//             <FiUsers className="text-5xl text-blue-600 mr-4" />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
//               <p className="text-gray-500 text-2xl">{totalUsers}</p>
//             </div>
//           </div>
//           <div className="p-6 bg-white rounded-xl shadow-lg flex items-center hover:shadow-xl transition-shadow">
//             <FiFileText className="text-5xl text-green-600 mr-4" />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
//               <p className="text-gray-500 text-2xl">{totalProducts}</p>
//             </div>
//           </div>
//           <div className="p-6 bg-white rounded-xl shadow-lg flex items-center hover:shadow-xl transition-shadow">
//             <FiShoppingCart className="text-5xl text-red-600 mr-4" />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
//               <p className="text-gray-500 text-2xl">{totalOrders}</p>
//             </div>
//           </div>
//         </div>

//         {/* Quick Links */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <Link to="/admin/users" className="p-6 bg-white shadow-md rounded-xl text-center hover:shadow-lg transition">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">Total Users</h2>
//             <p className="text-gray-500">View and manage users.</p>
//           </Link>
//           <Link to="/admin/crud" className="p-6 bg-white shadow-md rounded-xl text-center hover:shadow-lg transition">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">CRUD Operations</h2>
//             <p className="text-gray-500">Manage products and inventory.</p>
//           </Link>
//           <Link to="/admin/orders" className="p-6 bg-white shadow-md rounded-xl text-center hover:shadow-lg transition">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">View Orders</h2>
//             <p className="text-gray-500">Track and manage orders.</p>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React from "react";
import { Link } from "react-router-dom"
import Sidebar from "./Sidebar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
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

        {/* Dashboard Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Sale Statistics */}
          <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Sale Statistics</h2>
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span className="cursor-pointer hover:underline">Daily</span>
              <span className="cursor-pointer hover:underline">Weekly</span>
              <span className="cursor-pointer hover:underline">Monthly</span>
            </div>
            <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400">
              Graph Placeholder
            </div>
          </div>

          {/* Lifetime Sales */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Lifetime Sales</h2>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>0 orders</li>
              <li>$0.00 lifetime sale</li>
              <li>0% of orders completed</li>
              <li>0% of orders cancelled</li>
            </ul>
            <div className="mt-6 h-32 w-32 mx-auto relative">
              <svg className="w-full h-full">
                <circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  fill="none"
                  stroke="#38b2ac"
                  strokeWidth="10"
                  strokeDasharray="100"
                  strokeDashoffset="50"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm text-gray-700">
                0%
              </span>
            </div>
          </div>
        </div>

        {/* Best Sellers */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-gray-800">Best Sellers</h2>
          <p className="text-sm text-gray-500 mt-2">
            Looks like you just started. No bestsellers yet.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
