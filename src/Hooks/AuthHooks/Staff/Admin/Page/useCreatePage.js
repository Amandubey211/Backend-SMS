import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../config/Common";

const useCreatePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { role } = useSelector((store) => store.Auth);
  const { cid } = useParams();

  const createPage = useCallback(
    async (pageData) => {
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
        if (!token) {
          throw new Error("Authentication token is missing");
        }

        const response = await axios.post(
          `${baseUrl}/admin/api/pages/class/${cid}`,
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
          toast.success("Page created successfully");
        } else {
          toast.error("Failed to create page");
          setError("Failed to create page");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error creating page";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, baseUrl, cid]
  );

  return { loading, error, success, createPage };
};

export default useCreatePage;
