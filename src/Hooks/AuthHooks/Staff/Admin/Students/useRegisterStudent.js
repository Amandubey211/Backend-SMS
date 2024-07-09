import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const useRegisterStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const role = useSelector((store) => store.Auth.role);
  const API_URL = process.env.REACT_APP_API_URL;

  const registerStudent = useCallback(
    async (studentData) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const formData = new FormData();
        Object.keys(studentData).forEach((key) => {
          formData.append(key, studentData[key]);
        });

        const response = await axios.post(
          `${API_URL}/register-student`,
          formData,
          {
            headers: {
              Authentication: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success(response.data.msg);
        setLoading(false);
      } catch (err) {
        const errorMessage =
          err.response?.data?.msg || "Failed to register student";
        toast.error(errorMessage);
        setLoading(false);
        setError(errorMessage);
      }
    },
    [API_URL, role]
  );

  return { loading, error, registerStudent };
};

export default useRegisterStudent;
