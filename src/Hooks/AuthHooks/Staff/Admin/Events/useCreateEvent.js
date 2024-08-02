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

    const tokenKey = `${role}:token`;
    const token = localStorage.getItem(tokenKey);

    if (!token) {
      setError("Authentication token not found.");
      toast.error("Authentication failed: No token found.");
      setLoading(false);
      return;
    }

    console.log("Creating event with data:", eventData);
    console.log("Token key:", tokenKey);
    console.log("Retrieved token:", token);

    const formData = new FormData();
    formData.append("title", eventData.eventName);
    formData.append("startDate", eventData.startDate);
    formData.append("endDate", eventData.endDate);
    formData.append("time", eventData.time);
    formData.append("type", eventData.eventType);
    formData.append("location", eventData.location);
    formData.append("director", eventData.eventDirector);
    formData.append("description", eventData.description);
    if (eventData.eventImage) {
      formData.append("image", eventData.eventImage);
    }

    // Log formData content
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    try {
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
      console.log("Event created successfully:", response.data);
      toast.success("Event created successfully!");
      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Failed to create event";
      console.error("Error during event creation:", err);
      toast.error(errorMessage);
      setError(errorMessage);
      setLoading(false);
    }
  }, [role]);

  return { loading, error, createEvent };
};

export default useCreateEvent;
