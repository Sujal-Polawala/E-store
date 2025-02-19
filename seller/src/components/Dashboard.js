import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { SellerContext } from "../context/sellerContext.js";
import { gql, useQuery } from "@apollo/client";

const GET_SELLER_ORDERS = gql`
  query GetSellerOrders($sellerId: ID!) {
    orders(sellerId: $sellerId) {
      _id
      totalPrice
      createdAt
    }
  }
`;

const SellerDashboard = () => {
  const { state, dispatch } = useContext(SellerContext);
  const { seller } = state;
  const sellerId = seller?.sellerId;
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_SELLER_ORDERS, {
    variables: { sellerId },
    skip: !sellerId,
  });

  const [salesData, setSalesData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (data && data.orders) {
      const orders = data.orders;
      const revenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      setTotalRevenue(revenue);
      setTotalOrders(orders.length);
      setRecentOrders(orders.slice(0, 5));

      const revenueByMonth = orders.reduce((acc, order) => {
        const date = new Date(parseInt(order.createdAt));
        const monthIndex = date.getMonth();
        const monthName = date.toLocaleString("default", { month: "short" });

        if (!acc[monthIndex]) {
          acc[monthIndex] = { month: monthName, revenue: 0 };
        }
        acc[monthIndex].revenue += order.totalPrice;
        return acc;
      }, {});

      setSalesData(Object.values(revenueByMonth));
    }
  }, [data]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" }); // Clear seller context
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Seller Dashboard</h1>
        <button 
          onClick={handleLogout} 
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-gray-700">Total Revenue</h2>
          <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-gray-700">Total Orders</h2>
          <p className="text-3xl font-bold text-blue-600">{totalOrders}</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-gray-700">Avg Order Value</h2>
          <p className="text-3xl font-bold text-purple-600">
            ${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00"}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Manage Business */}
        <div className="lg:col-span-4 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Business</h2>
          <div className="space-y-4">
            <Link to="/seller/add-product" className="block bg-green-600 text-white text-center py-3 px-6 rounded-lg hover:bg-green-700">
              Add New Product
            </Link>
            <Link to="/seller/products" className="block bg-blue-600 text-white text-center py-3 px-6 rounded-lg hover:bg-blue-700">
              View Products
            </Link>
            <Link to="/seller/orders" className="block bg-purple-600 text-white text-center py-3 px-6 rounded-lg hover:bg-purple-700">
              View Orders
            </Link>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="lg:col-span-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Monthly Revenue</h2>
          {salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center">No sales data available.</p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
        <ul className="divide-y divide-gray-200">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <li key={order._id} className="py-3 flex justify-between">
                <span className="text-gray-700">Order ID: {order._id}</span>
                <span className="text-blue-600 font-semibold">${order.totalPrice.toFixed(2)}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No recent orders found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SellerDashboard;