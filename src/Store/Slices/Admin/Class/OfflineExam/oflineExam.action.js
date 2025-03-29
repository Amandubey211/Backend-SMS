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
import toast from "react-hot-toast";

export const fetchAllOfflineExam = createAsyncThunk(
  "subject/offline_get_exam",
  async (
    { classId, subjectId, query = "", page = 1, limit = 10, startDate = null, endDate = null },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const getRole = getUserRole(getState);
      const say = getAY();
      const semesterId = getState().common.user.classInfo.selectedSemester.id;
      dispatch(setShowError(false));

      const isValidStartDate = startDate && !isNaN(new Date(startDate).getTime());
      const isValidEndDate = endDate && !isNaN(new Date(endDate).getTime());
      
      let queryParams = `${getRole}/offlineExam/class/${classId}/subject/${subjectId}?say=${say}&search=${query}&semesterId=${semesterId}&page=${page}&limit=${limit}`;

      if (isValidStartDate) {
        queryParams += `&startDate=${new Date(startDate).toISOString()}`;
      }

      if (isValidEndDate) {
        queryParams += `&endDate=${new Date(endDate).toISOString()}`;
      }

      const response = await getData(queryParams);

      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// oflineExam.action.js (excerpt)
export const createOfflineExam = createAsyncThunk(
  "subject/offline_create_exam",
  async ({ payload, cid, sid }, { rejectWithValue, dispatch, getState }) => {
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
        // New fields added to the payload
        resultsPublished: payload.resultsPublished,
        resultsPublishDate: payload.resultsPublishDate,
      };

      dispatch(setShowError(false));

      const response = await postData(
        `${getRole}/exam/create?say=${say}`,
        updatedPayload
      );
      dispatch(fetchAllOfflineExam({ classId: cid, subjectId: sid }));
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const UploadOfflineExamSheet = createAsyncThunk(
  "subject/offline_upload_exam_sheet",
  async ({ formData, cid, sid }, { rejectWithValue, dispatch, getState }) => {
    try {
      const semesterId = getState().common.user.classInfo.selectedSemester.id;
      formData.append("semesterId", semesterId);

      // Append new results fields if they are not already present
      if (!formData.has("resultsPublished")) {
        formData.append("resultsPublished", false);
      }
      if (!formData.has("resultsPublishDate")) {
        formData.append("resultsPublishDate", null);
      }

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
      dispatch(fetchAllOfflineExam({ classId: cid, subjectId: sid }));
      toast.success(response.message);
      return response;
    } catch (error) {
      toast.error(error.message);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const UpdateOfflineExamCard = createAsyncThunk(
  "subject/offline_update_exam_card",
  async (
    { payload, examId, cid, sid },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const getRole = getUserRole(getState);
      const say = getAY();
      dispatch(setShowError(false));
      const response = await putData(
        `${getRole}/update/offlineExam/${examId}?say=${say}`,
        payload
      );
      dispatch(fetchAllOfflineExam({ classId: cid, subjectId: sid }));
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const UpdateOfflineExamStudent = createAsyncThunk(
  "subject/offline_update_exam_student",
  async (
    { payload, admissionNumber, subjectId, classId },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const getRole = getUserRole(getState);
      const say = getAY();
      dispatch(setShowError(false));
      console.log("payload update student", payload, admissionNumber);

      const response = await putData(
        `${getRole}/update/exam/${admissionNumber}?say=${say}`,
        payload
      );
      toast.success(response.message);
      dispatch(fetchAllOfflineExam({ classId: classId, subjectId: subjectId }));
      return response;
    } catch (error) {
      toast.error(error.message);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteOfflineExamCard = createAsyncThunk(
  "subject/offline_delete_exam_card",
  async ({ examId, cid, sid }, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      const say = getAY();
      dispatch(setShowError(false));
      const response = await deleteData(
        `${getRole}/delete/offlineExam/${examId}?say=${say}`
      );
      dispatch(fetchAllOfflineExam({ classId: cid, subjectId: sid }));
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteOfflineExamStudent = createAsyncThunk(
  "subject/offline_delete_exam_student",
  async (
    { subjectId, classId, admissionNumber, examId },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const getRole = getUserRole(getState);
      const say = getAY();
      dispatch(setShowError(false));

      const response = await deleteData(
        `${getRole}/delete/exam/subject/${subjectId}/${admissionNumber}?say=${say}&examId=${examId}`
      );
      dispatch(fetchAllOfflineExam({ classId: classId, subjectId: subjectId }));
      toast.success(response.message);

      return response;
    } catch (error) {
      toast.success(error.message);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
