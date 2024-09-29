import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setClass } from "../../../../../Redux/Slices/Admin/ClassSlice";
import { setSubjects } from "../../../../../Redux/Slices/Admin/SubjectSlice";
import { baseUrl } from "../../../../../config/Common";

const useGetClassDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const role = useSelector((store) => store.common.auth.role);

  const dispatch = useDispatch();

  const fetchClassDetails = useCallback(
    async (classId) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(`${baseUrl}/admin/class/${classId}`, {
          headers: { Authentication: token },
        });
        dispatch(setClass(response.data?.data));
        console.log(response.data.data);
        dispatch(setSubjects(response.data?.data?.subjects));
        setLoading(false);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch class details";
        toast.error(errorMessage);
        setLoading(false);
        setError(errorMessage);
      }
    },
    [role, baseUrl, dispatch]
  );

  return { loading, error, fetchClassDetails };
};

export default useGetClassDetails;
