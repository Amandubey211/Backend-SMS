import { useState, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// import { setRubrics } from "../../../../../Redux/Slices/Admin/RubricSlice";

const useGetRubricBySubjectId = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rubrics, setRubrics] = useState([]);
//   const dispatch = useDispatch();
  const role = useSelector((store) => store.Auth.role);
  const API_URL = process.env.REACT_APP_API_URL;
  const { sid } = useParams();

  const fetchRubricBySubjectId = useCallback(
    async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);

        const response = await axios.get(
          `${API_URL}/admin/rubric/subject/${sid}`,
          {
            headers: {
              Authentication: token,
            },
          
          }
        );
        
        console.log(response.data);
        if (response.data && response.data.success) {
          setRubrics(response.data.rubrics);
        //   dispatch(setRubrics(response.data.rubrics));
        } else {
          setError(response.data.message || "Failed to fetch rubrics.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Error in fetching rubrics"
        );
      } finally {
        setLoading(false);
      }
    },
    [role, API_URL, ]
  );

  return { loading, error, rubrics, fetchRubricBySubjectId };
};

export default useGetRubricBySubjectId;
