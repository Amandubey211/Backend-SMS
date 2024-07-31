import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

// Hook for updating a notice
const useUpdateNotice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const updateNotice = async (noticeId, updatedData) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem(`${role}:token`);
    try {
      const response = await axios.put(`${baseUrl}/admin/update/notice/${noticeId}`, updatedData, {
        headers: {
          Authentication: token,
        },
      });
      toast.success("Notice updated successfully");
      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update notice";
      toast.error(errorMessage);
      setLoading(false);
      setError(errorMessage);
    }
  };

  return { loading, error, updateNotice };
};

// Hook for deleting a notice
const useDeleteNotice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const deleteNotice = async (noticeId) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem(`${role}:token`);
    try {
      const response = await axios.delete(`${baseUrl}/admin/delete/notice/${noticeId}`, {
        headers: {
          Authentication: token,
        },
      });
      toast.success("Notice deleted successfully");
      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete notice";
      toast.error(errorMessage);
      setLoading(false);
      setError(errorMessage);
    }
  };

  return { loading, error, deleteNotice };
};

export { useUpdateNotice, useDeleteNotice };
