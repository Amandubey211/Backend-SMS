// hooks/useFetchClassData.js
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedClass,
  setSelectedClassName,
  setSelectedSection,
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

        const response = await fetch(`${baseUrl}/student/my_class`, {
          headers: {
            Authentication: token,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch class data, status: ${response.status}`
          );
        }

        const data = await response.json();
        if (data.status && data.data) {
          setClassData(data.data);
          dispatch(setSelectedClass(data.data.classId));
          dispatch(setSelectedClassName(data.data.className));
          dispatch(setSelectedSection(data.data.section.sectionId));
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
  }, [dispatch]);

  const memoizedClassData = useMemo(() => classData, [classData]);

  return { classData: memoizedClassData, loading, error };
};

export default useFetchClassData;
