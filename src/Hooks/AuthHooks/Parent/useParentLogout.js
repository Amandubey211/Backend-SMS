import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuth, setRole } from "../../../Redux/Slices/Auth/AuthSlice.js";
import toast from "react-hot-toast";

const useParentLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const parentLogout = () => {
    localStorage.clear();
    dispatch(setAuth(false));
    dispatch(setRole(null));
    navigate("/parentlogin");
    toast.success("Logged out successfully", {
      position: "bottom-left",
    });
  };

  return {
    parentLogout,
  };
};

export default useParentLogout;
