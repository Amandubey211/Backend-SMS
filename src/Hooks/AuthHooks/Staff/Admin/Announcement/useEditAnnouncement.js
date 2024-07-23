import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import FormData from "form-data";
import { baseUrl } from "../../../../../config/Common";

const useEditAnnouncement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const { role } = useSelector((store) => store.Auth);

  const editAnnouncement = useCallback(
    async (id, data, files) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const formData = new FormData();

        for (const key in data) {
          formData.append(key, data[key]);
        }

        if (files && files.attachment) {
          formData.append("attachment", files.attachment);
        }

        const response = await axios.put(
          `${baseUrl}/admin/announcement/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authentication: token,
            },
          }
        );
        if (response.data.status) {
          toast.success("Announcement updated successfully!");
        } else {
          toast.error("Announcement not updated");
          setError("Announcement not updated");
        }

        return response.data.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to update announcement";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, baseUrl]
  );

  return { loading, error, editAnnouncement };
};

export default useEditAnnouncement;
