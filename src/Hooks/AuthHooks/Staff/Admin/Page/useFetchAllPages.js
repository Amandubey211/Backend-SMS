import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../config/Common";

const useFetchAllPages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pages, setPages] = useState([]);

  
  const { role } = useSelector((store) => store.Auth);
  const { cid } = useParams();

  const fetchAllPages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(`${baseUrl}/admin/api/pages/class/pages/${cid}`, {
        headers: { Authentication: token },
      });
      console.log(response.data);
      if (response.data && response.data.success) {
        setPages(response.data.data);
      } else {
        toast.error("Failed to fetch pages");
        setError("Failed to fetch pages");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error fetching pages";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [role, baseUrl, cid]);

  return { loading, error, fetchAllPages, pages };
};

export default useFetchAllPages;
