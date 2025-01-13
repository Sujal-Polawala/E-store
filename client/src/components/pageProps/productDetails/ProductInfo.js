import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import {
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import axios from "axios";
import { CartPopup } from "../../popup/PopupMsg";
import { AuthContext } from "../../../context/AuthContext";

const ProductInfo = ({ productInfo }) => {
  const { state } = useContext(AuthContext);
  const { user } = state;
  const [showPopup, setShowPopup ] = useState(false);
  const dispatch = useDispatch();
  console.log(productInfo);
  const handleAddToCart = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/cart", {
        productId: productInfo._id,
        quantity: 1,
        userId: user.userId,
      });
      if (response.data.success) {
        console.log("Cart item saved to MongoDB:", response.data.cartItem);
        // Dispatch Redux action to update local cart state
        dispatch(
          addToCart({
            _id: productInfo._id,
            name: productInfo.title,
            quantity: 1,
            image: productInfo.image,
            badge: productInfo.badge,
            price: productInfo.price,
            colors: productInfo.color,
          })
        );
        setShowPopup(true); // Show the CartPopup
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }; 
  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <AiFillStar key={i} className="text-yellow-500" />
        ))}
        {halfStar && <AiOutlineStar className="text-yellow-500" />}
      </div>
    );
  };


  if (!productInfo) {
    return <div>Loading...</div>;
  }

  const rating = productInfo.rating || { rate: 0, count: 0 };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-semibold">{productInfo?.title || "No Title"}</h2>
      <p className="text-xl font-semibold">${productInfo?.price || 0}</p>
      <p className="text-xl font-semibold">{rating.count || 0}</p>
      <p className="text-base text-gray-600">{productInfo?.description || "No Description"}</p>
      <p className="font-medium text-lg">
        {rating.rate ? renderRating(rating.rate) : 0}
        <span>({rating.rate || 0} reviews)</span>
      </p>
      <p className="font-medium text-lg">
        <span className="font-normal">Colors:</span> {productInfo?.color || "N/A"}
      </p>
      <button
        onClick={handleAddToCart}
        className="w-full py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-titleFont"
      >
        Add to Cart
      </button>
      <p className="font-normal text-sm">
        <span className="text-base font-medium"> Categories:</span> Spring
        collection, Streetwear, Women Tags: featured SKU: N/A
      </p>
      {showPopup && (
        <CartPopup
          productInfo={productInfo}
          qty={1}
          setShowPopup={setShowPopup}
        />
      )}
    </div>
  );
};

export default ProductInfo;
