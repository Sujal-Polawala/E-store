// src/components/Pagination.js

import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  handlePageChange,
  mode,
  loading,
}) => {
  return (
    <div className="flex justify-center mt-6">
      <div className="flex items-center justify-center">

      <button
        className={`px-4 py-2 rounded-md text-white font-semibold ${
          currentPage
          ? "bg-blue-500"
          : "bg-gray-300 hover:bg-blue-400 hover:text-white"
        } transition-colors duration-300 ${
          currentPage === 1 ? "bg-gray-300" : "bg-blue-500"
        } text-white`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        >
        Previous
        {loading ? (
          <>
            <div className="w-5 h-5 border-4 border-t-transparent border-gray-900 rounded-full animate-spin opacity-80"></div>
          </>
        ) : (
          ""
        )}
      </button>

      <span
        className={`px-4 py-2 text-gray-600`}
        >
        Page {currentPage} of {totalPages}
      </span>

      <button
        className={`px-4 py-2 rounded-md text-white font-semibold ${
          currentPage
          ? "bg-blue-500"
          : "bg-gray-300 hover:bg-blue-400 hover:text-white"
        } transition-colors duration-300 ${
          currentPage === totalPages ? "bg-gray-300" : "bg-blue-500"
        } text-white`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        >
        Next
        {loading ? (
          <>
            <div className="w-5 h-5 border-4 border-t-transparent border-gray-900 rounded-full animate-spin opacity-80"></div>
          </>
        ) : (
          ""
        )}
      </button>
        </div>
    </div>
  );
};

export default Pagination;
