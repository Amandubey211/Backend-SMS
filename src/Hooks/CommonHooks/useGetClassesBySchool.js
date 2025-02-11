import { useState, useEffect } from "react";
import { getData } from "../../services/apiEndpoints";

const useGetClassesBySchool = (schoolId) => {
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClasses = async () => {
    // If no schoolId is provided, clear class list
    if (!schoolId) {
      setClassList([]);
      return;
    }
    setLoading(true);
    try {
      const response = await getData(
        `/admin/class/school?schoolId=${schoolId}`
      );
      // Assuming the controller returns: { status: true, data: classes }
      setClassList(response.data);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId]);

  return { classList, fetchClasses, loading, error };
};

export default useGetClassesBySchool;
