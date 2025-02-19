import React, { useState, useEffect } from "react";
import axios from "axios";
import PopupMsg from "./PopupMsg";

const EditProduct = ({ product, fetchProducts, cancelUpdate }) => {
  const [editingProduct, setEditingProduct] = useState({
    _id: product._id,
    title: product.title || "",
    description: product.description || "",
    price: product.price || 0,
    quantity: product.quantity || 0,
    image: product.image || "",
    category: product.category || "",
    badge: product.badge || "Popular", // Default value
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
      setEditingProduct({ ...editingProduct, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryChange = (e) => {
    setEditingProduct({ ...editingProduct, category: e.target.value });
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    if (
      !editingProduct.title ||
      !editingProduct.description ||
      !editingProduct.price ||
      !editingProduct.quantity ||
      !editingProduct.category ||
      !editingProduct.image ||
      !editingProduct.badge
    ) {
      setPopup({
        message: "Please fill all the fields",
        type: "error",
        show: true,
      });
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, editingProduct);
      fetchProducts();
      setPopup({
        message: "Product Updated Successfully!",
        type: "success",
        show: true,
      });

      setTimeout(() => {
        cancelUpdate();
      }, 500);
    } catch (error) {
      console.error("Error updating product:", error);
      setPopup({
        message: "Failed to update product",
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
        <form
          onSubmit={updateProduct}
          className="bg-white p-8 rounded-xl shadow-lg space-y-6"
        >
          <h3 className="text-3xl font-semibold text-gray-800 text-center">
            Update Product
          </h3>
          {popup.show && <PopupMsg message={popup.message} type={popup.type} />}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={editingProduct.title}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, title: e.target.value })
                }
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Product Name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, description: e.target.value })
                }
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Product Description"
                rows="3"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: parseFloat(e.target.value),
                  })
                }
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Product Price"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={editingProduct.category}
                onChange={handleCategoryChange}
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>Select a Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                value={editingProduct.quantity}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    quantity: parseInt(e.target.value),
                  })
                }
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Quantity"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Badge</label>
              <select
                value={editingProduct.badge}
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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                onChange={handleImageUpload}
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {editingProduct.image && (
                <div className="mt-2">
                  <img
                    src={editingProduct.image}
                    alt="Product"
                    className="w-24 h-24 object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={cancelUpdate}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl w-full transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl w-full transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
  );
};

export default EditProduct;