// src/hooks/useGetAllTeachers.js

import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setTeachers } from "../../../../Redux/Slices/Admin/TeachersSlice";
const API_URL = process.env.REACT_APP_API_URL;
const useGetAllTeachers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  const dispatch = useDispatch();
  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem(`${role}:token`);

      const response = await axios.get(`${API_URL}/admin/teacher`, {
        headers: { Authentication: token },
      });
      setTeachers(response.data.data);
      dispatch(setTeachers(response.data.data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { fetchTeachers, loading, error };
};

export default useGetAllTeachers;
