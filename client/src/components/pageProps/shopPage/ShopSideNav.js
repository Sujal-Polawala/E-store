import React from "react";
import Category from "./shopBy/Category";
import Color from "./shopBy/Color";
import Brand from "./shopBy/Brand";
import Price from "./shopBy/Price";

const ShopSideNav = ({ onCategoryFilter, clearFilters }) => {
  return (
    <div className="w-full flex flex-col gap-6">
      <Category onCategoryFilter={onCategoryFilter} clearFilters={clearFilters} />
      {/* <Color /> */}
      {/* <Brand /> */}
      <Price />
    </div>
  );
};

export default ShopSideNav;