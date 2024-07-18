import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const useFetchCommentsByDiscussion = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { did: discussionId } = useParams();
  const API_URL = process.env.REACT_APP_API_URL;
  const { role } = useSelector((store) => store.Auth);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(
        `${API_URL}/admin/getDiscussionComment/${discussionId}`,
        {
          headers: { Authentication: token },
        }
      );
console.log(response.data)
      if (response.data.status) {
        setComments(response.data.data);
        console.log(comments)
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
  }, [API_URL, discussionId, role]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, loading, error, fetchComments };
};

export default useFetchCommentsByDiscussion;
