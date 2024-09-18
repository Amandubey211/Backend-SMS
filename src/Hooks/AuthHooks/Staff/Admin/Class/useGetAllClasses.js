import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setClassList } from "../../../../../Redux/Slices/Admin/ClassSlice";
import { baseUrl } from "../../../../../config/Common";

const useGetAllClasses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const role = useSelector((store) => store.common.auth.role);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(`${baseUrl}/admin/class`, {
        headers: { Authentication: token },
      });

      dispatch(setClassList(response.data.data));
      setLoading(false);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch classes";
      toast.error(errorMessage);
      setLoading(false);
      setError(errorMessage);
    }
  }, [dispatch, role, baseUrl]);

  return { loading, error, fetchClasses };
};

export default useGetAllClasses;
