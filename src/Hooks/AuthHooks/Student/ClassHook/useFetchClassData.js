import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setSelectedClass,
  setSelectedClassName,
} from "../../../../Redux/Slices/Common/CommonSlice";
import { baseUrl } from "../../../../config/Common";

const useFetchClassData = () => {
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const role = useSelector((store) => store.Auth.role);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const token = localStorage.getItem(`${role}:token`);
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.get(`${baseUrl}/student/my_class`, {
          headers: {
            Authentication: token,
          },
        });

        if (response.data.status && response.data.data) {
          setClassData(response.data.data);
          dispatch(setSelectedClass(response.data.data.classId));
          dispatch(setSelectedClassName(response.data.data.className));
        } else {
          throw new Error("No class data or unsuccessful response");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [dispatch, role]);

  const memoizedClassData = useMemo(() => classData, [classData]);

  return { classData: memoizedClassData, loading, error };
};

export default useFetchClassData;
