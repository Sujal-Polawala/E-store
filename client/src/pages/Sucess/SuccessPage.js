import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import {PopupMsg} from "../../components/popup/PopupMsg";
import { FaCheckCircle } from "react-icons/fa";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const SuccessPage = () => {
  const [orderDetails, setOrderDetails] = useState(null); // To store the order details
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  const { state } = useContext(AuthContext);
  const { user } = state;
  const userId = user?.userId; // Optional chaining for safety
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [popup, setPopup] = useState({
    message: "",
    type: "",
    show: false,
  });

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/order/${userId}`
      );
      setOrderDetails(response.data);
      const order = response.data;

      // Check if the popup has already been shown (from localStorage)
      if (!localStorage.getItem("popupShown")) {
        setPopup({
          message: `Payment successful! Your order has been placed. 
                    Status: ${order.status}, 
                    Estimated Delivery: ${new Date(
                      order.deliveryDate
                    ).toDateString()}`,
          type: "success",
          show: true,
        });
        localStorage.setItem("popupShown", "true"); // Set the flag to true
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchOrderDetails();
    }
  }, [userId]);

  // To hide the popup after a specific duration or when it's closed
  const handlePopupClose = () => {
    setPopup((prevPopup) => ({ ...prevPopup, show: false }));
  };

  // Clear the popup message after 4 seconds
  useEffect(() => {
    if (popup.show) {
      const timer = setTimeout(() => {
        handlePopupClose(); // Close the popup after 4 seconds
      }, 4000);

      return () => clearTimeout(timer); // Cleanup timeout if the component is unmounted or popup state changes
    }
  }, [popup.show]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>No order details found!</p>
      </div>
    );
  }

  const totalPrice = orderDetails.totalPrice;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 mt-16">
        <Breadcrumbs title="Success" prevLocation={prevLocation} />
      {popup.show && <PopupMsg message={popup.message} type={popup.type} />}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <FaCheckCircle className="text-6xl text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-wide">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Thank you for your order! Your payment was successful, and your
            order has been placed successfully.
          </p>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>
          <ul className="space-y-6">
            {orderDetails.items.map((item) => (
              <li
                key={item._id}
                className="bg-gray-50 rounded-lg shadow-sm p-4 flex flex-col space-y-3 border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Title:
                  </h3>
                  <span className="text-gray-700">{item.title}</span>
                </div>

                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Category:
                  </h3>
                  <span className="text-gray-700">{item.category}</span>
                </div>

                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Quantity x Price:
                  </h3>
                  <span className="text-gray-700">
                    {item.quantity} x ${item.price.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
                  <h3 className="text-gray-800 text-lg font-semibold">Total:</h3>
                  <span className="text-gray-700 font-bold">
                    ${(item.quantity * item.price).toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center mt-4 text-gray-800 font-bold">
            <span>Total Amount :</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <button
            onClick={() => navigate("/myorders")}
            className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded-lg hover:from-green-500 hover:to-green-700 transition ease-in-out duration-300 shadow-md"
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/shop")}
            className="w-full bg-gradient-to-r from-gray-300 to-gray-500 text-gray-800 py-3 rounded-lg hover:from-gray-400 hover:to-gray-600 transition ease-in-out duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
