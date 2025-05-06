import { useState, useEffect } from "react";
import { getData } from "../../services/apiEndpoints";

const useGetClassesBySchool = (schoolId) => {
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClasses = async () => {
    // Only proceed if schoolId is available
    if (!schoolId) {
      setClassList([]);
      return;
    }
    setLoading(true);
    try {
      const response = await getData(
        `/admin/class/school?schoolId=${schoolId}`
      );
      setClassList(response.data);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch classes when schoolId is valid
    if (schoolId) {
      fetchClasses();
    }
  }, [schoolId]);

  return { classList, fetchClasses, loading, error };
};

export default useGetClassesBySchool;
