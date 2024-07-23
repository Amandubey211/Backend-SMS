// Hooks/ClassHooks/Teacher/useChangePassword.js
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";
const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  
  const ChangePassword = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      console.log(token);
      const response = await axios.put(`${baseUrl}/api/password/change-password`, data, {
        headers: { Authentication: token },
      });
      setLoading(false);
      if(response.data.success){
        toast.success("Password updated successfully!");
      }
      return response.data;
    } catch (err) {
      toast.error('Current password is wrong');
      setLoading(false);
      setError(err.message);
    }
  };

  return { ChangePassword, loading, error };
};

export default useChangePassword;
