import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../../config/Common";

const useFetchCommentsByAnnouncement = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { aid: announcementId } = useParams();

  const { role } = useSelector((store) => store.Auth);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(
        `${baseUrl}/admin/getAnnouncementComment/${announcementId}`,
        {
          headers: { Authentication: token },
        }
      );

      if (response.data.status) {
        setComments(response.data.data);
      } else {
        toast.error("Failed to fetch comments");
        setError("Failed to fetch comments");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error fetching comments";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [announcementId, role]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, loading, error, fetchComments };
};

export default useFetchCommentsByAnnouncement;
