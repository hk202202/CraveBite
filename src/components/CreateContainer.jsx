/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  MdFastfood,
  MdCloudUpload,
  MdDelete,
  MdFoodBank,
  MdAttachMoney,
} from "react-icons/md";
import { categories, cityList, restaurantList } from "../utils/data";
import Loader from "./Loader";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../firebase.config";
import { getAllFoodItems, saveItem } from "../utils/firebaseFunctions";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { useNavigate } from "react-router-dom";
import { errorToaster, successToaster } from "../utils/toastify";
import goToTop from "../utils/goToTop";
import Multiselect from "multiselect-react-dropdown";

const CreateContainer = () => {
  const navigate = useNavigate();

  const [fields, setFields] = useState(false);
  const [alertStatus, setAlertStatus] = useState("danger");
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [{ foodItems, user }, dispatch] = useStateValue();
  const [restaurant, setRestaurant] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [location, setLocation] = useState("");
  const [restaurantImage, setRestaurantImage] = useState(null);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [currentDish, setCurrentDish] = useState({
    id: `${Date.now()}`,
    title: "",
    category: "",
    calories: "",
    price: "",
    imageAsset: null,
    qty: 1,
  });

  const onSelect = (selectedList, selectedItem) => {
    // Handle the onSelect logic here
    // You can perform any additional actions when an item is selected
    setSelectedValues(selectedList);
  };

  const onRemove = (selectedList, removedItem) => {
    // Handle the onRemove logic here
    // You can perform any additional actions when an item is removed
    setSelectedValues(selectedList);
  };

  const uploadRestaurantImage = (e) => {
    setIsLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(
      storage,
      `RestaurantImages/${Date.now()}-${imageFile?.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        // Handle error
        setIsLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setRestaurantImage(downloadURL);
          setIsLoading(false);
        });
      }
    );
  };

  const uploadImage = (e) => {
    setIsLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(storage, `Images/${Date.now()}-${imageFile?.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        setFields(true);
        setMsg("Error while uploading: Try Again 🙇");
        setAlertStatus("danger");
        setTimeout(() => {
          setFields(false);
          setIsLoading(false);
        }, 4000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setCurrentDish({
            ...currentDish,
            imageAsset: downloadURL,
          });
          setIsLoading(false);
          setFields(true);
          setMsg("Image uploaded successfully 😊");
          setAlertStatus("success");
          setTimeout(() => {
            setFields(false);
          }, 4000);
        });
      }
    );
  };

  const deleteImage = () => {
    setIsLoading(true);
    const deleteRef = ref(storage, currentDish.imageAsset);
    deleteObject(deleteRef)
      .then(() => {
        setCurrentDish({
          ...currentDish,
          imageAsset: null,
        });
        setIsLoading(false);
        setFields(true);
        setMsg("Image deleted successfully 😊");
        setAlertStatus("success");
        setTimeout(() => {
          setFields(false);
        }, 4000);
      })
      .catch((error) => {
        setFields(true);
        setMsg("Error while deleting image: Try Again 🙇");
        setAlertStatus("danger");
        setTimeout(() => {
          setFields(false);
          setIsLoading(false);
        }, 4000);
      });
  };

  const saveDetails = () => {
    goToTop();
    setIsLoading(true);

    try {
      // Check if required fields are empty
      if (!restaurant || !location || !dishes || dishes.length === 0) {
        setFields(true);
        setMsg("Please fill in all required fields and add at least 1 dish");
        errorToaster(
          "Please fill in all required fields and add at least 1 dish"
        );
        setAlertStatus("danger");
        setTimeout(() => {
          setFields(false);
          setIsLoading(false);
        }, 4000);
      } else {
        const data = {
          restaurantID: `${Date.now()}`,
          restaurant: restaurant,
          restaurantImage: restaurantImage,
          location: location,
          categoriesInRestaurant: selectedValues,
          dishes: dishes,
        };

        saveItem(data);
        setIsLoading(false);
        setFields(true);
        setMsg("Data Uploaded successfully 😊");
        successToaster("Data Uploaded successfully 😊");
        setAlertStatus("success");
        setTimeout(() => {
          setFields(false);
        }, 4000);
        clearData();
      }
    } catch (error) {
      setFields(true);
      setMsg("Error while uploading: Try Again 🙇");
      errorToaster("Error while uploading: Try Again 🙇");
      setAlertStatus("danger");
      setTimeout(() => {
        setFields(false);
        setIsLoading(false);
      }, 4000);
    }

    fetchData();
  };

  const clearData = () => {
    setCurrentDish({
      id: "",
      title: "",
      category: "",
      calories: "",
      price: "",
      imageAsset: null,
      qty: "",
    });
  };

  const deleteRestaurantImage = () => {
    setIsLoading(true);
    const deleteRef = ref(storage, restaurantImage);
    deleteObject(deleteRef)
      .then(() => {
        setRestaurantImage(null);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const fetchData = async () => {
    await getAllFoodItems().then((data) => {
      dispatch({
        type: actionType.SET_FOOD_ITEMS,
        foodItems: data,
      });
    });
  };

  const addDish = () => {
    // Validate the current dish fields before adding
    if (
      !currentDish.title ||
      !currentDish.category ||
      !currentDish.calories ||
      !currentDish.price
    ) {
      // Handle validation error (show a message, etc.)
      alert("Please fill in all fields before adding a dish.");
      return;
    }

    // Add the current dish to the dishes array
    setDishes([...dishes, { ...currentDish, isVegetarian }]);
    setCurrentDish({
      id: `${Date.now()}`,
      title: "",
      category: "",
      calories: "",
      price: "",
      imageAsset: null,
      qty: 1,
      isVegetarian: false, // Reset the vegetarian status for the next entry
    });
  };

  useEffect(() => {
    if (user.email !== "g.nishi9525@gmail.com") {
      navigate("/");
    }
  }, [navigate, user.email]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-[90%] md:w-[50%] border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
        {fields && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`w-full p-2 rounded-lg text-center text-lg font-semibold ${
              alertStatus === "danger"
                ? "bg-red-400 text-red-800"
                : "bg-emerald-400 text-emerald-800"
            }`}
          >
            {msg}
          </motion.p>
        )}

        <div className="w-full">
          <h1 className="font-extrabold	 text-xl">Restaurant</h1>
        </div>

        <div className="group flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-225 md:h-340 cursor-pointer rounded-lg">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {!restaurantImage ? (
                <>
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <MdCloudUpload className="text-gray-500 text-3xl hover:text-gray-700" />
                      <p className="text-gray-500 hover:text-gray-700">
                        Click here to upload
                      </p>
                    </div>
                    <input
                      type="file"
                      name="uploadRestaurantImage"
                      accept="image/*"
                      onChange={uploadRestaurantImage}
                      className="w-0 h-0"
                    />
                  </label>
                </>
              ) : (
                <>
                  <div className="relative h-full">
                    <img
                      src={restaurantImage}
                      alt="uploadedimage"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-in-out"
                      onClick={deleteRestaurantImage}
                    >
                      <MdDelete className="text-white" />
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="w-full">
          <h1 className="font-extrabold text-xl">Restaurant Image</h1>
        </div>

        <div className="w-full">
          <select
            onChange={(e) => setRestaurant(e.target.value)}
            className="outline-none w-full text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
          >
            <option value="other" className="bg-white">
              Select Restaurant
            </option>
            {restaurantList &&
              restaurantList.map((item) => (
                <option
                  key={item.name}
                  className="text-base border-0 outline-none capitalize bg-white text-headingColor"
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
          </select>
        </div>

        <div className="w-full">
          <select
            onChange={(e) => setLocation(e.target.value)}
            className="outline-none w-full text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
          >
            <option value="other" className="bg-white">
              Select Location
            </option>
            {cityList &&
              cityList.map((item) => (
                <option
                  key={item.pincode}
                  className="text-base border-0 outline-none capitalize bg-white text-headingColor"
                  value={item.city}
                >
                  {item.city}
                </option>
              ))}
          </select>
        </div>

        <div className="w-full">
          <Multiselect
            options={categories}
            selectedValues={selectedValues}
            onSelect={onSelect}
            onRemove={onRemove}
            displayValue="name"
            closeIcon="cancel"
            selectionLimit={-1}
            placeholder="Categories in restaurant"
          />
        </div>

        <div className="w-full">
          <h1 className="font-extrabold	 text-xl">Add Dishes</h1>
        </div>
        {dishes.length > 0 && (
          <div className="w-full mt-4">
            <h2 className="font-bold text-lg mb-2">Added Dishes:</h2>
            <ul>
              {dishes.map((dish, index) => (
                <li key={index}>
                  {dish.title} - {dish.category} - {dish.calories} calories - $
                  {dish.price}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="addDishes flex flex-col items-center justify-center gap-4">
          <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
            <MdFastfood className="text-xl text-gray-700" />
            <input
              type="text"
              required
              value={currentDish.title}
              onChange={(e) =>
                setCurrentDish({ ...currentDish, title: e.target.value })
              }
              placeholder="Give me a title..."
              className="w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-gray-400 text-textColor"
            />
          </div>

          <div className="w-full">
            <select
              onChange={(e) =>
                setCurrentDish({ ...currentDish, category: e.target.value })
              }
              className="outline-none w-full text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
            >
              <option value="other" className="bg-white">
                Select Category
              </option>
              {categories &&
                categories.map((item) => (
                  <option
                    key={item.id}
                    className="text-base border-0 outline-none capitalize bg-white text-headingColor"
                    value={item.urlParamName}
                  >
                    {item.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="w-full flex flex-col md:flex-row items-center gap-3">
            {/* ... (existing calorie and price fields) */}

            {/* Add a new field for Veg/Non-Veg */}
            <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
              <MdFoodBank className="text-gray-700 text-2xl" />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isVegetarian}
                  onChange={() => setIsVegetarian(!isVegetarian)}
                  className="mr-2"
                />
                Vegetarian
              </label>
            </div>
          </div>

          <div className="group flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-225 md:h-340 cursor-pointer rounded-lg">
            {isLoading ? (
              <Loader />
            ) : (
              <>
                {!currentDish.imageAsset ? (
                  <>
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <MdCloudUpload className="text-gray-500 text-3xl hover:text-gray-700" />
                        <p className="text-gray-500 hover:text-gray-700">
                          Click here to upload
                        </p>
                      </div>
                      <input
                        type="file"
                        name="uploadimage"
                        accept="image/*"
                        onChange={uploadImage}
                        className="w-0 h-0"
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <div className="relative h-full">
                      <img
                        src={currentDish.imageAsset}
                        alt="uploadedimage"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                        onClick={deleteImage}
                      >
                        <MdDelete className="text-white" />
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className="w-full flex flex-col md:flex-row items-center gap-3">
            <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
              <MdFoodBank className="text-gray-700 text-2xl" />
              <input
                type="text"
                required
                value={currentDish.calories}
                onChange={(e) =>
                  setCurrentDish({ ...currentDish, calories: e.target.value })
                }
                placeholder="Calories"
                className="w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-gray-400 text-textColor"
              />
            </div>

            <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
              <MdAttachMoney className="text-gray-700 text-2xl" />
              <input
                type="text"
                required
                value={currentDish.price}
                onChange={(e) =>
                  setCurrentDish({ ...currentDish, price: e.target.value })
                }
                placeholder="Price"
                className="w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-gray-400 text-textColor"
              />
            </div>
          </div>

          <div className="flex items-center w-full">
            <button
              type="button"
              className="ml-0 md:ml-auto w-full md:w-auto border-none outline-none bg-emerald-500 px-12 py-2 rounded-lg text-lg text-white font-semibold"
              onClick={addDish}
            >
              Add Dish
            </button>
          </div>
        </div>

        <div className="flex items-center w-full">
          <button
            type="button"
            className="ml-0 md:ml-auto w-full md:w-auto border-none outline-none bg-emerald-500 px-12 py-2 rounded-lg text-lg text-white font-semibold"
            onClick={saveDetails}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateContainer;
