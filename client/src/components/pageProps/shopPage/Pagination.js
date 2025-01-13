import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios"; // Import axios to fetch data from API
import Product from "../../home/Products/Product";
import { paginationItems } from "../../../constants"; // If you still need paginationItems for mock data or fallback

// Items component to display current page items
function Items({ currentItems }) {
  return (
    <>
      {currentItems &&
        currentItems.map((item) => (
          <div key={item._id} className="w-full">
            <Product
              _id={item._id}
              img={item.image}
              productName={item.title}
              price={item.price}
              color={item.color}
              badge={item.badge}
              des={item.description}
            />
          </div>
        ))}
    </>
  );
}

// Pagination component with API integration
const Pagination = ({ itemsPerPage }) => {
  const [items, setItems] = useState([]); // Store the products
  const [loading, setLoading] = useState(true); // Loading state
  const [itemOffset, setItemOffset] = useState(0); // Pagination offset
  const [totalItems, setTotalItems] = useState(0); // Total number of items from API

  // Fetch data from API (getAllProducts endpoint)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setItems(response.data); // Set fetched data
        setTotalItems(response.data.length); // Set the total number of items for pagination
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate current items for the page
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(totalItems / itemsPerPage); // Total pages based on items length

  // Handle page change
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10">
        {/* Display the current page items */}
        {loading ? <div>Loading...</div> : <Items currentItems={currentItems} />}
      </div>
      <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
        {/* Pagination control */}
        <ReactPaginate
          nextLabel=""
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel=""
          pageLinkClassName="w-9 h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
          pageClassName="mr-6"
          containerClassName="flex text-base font-semibold font-titleFont py-10"
          activeClassName="bg-black text-white"
        />
        {/* Page info */}
        <p className="text-base font-normal text-lightText">
          Products from {itemOffset + 1} to {endOffset} of {totalItems}
        </p>
      </div>
    </div>
  );
};

export default Pagination;
