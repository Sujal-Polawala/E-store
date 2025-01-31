import React from "react";

const SearchBar = () => {
  return (
    <div className="relative mb-6">
      <input
        type="text"
        placeholder="Search"
        className="px-4 py-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
  );
};

export default SearchBar;