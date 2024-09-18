/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { MdShoppingBasket } from "react-icons/md";
import { motion } from "framer-motion";
import NotFound from "../assets/images/NotFound.svg";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import ImageWithFallback from "./ImageComponent";

const RowContainer = ({ flag, data, scrollValue, restaurant }) => {
  const rowContainer = useRef();

  const [items, setItems] = useState([]);

  const [{ cartItems }, dispatch] = useStateValue();

  const addtocart = () => {
    dispatch({
      type: actionType.SET_CARTITEMS,
      cartItems: items,
    });
    localStorage.setItem("cartItems", JSON.stringify(items));
  };

  useEffect(() => {
    addtocart();
  }, [items]);

  return (
    <>
      {data?.length > 0 && (
        <div
          ref={rowContainer}
          className={`flex scroll-smooth gap-5 ${
            flag
              ? "overflow-x-scroll scrollbar-none"
              : "overflow-x-hidden flex-wrap justify-center"
          }`}
        >
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <motion.div
                key={index}
                className="w-full min-w-[275px] md:w-300 md:min-w-[300px] bg-white rounded-lg md:py-2 md:px-4 my-12 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <motion.img
                    src={item?.imageAsset}
                    alt=""
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <motion.div
                    className="absolute top-0 right-0 p-2 bg-red-600 rounded-full cursor-pointer"
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setItems([...cartItems, item])}
                  >
                    <MdShoppingBasket className="text-white" />
                  </motion.div>
                </div>
                <div className="p-4">
                  <p className="text-textColor font-semibold text-base md:text-lg capitalize">
                    {item?.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {item?.calories} Calories
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-lg text-headingColor font-semibold">
                      <span className="text-sm text-red-500">$</span>{" "}
                      {item?.price}
                    </p>
                    <p>{restaurant}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="w-full flex flex-col items-center justify-center">
              <ImageWithFallback
                src={NotFound}
                className="h-340"
                alt="Not Found"
              />
              <p className="text-xl text-headingColor font-semibold my-2">
                Items Not Available
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RowContainer;
