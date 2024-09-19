import { useState, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import useGetClassDetails from "./Class/usegetClassDetails";
import { baseUrl } from "../../../../config/Common";

const useCreateSubject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  //   const dispatch = useDispatch();
  const { fetchClassDetails } = useGetClassDetails();
  const role = useSelector((store) => store.Auth.role);
  const createSubject = useCallback(async (subjectData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.post(
        `${baseUrl}/admin/subject`,
        subjectData,
        {
          headers: { Authentication: token },
        }
      );
      const { data } = response.data;
      //   dispatch(addSubject(data));
      setLoading(false);
      fetchClassDetails(subjectData.classId);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create subject";
      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateSubject = async (subjectId, subject) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.put(
        `${baseUrl}/admin/subject/${subjectId}`,
        subject,
        {
          headers: { Authentication: token },
        }
      );
      setLoading(false);
      console.log("update subject--", response.data);
      fetchClassDetails(subject.classId);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg || "Failed to update subject";
      setLoading(false);
      setError(errorMessage);
    }
  };

  const deleteSubject = async (subjectId, classId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.delete(
        `${baseUrl}/admin/subject/${subjectId}`,
        {
          headers: { Authentication: token },
        }
      );
      setLoading(false);
      console.log("deleted subject--", response.data);
      toast.success("Subject deleted successfully!");
      fetchClassDetails(classId);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg || "Failed to delete subject";
      setLoading(false);
      setError(errorMessage);
    }
  };

  return { createSubject, deleteSubject, updateSubject, loading, error };
};

export default useCreateSubject;
