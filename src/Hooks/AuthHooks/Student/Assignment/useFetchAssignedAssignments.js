import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../../../../config/Common";
import { useParams } from "react-router-dom";
import { setAssignment } from "../../../../Redux/Slices/Student/SubjectSlice";

const useFetchAssignedAssignments = (sectionId) => {
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
    () => `assignments-${cid}-${sectionId}-${sid}`,
    [cid, sectionId, sid]
  );
  const cachedData = useMemo(
    () => JSON.parse(localStorage.getItem(cacheKey)),
    [cacheKey]
  );

  const fetchFilteredAssignments = useCallback(
    async (sectionId, moduleId, chapterId) => {
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
          // const response = await fetch(`http://localhost:8080/student/studentAssignment/class/${selectedClass}/section/${selectedSection}?subjectId=${selectedSubject}`, {

          `${baseUrl}/student/studentAssignment/class/${cid}/section/${sectionId}?subjectId=${selectedSubject}`,
          {
            headers: {
              Authentication: token,
            },
            params: {
              subjectId: sid,
              moduleId,
              chapterId,
            },
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
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [cid, role, sid, cacheKey]
  );

  useEffect(() => {
    if (cachedData) {
      setAssignments(cachedData);
      setLoading(false);
    } else {
      fetchFilteredAssignments(sectionId, "", "");
    }
  }, [sectionId, fetchFilteredAssignments, cachedData]);

  const memoizedAssignments = useMemo(() => assignments, [assignments]);

  return {
    assignments: memoizedAssignments,
    loading,
    error,
    fetchFilteredAssignments,
  };
};

export default useFetchAssignedAssignments;
