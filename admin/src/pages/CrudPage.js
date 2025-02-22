import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import Pagination from "./Pagination";
import Sidebar from "./Sidebar";
import { FaStore, FaTag, FaFilter } from "react-icons/fa";
import { X } from "lucide-react";

const CrudPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState({ name: "", category: "", seller: "" });
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sellers, setSellers] = useState([]);
  const itemsPerPage = 6;
  const [recordsPerPage, setRecordsPerPage] = useState(6);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
      setLoading(false);

      const uniqueCategories = [
        ...new Set(response.data.map((product) => product.category)),
      ];
      setCategories(uniqueCategories);

      const uniqueSellers = [
        ...new Set(
          response.data.map((product) => product.sellerId?.name).filter(Boolean)
        ),
      ];
      setSellers(uniqueSellers);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filteredProducts = products.filter((product) => {
    const productDate = new Date(product.createdAt); // Convert product's date
    const now = new Date(); // Current date

    if (filter.date) {
      const daysAgo = new Date();
      daysAgo.setDate(now.getDate() - parseInt(filter.date)); // Subtract selected days

      console.log(daysAgo);

      return (
        product.title.toLowerCase().includes(filter.name.toLowerCase()) &&
        (filter.category ? product.category === filter.category : true) &&
        (filter.seller ? product.sellerId?.name === filter.seller : true) &&
        productDate >= daysAgo // Ensure product is within the selected range
      );
    }

    return (
      product.title.toLowerCase().includes(filter.name.toLowerCase()) &&
      (filter.category ? product.category === filter.category : true) &&
      (filter.seller ? product.sellerId?.name === filter.seller : true)
    );
  });

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / recordsPerPage);

  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-full md:w-3/4 ml-0 md:ml-6 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
          📦 Product Management
        </h2>

        {/* Filter Section */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-wrap items-center gap-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-600">
            <FaFilter /> Filters
          </h3>
          <input
            type="text"
            name="name"
            placeholder="Search by Name"
            className="border p-2 rounded w-full sm:w-52"
            value={filter.name}
            onChange={handleFilterChange}
          />

          {/* Category Filter */}
          <select
            name="category"
            className="border p-2 rounded w-full sm:w-52"
            value={filter.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Seller Filter */}
          <select
            name="seller"
            className="border p-2 rounded w-full sm:w-52"
            value={filter.seller}
            onChange={handleFilterChange}
          >
            <option value="">All Sellers</option>
            {sellers.map((seller) => (
              <option key={seller} value={seller}>
                {seller}
              </option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            name="date"
            className="border p-2 rounded w-full sm:w-52"
            value={filter.date}
            onChange={handleFilterChange}
          >
            <option value="">All Time</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 3 Months</option>
            <option value="365">Last Year</option>
          </select>

          {/* Clear Filters Button */}
          <button
            className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto hover:bg-red-600 transition"
            onClick={() =>
              setFilter({ name: "", category: "", seller: "", date: "" })
            }
          >
            Clear Filters
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-indigo-600 text-white text-left uppercase text-xs md:text-sm">
                  <tr>
                    <th className="py-2 md:py-3 px-4 md:px-6">ID</th>
                    <th className="py-2 md:py-3 px-4 md:px-6">Name</th>
                    <th className="py-2 md:py-3 px-4 md:px-6">Price</th>
                    <th className="py-2 md:py-3 px-4 md:px-6">Category</th>
                    <th className="py-2 md:py-3 px-4 md:px-6">Seller</th>
                    <th className="py-2 md:py-3 px-4 md:px-6">Image</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-xs md:text-sm">
                  {currentProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b hover:bg-gray-100 transition-colors"
                    >
                      <td className="py-2 md:py-3 px-4 md:px-6">
                        {product.id}
                      </td>
                      <td className="py-2 md:py-3 px-4 md:px-6 flex items-center gap-2">
                        <FaTag className="text-indigo-500" />
                        {product.title}
                      </td>
                      <td className="py-2 md:py-3 px-4 md:px-6 text-green-500">
                        ${product.price}
                      </td>
                      <td className="py-2 md:py-3 px-4 md:px-6">
                        {product.category || "N/A"}
                      </td>
                      <td className="py-2 md:py-3 px-4 md:px-6 flex items-center gap-2">
                        <FaStore className="text-gray-500" />
                        {product.sellerId?.name || "Unknown Seller"}
                      </td>
                      <td className="py-2 md:py-3 px-4 md:px-6">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-6 md:w-8 h-6 md:h-8 object-cover rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => openImageModal(product.image)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={setCurrentPage}
          recordsPerPage={recordsPerPage}
          setRecordsPerPage={setRecordsPerPage}
        />

        {isImageModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative bg-white p-4 rounded-lg max-w-2xl w-11/12">
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
