import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../config/Common";

const useMoveChapter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const role = useSelector((store) => store.Auth.role);
  const { sid } = useParams();

  const moveChapter = useCallback(
    async (moduleId, chapterId, newIndex) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const token = localStorage.getItem(`${role}:token`);

        const response = await axios.put(
          `${baseUrl}/admin/subjects/${sid}/modules/${moduleId}/chapters/reorder`,
          { chapterId, newIndex },
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
          toast.error(response.data.msg || "Failed to move chapter.");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.msg || "Error in moving chapter";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, baseUrl, sid]
  );

  return { loading, error, success, moveChapter };
};

export default useMoveChapter;
