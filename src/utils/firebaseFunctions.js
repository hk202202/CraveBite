// /* eslint-disable no-debugger */
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../firebase.config";
import { errorToaster, successToaster } from "./toastify";

// Saving new Item
export const saveItem = async (data) => {
  await setDoc(doc(firestore, "foodItems", `${Date.now()}`), data, {
    merge: true,
  });
};

// getall food items
export const getAllFoodItems = async () => {
  const items = await getDocs(query(collection(firestore, "foodItems")));
  return items.docs.map((doc) => doc.data());
};

export const editItem = async (item) => {
  const itemRef = doc(firestore, "foodItems", item?.restaurantID);
  console.log(itemRef, "itemRef");

  try {
    const response = await updateDoc(itemRef, item);
    successToaster("Data Updated Succesfully");
    return response;
  } catch (error) {
    console.error("Error updating document: ", error);
    errorToaster("Error updating document: ", error);
  }
};

export const deleteItem = async (restaurantID) => {
  console.log(restaurantID);
  const itemRef = doc(firestore, "foodItems", restaurantID);

  try {
    await deleteDoc(itemRef);
    successToaster("Item Deleted Successfully");
  } catch (error) {
    console.error("Error deleting document: ", error);
    errorToaster("Error deleting document: ", error);
  }
};
