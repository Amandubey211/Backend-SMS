import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../config/Common";

const useFetchPageById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(null);

  
  const { role } = useSelector((store) => store.Auth);
  const { pid } = useParams();

  const fetchPageById = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(
        `${baseUrl}/admin/api/pages/${pid}`,
        {
          headers: { Authentication: token },
        }
      );
console.log(response.data)
      if (response.data.success) {
        setPage(response.data.data);
      } else {
        toast.error("Failed to fetch page");
        setError("Failed to fetch page");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error fetching page";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [role, baseUrl, pid]);

  return { loading, error, fetchPageById, page };
};

export default useFetchPageById;
