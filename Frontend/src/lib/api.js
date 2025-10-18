import axios from "axios";

export const api = axios.create({
  baseURL: "",
  withCredentials: true,
});

export const getErr = (err) => {
  if (err?.response?.data?.error) return err.response.data.error;
  if (err?.response?.data?.message) return err.response.data.message;
  return err?.message || "Something went wrong";
};
