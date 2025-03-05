// // src/pages/MainSection.js

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import {
//   fetchRubricsBySubjectId,
//   deleteRubricThunk,
//   getRubricByIdThunk,
// } from "../../../../../Store/Slices/Admin/Class/Rubric/rubricThunks";
// import {
//   setRubricField,
//   resetRubricState,
// } from "../../../../../Store/Slices/Admin/Class/Rubric/rubricSlice";
// import RubricHeader from "./Components/RubricHeader";
// import RubricCard from "./Components/RubricCard";
// import SubjectSideBar from "../../Component/SubjectSideBar";
// // import Spinner from "../../../../../Components/Common/Spinner"; // We won't need the spinner anymore
// import NoDataFound from "../../../../../Components/Common/NoDataFound";
// import AddRubricModal from "./Components/AddRubricModal";
// import { useTranslation } from "react-i18next";
// import { FaClipboardList } from "react-icons/fa";
// import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";
// import { PERMISSIONS } from "../../../../../config/permission";

// // Import the new shimmer
// import RubricMainSectionShimmer from "./Components/RubricMainSectionShimmer";

// const MainSection = () => {
//   const { t } = useTranslation("admModule");
//   const dispatch = useDispatch();
//   const { sid } = useParams();

//   // Pull rubrics, loading state, modal status, and readonlyMode from the store
//   const { rubrics, loading, isModalOpen, readonlyMode } = useSelector(
//     (state) => state.admin.rubrics
//   );

//   useEffect(() => {
//     dispatch(fetchRubricsBySubjectId(sid));
//   }, [sid, dispatch]);

//   const handleDeleteRubric = (id) => {
//     dispatch(deleteRubricThunk(id));
//   };

//   const handleEditRubric = (id) => {
//     dispatch(resetRubricState());
//     dispatch(setRubricField({ field: "editMode", value: true }));
//     dispatch(setRubricField({ field: "readonlyMode", value: false }));
//     dispatch(setRubricField({ field: "isModalOpen", value: true }));
//     dispatch(getRubricByIdThunk(id));
//   };

//   const handleViewRubric = (id) => {
//     dispatch(resetRubricState());
//     dispatch(setRubricField({ field: "readonlyMode", value: true }));
//     dispatch(setRubricField({ field: "isModalOpen", value: true }));
//     dispatch(getRubricByIdThunk(id));
//   };

//   const handleAddRubric = () => {
//     dispatch(resetRubricState());
//     dispatch(setRubricField({ field: "readonlyMode", value: false }));
//     dispatch(setRubricField({ field: "isModalOpen", value: true }));
//   };

//   return (
//     <div className="w-full h-full flex">
//       <SubjectSideBar />
//       <ProtectedSection
//         title="Rubric"
//         requiredPermission={PERMISSIONS.RUBRIC_BY_SUBJECT_ID}
//       >
//         <div className="w-full p-3 border-l">
//           <RubricHeader onAddRubric={handleAddRubric} />
//           {loading ? (
//             // Show shimmer instead of Spinner
//             <RubricMainSectionShimmer />
//           ) : rubrics?.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
//               {rubrics?.map((rubric) => (
//                 <RubricCard
//                   key={rubric._id}
//                   rubric={rubric}
//                   onDelete={handleDeleteRubric}
//                   onEdit={handleEditRubric}
//                   onView={handleViewRubric}
//                 />
//               ))}
//             </div>
//           ) : (
//             <NoDataFound
//               title={t("Rubrics")}
//               desc={
//                 "Click 'Add New Rubric' to define your evaluation criteria."
//               }
//               icon={FaClipboardList}
//               iconColor="text-blue-500"
//               textColor="text-gray-700"
//               bgColor="bg-gray-100"
//             />
//           )}
//           {isModalOpen && <AddRubricModal readonly={readonlyMode} />}
//         </div>
//       </ProtectedSection>
//     </div>
//   );
// };
// export default MainSection;
