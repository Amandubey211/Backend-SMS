import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useGetEarningsData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [earningsData, setEarningsData] = useState(null);

  const role = useSelector((store) => store.Auth.role);

  const fetchEarningsData = useCallback(async (month, year, includeUnpaidExpenses) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(`${baseUrl}/admin/dashboard/earnings`, {
        headers: { Authentication: token },
        params: { month, year, includeUnpaidExpenses }
      });

      setEarningsData(response.data);
      setLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch earnings data";
      toast.error(errorMessage);
      setLoading(false);
      setError(errorMessage);
    }
  }, [role]);

  return { loading, error, earningsData, fetchEarningsData };
};

export default useGetEarningsData;
