import { toast, ToastPosition } from "react-toastify";

export const notifyError = (
  texto: string,
  posicion: ToastPosition
) =>
  toast.error(texto, {
    position: posicion,
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

export const notifySuccess = (texto: string, posicion: ToastPosition) =>
  toast.success(texto, {
    position: posicion,
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

  export const notifyWarning = (texto: string, posicion: ToastPosition) =>
    toast.warning(texto, {
      position: posicion,
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
