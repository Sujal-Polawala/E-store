import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import PopupMsg from "./PopupMsg";

const NewProduct = () => {
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: 0,
    rating: { count: 0 },
    image: "",
    category: "",
    badge: "Popular", // Set a default value
  });

  const [categories, setCategories] = useState([]);
  const [popup, setPopup] = useState({
    message: "",
    type: "",
    show: false,
  });

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/category");
      setCategories(response.data);
    } catch (error) {
      console.log("Error Fetching categories", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct({ ...newProduct, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (
      !newProduct.title ||
      !newProduct.description ||
      !newProduct.price ||
      !newProduct.rating.count ||
      !newProduct.category ||
      !newProduct.image ||
      !newProduct.badge // Ensure badge is not empty
    ) {
      setPopup({
        message: "Please fill all the fields",
        type: "error",
        show: true,
      });
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/products", newProduct);
      setNewProduct({
        title: "",
        description: "",
        price: 0,
        rating: { count: 0 },
        image: "",
        category: "",
        badge: "Popular", // Reset to default badge
      });
      setPopup({
        message: "Product Added Successfully!",
        type: "success",
        show: true,
      });
    } catch (error) {
      console.error("Error adding product:", error);
      setPopup({
        message: "Failed to add product",
        type: "error",
        show: true,
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (popup.show) {
      const timer = setTimeout(() => setPopup({ ...popup, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="flex items-center justify-between mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="bg-teal-500 text-white rounded-full h-10 w-10 flex items-center justify-center">
            a
          </div>
        </header>
        <form
          onSubmit={addProduct}
          className="bg-white p-8 rounded-xl shadow-lg space-y-6"
        >
          <h3 className="text-3xl font-semibold text-gray-800 text-center">
            Add New Product
          </h3>
          {popup.show && <PopupMsg message={popup.message} type={popup.type} />}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={newProduct.title}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, title: e.target.value })
                }
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Product Name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Product Description"
                rows="3"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: parseFloat(e.target.value),
                  })
                }
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Product Price"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                value={newProduct.rating.count}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    rating: { count: parseInt(e.target.value, 10) },
                  })
                }
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Quantity"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select a Category
                </option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Badge
              </label>
              <select
                value={newProduct.badge}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, badge: e.target.value })
                }
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Popular">Popular</option>
                <option value="Top Rated">Top Rated</option>
                <option value="Average">Average</option>
                <option value="Luxury">Luxury</option>
                <option value="Affordable">Affordable</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-1 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                onChange={handleImageUpload}
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-indigo-600 text-white py-3 px-6 rounded-full text-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add Product
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NewProduct;
