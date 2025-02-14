import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../../Utils/academivYear";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import {
  customRequest,
  deleteData,
  getData,
  postData,
  putData,
} from "../../../../../services/apiEndpoints";
import { getUserRole } from "../../../../../Utils/getRoles";

export const fetchAllOfflineExam = createAsyncThunk(
  "subject/offline_get_exam",
  async ({ classId, subjectId }, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      const say = getAY();
      dispatch(setShowError(false));

      const response = await getData(
        `${getRole}/offlineExam/class/${classId}/subject/${subjectId}?say=${say}`
      );

      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createOfflineExam = createAsyncThunk(
  "subject/offline_create_exam",
  async ({ payload }, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      const schoolId = getState().common.user.userDetails.schoolId;
      const semesterId = getState().common.user.classInfo.selectedSemester.id;
      const say = getAY();
      const updatedPayload = {
        ...payload,
        schoolId,
        semesterId,
        academicYearId: say,
      };

      console.log("semester id", semesterId);
      dispatch(setShowError(false));

      const response = await postData(
        `${getRole}/exam/create?say=${say}`,
        updatedPayload
      );
      console.log("response", response);

      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const UploadOfflineExamSheet = createAsyncThunk(
  "subject/offline_upload_exam_sheet",
  async (formData, { rejectWithValue, dispatch, getState }) => {
    try {
      const semesterId = getState().common.user.classInfo.selectedSemester.id;
      formData.append("semesterId", semesterId);
      const getRole = getUserRole(getState);
      const say = getAY();
      dispatch(setShowError(false));
      const response = await customRequest(
        "post",
        `${getRole}/exam/uploadExcel?say=${say}`,
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      );

      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const UpdateOfflineExamCard = createAsyncThunk(
  "subject/offline_update_exam_card",
  async ({ payload, examId }, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      const say = getAY();
      dispatch(setShowError(false));
      const response = await putData(
        `${getRole}/update/offlineExam/${examId}?say=${say}`,
        payload
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const UpdateOfflineExamStudentSheet = createAsyncThunk(
  "subject/offline_update_exam_student",
  async (
    { payload, admissionNumber },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const getRole = getUserRole(getState);
      const say = getAY();
      dispatch(setShowError(false));

      const response = await putData(
        `${getRole}/update/exam/${admissionNumber}?say=${say}`,
        payload
      );

      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteOfflineExamCard = createAsyncThunk(
  "subject/offline_delete_exam_card",
  async ({ examId }, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      const say = getAY();
      dispatch(setShowError(false));

      const response = await deleteData(
        `${getRole}/delete/offlineExam/${examId}?say=${say}`
      );

      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteOfflineExamStudentSheet = createAsyncThunk(
  "subject/offline_delete_exam_student",
  async (
    { subjectId, admissionNumber },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const getRole = getUserRole(getState);
      const say = getAY();
      dispatch(setShowError(false));

      const response = await deleteData(
        `${getRole}/delete/exam/subject/${subjectId}/${admissionNumber}?say=${say}`
      );

      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
