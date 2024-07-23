import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useGetAdminDashboardData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  const role = useSelector((store) => store.Auth.role);
  

  const fetchAdminDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(`${baseUrl}/admin/dashboard`, {
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
  }, [role, baseUrl]);

  return { loading, error, dashboardData, fetchAdminDashboardData };
};

export default useGetAdminDashboardData;
