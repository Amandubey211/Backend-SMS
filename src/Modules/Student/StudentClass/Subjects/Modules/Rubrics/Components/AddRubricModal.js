// // src/components/Components/AddRubricModal.js

// import React, { useEffect, useRef, useCallback, useState } from "react";
// import { HiOutlinePlus } from "react-icons/hi2";
// import { CiBoxList, CiWarning } from "react-icons/ci";
// import { AiOutlineInfoCircle } from "react-icons/ai"; // For the "i" icon
// import { FaCheckCircle } from "react-icons/fa"; // For checklist bullets
// import RubricModalRow from "./RubricModalRow";
// import toast from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import Spinner from "../../../../../../Components/Common/Spinner";
// import { useParams } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import {
//     setRubricField,
//     resetRubricState,
// } from "../../../../../../Store/Slices/Admin/Class/Rubric/rubricSlice";
// import { fetchFilteredAssignments } from "../../../../../../Store/Slices/Admin/Class/Assignment/assignmentThunks";
// import { fetchFilteredQuizzesThunk } from "../../../../../../Store/Slices/Admin/Class/Quiz/quizThunks";
// import { getStudentRubricByIdThunk } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Rubric/rubric.action";

// const AddRubricModal = ({ readonly = true }) => {
//     const { t } = useTranslation("admModule");
//     const dispatch = useDispatch();
//     const { sid } = useParams();

//     // Redux state
//     const {
//         isModalOpen,
//         criteria,
//         rubricName,
//         selectedAssignmentId,
//         selectedQuizId,
//         totalPoints,
//         rubricLoading,
//     } = useSelector((state) => state?.admin?.rubrics ?? {});

//     useEffect(() => {
//         if (isModalOpen) {
//             dispatch(fetchFilteredAssignments({ sid }));
//             dispatch(fetchFilteredQuizzesThunk({ sid }));

//             if (selectedAssignmentId || selectedQuizId) {
//                 const targetId = selectedAssignmentId || selectedQuizId;
//                 dispatch(getStudentRubricByIdThunk(targetId));
//             }
//         }
//     }, [isModalOpen, sid, dispatch, selectedAssignmentId, selectedQuizId]);

//     return (
//         <>
//             <div
//                 className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//                     }`}
//             >
//                 <div
//                     className={`bg-white w-full p-3 h-[97vh] rounded-t-lg shadow-lg transform transition-transform duration-300 ${isModalOpen ? "translate-y-0" : "translate-y-full"
//                         }`}
//                 >
//                     <div className="flex justify-between items-center p-1">
//                         <h2 className="text-lg font-semibold flex items-center gap-2">
//                             {t("View")} Rubric
//                         </h2>
//                         <button
//                             onClick={() =>
//                                 dispatch(
//                                     setRubricField({ field: "isModalOpen", value: false })
//                                 )
//                             }
//                             className="text-gray-600 text-3xl hover:text-gray-900"
//                         >
//                             &times;
//                         </button>
//                     </div>

//                     <div className="p-2">
//                         <label className="block mb-2 text-sm text-gray-700">
//                             {t("Rubric Name")}
//                         </label>
//                         <input
//                             type="text"
//                             value={rubricName ?? ""}
//                             className="block w-full p-2 border rounded-md bg-gray-100 sm:text-sm"
//                             disabled
//                         />
//                     </div>

//                     <div className="m-2 overflow-auto border h-[60vh]">
//                         <div className="flex px-4 font-semibold justify-between items-center p-2 w-full bg-gradient-to-r from-pink-100 to-purple-100">
//                             {["Criteria", "Ratings", "Point"]?.map((heading, idx) => (
//                                 <div
//                                     key={idx}
//                                     className="w-2/8 bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent"
//                                 >
//                                     {t(heading)}
//                                 </div>
//                             ))}
//                         </div>
//                         {rubricLoading ? (
//                             <div className="flex justify-center items-center h-full">
//                                 <Spinner />
//                             </div>
//                         ) : (criteria ?? []).length === 0 ? (
//                             <div className="flex flex-col items-center justify-center h-full text-center">
//                                 <p className="mt-4 text-sm text-gray-600">
//                                     {t("No criteria available")}
//                                 </p>
//                             </div>
//                         ) : (
//                             (criteria ?? []).map((item, index) => (
//                                 <RubricModalRow key={index} data={item} criteriaIndex={index} readonly />
//                             ))
//                         )}
//                     </div>

//                     <div className="flex justify-end p-4 border-t">
//                         <div className="text-transparent text-xl font-bold bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
//                             {selectedAssignmentId
//                                 ? t("Total Assignment Points: ") + (totalPoints ?? 0)
//                                 : t("Total Quiz Points: ") + (totalPoints ?? 0)}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };


// export default AddRubricModal;
