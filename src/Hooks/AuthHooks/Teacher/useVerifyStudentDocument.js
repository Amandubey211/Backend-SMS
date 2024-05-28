import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
const API_URL = process.env.REACT_APP_API_URL;
const TOKEN_STORAGE_KEY = process.env.REACT_APP_TOKEN_STORAGE_KEY;

const useVerifyStudentDocument = () => {
  const [loading, setLoading] = useState(false);
  const verifyDocument = async (verificationDetails) => {
    setLoading(true);

    try {
      const token = "bearer" + " " + localStorage.getItem(TOKEN_STORAGE_KEY);
      const { data } = await axios.put(
        `${API_URL}/admin/verify_student_info`,
        verificationDetails,
        { headers: { Authentication: token } }
      );
      if (data.success) {
        toast.success(data.msg || "Verified");
      } else {
        toast.error("Not Verified");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    verifyDocument,
  };
};

export default useVerifyStudentDocument;
