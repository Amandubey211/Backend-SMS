import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../Redux/Slices/AuthSlice.js";
import { useNavigate } from "react-router-dom";
const useTeacherLogin = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const teacherLogin = async (teacherDetails) => {
    try {
      setLoading(true);
      if (!teacherDetails) return;
      const { Email, Password } = teacherDetails;
      setTimeout(() => {
        dispatch(setAuth(true));
        setLoading(false);
        navigate("/dash");

        toast.success(`Teacher Logged In successfully ${Email},${Password}`, {
          position: "bottom-left",
        });
      }, 1000);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return {
    loading,
    teacherLogin,
  };
};

export default useTeacherLogin;
