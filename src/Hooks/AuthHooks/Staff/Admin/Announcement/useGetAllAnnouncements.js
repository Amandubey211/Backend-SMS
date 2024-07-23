import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useGetAllAnnouncements = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [announcementData, setAnnouncementData] = useState([]);

  
  const {
    role,
    userDetail: { userId },
  } = useSelector((store) => store.Auth);

  const fetchAnnouncements = useCallback(
    async (classId) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(
          `${baseUrl}/admin/announcement/class/${classId}`,
          {
            headers: { Authentication: token },
          }
        );

        setAnnouncementData(response.data.data);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch announcements";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, baseUrl]
  );

  return { loading, error, fetchAnnouncements, announcementData };
};

export default useGetAllAnnouncements;
