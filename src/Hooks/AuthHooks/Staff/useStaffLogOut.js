import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuth, setRole } from "../../../Redux/Slices/AuthSlice.js";
import toast from "react-hot-toast";

const useStaffLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const staffLogout = () => {
    const roles = ["admin", "teacher", "accountant", "librarian", "peon"];
    roles.forEach(role => {
      localStorage.removeItem(`${role}:token`);
    });

    dispatch(setAuth(false));
    dispatch(setRole(null));
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
