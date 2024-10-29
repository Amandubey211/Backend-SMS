import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../config/Common";

const useGetAllClasses = () => {
  const [classList, setClassList] = useState([]);
  const [error, setError] = useState(null);
  const fetchClasses = async (schoolId) => {
    try {
      if (!schoolId) return;
      const response = await axios.get(
        `${baseUrl}/student_diwan/getAllClasses/${schoolId}`
      );
      console.log(response.data);
      setClassList(response.data.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return { classList, fetchClasses, error };
};

export default useGetAllClasses;
