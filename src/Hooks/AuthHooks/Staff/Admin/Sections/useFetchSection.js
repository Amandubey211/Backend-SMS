import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSectionsList } from "../../../../../Redux/Slices/Admin/ClassSlice";
import { baseUrl } from "../../../../../config/Common";

const useFetchSection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const role = useSelector((store) => store.Auth.role);

  const fetchSection = useCallback(
    async (classId) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(
          `${baseUrl}/admin/getSectionByclass/${classId}`,
          {
            headers: { Authentication: token },
          }
        );

        const { data } = response.data;
        if (data.length > 0) {
          dispatch(setSectionsList(data));
        } else {
          dispatch(setSectionsList([]));
        }
        setLoading(false);
        return { success: true, data };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch section data";
        dispatch(setSectionsList([])); // Clear the sections list on error
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [dispatch, role]
  );

  return { fetchSection, loading, error };
};

export default useFetchSection;
