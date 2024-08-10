import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useDeleteSyllabus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { role } = useSelector((store) => store.Auth);

  const deleteSyllabus = useCallback(
    async (syllabusId) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.delete(
          `${baseUrl}/admin/syllabus/${syllabusId}`,
          {
            headers: {
              Authentication: token,
            },
          }
        );
        // if (response.data.success) {
        //   toast.success("Syllabus deleted successfully!");
        // } else {
        //   toast.error("Failed to delete syllabus");
        // }
        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to delete syllabus";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, baseUrl]
  );

  return { loading, error, deleteSyllabus };
};

export default useDeleteSyllabus;
