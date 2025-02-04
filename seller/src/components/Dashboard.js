import React from "react";
import { Link } from "react-router-dom";

const SellerDashboard = () => {
  // Sales data
  const salesData = {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    sales: [500, 700, 1000, 800, 1200, 1500],
  };

  // Calculate the max sales value for visualization
  const maxSales = Math.max(...salesData.sales);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">Seller Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Sales Overview Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
          <div className="h-40 bg-gray-200 flex items-end justify-between">
            {salesData.sales.map((sale, index) => (
              <div
                key={index}
                className="w-10 flex items-end justify-center"
                style={{
                  height: `${(sale / maxSales) * 100}%`,
                  backgroundColor: "rgba(54, 162, 235, 0.5)",
                  borderBottom: "2px solid rgba(54, 162, 235, 1)",
                }}
              >
                <span className="text-xs text-center">{salesData.months[index]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Manage Products Card */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Manage Products</h2>
          <Link to="/seller/products" className="text-blue-500 hover:underline">View Products</Link>
          <Link to="/seller/add-product" className="text-green-500 hover:underline">Add New Product</Link>
          <Link to="/seller/orders" className="text-purple-500 hover:underline">View Orders</Link>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;