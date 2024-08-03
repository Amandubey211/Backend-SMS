import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import FormData from "form-data";
import { baseUrl } from "../../../../../config/Common";

const useCreateAnnouncement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { role } = useSelector((store) => store.Auth);

  const createAnnouncement = useCallback(
    async (data, files) => {
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

        const response = await axios.post(
          `${baseUrl}/admin/announcement`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authentication: token,
            },
          }
        );
        if (response.data.status) {
          toast.success("Announcement created successfully!");
        } else {
          toast.error("Announcement not created");
          setError("Announcement not created");
        }

        return response.data.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to create announcement";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, baseUrl]
  );

  return { loading, error, createAnnouncement };
};

export default useCreateAnnouncement;
