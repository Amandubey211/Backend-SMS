import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuth } from "../../Redux/Slices/AuthSlice.js";
const useStudentLogin = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const student = async (studentDetails) => {
    try {
      setLoading(true);
      if (!studentDetails) return;
      const { Email, Password } = studentDetails;
      setTimeout(() => {
        dispatch(setAuth(true));
        setLoading(false);
        toast.success("Logged In successfully", { position: "bottom-left" });
      }, 3000);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return {
    loading,
    student,
  };
};

export default useStudentLogin;
