import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useGetFilteredEvents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);

  const role = useSelector((store) => store.common.auth.role);
  
  

  const fetchFilteredEvents = useCallback(async (month, year) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(`${baseUrl}/admin/dashboard/events`, {
        headers: { Authentication: token },
        params: { month, year },
      });

      setEvents(response.data.data);
      setLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch events";
      toast.error(errorMessage);
      setLoading(false);
      setError(errorMessage);
    }
  }, [role, baseUrl]);

  return { loading, error, events, fetchFilteredEvents };
};

export default useGetFilteredEvents;
