import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSectionsList } from "../../../../../Redux/Slices/Admin/ClassSlice";

const useFetchSection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const role = useSelector((store) => store.Auth.role);
  const fetchSection = useCallback(
    async (sectionId) => {
      setLoading(true);
      setError(null);

      try {
        const API_URL = process.env.REACT_APP_API_URL;
        const token = localStorage.getItem(`${role}:token`); // Adjust based on your authentication setup
        const response = await axios.get(
          `${API_URL}/admin/getSectionByclass/${sectionId}`,
          {
            headers: { Authentication: token },
          }
        );

        const { data } = response.data;
        console.log(data);
        dispatch(setSectionsList(data));

        setLoading(false);
        return { success: true, data };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch section data";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [dispatch]
  );

  return { fetchSection, loading, error };
};

export default useFetchSection;
