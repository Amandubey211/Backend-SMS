import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useCreateEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const createEvent = useCallback(async (eventData) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem(`${role}:token`);

    if (!token) {
      const errorMessage = "Authentication token not found.";
      setError(errorMessage);
      toast.error("Authentication failed: No token found.");
      setLoading(false);
      return;
    }
    
    try {
      const formData = new FormData();
      Object.entries(eventData).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      console.log(formData)
      const response = await axios.post(
        `${baseUrl}/admin/create_event`,
        formData,
        {
          headers: {
            Authentication: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Failed to create event";
      toast.error(errorMessage);
      setError(errorMessage);
      setLoading(false);
    }
  }, [role]);

  return { loading, error, createEvent };
};

export default useCreateEvent;
