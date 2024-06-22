import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useFetchTeachersByClass from "./useFetchTeachersByClass";

const useAssignTeacher = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  const API_URL = process.env.REACT_APP_API_URL;
const {cid} = useParams()
const {fetchTeachersByClass} = useFetchTeachersByClass()
  const assignTeacher = async (assignData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);

      const response = await axios.post(
        `${API_URL}/admin/teacher`,
        assignData,
        {
          headers: { Authentication: token },
        }
      );

      toast.success("Teacher assigned successfully!");
      console.log(response.data,"sdfsdf");
      fetchTeachersByClass(cid)
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
