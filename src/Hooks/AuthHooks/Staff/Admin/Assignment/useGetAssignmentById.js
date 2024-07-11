import { useState, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// import { setAssignment } from "../../../../../Redux/Slices/Admin/SubjectSlice";

const useGetAssignmentById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assignment, setAssignment] = useState(null);
  //   const dispatch = useDispatch();
  const { aid } = useParams();
  const role = useSelector((store) => store.Auth.role);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchAssignmentById = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(`${API_URL}/admin/assignment/${aid}`, {
        headers: {
          Authentication: token,
        },
      });
      console.log(response.data);
      if (response.data && response.data.success) {
        setAssignment(response.data.assignment);
        // dispatch(setAssignment(response.data.assignment));
      } else {
        setError(response.data.msg || "Failed to fetch assignment.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error in fetching assignment");
    } finally {
      setLoading(false);
    }
  }, [role, API_URL]);

  return { loading, error, assignment, fetchAssignmentById };
};

export default useGetAssignmentById;
