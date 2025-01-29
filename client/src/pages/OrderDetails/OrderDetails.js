import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

function OrderDetails() {
  const { orderId } = useParams(); // Get orderId from the route
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null); // State for payment details
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Fetch order details by orderId
        const orderResponse = await axios.get(
          `http://localhost:5000/api/orders/${orderId}` // Fetch order details
        );
        setOrder(orderResponse.data);

        // Check if paymentId is available in the order and fetch payment details
        if (orderResponse.data.paymentId) {
          const paymentResponse = await axios.get(
            `http://localhost:5000/api/payments/${orderResponse.data.paymentId}` // Fetch payment details using paymentId
          );
          setPayment(paymentResponse.data);
        } else {
          setError("Payment details not available.");
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to fetch order details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (isLoading) {
    return (
      <p className="text-center text-gray-500">Loading order details...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!order) {
    return <p className="text-center text-gray-500">Order not found.</p>;
  }

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-300 py-10">
      <Breadcrumbs title="Order Details" prevLocation={prevLocation} />
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Order Details Section */}
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Order Details
          </h1>
          <p className="text-sm text-gray-500">
            <strong>Order ID:</strong> {order._id}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Order Date:</strong>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Delivery Date:</strong>{" "}
            {new Date(order.deliveryDate).toLocaleDateString()}
          </p>
          <p className="text-lg font-semibold text-gray-800 mt-4">
            Total Price:{" "}
            <span className="text-green-600">
              ₹{order.totalPrice.toFixed(2)}
            </span>
          </p>
        </div>

        {/* Order Items Section */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded mr-4"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-lg">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                  <p className="text-sm text-gray-600">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address Section */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Shipping Address
          </h2>
          <p className="text-gray-600 mb-1">
            <strong>Address:</strong> {order.shippingAddress.address},{" "}
            {order.shippingAddress.city}, {order.shippingAddress.state},{" "}
            {order.shippingAddress.zipCode}
          </p>
          <p className="text-gray-600">
            <strong>Phone:</strong> {order.shippingAddress.mobileno}
          </p>
        </div>

        {/* Payment Details Section */}
        {payment && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Payment Details
            </h2>
            <p className="text-sm text-gray-500">
              <strong>Payment Method:</strong> {payment.paymentMethod}
            </p>
            {/* <p className="text-sm text-gray-500">
              <strong>Payment Status:</strong> {payment.status}
            </p> */}
            <p className="text-lg font-semibold text-gray-800 mt-4">
              Amount Paid:{" "}
              <span className="text-green-600">
                {" "}
                ${payment.totalPrice.toFixed(2)}{" "}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              <strong>Transaction ID:</strong> {payment.transactionId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;
