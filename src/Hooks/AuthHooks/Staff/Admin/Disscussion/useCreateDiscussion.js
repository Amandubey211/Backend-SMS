import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const useCreateDiscussion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;
  const { role } = useSelector((store) => store.Auth);
  const { cid } = useParams();

  const createDiscussion = useCallback(
    async (discussionData) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const formData = new FormData();

        for (const key in discussionData) {
          formData.append(key, discussionData[key]);
        }

        const response = await axios.post(
          `${API_URL}/admin/createDiscussion/class/${cid}`,
          formData,
          {
            headers: {
              Authentication: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response.data);
        if (response.data.status) {
          setSuccess(true);
          toast.success("Discussion created successfully");
        } else {
          toast.error("Failed to create discussion");
          setError("Failed to create discussion");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error creating discussion";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, API_URL, cid]
  );

  return { loading, error, success, createDiscussion };
};

export default useCreateDiscussion;
