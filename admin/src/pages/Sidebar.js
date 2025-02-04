import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AiFillHome,
  AiFillGift,
  AiFillSetting,
  AiOutlinePlus,
} from "react-icons/ai";
import { BsBoxSeam, BsTag, BsCart4 } from "react-icons/bs";
import { FaUserFriends, FaLink } from "react-icons/fa";
import { HiOutlineCollection } from "react-icons/hi";
import SearchBar from "./SearchBar";
import Avatar from "./Avatar";

const Sidebar = () => {
  // const [active, setActive] = useState(true); 
  return (
    <div className="flex flex-col h-screen">
      {/* Top Bar with SearchBar and Avatar */}
      {/* <header className="flex items-center justify-center bg-white shadow-md p-4">
        <SearchBar />
        <Avatar />
      </header> */}

      {/* Main Content */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg">
          <div className="p-4">
            {/* Quick Links Section */}
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center px-4 py-2 text-gray-700 focus:text-teal-600 hover:bg-gray-100 active:text-teal-600 active:bg-gray-200 rounded-md"
                  >
                    <AiFillHome className="text-lg mr-3" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/newproduct"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <AiOutlinePlus className="text-lg mr-3" />
                    New Product
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/newcoupon"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <AiFillGift className="text-lg mr-3" />
                    New Coupon
                  </Link>
                </li>
              </ul>
            </div>

            {/* Catalog Section */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
                Catalog
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/admin/crud"
                    className="flex items-center px-4 py-2 hover:bg-gray-100 forced-colors:text-teal-600 rounded-md"
                  >
                    <BsBoxSeam className="text-lg mr-3" />
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/category"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <FaLink className="text-lg mr-3" />
                    Categories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sale Section */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
                Sale
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/admin/orders"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <BsCart4 className="text-lg mr-3" />
                    Orders
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Section */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
                Users
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/admin/users"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <FaUserFriends className="text-lg mr-3" />
                    Users
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
                Sellers
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/admin/sellerrequests"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <FaUserFriends className="text-lg mr-3" />
                    Sellers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Promotion Section */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
                Promotion
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <AiFillGift className="text-lg mr-3" />
                    Coupons
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <AiFillSetting className="text-lg mr-3" />
                    Setting
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Sidebar;
