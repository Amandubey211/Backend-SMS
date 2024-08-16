import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useUpdatePinStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { role } = useSelector((store) => store.Auth);

  const updatePinStatus = useCallback(
    async (discussionId, isPinned) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.put(
          `${baseUrl}/admin/discussion/pinstatus/${discussionId}`,
          { isPinned },
          {
            headers: { Authentication: token },
          }
        );

        if (response.data.status) {
          toast.success(
            `Discussion ${isPinned ? "pinned" : "unpinned"} successfully`
          );
          return response.data.data; // Return the updated discussion data
        } else {
          toast.error(response.data.message || "Failed to update pin status");
          setError(response.data.message || "Failed to update pin status");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error updating pin status";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
      return null;
    },
    [role, baseUrl]
  );

  return { loading, error, updatePinStatus };
};

export default useUpdatePinStatus;
