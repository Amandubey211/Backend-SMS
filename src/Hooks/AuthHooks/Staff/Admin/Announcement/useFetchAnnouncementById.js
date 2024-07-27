// useFetchAnnouncementById.js
import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useFetchAnnouncementById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [announcement, setAnnouncement] = useState(null);

  const { role } = useSelector((store) => store.Auth);

  const fetchAnnouncementById = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(
          `${baseUrl}/admin/announcement/${id}`,
          {
            headers: { Authentication: token },
          }
        );
        if (response.data.status) {
          console.log(response.data);
          setAnnouncement(response.data.data);
        } else {
          toast.error("Announcement not found");
          setError("Announcement not found");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch announcement";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role]
  );

  return { loading, error, fetchAnnouncementById, announcement };
};

export default useFetchAnnouncementById;
