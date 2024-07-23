// Hooks/ClassHooks/Teacher/useCreateClass.js
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import useGetAllClasses from "./useGetAllClasses";
import { baseUrl } from "../../../../../config/Common";

const useCreateClass = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  
  const { fetchClasses } = useGetAllClasses();
  const createClass = async (classData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.post(`${baseUrl}/admin/class`, classData, {
        headers: { Authentication: token },
      });
      toast.success("Class created successfully!");
      setLoading(false);
      fetchClasses();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Failed to create class";
      toast.error(errorMessage);
      setLoading(false);
      setError(errorMessage);
      throw new Error(errorMessage); // Ensuring the error is thrown for the caller to handle
    }
  };

  return { createClass, loading, error };
};

export default useCreateClass;
