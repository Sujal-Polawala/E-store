import React, { useState, useEffect } from "react";
import axios from "axios";
import PopupMsg from "./PopupMsg";

const EditProduct = ({ product, fetchProducts, cancelUpdate }) => {
  const [editingProduct, setEditingProduct] = useState(product);
  const [categories, setCategories] = useState([]);
  const [popup, setPopup] = useState({
    message: "",
    type: "",
    show: false,
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingProduct({ ...editingProduct, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setEditingProduct({ ...editingProduct, category: e.target.value });
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/products/${editingProduct._id}`,
        editingProduct
      );
      fetchProducts();
      setPopup({
        message: "Product Updated Successfully!",
        type: "success",
        show: true,
      });

      // Close the form automatically after 3 seconds
      setTimeout(() => {
        cancelUpdate(); // Close the form
      }, 500);
    } catch (error) {
      console.error("Error updating product:", error);
      setPopup({
        message: "Error updating product",
        type: "error",
        show: true,
      });
    }
  };

  useEffect(() => {
    if (popup.show) {
      const timer = setTimeout(() => setPopup({ ...popup, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  return (
    <form
      onSubmit={updateProduct}
      className="mt-6 mb-7 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 rounded-2xl shadow-xl space-y-6"
    >
      <h3 className="text-3xl font-extrabold text-white text-center">
        Update Product
      </h3>
      {popup.show && <PopupMsg message={popup.message} type={popup.type} />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            Title
          </label>
          <input
            type="text"
            value={editingProduct.title}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, title: e.target.value })
            }
            className="border border-gray-300 px-4 py-3 rounded-xl w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Product Name"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            Description
          </label>
          <input
            type="text"
            value={editingProduct.description}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                description: e.target.value,
              })
            }
            className="border border-gray-300 px-4 py-3 rounded-xl w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Product Description"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            Price
          </label>
          <input
            type="number"
            value={editingProduct.price}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                price: parseFloat(e.target.value),
              })
            }
            className="border border-gray-300 px-4 py-3 rounded-xl w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Product Price"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            Sell-Price
          </label>
          <input
            type="number"
            value={
              isNaN(editingProduct.sellPrice) ? "" : editingProduct.sellPrice
            }
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value)) {
                setEditingProduct({
                  ...editingProduct,
                  sellPrice: value,
                });
              }
            }}
            className="border border-gray-300 px-4 py-3 rounded-xl w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Product Sell-Price"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            Quantity
          </label>
          <input
            type="number"
            value={editingProduct.rating.count}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                rating: { count: parseInt(e.target.value, 10) },
              })
            }
            className="border border-gray-300 px-4 py-3 rounded-xl w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Quantity"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            Category
          </label>
          <select
            value={editingProduct.category || ""}
            onChange={handleCategoryChange}
            className="border border-gray-300 px-4 py-3 rounded-xl w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          <label className="block text-sm font-medium text-gray-200">
            Image
          </label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="border border-gray-300 px-4 py-3 rounded-xl w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
