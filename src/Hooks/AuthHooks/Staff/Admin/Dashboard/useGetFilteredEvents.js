import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const useGetFilteredEvents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);

  const role = useSelector((store) => store.Auth.role);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchFilteredEvents = useCallback(async (month, year) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(`${API_URL}/admin/dashboard/events`, {
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
  }, [role, API_URL]);

  return { loading, error, events, fetchFilteredEvents };
};

export default useGetFilteredEvents;
