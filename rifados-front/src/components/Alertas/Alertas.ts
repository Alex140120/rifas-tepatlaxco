import { toast, ToastPosition } from "react-toastify";

export const notifyError = (
  texto: string,
  posicion: ToastPosition,
  time?: number
) =>
  toast.error(texto, {
    position: posicion,
    autoClose: time || 1000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

export const notifySuccess = (
  texto: string,
  posicion: ToastPosition,
  time?: number
) =>
  toast.success(texto, {
    position: posicion,
    autoClose: time || 1000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

export const notifyWarning = (
  texto: string,
  posicion: ToastPosition,
  time?: number
) =>
  toast.warning(texto, {
    position: posicion,
    autoClose: time || 1000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
