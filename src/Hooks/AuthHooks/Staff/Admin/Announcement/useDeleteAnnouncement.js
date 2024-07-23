import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../../../config/Common";

const useDeleteAnnouncement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  
  const { role } = useSelector((store) => store.Auth);

  const deleteAnnouncement = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.delete(
          `${baseUrl}/admin/announcement/${id}`,
          {
            headers: {
              Authentication: token,
            },
          }
        );

        if (response.data.status) {
          toast.success("Announcement and related comments deleted successfully!");
          navigate(-1); // Navigate back after deletion
        } else {
          toast.error("Announcement not Deleted");
          setError("Announcement not Deleted");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to delete announcement";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, baseUrl, navigate]
  );

  return { loading, error, deleteAnnouncement };
};

export default useDeleteAnnouncement;
