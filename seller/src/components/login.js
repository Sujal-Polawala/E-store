import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { SellerContext } from "../context/sellerContext"; // Import your SellerContext

const SellerLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const { state, dispatch } = useContext(SellerContext); // Access dispatch from context
  const seller = state?.seller;

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); 
    setIsError(false);

    try {
      const res = await axios.post("http://localhost:5000/seller/login", {
        username,
        password,
      });

      setMessage(res.data.message);
      const sellerData = {
        seller: res.data, // Assuming seller data is in the response
        token: res.data.token,
      };

      localStorage.setItem("seller", JSON.stringify(sellerData)); // Store seller data in localStorage
      dispatch({
        type: "LOGIN", // Dispatch login action
        payload: sellerData,
      });

      navigate("/dashboard");
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl px-8 py-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Seller Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Login
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center p-2 rounded ${isError ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
            {message}
          </p>
        )}

        <p className="text-sm text-center mt-4 text-gray-600">
          Not registered?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SellerLogin;