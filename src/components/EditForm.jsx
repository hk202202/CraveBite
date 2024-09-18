/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { MdCloudUpload, MdDelete } from "react-icons/md";
import { cityList, restaurantList } from "../utils/data";
import Loader from "./Loader";
import { useState } from "react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../firebase.config";
import { DishForm } from "./DishForm";
import { editItem } from "../utils/firebaseFunctions";
import { successToaster } from "../utils/toastify";

const EditForm = ({ data, saveEditedData }) => {
  const [dishId, setDishId] = useState(null);
  const [dishForm, setDishForm] = useState(false);
  const [dishData, setDishData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [editedData, setEditedData] = useState({
    restaurantID: data?.restaurantID || `${Date.now()}`,
    restaurant: data?.restaurant || "",
    restaurantImage: data?.restaurantImage || null,
    location: data?.location || "",
    categoriesInRestaurant: data?.categoriesInRestaurant || [],
    dishes: data?.dishes || [],
  });

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
          setEditedData((prevData) => ({
            ...prevData,
            restaurantImage: downloadURL,
          }));
          setIsLoading(false);
        });
      }
    );
  };

  const deleteRestaurantImage = () => {
    setIsLoading(true);
    const deleteRef = ref(storage, editedData?.restaurantImage);
    deleteObject(deleteRef)
      .then(() => {
        setEditedData((prevData) => ({
          ...prevData,
          restaurantImage: null,
        }));
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const handleInputChange = (e) => {
    setEditedData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const saveDish = () => {
    const filteredDishArr = editedData?.dishes?.filter(
      (item) => item.id !== dishData?.id
    );
    setEditedData({ ...editedData, dishes: [...filteredDishArr, dishData] });
    console.log(filteredDishArr, "filteredDishArr");

    successToaster("Dish Updated Successfully");
  };

  return (
    <div className="w-full min-h-screen ">
      <div className="w-[90%] md:w-[100%] border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
        <div className="w-full">
          <h1 className="font-extrabold	 text-xl">Restaurant</h1>
        </div>

        <div className="group flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-225 md:h-340 cursor-pointer rounded-lg">
          {data?.length <= 0 || undefined ? (
            <Loader />
          ) : (
            <>
              {!editedData.restaurantImage ? (
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
                      src={editedData?.restaurantImage}
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
            onChange={handleInputChange}
            defaultValue={editedData?.restaurant}
            name="restaurant"
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
            onChange={handleInputChange}
            name="location"
            defaultValue={editedData?.location}
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
          {/* <Multiselect
            options={categories}
            selectedValues={selectedValues}
            onSelect={onSelect}
            onRemove={onRemove}
            displayValue="name"
            closeIcon="cancel"
            selectionLimit={-1}
            placeholder="Categories in restaurant"
          /> */}
        </div>

        <div className="w-full">
          <h1 className="font-extrabold	 text-xl">Add Dishes</h1>
        </div>

        <div className="flex gap-3">
          {editedData?.dishes?.map((currentDish, index) => {
            return (
              <div
                className="border border-violet-800 p-3 cursor-pointer"
                key={index}
                onClick={() => {
                  setDishId(currentDish);
                  setDishForm(true);
                }}
              >
                <div>
                  {currentDish?.title} id - {currentDish?.id}
                </div>
              </div>
            );
          })}
        </div>
        {dishForm && (
          <DishForm
            currentDish={dishId}
            dishData={dishData}
            setDishData={setDishData}
            saveDish={saveDish}
          />
        )}

        <div className="flex items-center w-full">
          <button
            type="button"
            className="ml-0 md:ml-auto w-full md:w-auto border-none outline-none bg-emerald-500 px-12 py-2 rounded-lg text-lg text-white font-semibold"
            // onClick={saveDetails}
            onClick={() => {
              saveEditedData(editedData);
            }}
          >
            Save Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditForm;
