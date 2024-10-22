import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setTeachers } from "../../../../../Redux/Slices/Admin/TeachersSlice";
import { baseUrl } from "../../../../../config/Common";

const useGetAllTeachers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.common.auth.role);
  const dispatch = useDispatch();

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(`${baseUrl}/admin/teacher`, {
        headers: { Authentication: token },
      });
      // setTeachers(response.data.data);
      dispatch(setTeachers(response.data.data));
      // createSalary('unpaid','pay now')
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { fetchTeachers, loading, error };
};

export default useGetAllTeachers;
