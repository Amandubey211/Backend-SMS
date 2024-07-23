import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useUpdateDiscussion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  
  const { role } = useSelector((store) => store.Auth);

  const updateDiscussion = useCallback(
    async (id, discussionData) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const formData = new FormData();

        for (const key in discussionData) {
          formData.append(key, discussionData[key]);
        }

        const response = await axios.put(
          `${baseUrl}/admin/updateDiscussion/${id}`,
          formData,
          {
            headers: {
              Authentication: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.status) {
          setSuccess(true);
          toast.success("Discussion updated successfully");
        } else {
          toast.error("Failed to update discussion");
          setError("Failed to update discussion");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error updating discussion";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, baseUrl]
  );

  return { loading, error, success, updateDiscussion };
};

export default useUpdateDiscussion;
