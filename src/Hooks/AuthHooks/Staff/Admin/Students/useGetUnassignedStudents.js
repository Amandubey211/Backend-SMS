import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
// import { setUnassignedStudents } from "../../../../Redux/Slices/Admin/StudentSlice"; // Make sure to create and import the correct slice

const useGetUnassignedStudents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const role = useSelector((store) => store.Auth.role);
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();

  const fetchUnassignedStudents = useCallback(
    async (sectionId) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(
          `${API_URL}/admin/unassignedStudent/${sectionId}`,
          {
            headers: { Authentication: token },
          }
        );
        console.log(response.data);
        // if(response.data)
        // dispatch(setUnassignedStudents(response.data.data));
        setLoading(false);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch unassigned students";
        toast.error(errorMessage);
        setLoading(false);
        setError(errorMessage);
      }
    },
    [API_URL, role]
  );

  return { loading, error, fetchUnassignedStudents };
};

export default useGetUnassignedStudents;
