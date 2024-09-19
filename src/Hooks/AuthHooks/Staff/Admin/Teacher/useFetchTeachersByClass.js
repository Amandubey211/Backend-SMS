import { useState, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setTeacherAssign } from "../../../../../Redux/Slices/Admin/ClassSlice";
import { baseUrl } from "../../../../../config/Common";

const useFetchTeachersByClass = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.common.auth.role);
  const dispatch = useDispatch();

  const fetchTeachersByClass = useCallback(
    async (classId) => {
      setLoading(true);
      setError(null); // Reset error state before new request
      try {
        const token = localStorage.getItem(`${role}:token`);
        const { data } = await axios.get(`${baseUrl}/admin/teacherByClass`, {
          params: { id: classId },
          headers: { Authentication: token },
        });
        dispatch(setTeacherAssign(data.data));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    },
    [role, dispatch]
  );

  return { fetchTeachersByClass, loading, error };
};

export default useFetchTeachersByClass;
