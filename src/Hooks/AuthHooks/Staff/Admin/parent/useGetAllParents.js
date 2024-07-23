import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setParents } from "../../../../../Redux/Slices/Admin/parentsSilce";
import { baseUrl } from "../../../../../config/Common";

const useGetAllParents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  
const dispatch = useDispatch()
  const fetchAllParents = useCallback(
    async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(`${baseUrl}/admin/all/Parents`, {
          headers: { Authentication: token },
        });
        console.log(response.data)
        dispatch(setParents(response.data))
        if (response.data.status) {
          return response.data?.data;
        } else {
         // toast.error("Failed to fetch Parents. Please try again.");
          return [];
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch Parents";
        toast.error(errorMessage);
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [baseUrl, role]
  );

  return { loading, error, fetchAllParents };
};

export default useGetAllParents;
