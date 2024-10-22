import { useState, useCallback } from "react";
import axios from "axios";

import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useGetAdminDashboardData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  const role = useSelector((store) => store.common.auth.role);
  

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
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch dashboard data";

      setLoading(false);
      setError(errorMessage);
    }
  }, [role, baseUrl]);

  return { loading, error, dashboardData, fetchAdminDashboardData };
};

export default useGetAdminDashboardData;
