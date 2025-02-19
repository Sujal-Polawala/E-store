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
import Orders from "./components/viewOrders";
import { ApolloProvider } from "@apollo/client";
import client from "./components/apolloClient";

const App = () => {
  return (
    <SellerProvider>
      <ApolloProvider client={client}>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/add-product" element={<NewProduct />} />
            <Route path="/seller/products" element={<CrudPage />} />
            <Route path="/seller/orders" element={<Orders />} />
          </Routes>
        </Router>
      </ApolloProvider>
    </SellerProvider>
  );
};

export default App;
