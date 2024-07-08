import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setClassList } from "../../../Redux/Slices/AdminSlice";

const useCreateClass = () => {
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  //   const dispatch = useDispatch();
  const createClass = async (classData) => {
    setLoading(true);

    try {
      const token = localStorage.getItem(
        process.env.REACT_APP_ADMIN_TOKEN_STORAGE_KEY
      );
      const { data } = await axios.post(
        `${API_URL}/admin/create_class`,
        classData,
        {
          headers: { Authentication: token },
        }
      );
      if (data?.success) {
        console.log(data);
        toast.success("Class Created");
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
    createClass,
  };
};

export default useCreateClass;
