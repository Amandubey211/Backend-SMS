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
      let token =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFtYW5AZ21haWwuY29tIiwidXNlcklkIjoiNjY1NWRkZTZkZTQ1ZDMzNjIxODA3Y2U0Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzE2OTYwNzMwLCJleHAiOjE3MTcwNDcxMzB9.Z-aO2RPjeIfuon-OpFCQC7mJgkkAjO73B2vyTFfiIyY";
      const { data } = await axios.post(
        `${API_URL}/admin/create_class`,
        classData,
        {
          headers: { Authentication: token },
        }
      );
      if (data?.success) {
        console.log(data);
        toast.success("class Created");
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
