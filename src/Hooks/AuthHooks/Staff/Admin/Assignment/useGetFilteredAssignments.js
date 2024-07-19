import { useState, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setAssignment } from "../../../../../Redux/Slices/Admin/SubjectSlice";

const useGetFilteredAssignments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const dispatch = useDispatch();
  const role = useSelector((store) => store.Auth.role);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchFilteredAssignments = useCallback(
    async (sid, moduleId, chapterId, publish) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const params = {};

        if (moduleId) params.moduleId = moduleId;
        if (chapterId) params.chapterId = chapterId;
        if (publish !== null) params.publish = publish;

        const response = await axios.get(
          `${API_URL}/admin/assignments/${sid}`,
          {
            headers: {
              Authentication: token,
            },
            params,
          }
        );

        if (response.data && response.data.success) {
          setAssignments(response.data.assignments);
          dispatch(setAssignment(response.data.assignments));
        } else {
          setError(response.data.msg || "Failed to fetch assignments.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error in fetching assignments");
      } finally {
        setLoading(false);
      }
    },
    [role, API_URL, dispatch]
  );

  return { loading, error, assignments, fetchFilteredAssignments };
};

export default useGetFilteredAssignments;
