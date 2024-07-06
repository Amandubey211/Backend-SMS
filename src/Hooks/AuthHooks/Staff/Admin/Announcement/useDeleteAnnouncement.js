import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const useDeleteAnnouncement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();

  const API_URL = process.env.REACT_APP_API_URL;
  const {
    role,
    userDetail: { userId },
  } = useSelector((store) => store.Auth);

  const deleteAnnouncement = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.delete(
          `${API_URL}/admin/announcement/${id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        toast.success("Announcement and related comments deleted successfully!");
        history.push("/announcements"); // Navigate to the announcements page
        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to delete announcement";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, API_URL, history]
  );

  return { loading, error, deleteAnnouncement };
};

export default useDeleteAnnouncement;
