import axios from "axios";

// Detect if we're running on Render (production)
const baseURL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname.includes("onrender.com")
    ? "https://moviedb-ch39.onrender.com"
    : "http://localhost:5000");

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Small helper to normalize server/client errors into a string
export const getErr = (err) => {
  if (err?.response?.data?.error) return err.response.data.error;
  if (err?.response?.data?.message) return err.response.data.message;
  return err?.message || "Something went wrong";
};
