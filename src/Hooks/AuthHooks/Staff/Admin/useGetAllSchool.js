// src/Hooks/AuthHooks/Staff/Admin/useGetAllSchools.js

import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";

const useGetAllSchools = () => {
  const [schoolList, setSchoolList] = useState([]);

  const fetchSchools = async () => {
    try {
      const response = await axios.get(`${baseUrl}/student_diwan/get_schools`);
      console.log(response.data)
      setSchoolList(response.data.schools);
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  useEffect(() => {
    
    fetchSchools();
  }, []);

  return { schoolList,fetchSchools };
};

export default useGetAllSchools;
