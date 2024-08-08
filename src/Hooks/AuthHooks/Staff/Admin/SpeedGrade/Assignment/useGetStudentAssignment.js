import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../../config/Common";

const useGetStudentAssignment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assignmentDetails, setAssignmentDetails] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const fetchStudentAssignment = useCallback(
    async (studentId, assignmentId) => {
      console.log(studentId, assignmentId, "sdfsdfxxxxxxxxxx");
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(
          `${baseUrl}/admin/speed_grade/assignment`,
          {
            headers: { Authentication: token },
            params: { studentId, assignmentId },
          }
        );

        if (response.data.success) {
          setAssignmentDetails(response.data.data); // Store the assignment details in local state
          return response.data.data;
        } else {
          toast.error(
            response.data.message ||
              "Failed to fetch assignment details. Please try again."
          );
          return null;
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch assignment details";
        // toast.error(errorMessage);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [baseUrl, role]
  );

  return { loading, error, assignmentDetails, fetchStudentAssignment };
};

export default useGetStudentAssignment;
