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
  const role = useSelector((store) => store.common.auth.role);

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

  const updateClass = async (classData, classId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.put(
        `${baseUrl}/admin/update_class/${classId}`,
        classData,
        {
          headers: { Authentication: token },
        }
      );
      toast.success("Class updated successfully!");
      setLoading(false);
      console.log("update class--", response.data);
      fetchClasses();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Failed to update class";
      toast.error(errorMessage);
      setLoading(false);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteClass = async (classId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.delete(
        `${baseUrl}/admin/delete_class/${classId}`,
        {
          headers: { Authentication: token },
        }
      );
      toast.success("Class deleted successfully!");
      setLoading(false);
      console.log("delete class--", response.data);
      fetchClasses();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Failed to update class";
      toast.error(errorMessage);
      setLoading(false);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return { createClass, updateClass, deleteClass, loading, error };
};

export default useCreateClass;
