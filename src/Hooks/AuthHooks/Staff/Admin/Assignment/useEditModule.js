import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../config/Common";

const useEditModule = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const role = useSelector((store) => store.Auth.role);
  const { sid } = useParams(); // Assuming subjectId is in the URL params

  const editModule = useCallback(
    async (moduleId, name, thumbnail) => {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const formData = new FormData();
        formData.append("name", name);

        if (thumbnail) {
          formData.append("thumbnail", thumbnail);
        }

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authentication: token,
          },
        };

        const response = await axios.put(
          `${baseUrl}/admin/subjects/${sid}/modules/${moduleId}`,
          formData,
          config
        );

        const { data } = response;
        if (data.success) {
          setSuccess(data.msg);
          toast.success(data.msg);
        } else {
          throw new Error(data.msg || "Failed to edit module.");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.msg || err.message || "Error editing module";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, baseUrl, sid]
  );

  return { loading, error, success, editModule };
};

export default useEditModule;
