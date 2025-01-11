import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { logoLight } from "../../assets/images";

const SignIn = () => {
  // ============= Initial State Start here =============
  const { dispatch } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isUserExist, setIsUserExist] = useState(true);
  const navigate = useNavigate();
  // ============= Initial State End here ===============
  // ============= Error Msg Start here =================
  const [errors, setErrors] = useState({});

  // ============= Error Msg End here ===================
  const [successMsg, setSuccessMsg] = useState("");
  const validateForm = () => {
    let errors = {};
    if (!username) errors.username = "Username is required";
    if (!password) errors.password = "Password is required";
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      console.log("Response: ", res); // Check the response from the API

      if (res.status === 200 && (res.data.token || res.data.username)) {
        // setMessage(res.data.message);
        setIsUserExist(true);

        const userData = {
          user: res.data,
          token: res.data.token,
        };

        // localStorage.setItem("user", JSON.stringify(userData));
        // setUser(userData);
        // localStorage.setItem("token", res.data.token);

        dispatch({
          type: "LOGIN",
          payload: userData,
        });

        // Redirect to the intended page or homepage if none is specified

        setTimeout(() => {
          navigate("/");
        }, 1000);

        // setPopup({
        //   message: "Login success",
        //   type: "success",
        //   show: true,
        // });
      }
    } catch (error) {
      console.error("Login Error: ", error); // Log the error for debugging

      if (error.response && error.response.status === 404) {
        // setPopup({
        //   message: "User does not exist. Please Register!",
        //   type: "error",
        //   show: true,
        // });
        setIsUserExist(false);
      } else {
        // setPopup({
        //   message: "Server error. Please try again later.",
        //   type: "error",
        //   show: true,
        // });
      }

      setMessage(error.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
          <Link to="/">
            <img src={logoLight} alt="logoImg" className="w-28" />
          </Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">
              Stay sign in for more
            </h1>
            <p className="text-base">When you sign in, you are with us!</p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Get started fast with OREBI
              </span>
              <br />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab omnis
              nisi dolor recusandae consectetur!
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Access all OREBI services
              </span>
              <br />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab omnis
              nisi dolor recusandae consectetur!
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Trusted by online Shoppers
              </span>
              <br />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab omnis
              nisi dolor recusandae consectetur!
            </p>
          </div>
          <div className="flex items-center justify-between mt-10">
            <Link to="/">
              <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
                © OREBI
              </p>
            </Link>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Terms
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Privacy
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Security
            </p>
          </div>
        </div>
      </div>
      <div className="w-full lgl:w-1/2 h-full">
        {successMsg ? (
          <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
            <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">
              {successMsg}
            </p>
            <Link to="/signup">
              <button
                className="w-full h-10 bg-primeColor text-gray-200 rounded-md text-base font-titleFont font-semibold 
            tracking-wide hover:bg-black hover:text-white duration-300"
              >
                Sign Up
              </button>
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                {/* <label htmlFor="username" className="block text-sm text-gray-700">
              Username
            </label> */}
                <input
                  type="text"
                  // id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mb-4 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="your username"
                  required
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
                {/* </div>
          <div> */}
                {/* <label htmlFor="password" className="block text-sm text-gray-700">
              Password
            </label> */}
                <input
                  type="password"
                  // id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mb-4 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center text-sm text-gray-600">
                  <input type="checkbox" className="mr-2" /> Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-purple-600 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-purple-600 py-2 text-white hover:bg-purple-700"
              >
                Sign in
              </button>
              {message && (
                <p className="text-red-500 text-center mt-4">{message}</p>
              )}
              {!isUserExist && (
                <p className="text-sm text-center text-gray-700">
                  User does not exist.{" "}
                  <Link
                    to="/register"
                    className="text-blue-500 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              )}
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="#" className="text-purple-600 hover:underline">
                Sign up
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SignIn;
