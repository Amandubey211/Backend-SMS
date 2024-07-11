import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const useDeletePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;
  const { role } = useSelector((store) => store.Auth);
  const deletePage = useCallback(
    async (pid) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const token = localStorage.getItem(`${role}:token`);

        const response = await axios.delete(
          `${API_URL}/admin/api/pages/${pid}`,
          {
            headers: {
              Authentication: token,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          setSuccess(true);
          toast.success("Page deleted successfully");
        } else {
          toast.error("Failed to delete page");
          setError("Failed to delete page");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error deleting page";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, API_URL]
  );

  return { loading, error, success, deletePage };
};

export default useDeletePage;
