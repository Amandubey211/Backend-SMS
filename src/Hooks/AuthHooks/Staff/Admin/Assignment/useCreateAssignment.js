import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../config/Common";

const useCreateAssignment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const role = useSelector((store) => store.Auth.role);
  
  const createAssignment = useCallback(
    async (assignmentData) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const formData = new FormData();

        // Append assignment data to formData
        for (const key in assignmentData) {
          if (
            assignmentData[key] !== undefined &&
            assignmentData[key] !== null
          ) {
            if (key === "thumbnail" && assignmentData[key] instanceof File) {
              formData.append(key, assignmentData[key]);
            } else {
              formData.append(key, assignmentData[key]);
            }
          }
        }
        console.log(formData);
        // const response = await axios.post(
        //   `${baseUrl}/admin/create_assignment`,
        //   formData,
        //   {
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //       Authentication: token,
        //     },
        //   }
        // );

        // if (response.data && response.data.success) {
        //   setSuccess(response.data.msg);
        //   toast.success(response.data.msg);
        // } else {
        //   toast.error(response.data.msg || "Failed to create assignment.");
        // }
      } catch (err) {
        const errorMessage =
          err.response?.data?.msg || "Error in creating assignment";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, baseUrl]
  );

  return { loading, error, success, createAssignment };
};

export default useCreateAssignment;
