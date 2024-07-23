import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setStudents } from "../../../../../Redux/Slices/Admin/StudentSlice";
import { baseUrl } from "../../../../../config/Common";

const useGetAllStudents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  
const dispatch = useDispatch()
  const fetchAllStudents = useCallback(
    async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(`${baseUrl}/admin/all/students`, {
          headers: { Authentication: token },
        });
        console.log(response.data)
        dispatch(setStudents(response.data))
        if (response.data.status) {
          return response.data?.data;
        } else {
         // toast.error("Failed to fetch students. Please try again.");
          return [];
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch students";
        toast.error(errorMessage);
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [baseUrl, role]
  );

  return { loading, error, fetchAllStudents };
};

export default useGetAllStudents;
