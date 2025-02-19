import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import Sidebar from "./Sidebar";

const CrudPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // Modal state
  const [selectedImage, setSelectedImage] = useState(null); // Store clicked image URL
  const itemsPerPage = 6;

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle opening and closing the image modal
  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="w-3/4 ml-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-semibold text-gray-800">
            Product Management
          </h2>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <table className="min-w-full bg-white rounded-lg shadow-lg table-auto">
            <thead className="bg-indigo-600 text-white text-left text-sm uppercase">
              <tr>
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Quantity</th>
                <th className="py-4 px-6">Seller Name</th>
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {currentProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-100 transition-colors"
                >
                  <td className="py-4 px-6">{product.id}</td>
                  <td className="py-4 px-6">{product.title}</td>
                  <td className="py-4 px-6">${product.price}</td>
                  <td className="py-4 px-6">
                    {product.category ? `${product.category}` : ""}
                  </td>
                  <td className="py-4 px-6">{product.quantity}</td>
                  <td className="py-4 px-6">
                    {product.sellerId && product.sellerId.name
                      ? product.sellerId.name
                      : "Unknown Seller"}
                  </td>
                  <td className="py-4 px-6">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-lg shadow-md cursor-pointer"
                      onClick={() => openImageModal(product.image)}
                    />
                  </td>
                  <td className="border-t px-4 py-2 flex justify-center">
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          handlePageChange={handlePageChange}
        />

        {/* Image Modal */}
        {isImageModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative bg-white p-4 rounded-lg max-w-2xl">
              <button
                onClick={closeImageModal}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex justify-center items-center"
              >
                &times;
              </button>
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-auto max-h-96 object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrudPage;
