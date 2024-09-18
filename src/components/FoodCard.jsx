/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from "react";
import { motion } from "framer-motion";
import { MdShoppingBasket } from "react-icons/md";

const FoodCard = ({ item, restaurant, setItems, cartItems }) => {
  return (
    <motion.div
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
        <p className="mt-1 text-sm text-gray-500">{item?.calories} Calories</p>
        <div className="flex items-center justify-between mt-4">
          <p className="text-lg text-headingColor font-semibold">
            <span className="text-sm text-red-500">$</span> {item?.price}
          </p>
          <p>{restaurant}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;
