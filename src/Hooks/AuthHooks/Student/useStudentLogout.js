import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setAuth,
  setRole,
  setUserDetails,
} from "../../../Redux/Slices/Auth/AuthSlice.js";
import toast from "react-hot-toast";

const useStudentLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const studentLogout = () => {
    localStorage.removeItem("student:token");

    dispatch(setAuth(false));
    dispatch(setRole(null));
    dispatch(setUserDetails({}));
    navigate("/studentlogin");

    toast.success("Logged out successfully", {
      position: "bottom-left",
    });
  };

  return {
    studentLogout,
  };
};

export default useStudentLogout;
