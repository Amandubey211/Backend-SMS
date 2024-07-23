import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../config/Common";

const useAddModule = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const role = useSelector((store) => store.Auth.role);
  
  const { sid } = useParams();

  const addModule = useCallback(
    async (name, thumbnail) => {
        console.log(name,thumbnail)
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
              Authentication: token,
            },
          }
        );

        if (response.data && response.data.success) {
          setSuccess(response.data.msg);
          toast.success(response.data.msg);
        } else {
          toast.error(response.data.msg || "Failed to add module.");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.msg || "Error in adding module";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, baseUrl, sid]
  );

  return { loading, error, success, addModule };
};

export default useAddModule;
