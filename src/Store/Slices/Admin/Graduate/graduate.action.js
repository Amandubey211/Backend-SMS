import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorMsg, handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../Common/Alerts/alertsSlice";
import { getAY } from "../../../../Utils/academivYear";
import { getData, putData } from "../../../../services/apiEndpoints";



// Fetch Graduates
export const fetchGraduates = createAsyncThunk(
  "graduates/fetchGraduates",
  async (
    { batchStart, batchEnd, email, Q_Id, admissionNumber, page, limit },
    { rejectWithValue,  dispatch }
  ) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(`/admin/graduates/students?say=${say}`,
         { batchStart, batchEnd, email, Q_Id, admissionNumber, page, limit },
      );

      return {
        data: response.data,
        total: response.total,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
      };
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Demote Students
export const demoteStudents = createAsyncThunk(
  "students/demoteStudents",
  async ({ studentIds }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      
      const response = await putData(
        `/admin/demote/students?say=${say}`,
        { studentIds },
      );

      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
