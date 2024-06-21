import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const useAssignTeacher = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  const API_URL = process.env.REACT_APP_API_URL;

  const assignTeacher = async (assignData) => {
    setLoading(true);
    setError(null);
    try {
      const schoolId = useSelector((store) => store.Auth.schoolId); // Assuming schoolId is in the Auth slice
      const token = localStorage.getItem(`${role}:token`);

      const response = await axios.post(
        `${API_URL}/assignTeacher`,
        assignData,
        {
          headers: { Authentication: token },
        }
      );

      toast.success("Teacher assigned successfully!");
      console.log(response.data.data);
      setLoading(false);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to assign teacher";
      toast.error(errorMessage);
      setLoading(false);
      setError(errorMessage);
      throw new Error(errorMessage); // Ensuring the error is thrown for the caller to handle
    }
  };

  return { assignTeacher, loading, error };
};

export default useAssignTeacher;
