import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const successToaster = (msg) => {
  toast.success(msg, {
    position: toast.POSITION.BOTTOM_RIGHT,
    className: "toast-message",
  });
};

export const errorToaster = (msg) => {
  toast.error(msg, {
    position: toast.POSITION.BOTTOM_RIGHT,
    className: "toast-message",
  });
};
