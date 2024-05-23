import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuth } from "../../Redux/Slices/AuthSlice.js";
import { useNavigate } from "react-router-dom";
const useQidVerification = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigage = useNavigate();
  const verify = async (studentDetails) => {
    try {
      setLoading(true);
      const { Email, Password } = studentDetails;
      setTimeout(() => {
        dispatch(setAuth(true));
        toast.success("Verifyed Successfully", { position: "bottom-left" });
        navigage("/dash");
        setLoading(false);
      }, 3000);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return {
    loading,
    verify,
  };
};

export default useQidVerification;
