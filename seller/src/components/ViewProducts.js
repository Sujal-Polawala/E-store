import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import EditProduct from "./EditProductForm";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import { Pencil, Trash, Plus, X } from "lucide-react";
import PopupMsg from "./PopupMsg";
import { SellerContext } from "../context/sellerContext";

const CrudPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { state } = useContext(SellerContext);
  const { seller } = state;
  const sellerId = seller?.sellerId;
  const itemsPerPage = 6;
  const [popup, setPopup] = useState({
    message: "",
    type: "",
    show: false,
  });

  const fetchProducts = async () => {
    if(!sellerId) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/products?sellerId=${sellerId}`
      );
      setProducts(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setPopup({
        message: "Product deleted successfully",
        type: "success",
        show: true,
      });
      fetchProducts();
    } catch (error) {
      setPopup({
        message: "Error deleting product",
        type: "error",
        show: true,
      });
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

  const editProduct = (product) => {
    setEditingProduct(product);
  };

  const cancelUpdate = () => {
    setPopup({
      message: "Product update cancelled",
      type: "error",
      show: true,
    });
    setEditingProduct(null);
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    if (sellerId) {
      fetchProducts();
    }
  }, [sellerId]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 p-6">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        {popup.show && <PopupMsg message={popup.message} type={popup.type} />}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Product Management
          </h2>
          <Link
            to="/seller/add-product"
            className="bg-indigo-600 text-white px-5 py-3 rounded-lg shadow-md flex items-center gap-2 hover:bg-indigo-700 transition-transform transform hover:scale-105"
          >
            <Plus size={20} /> Add New Product
          </Link>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <>
            {editingProduct && (
              <EditProduct
                product={editingProduct}
                fetchProducts={fetchProducts}
                cancelUpdate={cancelUpdate}
              />
            )}
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-lg rounded-lg">
                <thead className="bg-indigo-600 text-white text-sm uppercase">
                  <tr>
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Quantity</th>
                    <th className="py-4 px-6">Seller Name</th>
                    <th className="py-4 px-6">Image</th>
                    {/* <th className="py-4 px-6">Seller</th> */}
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {currentProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-100">
                      <td className="py-4 px-6">{product._id}</td>
                      <td className="py-4 px-6">{product.title}</td>
                      <td className="py-4 px-6">${product.price}</td>
                      <td className="py-4 px-6">{product.category || "-"}</td>
                      <td className="py-4 px-6">{product.quantity}</td>
                      <td className="py-4 px-6">{product.sellerId.name}</td>
                      <td className="py-4 px-6">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => openImageModal(product.image)}
                        />
                      </td>
                      {/* <td className="py-4 px-6">
                        {product.sellerId ? product.sellerId.name : "Unknown"}
                      </td> */}
                      <td className="py-4 px-6 flex justify-center gap-4">
                        <button
                          onClick={() => editProduct(product)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-transform transform hover:scale-105"
                        >
                          <Pencil size={16} /> Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-transform transform hover:scale-105"
                        >
                          <Trash size={16} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          handlePageChange={handlePageChange}
        />
        {isImageModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative bg-white p-4 rounded-lg max-w-2xl">
              <button
                onClick={closeImageModal}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex justify-center items-center"
              >
                <X size={20} />
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
