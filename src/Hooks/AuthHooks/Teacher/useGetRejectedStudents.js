import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setRejectedStudents } from "../../../Redux/Slices/AdminSlice";

const useGetRejectedStudents = () => {
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const getRejectedStudents = async () => {
    setLoading(true);

    try {
      let token = process.env.REACT_APP_ADMIN_TOKEN;

      //   const { data } = await axios.get(
      //     `${API_URL}/admin/get_rejected_students`,
      //     {
      //       headers: { Authentication: token },
      //     }
      //   );
      //   if (data?.success) {
      //     dispatch(setRejectedStudents(data?.students));
      //   } else {
      //     toast.error(data.msg);
      //   }
      toast.success("working");
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
