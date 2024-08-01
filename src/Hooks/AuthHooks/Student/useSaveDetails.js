import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../../config/Common";

const useSaveDetails = () => {
  const [loading, setLoading] = useState(false);

  const saveDetails = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/student/student_register`,
        formData,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
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
