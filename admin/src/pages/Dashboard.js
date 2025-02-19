import React from "react";
import { useQuery, gql } from "@apollo/client";
import Sidebar from "./Sidebar";
import Avatar from "./Avatar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// GraphQL Query to Fetch Admin Dashboard Data
const GET_ADMIN_DASHBOARD = gql`
  query GetAdminDashboard {
    totalOrders
    totalRevenue
    totalUsers
    totalSellers
    sellers {
      _id
      name
      orders {
        _id
        totalPrice
        createdAt
      }
      totalSales
    }
    bestSellingProducts {
      _id
      title
      sales
    }
  }
`;

const Dashboard = () => {
  const { loading, error, data } = useQuery(GET_ADMIN_DASHBOARD);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Prepare data for the chart (Revenue per Seller)
  const sellerRevenueData = data.sellers.map((seller) => ({
    name: seller.name, // Seller name on the X-axis
    revenue: seller.totalSales, // Revenue of the seller
  }));

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex items-center justify-end mb-6">
          <Avatar />
        </header>

        {/* Dashboard Content */}
        <div className="flex items-center justify-center py-6">
          <h2 className="text-4xl font-bold text-white bg-black px-6 py-3 rounded-lg shadow-lg">
            Admin Dashboard
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <div className="bg-gradient-to-r from-green-400 to-green-600 p-8 rounded-xl shadow-xl text-white">
            <h2 className="text-lg font-bold">Total Revenue</h2>
            <p className="text-3xl font-semibold mt-4">
              ${data.totalRevenue.toFixed(2)}
            </p>

            {/* Display Seller-wise Revenue */}
            <div className="mt-4">
              <h3 className="font-semibold text-lg">Revenue by Seller</h3>
              {data.sellers.map((seller) => (
                <div key={seller._id} className="flex justify-between mt-2">
                  <span>{seller.name}</span>
                  <span className="font-semibold">
                    ${seller.totalSales.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-8 rounded-xl shadow-xl text-white">
            <h2 className="text-lg font-bold">Total Orders</h2>
            <p className="text-3xl font-semibold mt-4">{data.totalOrders}</p>
          </div>

          {/* Total Users */}
          <div className="bg-gradient-to-r from-indigo-400 to-indigo-600 p-8 rounded-xl shadow-xl text-white">
            <h2 className="text-lg font-bold">Total Users</h2>
            <p className="text-3xl font-semibold mt-4">{data.totalUsers}</p>
          </div>

          {/* Total Sellers */}
          <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-8 rounded-xl shadow-xl text-white">
            <h2 className="text-lg font-bold">Total Sellers</h2>
            <p className="text-3xl font-semibold mt-4">{data.totalSellers}</p>
          </div>
        </div>

        {/* Seller Revenue Chart */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Seller Revenue Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sellerRevenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Other sections remain unchanged */}
        {/* Sellers List */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-gray-800">Sellers Overview</h2>
          <ul className="text-sm text-gray-600 mt-2 space-y-4">
            {data.sellers.map((seller) => {
              return (
                <li
                  key={seller._id}
                  className="bg-gray-50 p-4 rounded-lg shadow-md"
                >
                  <h3 className="font-bold text-lg text-gray-800">
                    {seller.name}
                  </h3>
                  <p className="text-gray-600">
                    Total Sales: ${seller.totalSales}
                  </p>{" "}
                  {/* Display totalSales */}
                  <h4 className="mt-2 font-semibold text-gray-700">Orders:</h4>
                  <ul className="mt-2 text-sm text-gray-600">
                    {seller.orders.length > 0 ? (
                      seller.orders.map((order) => (
                        <li key={order._id} className="flex justify-between">
                          <span>OrderId: #{order._id}</span>
                          <span className="font-semibold">
                            ${seller.totalSales}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li>No orders found for this seller</li>
                    )}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Best Selling Products */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-gray-800">
            Best Selling Products
          </h2>
          <ul className="text-sm text-gray-600 mt-2 space-y-2">
            {data.bestSellingProducts.map((product) => (
              <li key={product._id} className="flex justify-between">
                <span>{product.title}</span>
                <span className="font-semibold">{product.sales} sales</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
