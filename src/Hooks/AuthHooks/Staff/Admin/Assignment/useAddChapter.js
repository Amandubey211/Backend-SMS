import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../config/Common";

const useAddChapter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const role = useSelector((store) => store.Auth.role);
  
  const { sid } = useParams(); // Assuming subjectId and moduleId are in the URL params

  const addChapter = useCallback(
    async (name, thumbnail,moduleId) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("subjectId", sid);
        formData.append("moduleId", moduleId);
        if (thumbnail) {
          formData.append("thumbnail", thumbnail);
        }

        const response = await axios.post(
          `${baseUrl}/admin/add_chapter`,
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
          toast.error(response.data.msg || "Failed to add chapter.");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.msg || "Error in adding chapter";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, baseUrl, sid]
  );

  return { loading, error, success, addChapter };
};

export default useAddChapter;
