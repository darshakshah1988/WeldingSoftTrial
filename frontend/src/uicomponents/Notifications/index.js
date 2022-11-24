import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {DOWNLOAD_FIELDS } from "../../Global/constants"

export const notify = (toastId) =>
  (toastId.current = toast.loading("Loading", { autoClose: false }));

export const update = (toastId, ApiStatus, notifyName) => {
  let name = ApiStatus.split(" ")[1];

  if (
    name == "successfully" || name=="sucessfull"
  ) {
    toast.update(toastId.current, {
      render: notifyName + ApiStatus,
      type: "success",
      autoClose: 3000,
      isLoading: false,
    });
  } else {
    toast.update(toastId.current, {
      render: notifyName + ApiStatus,
      type: "error",
      autoClose: 3000,
      isLoading: false,
    });
  }
};

export const validate = (toastId, datalength, notifyName) => {
  if (
    datalength <= 0
  ) {
    toast.update(toastId.current, {
      render: DOWNLOAD_FIELDS.RECORD_NOT_FOUND ,
      type: "error",
      autoClose: 3000,
      isLoading: false,
    });
  }
  else{
    toast.update(toastId.current, {
      render: DOWNLOAD_FIELDS.DOWNLOAD_SUCCESS,
      type: "success",
      autoClose: 3000,
      isLoading: false,
    });
  }
};

export const infoToast = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
};