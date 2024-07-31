import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useGetGroupsByClassAndSection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const fetchGroupsByClassAndSection = useCallback(
    async (classId, sectionId) => {
      console.log(classId, sectionId);
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(
          `${baseUrl}/admin/group/class/${classId}/section/${sectionId}`,
          {
            headers: { Authentication: token },
          }
        );
        console.log(response.data);
        if (response.data.status) {
          return response.data.data;
        } else {
          toast.error("Failed to fetch groups. Please try again.");
          return [];
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch groups";
        toast.error(errorMessage);
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [baseUrl, role]
  );

  return { loading, error, fetchGroupsByClassAndSection };
};

export default useGetGroupsByClassAndSection;
