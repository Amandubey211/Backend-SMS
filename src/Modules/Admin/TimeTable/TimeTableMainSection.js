// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import TimeTableList from "./Components/TimeTableList";
// import {
//   fetchTimetables,
//   deleteTimetable,
// } from "../../../Store/Slices/Admin/TimeTable/timetable.action";
// import { fetchStudentTimetable } from "../../../Store/Slices/Student/TimeTable/studentTimeTable.action";
// import { fetchParentTimetable } from "../../../Store/Slices/Parent/TimeTable/parentTimeTable.action";
// import { fetchTeacherTimetable } from "../../../Store/Slices/Teacher/teacherTimeTable.action";
// import { fetchAllClasses } from "../../../Store/Slices/Admin/Class/actions/classThunk";
// import TopNavigationWithFilters from "./Components/TopNavigationWithFilters";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useTranslation } from "react-i18next";
// import ProtectedSection from "../../../Routes/ProtectedRoutes/ProtectedSection";
// import ProtectedAction from "../../../Routes/ProtectedRoutes/ProtectedAction";
// import { PERMISSIONS } from "../../../config/permission";

// const TimeTableMainSection = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { t } = useTranslation("admTimeTable");

//   // Role-based state selection
//   const role = useSelector((store) => store.common.auth.role);

//   // Select timetables and loading/error states based on role
//   const { timetables, loadingFetch, errorFetch } = useSelector((state) => {
//     if (role === "student") {
//       return {
//         timetables: state.student?.studentTimetable?.timetables || [],
//         loadingFetch: state.student?.studentTimetable?.loading || false,
//         errorFetch: state.student?.studentTimetable?.error || null,
//       };
//       // } else if (role === "parent") {
//       //   return {
//       //     timetables: state.Parent?.parentTimetable?.timetables || [],
//       //     loadingFetch: state.Parent?.parentTimetable?.loading || false,
//       //     errorFetch: state.Parent?.parentTimetable?.error || null,
//       //   };
//     } else if (role === "teacher") {
//       return {
//         timetables: state.admin?.teacherTimetable?.timetables || [],
//         loadingFetch: state.admin?.teacherTimetable?.loading || false,
//         errorFetch: state.admin?.teacherTimetable?.error || null,
//       };
//     } else {
//       return {
//         timetables: state.admin?.timetable?.timetables || [],
//         loadingFetch: state.admin?.timetable?.loadingFetch || false,
//         errorFetch: state.admin?.timetable?.errorFetch || null,
//       };
//     }
//   });

//   // Select classes state
//   const {
//     classes,
//     loading: classLoading,
//     error: classError,
//   } = useSelector((state) => state.admin.class);

//   const [academicYears, setAcademicYears] = useState([]);
//   const [backendFilters, setBackendFilters] = useState({
//     classId: "",
//     type: "",
//     status: "",
//     academicYear: "",
//   });
//   const [frontendFilter, setFrontendFilter] = useState("");
//   const [filteredTimetables, setFilteredTimetables] = useState([]);

//   // Fetch academic years from localStorage
//   const fetchAcademicYearsFromStorage = () => {
//     const persistedAuth = localStorage.getItem("persist:auth");
//     if (persistedAuth) {
//       const parsedAuth = JSON.parse(persistedAuth);
//       const authData = JSON.parse(parsedAuth.auth || "{}");
//       if (authData && authData.AcademicYear) {
//         setAcademicYears(authData.AcademicYear);
//       }
//     }
//   };

//   // Fetch timetables or classes based on role
//   useEffect(() => {
//     fetchAcademicYearsFromStorage();
//     if (role === "student") {
//       dispatch(fetchStudentTimetable());
//     }
//     //else if (role === "parent") {
//     //   dispatch(fetchParentTimetable());
//     // }
//     else if (role === "teacher") {
//       dispatch(fetchTeacherTimetable());
//     } else if (role === "admin") {
//       dispatch(fetchAllClasses());
//       dispatch(fetchTimetables({}));
//     }
//   }, [dispatch, role]);

//   // Handle class fetching errors
//   useEffect(() => {
//     if (classError && role === "admin") {
//       console.error("Failed to load classes:", classError); // Log the error
//     }
//   }, [classError, role]);

//   // Fetch timetables based on backend filters
//   useEffect(() => {
//     if (role === "admin") {
//       const activeFilters = Object.fromEntries(
//         Object.entries(backendFilters).filter(([key, value]) => value)
//       );
//       dispatch(fetchTimetables(activeFilters));
//     }
//   }, [backendFilters, dispatch, role]);

//   // Update filtered timetables when timetables or frontend filter changes
//   useEffect(() => {
//     if (frontendFilter.trim() === "") {
//       setFilteredTimetables(timetables);
//     } else {
//       const filtered = timetables.filter((timetable) =>
//         timetable.name.toLowerCase().includes(frontendFilter.toLowerCase())
//       );
//       setFilteredTimetables(filtered);
//     }
//   }, [timetables, frontendFilter]);

//   // Handle backend filter changes
//   const handleBackendFilterChange = (updatedFilters) => {
//     setBackendFilters({
//       classId: updatedFilters.classId || "",
//       type: updatedFilters.type || "",
//       status: updatedFilters.status || "",
//       academicYear: updatedFilters.academicYear || "",
//     });
//   };

//   // Handle frontend filter changes (Name search)
//   const handleFrontendFilterChange = (name) => {
//     setFrontendFilter(name);
//   };

//   // Handle create button click
//   const handleCreateTimeTable = () => {
//     navigate("/timetable/create-new-timeTable");
//   };

//   // Handle delete timetable
//   const handleDelete = (id) => {
//     dispatch(deleteTimetable(id))
//       .unwrap()
//       .then(() => {
//         toast.success(t("Timetable deleted successfully."));
//       })
//       .catch(() => {
//         toast.error(t("Failed to delete timetable."));
//       });
//   };

//   // Show error toast for timetable fetch failure
//   useEffect(() => {
//     if (errorFetch) {
//       toast.error(`${t("Failed to load timetables")}: ${errorFetch}`);
//     }
//   }, [errorFetch]);

//   return (
//     <div className="relative p-5">
//       {/* Filter Navigation */}
//       <TopNavigationWithFilters
//         onBackendFilterChange={handleBackendFilterChange}
//         onFrontendFilterChange={handleFrontendFilterChange}
//         academicYears={academicYears}
//       />

//       <ProtectedSection
//         requiredPermission={PERMISSIONS.TIMETABLE_VIEW}
//         title={t("TimeTable")}
//       >
//         <ProtectedAction requiredPermission={PERMISSIONS.TIMETABLE_VIEW}>
//           {/* Display Timetable List */}
//           <TimeTableList
//             timetables={filteredTimetables}
//             loading={loadingFetch || classLoading}
//             onDelete={handleDelete}
//           />
//         </ProtectedAction>
//       </ProtectedSection>
//     </div>
//   );
// };

// export default TimeTableMainSection;
