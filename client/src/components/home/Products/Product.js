import React, { useContext, useState } from "react";
import { BsSuitHeartFill } from "react-icons/bs";
import { GiReturnArrow } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import Image from "../../designLayouts/Image";
import Badge from "./Badge";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import axios from "axios"; // Import Axios
import { AuthContext } from "../../../context/AuthContext";
import { CartPopup } from "../../popup/PopupMsg";

const Product = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const { isLoggedIn, user } = state;
  const productInfo = props;

  const [showPopup, setShowPopup] = useState(false);

  const handleProductDetails = () => {
    navigate(`/products/${props._id}`, {
      state: {
        item: productInfo,
      },
    });
  };

  // console.log(productInfo);

  const handleAddToCart = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/cart", {
        productId: props._id,
        quantity: 1,
        userId: user.userId,
      });
      if (response.data.success) {
        console.log("Cart item saved to MongoDB:", response.data.cartItem);
        // Dispatch Redux action to update local cart state
        dispatch(
          addToCart({
            _id: props._id,
            name: props.title,
            quantity: 1,
            image: props.image,
            badge: props.badge,
            price: props.price,
            colors: props.color,
          })
        );
        setShowPopup(true); // Show the CartPopup
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <>
      <div className="w-full relative group">
        <div className="max-w-80 max-h-80 relative overflow-y-hidden">
          <div>
            <Image className="w-full h-52" imgSrc={props.image} />
          </div>
          <div className="absolute top-6 left-8">
            {props.badge && <Badge text={props.badge} />}
          </div>
          <div className="w-full h-32 absolute bg-white -bottom-[130px] group-hover:bottom-0 duration-700">
            <ul className="w-full h-full flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-l border-r">
              <li className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full">
                Compare
                <span>
                  <GiReturnArrow />
                </span>
              </li>
              <li
                onClick={handleAddToCart} // Use API call
                className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
              >
                Add to Cart
                <span>
                  <FaShoppingCart />
                </span>
              </li>
              <li
                onClick={handleProductDetails}
                className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
              >
                View Details
                <span className="text-lg">
                  <MdOutlineLabelImportant />
                </span>
              </li>
              <li className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full">
                Add to Wish List
                <span>
                  <BsSuitHeartFill />
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-80 py-6 flex flex-col gap-1 border-[1px] border-t-0 px-4">
          <div className="flex items-center justify-between font-titleFont">
            <h2 className="text-lg text-primeColor font-bold">{props.title.slice(0,20)}...</h2>
            <p className="text-[#767676] text-[14px]">${props.price}</p>
          </div>
          <div>
            <p className="text-[#767676] text-[14px]">{props.color}</p>
          </div>
        </div>
      </div>
      {showPopup && (
        <CartPopup
          productInfo={productInfo}
          qty={1}
          setShowPopup={setShowPopup}
        />
      )}
    </>
  );
};

export default Product;