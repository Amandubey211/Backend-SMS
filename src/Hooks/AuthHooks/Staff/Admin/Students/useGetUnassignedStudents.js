import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useGetUnassignedStudents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.common.auth.role);

  const fetchUnassignedStudents = useCallback(
    async (classId) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(
          `${baseUrl}/admin/unassignedStudent/${classId}`,
          {
            headers: {
              Authentication: token,
            },
          }
        );
        console.log(response.data);

        if (response.data.status) {
          return response.data?.data;
        } else {
          toast.error("Please try again");
          return [];
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch unassigned students";
        toast.error(errorMessage);
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [baseUrl, role]
  );

  return { loading, error, fetchUnassignedStudents };
};

export default useGetUnassignedStudents;
