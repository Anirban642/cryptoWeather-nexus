"use client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initialize Toast
export const notify = (message, type = "info") => {
  toast[type](message, { position: "top-right", autoClose: 3000 });
};

const Notification = () => {
  return <div>{toast.container}</div>;
};

export default Notification;
