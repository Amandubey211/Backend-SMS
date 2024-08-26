import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";
import { setGroupsList } from "../../../../../Redux/Slices/Admin/ClassSlice";

const useGetGroupsByClass = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  const dispatch = useDispatch();

  const fetchGroupsByClass = useCallback(
    async (classId) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(`${baseUrl}/admin/group/${classId}`, {
          headers: { Authentication: token },
        });

        if (response.data.success && response.data.data.length > 0) {
          dispatch(setGroupsList(response.data.data));
        } else {
          dispatch(setGroupsList([]));
          toast.error("No groups found for this class.");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch groups";
        setError(errorMessage);
        dispatch(setGroupsList([])); // Clear the groups list on error
      } finally {
        setLoading(false);
      }
    },
    [dispatch, role]
  );

  return { loading, error, fetchGroupsByClass };
};

export default useGetGroupsByClass;
