import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../../../../config/Common";
import { useParams } from "react-router-dom";
import { setAssignment } from "../../../../Redux/Slices/Student/SubjectSlice";

const useFetchAssignedAssignments = () => {
  const { selectedClass, selectedSection, selectedSubject } = useSelector(
    (state) => state.Common
  );
  const dispatch = useDispatch();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  const { cid, sid } = useParams(); // Assuming sid is the subject ID

  // Caching
  const cacheKey = useMemo(
    () => `assignments-${cid}-${selectedSection}-${sid}`,
    [cid, selectedSection, sid]
  );
  const cachedData = useMemo(
    () => JSON.parse(localStorage.getItem(cacheKey)),
    [cacheKey]
  );

  const fetchFilteredAssignments = useCallback(
    async (subjectId, moduleId = "", chapterId = "") => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem(`${role}:token`);
      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${baseUrl}/student/studentAssignment/class/${cid}`,
          {
            headers: { Authentication: token },
            params: { subjectId, moduleId, chapterId },
          }
        );

        if (response.data.success && response.data.data) {
          setAssignments(response.data.data);
          dispatch(setAssignment(response.data.data));

          localStorage.setItem(cacheKey, JSON.stringify(response.data.data)); // Cache the data
        } else {
          throw new Error(
            response.data.message || "Failed to fetch assignments"
          );
        }
      } catch (err) {
        setError(err.message || "Error fetching assignments");
      } finally {
        setLoading(false);
      }
    },
    [cid, role, cacheKey, dispatch]
  );

  useEffect(() => {
    if (cachedData) {
      setAssignments(cachedData);
      setLoading(false);
    } else {
      fetchFilteredAssignments(sid, "", "");
    }
  }, [sid, fetchFilteredAssignments, cachedData]);

  return {
    assignments,
    loading,
    error,
    fetchFilteredAssignments,
  };
};

export default useFetchAssignedAssignments;
