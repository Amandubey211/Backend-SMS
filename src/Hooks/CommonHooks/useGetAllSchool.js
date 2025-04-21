// src/Hooks/AuthHooks/Staff/Admin/useGetAllSchools.js

import { useState, useEffect } from "react";
import { getData } from "../../services/apiEndpoints";

const useGetAllSchools = () => {
  const [schoolList, setSchoolList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const response = await getData(`/student_diwan/get_schools`);
      setSchoolList(response.schools);
    } catch (error) {
      console.error("Error fetching schools:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  return { schoolList, loading, fetchSchools };
};

export default useGetAllSchools;
