import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useGetNotices = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notices, setNotices] = useState([]);

  const role = useSelector((store) => store.Auth.role);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(`${baseUrl}/admin/dashboard/notices`, {
        headers: { Authentication: token },
      });

      setNotices(response.data.notices);
      setLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch notices";
      toast.error(errorMessage);
      setLoading(false);
      setError(errorMessage);
    }
  }, [role, baseUrl]);

  return { loading, error, notices, fetchNotices };
};

export default useGetNotices;
