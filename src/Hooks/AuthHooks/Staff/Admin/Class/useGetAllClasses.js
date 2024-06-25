import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setClassList } from "../../../../../Redux/Slices/Admin/ClassSlice";

const useGetAllClasses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const role = useSelector((store) => store.Auth.role);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(`${API_URL}/admin/class`, {
        headers: { Authentication: token },
      });

      dispatch(setClassList(response.data.data));
      console.log(response.data.data);
      setLoading(false);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch classes";
      toast.error(errorMessage);
      setLoading(false);
      setError(errorMessage);
    }
  }, [dispatch, role, API_URL]);

  return { loading, error, fetchClasses };
};

export default useGetAllClasses;
