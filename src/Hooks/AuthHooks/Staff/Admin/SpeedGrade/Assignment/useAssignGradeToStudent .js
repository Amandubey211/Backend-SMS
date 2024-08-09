import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../../config/Common";

const useAssignGradeToStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const assignGrade = useCallback(
    async ({ studentId, assignmentId, grade, attemptDate, status }) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.put(
          `${baseUrl}/admin/speed_grade/grade`,
          { studentId, assignmentId, grade, attemptDate, status },
          {
            headers: { Authentication: token },
          }
        );

        if (response.data.success) {
          toast.success("Student graded successfully");
          return response.data.data;
        } else {
          toast.error(
            response.data.message || "Failed to assign grade. Please try again."
          );
          return null;
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to assign grade";
        toast.error(errorMessage);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [role]
  );

  return { loading, error, assignGrade };
};

export default useAssignGradeToStudent;
