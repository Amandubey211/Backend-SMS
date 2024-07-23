import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useMarkAsReadDiscussion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { role } = useSelector((store) => store.Auth);
  

  const markAsReadDiscussion = useCallback(
    async (discussionId) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.put(
          `${baseUrl}/admin/discussion/readstatus/${discussionId}`,
          {},
          {
            headers: { Authentication: token },
          }
        );

        if (response.data.status) {
          toast.success("Discussion marked as read");
          return response.data.data;
        } else {
          toast.error(response.data.message || "Failed to mark discussion as read");
          setError(response.data.message || "Failed to mark discussion as read");
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Error marking discussion as read";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, baseUrl]
  );

  return { loading, error, markAsReadDiscussion };
};

export default useMarkAsReadDiscussion;
