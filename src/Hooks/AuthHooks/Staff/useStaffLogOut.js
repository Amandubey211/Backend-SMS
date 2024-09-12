import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setAcademicYear,
  setAuth,
  setRole,
  setUserDetails,
} from "../../../Redux/Slices/Auth/AuthSlice.js";
import toast from "react-hot-toast";
import {
  setSelectedClass,
  setSelectedSubject,
  setSelectedModule,
  setSelectedAssignmentname,
  setSelectedSectionId,
  setSelectedSectionName,
  setStudentId,
} from "../../../Redux/Slices/Common/CommonSlice.js";
import { purgeStoredState } from "redux-persist";
import storage from "redux-persist/lib/storage"; // default: localStorage if web

const useStaffLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const staffLogout = async () => {
    // const roles = ["admin", "teacher", "accountant", "librarian", "peon"];

    // Clear local storage and Redux state
    localStorage.clear();
    dispatch(setAuth(false));
    dispatch(setRole(null));
    dispatch(setAcademicYear({}));
    dispatch(setUserDetails(null));
    dispatch(setSelectedClass(null));
    dispatch(setSelectedSubject(null));
    dispatch(setSelectedModule(null));
    dispatch(setSelectedAssignmentname(null));
    dispatch(setSelectedSectionId(null));
    dispatch(setSelectedSectionName(null));
    dispatch(setStudentId(null));

    // Clear persisted state
    await purgeStoredState({ storage });

    // Navigate to login page
    navigate("/stafflogin");

    // Show success message
    toast.success("Logged out successfully", {
      position: "bottom-left",
    });
  };

  return {
    staffLogout,
  };
};

export default useStaffLogout;
