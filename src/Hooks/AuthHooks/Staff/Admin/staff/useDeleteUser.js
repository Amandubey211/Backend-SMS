import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";
import useGetAllStaff from "./useGetAllStaff";
import useGetAllTeachers from "../Teacher/useGetAllTeacher";

const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const  { fetchStaff} = useGetAllStaff();
  const {fetchTeachers} = useGetAllTeachers()
  const deleteUser = useCallback(
    async (uid) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const token = localStorage.getItem(`admin:token`);

        const response = await axios.delete(
          `${baseUrl}/admin/delete_staff/${uid}`,
          {
            headers: {
              Authentication: token,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          setSuccess(true);
          toast.success("User deactivated successfully");
  
            fetchTeachers()
      
            fetchStaff();
        } else {
          toast.error("Failed to deactivated User");
          setError("Failed to deactivated User");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error deactivated User";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [ baseUrl]
  );

  return { loading, error, success, deleteUser };
};

export default useDeleteUser;
