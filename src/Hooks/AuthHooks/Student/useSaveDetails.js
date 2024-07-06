import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setStep } from "../../../Redux/Slices/AuthSlice";
const useSaveDetails = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const saveDetails = async (studentDetails) => {
    setLoading(true);
    try {
      console.log(studentDetails)
      const { data } = await axios.post(
        `http://localhost:8080/student/student_register`,
        studentDetails
      );
      if (data.success) {
        toast.success(data.msg || "Data saved successfully");
        localStorage.setItem("email", studentDetails.email);
        dispatch(setStep(2));
      } else {
        toast.error(data.msg || "Something went wrong");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data.msg === "email already exists!"
      ) {
        toast.error("Email already exists!");
      } else {
        toast.error(error.response?.data.msg || "Something went wrong");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    saveDetails,
  };
};

export default useSaveDetails;
