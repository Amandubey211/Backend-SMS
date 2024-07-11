import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const useFetchClassDiscussions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [discussions, setDiscussions] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;
  const { role } = useSelector((store) => store.Auth);
  const { cid } = useParams();

  const fetchClassDiscussions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(
        `${API_URL}/admin/getDiscussion/class/${cid}`,
        {
          headers: { Authentication: token },
        }
      );

      if (response.data) {
        setDiscussions(response.data.data);
      } else {
        toast.error("Failed to fetch discussions");
        setError("Failed to fetch discussions");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error fetching discussions";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [role, API_URL, cid]);

  return { loading, error, fetchClassDiscussions, discussions };
};

export default useFetchClassDiscussions;
