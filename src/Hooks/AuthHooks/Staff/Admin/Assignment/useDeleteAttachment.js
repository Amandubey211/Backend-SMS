import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useDeleteAttachment = (fetchModules) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const role = useSelector((store) => store.Auth.role);

  const deleteAttachment = useCallback(
    async (chapterId, subjectId, fileUrl) => {
      // Renamed `fileUrls` to `fileUrl` to match the backend
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const token = localStorage.getItem(`${role}:token`);

        const response = await axios.put(
          `${baseUrl}/admin/removeChapterFiles`,
          {
            subjectId,
            chapterId,
            fileUrl, // Send single fileUrl to match the backend expectation
          },
          {
            headers: { Authentication: token },
          }
        );

        if (response.status === 200) {
          // Check for status code instead of `response.data.success`
          setSuccess(response.data.message);
          toast.success(response.data.message);
          fetchModules(); // Refetch modules after deleting the attachment
        } else {
          toast.error(response.data.message || "Failed to delete attachment.");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error in deleting attachment";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, baseUrl, fetchModules]
  );

  return { loading, error, success, deleteAttachment };
};

export default useDeleteAttachment;
