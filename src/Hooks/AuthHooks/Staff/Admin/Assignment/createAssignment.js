import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const useCreateAssignment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const createAssignment = useCallback(
    async (assignmentData) => {
      const {
        name,
        content,
        points,
        grade,
        submissionType,
        allowedAttempts,
        allowNumberOfAttempts,
        assignTo,
        sectionId,
        dueDate,
        availableFrom,
        thumbnail,
      } = assignmentData;

      const missingFields = [];

      if (!name) missingFields.push("Assignment Name");
      if (!content) missingFields.push("Content");
      if (!points) missingFields.push("Points");
      if (!grade) missingFields.push("Grade");
      if (!submissionType) missingFields.push("Submission Type");
      if (!allowedAttempts) missingFields.push("Allowed Attempts");
      if (!allowNumberOfAttempts) missingFields.push("Number of Attempts");
      if (!assignTo) missingFields.push("Assign To");
      if (!sectionId) missingFields.push("Section");
      if (!dueDate) missingFields.push("Due Date");
      if (!availableFrom) missingFields.push("Available From");

      if (missingFields.length > 0) {
        toast.error(`Please fill out the following fields: ${missingFields.join(", ")}`);
        return { success: false, error: "Validation Error" };
      }

      setLoading(true);
      setError(null);

      try {
        const API_URL = process.env.REACT_APP_API_URL;
        const token = localStorage.getItem(`${role}:token`);

        const response = await axios.post(
          `${API_URL}/admin/create_assignment`, // Adjust the API endpoint as needed
          assignmentData,
          {
            headers: {       Authentication: token, },
          }
        );

        const { data } = response.data;

        console.log(data);
        setLoading(false);
        toast.success("Assignment created successfully");
        return { success: true, data };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to create assignment";
        toast.error(errorMessage);
        setLoading(false);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [role]
  );

  return { createAssignment, loading, error };
};

export default useCreateAssignment;
