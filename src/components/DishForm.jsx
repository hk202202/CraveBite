/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  MdFastfood,
  MdCloudUpload,
  MdDelete,
  MdFoodBank,
  MdAttachMoney,
} from "react-icons/md";
import { categories } from "../utils/data";
import Loader from "./Loader";
import { useEffect, useState } from "react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import DummyImage from "../assets/images/chef1.png";
import { storage } from "../firebase.config";

export const DishForm = ({ currentDish, dishData, setDishData, saveDish }) => {
  const [isLoading, setIsLoading] = useState(false);

  const uploadImage = async (e) => {
    setIsLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(storage, `Images/${Date.now()}-${imageFile?.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // Update UI with the upload progress if needed
      },
      (error) => {
        // Handle error
        setIsLoading(false);
        console.error("Error uploading image:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setDishData((prevData) => ({
            ...prevData,
            imageAsset: downloadURL,
          }));
          setIsLoading(false);
        });
      }
    );
  };

  const deleteImage = () => {
    setIsLoading(true);
    const deleteRef = ref(storage, dishData?.imageAsset);
    deleteObject(deleteRef)
      .then(() => {
        setDishData((prevData) => ({
          ...prevData,
          imageAsset: "",
        }));
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error deleting image:", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle different input types
    const newValue = type === "checkbox" ? checked : value;

    setDishData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  useEffect(() => {
    setDishData(currentDish);
  }, [currentDish]);

  return (
    <div className="addDishes flex flex-col items-center justify-center gap-4">
      <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
        <MdFastfood className="text-xl text-gray-700" />
        <input
          type="text"
          required
          name="title"
          value={dishData?.title}
          onChange={handleInputChange}
          placeholder="Give me a title..."
          className="w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-gray-400 text-textColor"
        />
      </div>

      <div className="w-full">
        <select
          onChange={handleInputChange}
          value={dishData?.category}
          name="category"
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
        Add a new field for Veg/Non-Veg
        <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
          <MdFoodBank className="text-gray-700 text-2xl" />
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isVegetarian"
              checked={dishData?.isVegetarian}
              onChange={handleInputChange}
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
            {!dishData?.imageAsset ? (
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
                    src={dishData?.imageAsset}
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
            name="calories"
            value={dishData?.calories}
            onChange={handleInputChange}
            placeholder="Calories"
            className="w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-gray-400 text-textColor"
          />
        </div>

        <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
          <MdAttachMoney className="text-gray-700 text-2xl" />
          <input
            type="text"
            required
            value={dishData?.price}
            onChange={handleInputChange}
            name="price"
            placeholder="Price"
            className="w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-gray-400 text-textColor"
          />
        </div>
      </div>

      <div className="flex items-center w-full">
        <button
          type="button"
          className="ml-0 md:ml-auto w-full md:w-auto border-none outline-none bg-emerald-500 px-12 py-2 rounded-lg text-lg text-white font-semibold"
          onClick={saveDish}
        >
          Save Dish
        </button>
      </div>
    </div>
  );
};
