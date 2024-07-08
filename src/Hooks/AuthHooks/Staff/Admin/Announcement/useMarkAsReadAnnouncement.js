import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const useMarkAsReadAnnouncement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;
  const { role } = useSelector((store) => store.Auth);

  const markAsReadAnnouncement = useCallback(
    async (announcementId) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        // backend  route is inconsistent
        const response = await axios.put(
          `${API_URL}/admin/markAsRead/announcement/${announcementId}/`,
          {},
          {
            headers: {
              Authentication: token,
            },
          }
        );

        if (response.data.status) {
          toast.success("Announcement marked as read!");
        } else {
          toast.error("Failed to mark announcement as read");
          setError("Failed to mark announcement as read");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to mark announcement as read";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, API_URL]
  );

  return { loading, error, markAsReadAnnouncement };
};

export default useMarkAsReadAnnouncement;
