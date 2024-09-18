/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import { getAllFoodItems } from "../utils/firebaseFunctions";
import { motion } from "framer-motion";
import restaurantPic1 from "../assets/restaurant1.jpg";
import SearchComponent from "./SearchComponent";
import { SkeletonLoader } from "./SkelatonLoader";
import FilterComponent from "./FilterComponent";

const RestaurantList = () => {
  const [{ foodItems }, dispatch] = useStateValue();

  const [filteredItems, setFilteredItems] = useState([]);

  const [sortOption, setSortOption] = useState("default");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [uniqueLocations, setUniqueLocations] = useState([]);

  const fetchData = async () => {
    await getAllFoodItems().then((data) => {
      dispatch({
        type: actionType.SET_FOOD_ITEMS,
        foodItems: data,
      });
      setFilteredItems(data);
      const locations = data.map((item) => item.location);
      setUniqueLocations([...new Set(locations)]);
    });
  };

  const handleSearch = (searchTerm) => {
    const filtered = foodItems.filter((item) =>
      item?.restaurant?.toLowerCase()?.includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleFilterChange = (option) => {
    setSortOption(option);

    let sortedItems = [...filteredItems];

    switch (option) {
      case "alphabetical":
        sortedItems.sort((a, b) =>
          a?.restaurant?.localeCompare(b.restaurant, undefined, {
            sensitivity: "base",
          })
        );
        break;
      case "priceLowToHigh":
        sortedItems.sort((a, b) => a.price - b.price);
        break;
      case "priceHighToLow":
        sortedItems.sort((a, b) => b.price - a.price);
        break;
      case "location":
        sortedItems.sort((a, b) =>
          a?.location?.localeCompare(b.location, undefined, {
            sensitivity: "base",
          })
        );
        break;
      // Add more cases for additional sorting options
      default:
        // Default case: no sorting
        break;
    }

    setFilteredItems(sortedItems);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <div className="w-full flex justify-center items-center">
        <SearchComponent onSearch={handleSearch} />
        <FilterComponent onFilterChange={handleFilterChange} />
      </div>
      <motion.section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {filteredItems?.length > 0 ? (
          <>
            {filteredItems?.map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 transform hover:scale-105"
              >
                <motion.img
                  src={
                    item?.restaurantImage
                      ? item?.restaurantImage
                      : restaurantPic1
                  }
                  alt=""
                  className="w-full h-48 object-cover object-center"
                  loading="lazy"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                />
                <div className="p-6">
                  <motion.h1
                    className="text-lg font-semibold text-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {item?.restaurant}
                  </motion.h1>
                  <motion.div
                    className="text-lg font-semibold text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    $300-600
                  </motion.div>
                  <motion.div
                    className="text-sm font-medium text-gray-700 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {item?.location}
                  </motion.div>
                  <motion.div
                    className="flex items-baseline mt-4 mb-6 pb-6 border-b border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <motion.div className="flex text-sm gap-2 flex-wrap">
                      {item?.categoriesInRestaurant?.map(({ name, id }) => (
                        <motion.div
                          key={id}
                          className="text-xs bg-gray-300 py-1 px-2 rounded-md"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 }}
                        >
                          {name}
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                  <motion.div
                    className="flex space-x-4 mb-6 text-sm font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                  >
                    <motion.div className="flex-auto flex space-x-4">
                      <button className="h-10 px-6 font-semibold rounded-md bg-black text-white">
                        View More
                      </button>
                    </motion.div>
                    <motion.button
                      className="flex-none flex items-center justify-center w-9 h-9 rounded-md text-gray-400 border border-gray-200"
                      type="button"
                      aria-label="Like"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.6 }}
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        />
                      </svg>
                    </motion.button>
                  </motion.div>
                  <motion.p
                    className="text-sm text-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                  >
                    Free shipping on all orders above 1000.
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </>
        ) : (
          <>
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </>
        )}
      </motion.section>
    </div>
  );
};

export default RestaurantList;
