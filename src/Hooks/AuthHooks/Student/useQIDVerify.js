import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setRole } from "../../../Redux/Slices/AuthSlice";
import { useDispatch } from "react-redux";
const TOKEN_STORAGE_KEY = process.env.REACT_APP_STUDENT_TOKEN_STORAGE_KEY;
const useQidVerification = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const verify = async (studentDetails) => {
    try {
      setLoading(true);
      const { addmissionNumber, Q_Id } = studentDetails;
      if (!addmissionNumber || !Q_Id)
        return toast.error("Please provide all the details");
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);

      const { data } = await axios.post(
        `http://localhost:8080/student/verify_school_id`,
        studentDetails,
        { headers: { Authentication: token } }
      );

      if (data.success) {
        dispatch(setRole("student"));
        toast.success("Verified successfully");
        navigate("/student_dash");
      } else {
        toast.error(data.msg || "Verification unsuccessful");
      }
    } catch (error) {
      // Handle specific error messages from the backend
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
    verify,
  };
};

export default useQidVerification;
