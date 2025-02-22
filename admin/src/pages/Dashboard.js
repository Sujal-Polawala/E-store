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
      totalSales
      orders {
        _id
        totalPrice
        createdAt
      }
    }
    bestSellingProducts {
      _id
      title
      sales
    }
  }
`;

const Dashboard = () => {
  const { loading, error, data } = useQuery(GET_ADMIN_DASHBOARD, {
    fetchPolicy: "no-cache",
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Prepare data for the chart (Revenue per Seller)
  const sellerRevenueData = data.sellers.map((seller) => ({
    name: seller.name, // Seller name on the X-axis
    revenue: seller.totalSales, // Revenue of the seller
  }));

  // console.log("Dashboard Data:", data.sellers);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex items-center justify-end">
          <Avatar />
        </header>

        {/* Dashboard Content */}
        {/* Admin Dashboard Header */}
        <div className="flex items-center justify-center -mt-12 mb-6">
          <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-gray-100 to-gray-300 px-8 py-4 rounded-lg shadow-lg">
            Admin Dashboard
          </h2>
        </div>

        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Revenue
            </h2>
            <p className="text-3xl font-bold text-green-600 mt-3">
              ${data.totalRevenue.toFixed(2)}
            </p>
            {/* Display Seller-wise Revenue */}
            <div className="mt-4">
              <h3 className="text-md font-semibold text-gray-600">
                Revenue by Seller
              </h3>
              {data.sellers.map((seller) => (
                <div
                  key={seller._id}
                  className="flex justify-between mt-2 text-gray-500"
                >
                  <span>{seller.name}</span>
                  <span className="font-semibold">
                    ${seller.totalSales.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Orders
            </h2>
            <p className="text-3xl font-bold text-blue-600 mt-3">
              {data.totalOrders}
            </p>
          </div>

          {/* Total Users */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
            <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
            <p className="text-3xl font-bold text-indigo-600 mt-3">
              {data.totalUsers}
            </p>
          </div>

          {/* Total Sellers */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Sellers
            </h2>
            <p className="text-3xl font-bold text-purple-600 mt-3">
              {data.totalSellers}
            </p>
          </div>
        </div>

        {/* Seller Revenue Chart */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            Seller Revenue Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sellerRevenueData}>
              <XAxis dataKey="name" tick={{ fill: "#4B5563" }} />
              <YAxis tick={{ fill: "#4B5563" }} />
              <Tooltip cursor={{ fill: "#E5E7EB" }} />
              <Bar dataKey="revenue" fill="#6366F1" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sellers & Best Selling Products Side by Side */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sellers List */}
          <div className="bg-gradient-to-r from-blue-100 to-blue-300 p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-extrabold text-blue-900">
              Sellers Overview
            </h2>
            <ul className="text-sm text-gray-700 mt-4 space-y-4 max-h-80 overflow-y-auto">
              {data.sellers.map((seller) => (
                <li
                  key={seller._id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  <h3 className="font-bold text-md text-gray-900">
                    {seller.name}
                  </h3>
                  <p className="text-gray-700 mt-1">
                    Total Sales:{" "}
                    <span className="text-green-600 font-semibold">
                      ${seller.totalSales.toFixed(2)}
                    </span>
                  </p>
                  {/* Orders per Seller */}
                  <h4 className="mt-3 font-semibold text-gray-800">Orders:</h4>
                  <ul className="mt-2 text-sm text-gray-600">
                    {seller.orders.length > 0 ? (
                      seller.orders.map((order) => (
                        <li
                          key={order._id}
                          className="flex justify-between bg-gray-100 p-2 rounded-md"
                        >
                          <span className="text-gray-800">#{order._id}</span>
                          <span className="font-semibold text-green-700">
                            ${order.totalPrice.toFixed(2)}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No orders found</li>
                    )}
                  </ul>
                </li>
              ))}
            </ul>
          </div>

          {/* Best Selling Products */}
          <div className="bg-gradient-to-r from-purple-100 to-purple-300 p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-extrabold text-purple-900">
              Best Selling Products
            </h2>
            <ul className="text-sm text-gray-700 mt-4 space-y-3 max-h-80 overflow-y-auto">
              {data.bestSellingProducts.map((product) => (
                <li
                  key={product._id}
                  className="flex justify-between bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  <span className="text-gray-900">{product.title}</span>
                  <span className="font-semibold text-purple-700">
                    {product.sales} sales
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
