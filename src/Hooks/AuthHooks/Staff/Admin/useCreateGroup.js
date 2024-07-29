import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../config/Common";
import toast from "react-hot-toast";



const useCreateGroup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  const createGroup = async (groupData) => {
    setLoading(true);
    setError(null); // Reset error state before new request
    try {
      const token = localStorage.getItem(`${role}:token`); // Replace with your actual token key
      const { data } = await axios.post(`${baseUrl}/admin/group`, groupData, {
        headers: { Authentication: token },
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateGroup = async (groupData, groupId) => {
    setLoading(true);
    setError(null); // Reset error state before new request
    try {
      const token = localStorage.getItem(`${role}:token`); // Replace with your actual token key
      const { data } = await axios.put(`${baseUrl}/admin/group/${groupId}`, groupData, {
        headers: { Authentication: token },
      });
      toast.success("Group updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (groupId) => {
    setLoading(true);
    setError(null); // Reset error state before new request
    try {
      const token = localStorage.getItem(`${role}:token`); // Replace with your actual token key
      const { data } = await axios.delete(`${baseUrl}/admin/group/:${groupId}`, {
        headers: { Authentication: token },
      });
      toast.success("Group deleted successfully!");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { createGroup, updateGroup, deleteGroup, loading, error };
};

export default useCreateGroup;
