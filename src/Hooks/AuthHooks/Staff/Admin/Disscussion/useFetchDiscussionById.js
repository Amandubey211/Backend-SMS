import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const useFetchDiscussionById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [discussion, setDiscussion] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;
  const { role } = useSelector((store) => store.Auth);
  const { did } = useParams();

  const fetchDiscussionById = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(
        `${API_URL}/admin/getDiscussionById/${did}`,
        {
          headers: { Authentication: token },
        }
      );

      if (response.data.status) {
        setDiscussion(response.data.data);
      } else {
        toast.error("Failed to fetch discussion");
        setError("Failed to fetch discussion");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error fetching discussion";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [role, API_URL, did]);

  return { loading, error, fetchDiscussionById, discussion };
};

export default useFetchDiscussionById;
