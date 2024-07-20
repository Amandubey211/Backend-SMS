import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const useGetAdminDashboardData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  const role = useSelector((store) => store.Auth.role);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchAdminDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(`${API_URL}/admin/dashboard`, {
        headers: { Authentication: token },
      });

      setDashboardData(response.data);
      setLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch dashboard data";
      toast.error(errorMessage);
      setLoading(false);
      setError(errorMessage);
    }
  }, [role, API_URL]);

  return { loading, error, dashboardData, fetchAdminDashboardData };
};

export default useGetAdminDashboardData;
