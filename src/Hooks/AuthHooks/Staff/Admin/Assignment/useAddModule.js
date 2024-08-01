import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../config/Common";

const useAddModule = (fetchModules) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const role = useSelector((store) => store.Auth.role);
  const { sid } = useParams();

  const addModule = useCallback(
    async (name, thumbnail) => {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("subjectId", sid);
        if (thumbnail) {
          formData.append("thumbnail", thumbnail);
        }

        const response = await axios.post(
          `${baseUrl}/admin/add_module`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authentication: token, // Ensure the correct header is used
            },
          }
        );

        if (response.data && response.data.success) {
          setSuccess(response.data.msg);
          toast.success(response.data.msg);
          fetchModules(); // Refetch modules after adding
          return { success: true, msg: response.data.msg };
        } else {
          const errorMsg = response.data?.msg || "Failed to add module.";
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.msg || "Error in adding module.";
        toast.error(errorMessage);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [role, sid, fetchModules]
  );

  return { loading, error, success, addModule };
};

export default useAddModule;
