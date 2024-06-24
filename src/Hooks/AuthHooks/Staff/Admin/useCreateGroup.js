import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_URL;

const useCreateGroup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  const createGroup = async (groupData) => {
    setLoading(true);
    setError(null); // Reset error state before new request
    try {
      const token = localStorage.getItem(`${role}:token`); // Replace with your actual token key
      const { data } = await axios.post(`${API_URL}/admin/group`, groupData, {
        headers: { Authentication: token },
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { createGroup, loading, error };
};

export default useCreateGroup;
