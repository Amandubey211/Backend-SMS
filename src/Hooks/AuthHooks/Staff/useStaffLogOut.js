import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setAuth,
  setRole,
  setUerDetails,
} from "../../../Redux/Slices/Auth/AuthSlice.js";
import toast from "react-hot-toast";

const useStaffLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const staffLogout = () => {
    const roles = ["admin", "teacher", "accountant", "librarian", "peon"];
    localStorage.clear()
    dispatch(setAuth(false));
    dispatch(setRole(null));
    dispatch(setUerDetails(null));
    navigate("/stafflogin");

    toast.success("Logged out successfully", {
      position: "bottom-left",
    });
  };

  return {
    staffLogout,
  };
};

export default useStaffLogout;
