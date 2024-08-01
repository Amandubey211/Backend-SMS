import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useUpdatePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { role } = useSelector((store) => store.Auth);

  const updatePage = useCallback(
    async (pageId, pageData) => {
      const { title, content } = pageData;

      // Validate required fields
      if (!title.trim() || !content.trim()) {
        toast.error("Title and content are required");
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const token = localStorage.getItem(`${role}:token`);

        const response = await axios.put(
          `${baseUrl}/admin/api/pages/${pageId}`,
          pageData,
          {
            headers: {
              Authentication: token,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          setSuccess(true);
          toast.success("Page updated successfully");
        } else {
          toast.error("Failed to update page");
          setError("Failed to update page");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error updating page";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, baseUrl]
  );

  return { loading, error, success, updatePage };
};

export default useUpdatePage;
