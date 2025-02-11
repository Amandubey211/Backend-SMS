// src/Hooks/AuthHooks/Staff/Admin/useGetAllSchools.js

import { useState, useEffect } from "react";
import { getData } from "../../services/apiEndpoints";
const useGetAllSchools = () => {
  const [schoolList, setSchoolList] = useState([]);
  const fetchSchools = async () => {
    try {
      const response = await getData(`/student_diwan/get_schools`);
      return setSchoolList(response.schools);
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  return { schoolList, fetchSchools };
};

export default useGetAllSchools;
