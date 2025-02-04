import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Register from "./components/register";
import Login from "./components/login";
import SellerDashboard from "./components/Dashboard";
import NewProduct from "./components/newProductForm";
import { SellerProvider } from "./context/sellerContext";
import CrudPage from "./components/ViewProducts";

const App = () => {
  return (
    <SellerProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/add-product" element={<NewProduct />} />
          <Route path="/seller/products" element={<CrudPage />} />
        </Routes>
      </Router>
    </SellerProvider>
  );
};

export default App;
