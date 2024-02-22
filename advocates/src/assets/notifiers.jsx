import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const notifiers = {
  httpError: (message) => {
    Toast.fire({
      icon: "error",
      title: "Oops...",
      color: "red",
      background: "black",
      text: message.message
        ? message.error || message.message
        : "An error occured!!",
    });
  },
  httpSuccess: (message) => {
    Toast.fire({
      icon: "success",
      title: "Success!",
      color: "green",
      background: "black",
      text: message,
    });
  },
  generalInfo: (message) => {
    Toast.fire({
      icon: "warning",
      title: "Warning",
      color: "orange",
      text: message,
      background: "black",
    });
  },
};
