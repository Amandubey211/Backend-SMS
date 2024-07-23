import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const useSaveDetails = () => {
  const [loading, setLoading] = useState(false);

  const saveDetails = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/student/student_register`, formData);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      toast.error("Error saving student details");
      console.error(error);
    }
  };

  return {
    loading,
    saveDetails,
  };
};

export default useSaveDetails;
