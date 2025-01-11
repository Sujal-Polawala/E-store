import React, { useState } from "react";
import axios from "axios";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaCheck } from "react-icons/fa";
import { logoLight } from "../../assets/images";

const SignUp = () => {
  // ============= Initial State Start here =============
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUserExist, setIsUserExist] = useState(true);
  const [checked, setChecked] = useState(false);
  // ============= Initial State End here ===============
  const [successMsg, setSuccessMsg] = useState("");
  // // ============= Error Msg Start here =================
  // const [errfirstName, setErrFirstName] = useState("");
  // const [errEmail, setErrEmail] = useState("");
  // const [errlastName, setErrLastName] = useState("");
  // const [erruserName, setErrUserName] = useState("");
  // const [errPassword, setErrPassword] = useState("");
  // const [errcPassword, setErrCPassword] = useState("");
  // ============= Error Msg End here ===================
  // ============= Event Handler End here ===============
  // ================= Email Validation start here =============
  // const EmailValidation = (email) => {
  //   return String(email)
  //     .toLowerCase()
  //     .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  // };
  // ================= Email Validation End here ===============

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      // setPopup({
      //   message: "Passwords do not match!",
      //   type: "error",
      //   show: true,
      // });
      setSuccessMsg("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/register", {
        username,
        password,
        email,
        firstname,
        lastname,
        confirmPassword,
      });

      // setPopup({
      //   message: "Registration successful! You can now log in.",
      //   type: "success",
      //   show: true,
      // });

      setIsUserExist(true);
      // Reset fields
      setUsername("");
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      // setPopup({
      //   message: "User already exists. Please login!",
      //   type: "error",
      //   show: true,
      // });
      console.error(error);
      setIsUserExist(false);
    }
  };
  return (
    <div className="w-full h-screen flex items-center justify-start">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
          <Link to="/">
            <img src={logoLight} alt="logoImg" className="w-28" />
          </Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">
              Get started for free
            </h1>
            <p className="text-base">Create your account to access more</p>
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
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              © OREBI
            </p>
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
      <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
        {successMsg ? (
          <div className="w-[500px]">
            <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">
              {successMsg}
            </p>
            <Link to="/signin">
              <button
                className="w-full h-10 bg-primeColor rounded-md text-gray-200 text-base font-titleFont font-semibold 
            tracking-wide hover:bg-black hover:text-white duration-300"
              >
                Sign in
              </button>
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div className="relative flex items-center">
                <FaUser className="absolute left-3 text-gray-400" />
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  className="pl-10 pr-3 py-2 w-full border rounded focus:ring focus:ring-purple-400"
                  placeholder="First Name"
                />
              </div>

              {/* Last Name */}
              <div className="relative flex items-center">
                <FaUser className="absolute left-3 text-gray-400" />
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  className="pl-10 pr-3 py-2 w-full border rounded focus:ring focus:ring-purple-400"
                  placeholder="Last Name"
                />
              </div>

              {/* Username */}
              <div className="relative flex items-center">
                <FaUser className="absolute left-3 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="pl-10 pr-3 py-2 w-full border rounded focus:ring focus:ring-purple-400"
                  placeholder="Username"
                />
              </div>

              {/* Email */}
              <div className="relative flex items-center">
                <FaEnvelope className="absolute left-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 pr-3 py-2 w-full border rounded focus:ring focus:ring-purple-400"
                  placeholder="Email"
                />
              </div>

              {/* Password */}
              <div className="relative flex items-center">
                <FaLock className="absolute left-3 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-3 py-2 w-full border rounded focus:ring focus:ring-purple-400"
                  placeholder="Password"
                />
              </div>

              {/* Confirm Password */}
              <div className="relative flex items-center">
                <FaCheck className="absolute left-3 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 pr-3 py-2 w-full border rounded focus:ring focus:ring-purple-400"
                  placeholder="Confirm Password"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
              >
                Sign Up
              </button>
            </form>

            <p className="text-center text-sm mt-6">
              Already have an account?
              <Link to="/signin" className="ml-2 text-blue-500 hover:underline">
                Sign In
              </Link>
            </p>
            {!isUserExist && (
              <p className="mt-2 text-center text-red-500">
                User already exists.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SignUp;
