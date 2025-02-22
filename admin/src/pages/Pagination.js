import React from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const Pagination = ({ currentPage, totalPages, handlePageChange, loading, recordsPerPage, setRecordsPerPage }) => {
  return (
    <div className="flex flex-wrap justify-between items-center my-6 px-4 py-3 bg-white shadow-md rounded-lg gap-4 sm:gap-0">
      {/* Pagination Controls */}
      <div className="flex flex-wrap items-center space-x-4">
        {/* Previous Button */}
        <button
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-sm w-full sm:w-auto 
          ${currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={20} className="mr-1" /> Previous
        </button>

        {/* Page Indicator */}
        <span className="text-gray-700 font-medium text-center w-full sm:w-auto">
          Page {currentPage} of {totalPages}
        </span>

        {/* Next Button */}
        <button
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-sm w-full sm:w-auto 
          ${currentPage === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next <ChevronRight size={20} className="ml-1" />
        </button>
      </div>

      {/* Records per Page Selector */}
      <div className="flex flex-wrap items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start">
        <span className="text-gray-700 font-medium">Records per page:</span>
        <select
          className="border rounded-lg px-3 py-1 text-gray-700 shadow-sm focus:ring focus:ring-blue-300"
          value={recordsPerPage}
          onChange={(e) => setRecordsPerPage(Number(e.target.value))}
        >
          <option value={6}>6</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <Loader2 size={24} className="animate-spin text-blue-500" />
        </div>
      )}
    </div>
  );
};

export default Pagination;
