import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa"; // Import icons
import PopupMsg from "./PopupMsg";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [popup, setPopup] = useState({
    message: "",
    type: "",
    show: false,
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        { username, password }
      );
      const { token } = response.data;
      localStorage.setItem("adminToken", token);
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
      setPopup({
        message: "Login Successfully",
        type: "success",
        show: true,
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
      setPopup({
        message: "Login Failed",
        type: "error",
        show: true,
      });
    }
  };

  useEffect(() => {
    if(popup.show) {
      const timer = setTimeout(() => setPopup({ ... popup, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [popup])

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center"
    >
      {popup.show && <PopupMsg message={popup.message} type={popup.type} />}
      <div className="relative bg-gray-800 rounded-lg shadow-lg w-96 p-8 text-white">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <h1 className="text-5xl font-bold">
            <span className="text-blue-400">u</span>
            <span className="text-yellow-400">w</span>
          </h1>
        </div>
        <h2 className="text-center text-lg font-bold mb-4">ADMIN PANEL</h2>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Control panel login
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="h-56">
          {/* Username Field */}
          <div className="mb-4">
            <div className="flex items-center border-b border-gray-600 py-2">
              <FaUser className="text-blue-400 mr-2" />
              <input
                type="text"
                placeholder="admin"
                className="bg-transparent focus:outline-none w-full text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <div className="flex items-center border-b border-gray-600 py-2">
              <FaLock className="text-blue-400 mr-2" />
              <input
                type="password"
                placeholder="********"
                className="bg-transparent focus:outline-none w-full text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 rounded transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Error Message */}
        {errorMessage && (
          <p className="mt-4 text-red-500 text-center">{errorMessage}</p>
        )}

        {/* Wave Design */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg
            viewBox="0 0 500 150"
            preserveAspectRatio="none"
            className="h-24 w-full"
          >
            <path
              d="M0.00,49.98 C150.00,150.00 271.00,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
              style={{ stroke: "none", fill: "#4f46e5" }} // Blue wave color
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FaUser, FaKey } from "react-icons/fa"; // Import icons

// const AdminLogin = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/admin/login",
//         { username, password }
//       );
//       const { token } = response.data;
//       localStorage.setItem("adminToken", token);
//       navigate("/admin/dashboard");
//     } catch (error) {
//       setErrorMessage(
//         error.response?.data?.message || "Login failed. Please try again."
//       );
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-900">
//       {/* Login Card */}
//       <div className="w-full max-w-sm bg-gray-800 rounded-lg shadow-lg p-8 text-white">
//         {/* Logo */}
//         <div className="flex items-center justify-center mb-6">
//           <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
//             <span className="text-2xl font-bold text-yellow-400">W</span>
//           </div>
//         </div>
//         <h2 className="text-center text-2xl font-bold">ADMIN PANEL</h2>
//         <p className="text-center text-gray-400 mb-6">Control panel login</p>
//         <form onSubmit={handleSubmit}>
//           {/* Username Field */}
//           <div className="mb-4">
//             <label className="block text-gray-400 mb-2" htmlFor="username">
//               Username
//             </label>
//             <div className="flex items-center bg-gray-700 rounded px-3">
//               <FaUser className="text-gray-400 mr-2" />
//               <input
//                 type="text"
//                 placeholder="Enter username"
//                 className="w-full bg-transparent focus:outline-none text-white py-2"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//               />
//             </div>
//           </div>
//           {/* Password Field */}
//           <div className="mb-6">
//             <label className="block text-gray-400 mb-2" htmlFor="password">
//               Password
//             </label>
//             <div className="flex items-center bg-gray-700 rounded px-3">
//               <FaKey className="text-gray-400 mr-2" />
//               <input
//                 type="password"
//                 placeholder="Enter password"
//                 className="w-full bg-transparent focus:outline-none text-white py-2"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//           </div>
//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-yellow-400 text-gray-900 font-semibold rounded py-2 hover:bg-yellow-500 transition duration-200"
//           >
//             Login
//           </button>
//         </form>
//         {/* Error Message */}
//         {errorMessage && (
//           <p className="mt-4 text-red-500 text-center">{errorMessage}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;
