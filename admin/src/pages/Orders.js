import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner.js";
import Pagination from "./Pagination.js";
import Sidebar from "./Sidebar.js";
import {
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaTimes,
  FaBox,
  FaDollarSign,
  FaClock,
  FaCogs,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [statusFilter, dateFilter, searchQuery, orders]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/orders");
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load orders.");
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;
    const today = new Date();

    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (dateFilter === "lastWeek") {
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) >= lastWeek
      );
    } else if (dateFilter === "last30Days") {
      const last30Days = new Date();
      last30Days.setDate(today.getDate() - 30);
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) >= last30Days
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((order) =>
        order.items.some((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredOrders(filtered);
  };

  const clearFilters = () => {
    setStatusFilter("");
    setDateFilter("");
    setSearchQuery("");
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <FaClock className="text-yellow-500" />;
      case "Processing":
        return <FaCogs className="text-blue-500" />;
      case "Shipped":
        return <FaTruck className="text-indigo-500" />;
      case "Delivered":
        return <FaCheckCircle className="text-green-500" />;
      case "Cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="w-full md:w-3/4 p-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaBox /> Order Management
        </h2>

        {/* Filter Section */}
        <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-600">
            <FaFilter /> Filters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {/* Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search by Product Name"
                className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FaTruck className="absolute left-3 top-3 text-gray-500" />
              <select
                className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Filter by Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-500" />
              <select
                className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="">Filter by Date</option>
                <option value="lastWeek">Last 1 Week</option>
                <option value="last30Days">Last 30 Days</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              onClick={clearFilters}
            >
              <FaTimes /> Clear Filters
            </button>
          </div>
        </div>

        {/* Order Table */}
        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <p className="text-center text-gray-600">No orders found.</p>
          ) : (
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order._id} className="border-t">
                    <td className="p-3">{order._id}</td>
                    <td className="p-3">
                      {order.items.map((item) => (
                        <div key={item._id} className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <span>{item.title}</span>
                        </div>
                      ))}
                    </td>
                    <td className="p-3 flex items-center gap-2">
                      {getStatusIcon(order.status)} {order.status}
                    </td>
                    <td className="p-3 gap-2">
                      <FaDollarSign className="text-green-500 -ml-4 -mb-5" /> {order.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={paginate} loading={loading} />
      </div>
    </div>
  );
};

export default Orders;
