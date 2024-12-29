import { toast } from "react-toastify";

export const notifyError = (texto: string) =>
  toast.error(texto, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  export const notifySuccess = (texto: string) =>
    toast.success(texto, {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  
