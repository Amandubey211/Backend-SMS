import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setClassList } from "../../../Redux/Slices/AdminSlice";
import { baseUrl } from "../../../config/Common";

const useGetAllClassList = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const getClassList = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem(
        process.env.REACT_APP_ADMIN_TOKEN_STORAGE_KEY
      );

      const { data } = await axios.get(`${baseUrl}/admin/get_class`, {
        headers: { Authentication: token },
      });
      if (data?.success) {
        dispatch(setClassList(data?.classes));
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
    getClassList,
  };
};

export default useGetAllClassList;
