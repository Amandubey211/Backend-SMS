import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuth } from "../../Redux/Slices/AuthSlice.js";
const useParentLogin = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const login = async (parentDetails) => {
    try {
      setLoading(true);
      if (!parentDetails) return;
      console.log(parentDetails);
      const { Email, Password } = parentDetails;

      setTimeout(() => {
        dispatch(setAuth(true));
        toast.success("logedin Successfully", { position: "bottom-left" });
        console.log(Email, Password);
        setLoading(false);
      }, 3000);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return {
    loading,
    login,
  };
};

export default useParentLogin;
