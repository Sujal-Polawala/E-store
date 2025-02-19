import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner.js";
import Pagination from "./Pagination.js";
import Sidebar from "./Sidebar.js";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/orders`);
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load orders.");
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.put("http://localhost:5000/api/orders/update-status", {
        orderId,
        status: newStatus,
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      alert("Order status updated successfully!");
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to update order status.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="w-full max-w-6xl p-6 bg-white shadow-xl rounded-lg">
        <h2 className="text-4xl font-semibold text-center text-gray-800 mb-8">
          Order Management
        </h2>
        {orders.length === 0 ? (
          <p className="text-center text-gray-600">No orders found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full table-auto">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium">
                    Order ID
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium">
                    Seller Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium">
                    Product Image
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium">
                    Category
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium">
                    Price
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium">
                    Total Price
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium">
                    Status
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {currentOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    {order.items.map((item) => (
                      <tr
                        key={item._id}
                        className="border-t hover:bg-gray-50 transition duration-200"
                      >
                        <td className="py-3 px-4 text-sm font-medium text-gray-600">
                          {order._id}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-600">
                          {item.sellerId?.name}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </td>
                        <td className="py-3 px-4 text-sm">{item.category}</td>
                        <td className="py-3 px-4 text-sm font-semibold">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-700">
                          ${order.totalPrice.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-center">
                          <span
                            className={`${
                              order.status === "Delivered"
                                ? "text-green-500"
                                : "text-gray-700"
                            }`}
                          >
                            {order.status}
                          </span>
                          {order.status !== "Delivered" && (
                            <select
                              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              value={order.status}
                              onChange={(e) =>
                                handleUpdateStatus(order._id, e.target.value)
                              }
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          )}
                        </td>
                        {order.status !== "Delivered" && (
                          <td className="py-3 px-4 text-center">
                            <button
                              className="bg-red-500 text-white font-semibold py-1 px-3 rounded-lg shadow-sm transition transform hover:scale-105"
                              onClick={() =>
                                handleUpdateStatus(order._id, "Cancelled")
                              }
                            >
                              Cancel
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={paginate}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
