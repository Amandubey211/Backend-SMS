import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setRejectedStudents } from "../../../Redux/Slices/AdminSlice";
import { baseUrl } from "../../../config/Common";

const useGetRejectedStudents = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const getRejectedStudents = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem(
        process.env.REACT_APP_ADMIN_TOKEN_STORAGE_KEY
      );

      const { data } = await axios.get(
        `${baseUrl}/admin/get_rejected_student_details`,
        {
          headers: { Authentication: token },
        }
      );
      console.log(data);
      if (data?.success) {
        dispatch(setRejectedStudents(data?.students));
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
    getRejectedStudents,
  };
};

export default useGetRejectedStudents;
