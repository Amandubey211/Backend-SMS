// import { useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import useFetchTeachersByClass from "./useFetchTeachersByClass";
// import { baseUrl } from "../../../../../config/Common";

// const useAssignTeacher = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const role = useSelector((store) => store.common.auth.role);

//   const { cid } = useParams();
//   const { fetchTeachersByClass } = useFetchTeachersByClass();
//   const assignTeacher = async (assignData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem(`${role}:token`);

//       const response = await axios.post(
//         `${baseUrl}/admin/teacher`,
//         assignData,
//         {
//           headers: { Authentication: token },
//         }
//       );
//       if (response.data.success == false) {
//         toast.error(response.data.message);
//       } else {
//         toast.success("Teacher assigned successfully!");
//       }
//       console.log(response.data, "sdfsdf");
//       fetchTeachersByClass(cid);
//       setLoading(false);
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message || "Failed to assign teacher";
//       toast.error(errorMessage);
//       setLoading(false);
//       setError(errorMessage);
//       throw new Error(errorMessage); // Ensuring the error is thrown for the caller to handle
//     }
//   };
//   const unassignTeacher = async (teacherId) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem(`${role}:token`);

//       const response = await axios.delete(
//         `${baseUrl}/admin/teacher/${teacherId}/class/${cid}`,
//         {
//           headers: { Authentication: token },
//         }
//       );

//       toast.success("Teacher unassigned successfully!");
//       fetchTeachersByClass(cid);
//       setLoading(false);
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message || "Failed to remove teacher";
//       toast.error(errorMessage);
//       setLoading(false);
//       setError(errorMessage);
//       throw new Error(errorMessage);
//     }
//   };
//   return { assignTeacher, unassignTeacher, loading, error };
// };

// export default useAssignTeacher;
