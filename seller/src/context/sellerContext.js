import React, { createContext, useReducer, useEffect } from "react";

// Initial state
const initialState = {
  isLoggedIn: false,
  seller: null,
  token: null, // You can store the token here if required
};

// Reducer
const sellerReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
        seller: action.payload.seller, // Setting seller details correctly
        token: action.payload.token, // Optionally store token
      };
    case "LOGOUT":
      localStorage.removeItem("seller");
      return {
        ...state,
        isLoggedIn: false,
        seller: null,
        token: null, // Reset token if it's being stored
      };
    default:
      return state;
  }
};

// Create context
export const SellerContext = createContext();

// Context provider component
export const SellerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sellerReducer, initialState);

  // On app load, check if seller is stored in localStorage and set it in state
  useEffect(() => {
    const storedSeller = localStorage.getItem("seller");
    if (storedSeller) {
      try {
        const parsedSeller = JSON.parse(storedSeller);
        dispatch({
          type: "LOGIN",
          payload: parsedSeller, // Pass the full seller data (including token)
        });
      } catch (error) {
        console.error("Error parsing stored seller data:", error);
        localStorage.removeItem("seller"); // Clear invalid data
      }
    }
  }, []);

  return (
    <SellerContext.Provider value={{ state, dispatch }}>
      {children}
    </SellerContext.Provider>
  );
};