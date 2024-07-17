import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const useAddUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const adminRole = useSelector((store) => store.Auth.role);
  const addUser = useCallback(
    
    async (userData) => {
      setLoading(true);
      setError(null);

      try {
        const API_URL = process.env.REACT_APP_API_URL;
        const token = localStorage.getItem(`${adminRole}:token`);

        const response = await axios.post(
          `${API_URL}/admin/staff_register`, // Adjust the API endpoint as needed
         userData,
          {
            headers: {       Authentication: token, },
          }
        );

        const { data } = response.data;

        console.log(data);
        setLoading(false);
        toast.success("User added successfully");
        return { success: true, data };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to add user";
        toast.error(errorMessage);
        setLoading(false);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [adminRole]
  );

  return { addUser, loading, error };
};

export default useAddUser;
