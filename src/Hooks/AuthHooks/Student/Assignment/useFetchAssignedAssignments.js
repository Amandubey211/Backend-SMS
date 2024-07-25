import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../config/Common";
import { useParams } from "react-router-dom";

const useFetchAssignedAssignments = (sectionId) => {
  const [assignments, setAssignments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  const { cid, sid } = useParams(); // Assuming sid is the subject ID

  // Caching
  const cacheKey = useMemo(() => `assignments-${cid}-${sectionId}-${sid}`, [cid, sectionId, sid]);
  const cachedData = useMemo(() => JSON.parse(localStorage.getItem(cacheKey)), [cacheKey]);

  useEffect(() => {
    const fetchAssignedAssignments = async () => {
      if (cachedData) {
        setAssignments(cachedData);
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem(`${role}:token`);
        if (!token) {
          throw new Error("Authentication token not found");
        }

        if (!sid) {
          throw new Error("Subject ID is required");
        }

        const response = await axios.get(
          `${baseUrl}/studentAssignment/class/${cid}/section/${sectionId}`, {
            headers: {
              Authentication: token,
            },
            params: {
              subjectId: sid,
            },
          }
        );

        if (response.data.success && response.data.data) {
          setAssignments(response.data.data);
          localStorage.setItem(cacheKey, JSON.stringify(response.data.data)); // Cache the data
        } else {
          throw new Error(response.data.message || "Failed to fetch assignments");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedAssignments();
  }, [sectionId, sid, role, cid, cachedData, cacheKey]);

  const memoizedAssignments = useMemo(() => assignments, [assignments]);

  return { assignments: memoizedAssignments, loading, error };
};

export default useFetchAssignedAssignments;
