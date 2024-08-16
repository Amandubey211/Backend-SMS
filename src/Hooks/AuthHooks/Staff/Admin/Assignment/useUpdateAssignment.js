import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";

const useUpdateAssignment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  const logFormData = (formData) => {
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  };

  const updateAssignment = useCallback(
    async (assignmentId, assignmentData, sectionId) => {
      const {
        name,
        points,
        grade,
        submissionType,
        allowedAttempts,
        allowNumberOfAttempts,
        assignTo,
        availableFrom,
        dueDate,
        content,
        classId,
        subjectId,
        moduleId,
        chapterId,
        publish,
        thumbnail,
      } = assignmentData;
      // const {
      const missingFields = [];

      // if (!name) missingFields.push("Assignment Name");
      // if (!content) missingFields.push("Content");
      // if (!points) missingFields.push("Points");
      // if (!grade) missingFields.push("Grade");
      // if (!submissionType) missingFields.push("Submission Type");
      // if (!allowedAttempts) missingFields.push("Allowed Attempts");
      // if (!allowNumberOfAttempts) missingFields.push("Number of Attempts");
      if (!assignTo) missingFields.push("Assign To");
      // if (!sectionId) missingFields.push("Section");
      // if (!dueDate) missingFields.push("Due Date");
      // if (!availableFrom) missingFields.push("Available From");

      if (missingFields.length > 0) {
        toast.error(
          `Please fill out the following fields: ${missingFields.join(", ")}`
        );
        return { success: false, error: "Validation Error" };
      }
      setLoading(true);
      setError(null);

      const token = localStorage.getItem(`${role}:token`);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("points", points);
      formData.append("grade", grade);
      formData.append("submissionType", submissionType);
      formData.append("allowedAttempts", allowedAttempts);

      // Only append allowNumberOfAttempts if it's a valid number
      if (
        allowNumberOfAttempts !== null &&
        allowNumberOfAttempts !== undefined
      ) {
        formData.append("allowNumberOfAttempts", allowNumberOfAttempts);
      }

      formData.append("assignTo", assignTo);
      if (sectionId) {
        formData.append("sectionId", sectionId);
      }
      formData.append("availableFrom", availableFrom);
      formData.append("dueDate", dueDate);
      formData.append("content", content);
      formData.append("classId", classId);
      formData.append("subjectId", subjectId);
      if (moduleId) {
        formData.append("moduleId", moduleId);
      }
      if (chapterId) {
        formData.append("chapterId", chapterId);
      }
      formData.append("publish", publish);
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      logFormData(formData);

      try {
        const response = await axios.put(
          `${baseUrl}/admin/update_assignment/${assignmentId}`,
          formData,
          {
            headers: {
              Authentication: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const { data } = response.data;

        console.log(data);
        setLoading(false);
        toast.success("Assignment updated successfully");
        return { success: true, data };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to update assignment";
        toast.error(errorMessage);
        setLoading(false);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [role]
  );

  return { updateAssignment, loading, error };
};

export default useUpdateAssignment;
