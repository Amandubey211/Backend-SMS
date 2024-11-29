// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { graduateStudents } from "../../../../Store/Slices/Admin/Class/Students/studentThunks";
// import { motion } from "framer-motion";
// import DeleteConfirmatiomModal from "../../../../Components/Common/DeleteConfirmationModal";
// import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";
// import toast from "react-hot-toast";

// const GraduateStudent = ({ student }) => {
//   const dispatch = useDispatch();

//   const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
//   const [confirmLoading, setConfirmLoading] = useState(false); // Loading state for confirmation action
//   const { loading } = useSelector((state) => state.admin.students);

//   const handleGraduation = (e) => {
//     e.preventDefault();
//     setIsModalOpen(true); // Show the confirmation modal before graduation
//   };

//   const confirmGraduation = async () => {
//     setConfirmLoading(true);
//     try {
//       // console.log("Dispatching graduateStudents thunk...");
//       const response = await dispatch(
//         graduateStudents({
//           studentIds: [student._id],
//         })
//       ).unwrap(); // unwrap to handle any errors within async thunks
//       // console.log("Response:", response);
//       toast.success("Student graduated successfully");
//       setIsModalOpen(false); // Close the modal after successful graduation
//     } catch (error) {
//       console.error("Graduation failed:", error);
//       toast.error("Failed to graduate student");
//     } finally {
//       setConfirmLoading(false);
//     }
//   };

//   return (
//     <>
//       <motion.form
//         className="flex flex-col justify-between min-h-screen p-4"
//         onSubmit={handleGraduation}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         {/* Student Details */}
//         <div className="bg-white p-4 w-full max-w-md mx-auto flex-grow">
//           <div className="flex items-center space-x-4 mb-6">
//             <img
//               src={student.profile || profileIcon}
//               alt={`${student.firstName} ${student.lastName}`}
//               className="w-14 h-14 rounded-full"
//               loading="lazy"
//             />
//             <div className="flex flex-col">
//               <div className="text-xl font-semibold">{`${student.firstName} ${student.lastName}`}</div>
//               <div className="text-sm text-gray-500">
//                 Admission Number: {student.admissionNumber || "N/A"}
//               </div>
//               <div className="text-sm text-gray-500">
//                 Class: {student.className || "N/A"}
//               </div>
//               <div className="text-sm text-gray-500">
//                 Section: {student.sectionName || "N/A"}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Graduate Button */}
//         <motion.div
//           className="mb-10 sticky bottom-0 w-full max-w-md mx-auto"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <button
//             type="submit"
//             className={`w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 rounded-md hover:from-green-600 hover:to-teal-600 transition-all ${
//               loading ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//             disabled={loading}
//           >
//             {loading ? "Graduating..." : "Graduate Student"}
//           </button>
//         </motion.div>
//       </motion.form>

//       {/* Confirmation Modal */}
//       <DeleteConfirmatiomModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onConfirm={confirmGraduation}
//         loading={confirmLoading}
//         text="Graduate"
//       />
//     </>
//   );
// };

// export default GraduateStudent;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { graduateStudents } from "../../../../Store/Slices/Admin/Class/Students/studentThunks";
import { motion } from "framer-motion";
import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";
import toast from "react-hot-toast";

const GraduateStudent = ({ student }) => {
  const dispatch = useDispatch();

  const [confirmLoading, setConfirmLoading] = useState(false); // Loading state for graduation action
  const { loading } = useSelector((state) => state.admin.students);

  const handleGraduation = async (e) => {
    e.preventDefault();
    setConfirmLoading(true);
    try {
      // console.log("Dispatching graduateStudents thunk...");
      const response = await dispatch(
        graduateStudents({
          studentIds: [student._id],
        })
      ).unwrap(); // unwrap to handle any errors within async thunks
      // console.log("Response:", response);
      
    } catch (error) {
      console.error("Graduation failed:", error);
      toast.error("Failed to graduate student");
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <motion.form
      className="flex flex-col justify-between min-h-screen p-4"
      onSubmit={handleGraduation}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Student Details */}
      <div className="bg-white p-4 w-full max-w-md mx-auto flex-grow">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={student.profile || profileIcon}
            alt={`${student.firstName} ${student.lastName}`}
            className="w-14 h-14 rounded-full"
            loading="lazy"
          />
          <div className="flex flex-col">
            <div className="text-xl font-semibold">{`${student.firstName} ${student.lastName}`}</div>
            <div className="text-sm text-gray-500">
              Admission Number: {student.admissionNumber || "N/A"}
            </div>
            <div className="text-sm text-gray-500">
              Class: {student.className || "N/A"}
            </div>
            <div className="text-sm text-gray-500">
              Section: {student.sectionName || "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Graduate Button */}
      <motion.div
        className="mb-10 sticky bottom-0 w-full max-w-md mx-auto"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          type="submit"
          className={`w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 rounded-md hover:from-green-600 hover:to-teal-600 transition-all ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || confirmLoading}
        >
          {loading || confirmLoading ? "Graduating..." : "Graduate Student"}
        </button>
      </motion.div>
    </motion.form>
  );
};

export default GraduateStudent;
