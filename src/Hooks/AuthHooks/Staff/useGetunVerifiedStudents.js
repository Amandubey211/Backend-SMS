import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUnVerifiedStudents } from "../../../Redux/Slices/AdminSlice";

const useGetUnVerifiedStudents = () => {
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const getUnverifiedStudents = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem(
        process.env.REACT_APP_ADMIN_TOKEN_STORAGE_KEY
      );
      console.log(token);
      const { data } = await axios.get(
        `${API_URL}/admin/get_unverified_student_details`,
        {
          headers: { Authentication: token },
        }
      );
      if (data?.success) {
        dispatch(setUnVerifiedStudents(data?.students));
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.error("Error fetching unverified students:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getUnverifiedStudents,
  };
};

export default useGetUnVerifiedStudents;
