
import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setStaff } from "../../../../../Redux/Slices/Admin/StaffSlice";
const API_URL = process.env.REACT_APP_API_URL;

const useGetAllStaff = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  const dispatch = useDispatch();
  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(`${API_URL}/admin/get_staffs`, {
        headers: { Authentication: token },
      });
      dispatch(setStaff(response.data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { fetchStaff, loading, error };
};



export default useGetAllStaff;
