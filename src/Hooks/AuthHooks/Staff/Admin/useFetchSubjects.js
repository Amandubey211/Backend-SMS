// import { useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { setSubjects } from "../../../../Redux/Slices/Admin/SubjectSlice";

// const useFetchSubjects = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const dispatch = useDispatch();
//   const role = useSelector((store) => store.Auth.role);
//   const fetchSubjects = useCallback(
//     async (classId) => {
//       setLoading(true);
//       setError(null);

//       try {
//         
//         const token = localStorage.getItem(`${role}:token`); // Adjust based on your authentication setup
//         const response = await axios.get(
//           `${baseUrl}/admin/subject/${classId}`,
//           {
//             headers: { Authentication: token },
//           }
//         );
//         const { data } = response.data;
//         console.log(data);
//         dispatch(setSubjects(data))
//         setLoading(false);
//         return { success: true, data };
//       } catch (err) {
//         const errorMessage =
//           err.response?.data?.message || "Failed to fetch section data";
//         setError(errorMessage);
//         setLoading(false);
//         return { success: false, error: errorMessage };
//       }
//     },
//     [dispatch]
//   );

//   return { fetchSubjects, loading, error };
// };

// export default useFetchSubjects;
