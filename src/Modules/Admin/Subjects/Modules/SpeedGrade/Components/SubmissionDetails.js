// import React, { useState, useEffect, useCallback } from "react";
// import { AiOutlineFileText } from "react-icons/ai";
// import { CiTextAlignJustify } from "react-icons/ci";

// import { FaFileAlt, FaFilePdf } from "react-icons/fa";
// import { IoCalendarOutline } from "react-icons/io5";
// import { RxPerson } from "react-icons/rx";
// import { AiOutlineEye } from "react-icons/ai";
// import { RiFileWord2Line } from "react-icons/ri";
// import AddRubricModal from "../../Rubric/Components/AddRubricModal";

// import { useParams } from "react-router-dom";
// import toast from "react-hot-toast";
// import useAssignQuizGrade from "../../../../../../Hooks/AuthHooks/Staff/Admin/SpeedGrade/Quiz/useAssignQuizGrade";
// import useAssignAssignmentGrade from "../../../../../../Hooks/AuthHooks/Staff/Admin/SpeedGrade/Assignment/useAssignAssignmentGrade";

// const SubmissionDetails = ({ details, student, initialGrade }) => {
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [criteriaList, setCriteriaList] = useState([]);
//   const [existingRubricId, setExistingRubricId] = useState(null);
//   const [grade, setGrade] = useState(initialGrade || 0);
//   const [attemptDate, setAttemptDate] = useState("");
//   const [status, setStatus] = useState("Missing");
//   const { type } = useParams();

//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [previewType, setPreviewType] = useState(null);

//   const {
//     loading: assignGradeLoading,
//     error: assignGradeError,
//     assignGrade,
//   } = useAssignAssignmentGrade();

//   const {
//     loading: assignQuizGradeLoading,
//     error: assignQuizGradeError,
//     assignQuizGrade,
//   } = useAssignQuizGrade();

//   const loading =
//     type === "Assignment" ? assignGradeLoading : assignQuizGradeLoading;

//   const { dueDate, points, totalPoints, comments } =
//     details?.assignmentId || details?.quizId || {};
//   const { content, media } = details;

//   const maxPoints = type === "Quiz" ? totalPoints : points;

//   const wordCount = content ? content.split(/\s+/).length : 0;
//   const today = new Date();
//   const due = new Date(dueDate);
//   const daysDifference = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
//   const daysLeft = daysDifference >= 0;
//   const daysLabel = daysLeft
//     ? `${daysDifference} days left`
//     : `${Math.abs(daysDifference)} days late`;
//   const daysLabelClass = daysLeft
//     ? "text-green-500 bg-green-100"
//     : "text-red-500 bg-red-100";
//   const commentCount = comments ? comments.length : 0;
//   const { sgid } = useParams();

//   useEffect(() => {
//     // Reset state variables when new details are selected
//     setGrade(initialGrade); // Use initial grade passed from AssignmentDetails
//     setAttemptDate(
//       details.submittedAt
//         ? new Date(details.submittedAt).toISOString().split("T")[0]
//         : ""
//     );
//     setStatus(details.status || "Missing");
//   }, [details, initialGrade]);

//   const handleTotalGradeUpdate = (newGrade) => {
//     setGrade(newGrade);
//   };

//   const handleViewRubric = () => {
//     setModalOpen(true);
//   };

//   const handleAddCriteria = () => {
//     setSidebarOpen(true);
//   };

//   const handleGradeChange = (e) => {
//     const inputGrade = e.target.value;

//     // Allow clearing the input by setting grade to an empty string
//     if (inputGrade === "") {
//       setGrade("");
//     } else {
//       const parsedGrade = parseFloat(inputGrade);

//       // Ensure that parsedGrade is a number and does not exceed maxPoints
//       if (!isNaN(parsedGrade) && parsedGrade <= maxPoints) {
//         setGrade(parsedGrade);
//       } else if (parsedGrade > maxPoints) {
//         toast.error(`Grade cannot exceed ${maxPoints} points`);
//         setGrade(maxPoints);
//       }
//     }
//   };

//   const handleSubmitGrade = useCallback(async () => {
//     const gradeData = {
//       studentId: student._id,
//       grade,
//       attemptDate,
//       status,
//     };

//     if (type === "Assignment") {
//       gradeData.assignmentId = sgid;
//     } else if (type === "Quiz") {
//       gradeData.quizId = sgid;
//       gradeData.score = grade; // use score instead of grade for quizzes
//     }

//     const result =
//       type === "Assignment"
//         ? await assignGrade(gradeData)
//         : await assignQuizGrade(gradeData);

//     if (result) {
//       // Handle success (e.g., show a success message or update state)
//     }
//   }, [
//     assignGrade,
//     assignQuizGrade,
//     sgid,
//     grade,
//     attemptDate,
//     status,
//     student._id,
//     type,
//   ]);

//   const dummyFiles = [
//     // {
//     //   url: "https://res.cloudinary.com/dhksqayts/image/upload/v1723784726/subjects/66a9e9203e9c5429f9f5b673/chapters/66ab5a5ea62c56abdbe41280/lamck4rqzyhaybbq1d8u.pdf",
//     //   title: "Assignment image 1",
//     //   type: "application/pdf",
//     // },
//     // {
//     //   url: "https://res.cloudinary.com/dhksqayts/image/upload/v1723623488/subjects/66a9e9203e9c5429f9f5b673/chapters/66b0acd88bf0bc11a3955362/xtlligurgjrj2smp5wtp.png",
//     //   title: "Assignment image 2",
//     //   type: "image/png",
//     // },
//     // {
//     //   url: "https://res.cloudinary.com/dhksqayts/image/upload/v1723784726/subjects/66a9e9203e9c5429f9f5b673/chapters/66ab5a5ea62c56abdbe41280/lamck4rqzyhaybbq1d8u.pdf",
//     //   title: "Assignment image 3",
//     //   type: "application/pdf",
//     // },
//   ];

//   const openPreviewModal = (url, type) => {
//     setPreviewUrl(url);
//     setPreviewType(type);
//   };

//   const closePreviewModal = () => {
//     setPreviewUrl(null);
//     setPreviewType(null);
//   };
//   console.log("media", media);
//   const renderWordCount = () => {
//     if (wordCount === 0) {
//       return (
//         <div className="flex flex-col items-center justify-center text-gray-500 my-4">
//           <CiTextAlignJustify className="text-4xl" aria-hidden="true" />
//           <p className="mt-2 text-sm">No Text submitted</p>
//         </div>
//       );
//     } else {
//       return (
//         <div className="flex items-center space-x-2 mb-3">
//           <RiFileWord2Line className="text-blue-500" />
//           <span className="font-medium text-sm">Word Count:</span>
//           <span className="text-green-500">{wordCount} Words</span>
//         </div>
//       );
//     }
//   };

//   const renderFiles = () => {
//     if (!media || media.length === 0) {
//       return (
//         <div className="flex flex-col items-center justify-center text-gray-500 mt-7">
//           <FaFileAlt className="text-xl" aria-hidden="true" />
//           <p className="mt-1 text-sm">No files uploaded</p>
//         </div>
//       );
//     } else {
//       return (
//         <>
//           <h1 className="font-semibold text-gray-500  bg-gray-50 py-1">
//             {" "}
//             Uploaded Files
//           </h1>

//           <ul className="space-y-2 text-sm">
//             {media?.map((file, index) => (
//               <li
//                 key={index}
//                 className="flex items-center justify-between bg-white p-2 border rounded-md shadow-sm hover:shadow-md transition-shadow"
//               >
//                 <div className="flex items-center space-x-2">
//                   {file?.type?.startsWith("image/") ? (
//                     <img
//                       src={file.url}
//                       alt={file.name}
//                       className="w-6 h-6 object-cover rounded"
//                     />
//                   ) : file.type === "application/pdf" ? (
//                     <FaFilePdf className="text-red-500 w-6 h-6" />
//                   ) : (
//                     <FaFileAlt className="text-gray-500 w-6 h-6" />
//                   )}
//                   <a
//                     href="#"
//                     className="text-green-500 hover:underline"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       openPreviewModal(file.url, file.type);
//                     }}
//                   >
//                     {/* {file.name} */}
//                     File {index + 1}
//                   </a>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </>
//       );
//     }
//   };

//   const renderSubmissionDetails = () => {
//     if (wordCount === 0 && (!dummyFiles || dummyFiles.length === 0)) {
//       return (
//         <div className="flex flex-col items-center justify-center text-gray-500 mt-4">
//           <FaFileAlt className="text-4xl" aria-hidden="true" />
//           <p className="mt-2 text-sm">No submission found</p>
//         </div>
//       );
//     } else {
//       return (
//         <>
//           {details?.assignmentId && <> {renderWordCount()}</>}
//           {renderFiles()}
//         </>
//       );
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex gap-2 p-2 justify-center items-center border-b pb-3">
//         <button className="flex items-center bg-white border text-sm gap-1 border-gray-300 font-semibold py-2 px-4 rounded-full hover:bg-gray-100 focus:outline-none">
//           <RxPerson className="inline-block" />
//           {details?.quizId?.quizType !== "Practice" ? (
//             <span>
//               Graded:{" "}
//               <span className=" text-purple-500">
//                 {grade !== "" ? `${grade}` : "N/A"}
//               </span>
//             </span>
//           ) : (
//             <span>Pratice </span>
//           )}
//         </button>

//         <button
//           className="flex items-center bg-gradient-to-r text-sm gap-1 from-pink-100 to-purple-100 font-semibold py-2 px-4 rounded-full hover:from-purple-200 hover:to-pink-200 focus:outline-none"
//           onClick={handleViewRubric}
//         >
//           <AiOutlineEye className="inline-block text-gradient" />
//           <span className="text-gradient">View Rubric</span>
//         </button>
//       </div>

//       <div className="flex-grow overflow-y-auto no-scrollbar ">
//         <div className="flex p-2 justify-between items-center mb-1">
//           <h3 className="text-lg font-semibold">Submission</h3>
//           <span
//             className={`text-sm font-medium px-2 py-0.5 rounded-full ${daysLabelClass}`}
//           >
//             {daysLabel}
//           </span>
//         </div>

//         <div className="space-y-4 px-3">
//           <div className="flex items-center space-x-2">
//             <IoCalendarOutline className="text-green-500 h-4 w-4" />
//             <span className="text-sm text-green-500">
//               Due Date: <span>{new Date(dueDate).toLocaleDateString()}</span>
//             </span>
//           </div>
//           {details?.quizId?.quizType !== "Practice" && (
//             <>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Attempt Date
//                 </label>
//                 <input
//                   type="date"
//                   className="mt-1 block w-full border border-gray-300 bg-white rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
//                   value={attemptDate}
//                   onChange={(e) => setAttemptDate(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-500">
//                   Grade{" "}
//                   <span className="text-xs font-normal text-pink-500 italic">
//                     (Out of {type === "Quiz" ? totalPoints : points || 0})
//                   </span>
//                 </label>
//                 <input
//                   type="number"
//                   value={grade}
//                   onChange={handleGradeChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-500">
//                   Status
//                 </label>
//                 <div className="flex items-center space-x-4 mt-1">
//                   <div className="flex items-center">
//                     <input
//                       id="status-submit"
//                       name="status"
//                       type="radio"
//                       className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
//                       checked={status === "Submit"}
//                       onChange={() => setStatus("Submit")}
//                     />
//                     <label
//                       htmlFor="status-submit"
//                       className="ml-2 block text-sm text-green-500"
//                     >
//                       Submit
//                     </label>
//                   </div>
//                   <div className="flex items-center">
//                     <input
//                       id="status-excused"
//                       name="status"
//                       type="radio"
//                       className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300"
//                       checked={status === "Excused"}
//                       onChange={() => setStatus("Excused")}
//                     />
//                     <label
//                       htmlFor="status-excused"
//                       className="ml-2 block text-sm text-yellow-400"
//                     >
//                       Excused
//                     </label>
//                   </div>
//                   <div className="flex items-center">
//                     <input
//                       id="status-missing"
//                       name="status"
//                       type="radio"
//                       className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
//                       checked={status === "Missing"}
//                       onChange={() => setStatus("Missing")}
//                     />
//                     <label
//                       htmlFor="status-missing"
//                       className="ml-2 block text-sm text-red-700"
//                     >
//                       Missing
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         <div className="mt-3">
//           <h3 className="text-lg bg-gray-50 py-1 ps-3 font-semibold ">
//             Submission Details
//           </h3>
//           <div className="space-y-2 px-3 p-2">{renderSubmissionDetails()}</div>
//         </div>
//       </div>
//       {details?.quizId?.quizType !== "Practice" && (
//         <div className="p-4 mb-10 border-t border-gray-200">
//           <button
//             className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-md shadow-md hover:from-purple-500 hover:to-pink-500 focus:outline-none"
//             onClick={handleSubmitGrade}
//             disabled={loading}
//           >
//             {loading ? "Submitting..." : "Submit Grade →"}
//           </button>
//         </div>
//       )}

//       <AddRubricModal
//         type={type === "Assignment" ? "assignment" : "quiz"}
//         isOpen={isModalOpen}
//         onClose={() => setModalOpen(false)}
//         criteriaList={criteriaList}
//         AssignmentId={details?.assignmentId?._id}
//         QuizId={details?.quizId?._id}
//         setCriteriaList={setCriteriaList}
//         setExistingRubricId={setExistingRubricId}
//         readonly={true}
//       />

//       {previewUrl && (
//         <div
//           className="fixed inset-0 flex items-center justify-center z-50"
//           role="dialog"
//           aria-modal="true"
//         >
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
//             onClick={closePreviewModal}
//           ></div>
//           <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-transform duration-300 max-w-3xl w-full p-6 relative">
//             <button
//               onClick={closePreviewModal}
//               className="absolute top-2 right-2 p-2 px-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-colors duration-500 ease-in-out shadow-lg"
//             >
//               ✕
//             </button>
//             <div className="flex justify-center">
//               <div className="overflow-y-auto max-h-[80vh] w-full">
//                 {previewType === "application/pdf" ? (
//                   <iframe
//                     src={previewUrl}
//                     width="100%"
//                     height="500px"
//                     className="max-h-[80vh] overflow-y-auto rounded-md"
//                   />
//                 ) : (
//                   <img
//                     src={previewUrl}
//                     alt="Preview"
//                     className="max-h-[80vh] w-full object-contain rounded-md"
//                   />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SubmissionDetails;

import React, { useState, useEffect, useCallback } from "react";
import { AiOutlineFileText } from "react-icons/ai";
import { CiTextAlignJustify } from "react-icons/ci";
import { FaFileAlt, FaFilePdf } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { RxPerson } from "react-icons/rx";
import { AiOutlineEye } from "react-icons/ai";
import { RiFileWord2Line } from "react-icons/ri";
import AddRubricModal from "../../Rubric/Components/AddRubricModal";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { assignAssignmentGrade } from "../../../../../../Store/Slices/Admin/Class/SpeedGrade/AssignmentSpeedGradeThunks";
import { assignQuizGrade } from "../../../../../../Store/Slices/Admin/Class/SpeedGrade/QuizSpeedGradeThunks";

const SubmissionDetails = ({ details, student, initialGrade }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [grade, setGrade] = useState(initialGrade || 0);
  const [attemptDate, setAttemptDate] = useState("");
  const [status, setStatus] = useState("Missing");
  const { type, sgid } = useParams();
  const dispatch = useDispatch();

  const loading = useSelector((state) =>
    type === "Assignment"
      ? state.admin.speedgrades.gradeAssignmentLoading
      : state.admin.speedgrades.gradeQuizLoading
  );

  const { dueDate, points, totalPoints, comments } =
    details?.assignmentId || details?.quizId || {};
  const { content, media } = details;
  const maxPoints = type === "Quiz" ? totalPoints : points;

  const wordCount = content ? content.split(/\s+/).length : 0;
  const today = new Date();
  const due = new Date(dueDate);
  const daysDifference = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  const daysLeft = daysDifference >= 0;
  const daysLabel = daysLeft
    ? `${daysDifference} days left`
    : `${Math.abs(daysDifference)} days late`;
  const daysLabelClass = daysLeft
    ? "text-green-500 bg-green-100"
    : "text-red-500 bg-red-100";

  const commentCount = comments ? comments.length : 0;

  useEffect(() => {
    setGrade(initialGrade);
    setAttemptDate(
      details.submittedAt
        ? new Date(details.submittedAt).toISOString().split("T")[0]
        : ""
    );
    setStatus(details.status || "Missing");
  }, [details, initialGrade]);

  const handleGradeChange = (e) => {
    const inputGrade = e.target.value;

    if (inputGrade === "") {
      setGrade("");
    } else {
      const parsedGrade = parseFloat(inputGrade);

      if (!isNaN(parsedGrade) && parsedGrade <= maxPoints) {
        setGrade(parsedGrade);
      } else if (parsedGrade > maxPoints) {
        toast.error(`Grade cannot exceed ${maxPoints} points`);
        setGrade(maxPoints);
      }
    }
  };

  const handleSubmitGrade = useCallback(async () => {
    const gradeData = {
      studentId: student._id,
      grade,
      attemptDate,
      status,
    };

    if (type === "Assignment") {
      gradeData.assignmentId = sgid;
    } else if (type === "Quiz") {
      gradeData.quizId = sgid;
      gradeData.score = grade;
    }

    try {
      const result =
        type === "Assignment"
          ? await dispatch(assignAssignmentGrade(gradeData)).unwrap()
          : await dispatch(assignQuizGrade(gradeData)).unwrap();

      if (result) {
        toast.success("Grade submitted successfully");
      }
    } catch (error) {
      toast.error("Failed to submit grade");
    }
  }, [dispatch, student, grade, attemptDate, status, type, sgid]);

  const renderWordCount = () => {
    if (wordCount === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-gray-500 my-4">
          <CiTextAlignJustify className="text-4xl" aria-hidden="true" />
          <p className="mt-2 text-sm">No Text submitted</p>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2 mb-3">
          <RiFileWord2Line className="text-blue-500" />
          <span className="font-medium text-sm">Word Count:</span>
          <span className="text-green-500">{wordCount} Words</span>
        </div>
      );
    }
  };

  const renderFiles = () => {
    if (!media || media.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-7">
          <FaFileAlt className="text-xl" aria-hidden="true" />
          <p className="mt-1 text-sm">No files uploaded</p>
        </div>
      );
    } else {
      return (
        <>
          <h1 className="font-semibold text-gray-500 bg-gray-50 py-1">
            Uploaded Files
          </h1>

          <ul className="space-y-2 text-sm">
            {media.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-white p-2 border rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-2">
                  {file.type?.startsWith("image/") ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-6 h-6 object-cover rounded"
                    />
                  ) : file.type === "application/pdf" ? (
                    <FaFilePdf className="text-red-500 w-6 h-6" />
                  ) : (
                    <FaFileAlt className="text-gray-500 w-6 h-6" />
                  )}
                  <a
                    href={file.url}
                    className="text-green-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    File {index + 1}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </>
      );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 p-2 justify-center items-center border-b pb-3">
        <button className="flex items-center bg-white border text-sm gap-1 border-gray-300 font-semibold py-2 px-4 rounded-full hover:bg-gray-100 focus:outline-none">
          <RxPerson className="inline-block" />
          <span className="text-purple-500">
            {grade !== "" ? `${grade}` : "N/A"}
          </span>
        </button>

        <button
          className="flex items-center bg-gradient-to-r text-sm gap-1 from-pink-100 to-purple-100 font-semibold py-2 px-4 rounded-full hover:from-purple-200 hover:to-pink-200 focus:outline-none"
          onClick={() => setModalOpen(true)}
        >
          <AiOutlineEye className="inline-block text-gradient" />
          <span className="text-gradient">View Rubric</span>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto no-scrollbar">
        <div className="flex p-2 justify-between items-center mb-1">
          <h3 className="text-lg font-semibold">Submission</h3>
          <span
            className={`text-sm font-medium px-2 py-0.5 rounded-full ${daysLabelClass}`}
          >
            {daysLabel}
          </span>
        </div>

        <div className="space-y-4 px-3">
          <div className="flex items-center space-x-2">
            <IoCalendarOutline className="text-green-500 h-4 w-4" />
            <span className="text-sm text-green-500">
              Due Date: <span>{new Date(dueDate).toLocaleDateString()}</span>
            </span>
          </div>
          {type === "Quiz" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Attempt Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 bg-white rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  value={attemptDate}
                  onChange={(e) => setAttemptDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Grade{" "}
                  <span className="text-xs font-normal text-pink-500 italic">
                    (Out of {type === "Quiz" ? totalPoints : points || 0})
                  </span>
                </label>
                <input
                  type="number"
                  value={grade}
                  onChange={handleGradeChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Status
                </label>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center">
                    <input
                      id="status-submit"
                      name="status"
                      type="radio"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      checked={status === "Submit"}
                      onChange={() => setStatus("Submit")}
                    />
                    <label
                      htmlFor="status-submit"
                      className="ml-2 block text-sm text-green-500"
                    >
                      Submit
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="status-excused"
                      name="status"
                      type="radio"
                      className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300"
                      checked={status === "Excused"}
                      onChange={() => setStatus("Excused")}
                    />
                    <label
                      htmlFor="status-excused"
                      className="ml-2 block text-sm text-yellow-400"
                    >
                      Excused
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="status-missing"
                      name="status"
                      type="radio"
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      checked={status === "Missing"}
                      onChange={() => setStatus("Missing")}
                    />
                    <label
                      htmlFor="status-missing"
                      className="ml-2 block text-sm text-red-700"
                    >
                      Missing
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-3">
          <h3 className="text-lg bg-gray-50 py-1 ps-3 font-semibold">
            Submission Details
          </h3>
          <div className="space-y-2 px-3 p-2">
            {renderWordCount()}
            {renderFiles()}
          </div>
        </div>
      </div>

      {details?.quizId?.quizType !== "Practice" && (
        <div className="p-4 mb-10 border-t border-gray-200">
          <button
            className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-md shadow-md hover:from-purple-500 hover:to-pink-500 focus:outline-none"
            onClick={handleSubmitGrade}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Grade →"}
          </button>
        </div>
      )}

      <AddRubricModal
        type={type === "Assignment" ? "assignment" : "quiz"}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        criteriaList={[]}
        AssignmentId={details?.assignmentId?._id}
        QuizId={details?.quizId?._id}
        readonly={true}
      />
    </div>
  );
};

export default SubmissionDetails;
