// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import { IoIosArrowBack } from "react-icons/io";
// import { useNavigate } from "react-router-dom";
// import AddRubricModal from "../../../Rubric/Components/AddRubricModal";
// import Sidebar from "../../../../../../../Components/Common/Sidebar";
// import AddNewCriteriaForm from "../../../Rubric/Components/AddNewCriteriaForm";
// import useGetRubricBySubjectId from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Rubric/useGetRubricBySubjectId";
// import useUpdateRubric from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Rubric/useUpdateRubric";
// import useCreateAssignmentRubric from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Rubric/useCreateAssignmentRubric";

// const CreateAssignmentHeader = ({
//   onSave,
//   id,
//   isEditing,
//   criteriaList,
//   setCriteriaList,
//   existingRubricId,
//   setExistingRubricId,
//   assignmentId,
//   saveLoading, // Add this prop
//   publishLoading, // Add this prop
// }) => {
//   const navigate = useNavigate();
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [criteriaToEdit, setCriteriaToEdit] = useState(null);
//   const { fetchRubricBySubjectId } = useGetRubricBySubjectId();
//   const { createAssignmentRubric, loading: createLoading } =
//     useCreateAssignmentRubric();
//   const { updateRubric, loading: updateLoading } = useUpdateRubric();

//   const handleAddCriteria = () => {
//     setSidebarOpen(true);
//   };

//   const handleAddNewCriteria = (newCriteria) => {
//     if (editMode) {
//       setCriteriaList(
//         criteriaList?.map((crit, index) =>
//           index === criteriaToEdit.index ? newCriteria : crit
//         )
//       );
//     } else {
//       setCriteriaList([...criteriaList, newCriteria]);
//     }
//     setSidebarOpen(false);
//     setEditMode(false);
//     setCriteriaToEdit(null);
//   };

//   const handleSubmit = async (rubricData) => {
//     if (existingRubricId) {
//       const result = await updateRubric(existingRubricId, rubricData);
//       if (result.success) {
//         fetchRubricBySubjectId(id);
//         setModalOpen(false);
//         setEditMode(false);
//       } else {
//         toast.error(result.error || "Failed to update rubric.");
//       }
//     } else {
//       const result = await createAssignmentRubric(rubricData);
//       if (result.success) {
//         fetchRubricBySubjectId(id);
//         toast.success("Rubric created successfully.");
//         setModalOpen(false);
//         setCriteriaList([]);
//         setExistingRubricId(result.data._id);
//       } else {
//         toast.error(result.error || "Failed to create rubric.");
//       }
//     }
//   };
//   const handleEditCriteria = (index) => {
//     setCriteriaToEdit({ ...criteriaList[index], index });
//     setSidebarOpen(true);
//     setEditMode(true);
//   };
//   return (
//     <div className="flex items-center justify-between p-2 bg-white border-b border-gray-300 shadow-sm">
//       <div className="flex items-center">
//         <IoIosArrowBack
//           className="mr-2 text-gray-600 text-2xl cursor-pointer"
//           onClick={() => navigate(-1)}
//         />
//         <h1 className="text-lg font-semibold text-gray-800">
//           {isEditing ? "Update Assignment" : "Create New Assignment"}
//         </h1>
//       </div>
//       <div className="flex items-center space-x-2">
//         {isEditing ? (
//           <button
//             onClick={() => setModalOpen(true)}
//             className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-pink-500 hover:bg-gray-100 transition"
//           >
//             <span className="mr-1">+</span>
//             <span>{false ? "Edit" : "Add"} Rubric</span>
//           </button>
//         ) : (
//           <button
//             onClick={() => toast.error("First Create the Assignment ")}
//             className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-pink-500 hover:bg-gray-100 transition"
//           >
//             <span className="mr-1">+</span>
//             <span>{false ? "Edit" : "Add"} Rubric</span>
//           </button>
//         )}

//         <button
//           onClick={() => onSave(true)}
//           className="flex-grow rounded-md py-2 px-4 text-center bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition"
//           disabled={publishLoading}
//         >
//           <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-500">
//             {publishLoading
//               ? "please wait..."
//               : isEditing
//               ? "Update & Publish"
//               : "Save & Publish"}
//           </span>
//         </button>
//         <button
//           onClick={() => onSave(false)}
//           className="px-4 py-2 text-white font-semibold rounded-md bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 transition"
//           disabled={saveLoading}
//         >
//           {saveLoading ? "please wait..." : "Save"}
//         </button>
//         <AddRubricModal
//           type="assignment"
//           isOpen={isModalOpen}
//           onSubmit={handleSubmit}
//           onClose={() => setModalOpen(false)}
//           criteriaList={criteriaList}
//           onEditCriteria={handleEditCriteria}
//           setCriteriaList={setCriteriaList}
//           onAddCriteria={handleAddCriteria}
//           setExistingRubricId={setExistingRubricId}
//           AssignmentId={assignmentId}
//           editMode={editMode}
//           readonly={false}
//           createLoading={createLoading}
//           updateLoading={updateLoading}
//         />
//         <Sidebar
//           isOpen={isSidebarOpen}
//           onClose={() => setSidebarOpen(false)}
//           title="Add New Criteria"
//         >
//           <AddNewCriteriaForm
//             onSave={handleAddNewCriteria}
//             initialData={criteriaToEdit}
//             editMode={editMode}
//           />
//         </Sidebar>
//       </div>
//     </div>
//   );
// };

// export default CreateAssignmentHeader;

import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import AddRubricModal from "../../../Rubric/Components/AddRubricModal";
import Sidebar from "../../../../../../../Components/Common/Sidebar";
import AddNewCriteriaForm from "../../../Rubric/Components/AddNewCriteriaForm";

const CreateAssignmentHeader = ({
  onSave,
  id,
  isEditing,
  criteriaList,
  setCriteriaList,
  existingRubricId,
  setExistingRubricId,
  saveLoading, // Add this prop
  publishLoading, // Add this prop
}) => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [criteriaToEdit, setCriteriaToEdit] = useState(null);

  const handleAddCriteria = () => {
    setSidebarOpen(true);
  };

  const handleAddNewCriteria = (newCriteria) => {
    if (editMode) {
      setCriteriaList(
        criteriaList?.map((crit, index) =>
          index === criteriaToEdit.index ? newCriteria : crit
        )
      );
    } else {
      setCriteriaList([...criteriaList, newCriteria]);
    }
    setSidebarOpen(false);
    setEditMode(false);
    setCriteriaToEdit(null);
  };

  const handleSubmit = async (rubricData) => {
    const result = await onSave(rubricData);
    if (result.success) {
      setModalOpen(false);
    }
  };

  const handleEditCriteria = (index) => {
    setCriteriaToEdit({ ...criteriaList[index], index });
    setSidebarOpen(true);
    setEditMode(true);
  };

  return (
    <div className="flex items-center justify-between p-2 bg-white border-b border-gray-300 shadow-sm">
      <div className="flex items-center">
        <IoIosArrowBack
          className="mr-2 text-gray-600 text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-lg font-semibold text-gray-800">
          {isEditing ? "Update Assignment" : "Create New Assignment"}
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-pink-500 hover:bg-gray-100 transition"
        >
          <span className="mr-1">+</span>
          <span>{isEditing ? "Edit" : "Add"} Rubric</span>
        </button>

        <button
          onClick={() => onSave(true)}
          className="flex-grow rounded-md py-2 px-4 text-center bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition"
          disabled={publishLoading}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-500">
            {publishLoading
              ? "please wait..."
              : isEditing
              ? "Update & Publish"
              : "Save & Publish"}
          </span>
        </button>
        <button
          onClick={() => onSave(false)}
          className="px-4 py-2 text-white font-semibold rounded-md bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 transition"
          disabled={saveLoading}
        >
          {saveLoading ? "please wait..." : "Save"}
        </button>

        <AddRubricModal
          isOpen={isModalOpen}
          onSubmit={handleSubmit}
          onClose={() => setModalOpen(false)}
          criteriaList={criteriaList}
          onEditCriteria={handleEditCriteria}
          setCriteriaList={setCriteriaList}
          setExistingRubricId={setExistingRubricId}
          readonly={false}
        />
      </div>
    </div>
  );
};

export default CreateAssignmentHeader;
