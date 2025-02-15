import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/category");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/categories", newCategory);
      setNewCategory({ name: "", description: "" });
      fetchCategories();
      toast.success("Category added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      fetchCategories();
      toast.success("Category deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 bg-white p-8 rounded-lg shadow-xl mx-6">
        <h2 className="text-3xl font-semibold text-indigo-700 mb-8 text-center">
          Manage Categories
        </h2>

        <form
          onSubmit={addCategory}
          className="space-y-8 bg-white p-8 shadow-lg rounded-lg border border-gray-200"
        >
          <div className="space-y-4">
            <label htmlFor="name" className="text-lg font-medium text-gray-800">
              Category Name
            </label>
            <input
              id="name"
              type="text"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
              placeholder="Enter category name"
            />
          </div>

          <div className="space-y-4">
            <label
              htmlFor="description"
              className="text-lg font-medium text-gray-800"
            >
              Description
            </label>
            <textarea
              id="description"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({
                  ...newCategory,
                  description: e.target.value,
                })
              }
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
              placeholder="Enter description"
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out"
          >
            Add Category
          </button>
        </form>

        <h3 className="text-3xl font-semibold text-gray-900 mt-10 mb-6 text-center">
          Existing Categories
        </h3>

        <ul className="space-y-6">
          {categories.map((category) => (
            <li
              key={category._id}
              className="flex justify-between items-center bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <div className="flex-1">
                <h4 className="text-2xl font-semibold text-gray-800">
                  {category.name}
                </h4>
                <p className="text-lg text-gray-600 mt-2">
                  {category.description}
                </p>
              </div>

              <button
                onClick={() => deleteCategory(category._id)}
                className="bg-red-600 text-white py-2 px-5 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {/* <h3 className="text-3xl font-semibold text-gray-900 mt-10 mb-6 text-center">
  Existing Categories
</h3>

<div className="overflow-x-auto">
  <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
    <thead className="bg-gray-100">
      <tr className="text-gray-700 text-left">
        <th className="py-3 px-6 border-b">Category Name</th>
        <th className="py-3 px-6 border-b">Description</th>
        <th className="py-3 px-6 border-b text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {categories.map((category) => (
        <tr
          key={category._id}
          className="border-b hover:bg-gray-50 transition-all duration-300 ease-in-out"
        >
          <td className="py-4 px-6">{category.name}</td>
          <td className="py-4 px-6">{category.description}</td>
          <td className="py-4 px-6 text-center">
            <button
              onClick={() => deleteCategory(category._id)}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div> */}

        {/* Toast Notification Container */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default CategoryPage;
