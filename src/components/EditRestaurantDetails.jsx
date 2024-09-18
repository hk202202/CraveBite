import { useEffect } from "react";
import { useStateValue } from "../context/StateProvider";
import { getAllFoodItems } from "../utils/firebaseFunctions";
import { actionType } from "../context/reducer";
import EditForm from "./EditForm";

const EditRestaurantDetails = () => {
  const [{ foodItems }, dispatch] = useStateValue();

  const fetchData = async () => {
    await getAllFoodItems().then((data) => {
      dispatch({
        type: actionType.SET_FOOD_ITEMS,
        foodItems: data,
      });
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <EditForm data={foodItems[1]} />;
};

export default EditRestaurantDetails;
