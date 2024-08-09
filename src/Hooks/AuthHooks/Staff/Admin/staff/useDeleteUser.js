import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";
import useGetAllStaff from "./useGetAllStaff";

const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const  { fetchStaff} = useGetAllStaff()
  const { role } = useSelector((store) => store.Auth);
  const deleteUser = useCallback(
    async (uid) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const token = localStorage.getItem(`${role}:token`);

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
          toast.success("User deleted successfully");
          fetchStaff()
        } else {
          toast.error("Failed to delete User");
          setError("Failed to delete User");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error deleting User";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, baseUrl]
  );

  return { loading, error, success, deleteUser };
};

export default useDeleteUser;
