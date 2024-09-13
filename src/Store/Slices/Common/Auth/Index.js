import authReducer from "./reducers/authSlice";
import {
  staffLogin,
  staffLogout,
  createAcademicYear,
} from "./actions/staffActions";
import { parentLogin, parentLogout } from "./actions/parentActions";
import { qidVerification, studentLogout } from "./actions/studentActions";

export {
  authReducer,
  staffLogin,
  staffLogout,
  createAcademicYear,
  parentLogin,
  parentLogout,
  qidVerification,
  studentLogout,
};
