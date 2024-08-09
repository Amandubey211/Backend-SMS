import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../config/Common";

const useDeleteChapter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const role = useSelector((store) => store.Auth.role);
  const { sid } = useParams(); // Assuming subjectId is in the URL params

  const deleteChapter = useCallback(
    async (moduleId, chapterId) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const token = localStorage.getItem(`${role}:token`);

        const response = await axios.delete(
          `${baseUrl}/admin/subjects/${sid}/modules/${moduleId}/chapters/${chapterId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authentication: token,
            },
          }
        );

        if (response.data && response.data.success) {
          setSuccess(response.data.msg);
          toast.success(response.data.msg);
        } else {
          toast.error(response.data.msg || "Failed to delete chapter.");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.msg || "Error in deleting chapter";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, baseUrl, sid]
  );

  return { loading, error, success, deleteChapter };
};

export default useDeleteChapter;
