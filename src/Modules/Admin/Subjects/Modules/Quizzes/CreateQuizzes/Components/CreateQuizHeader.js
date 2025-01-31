import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import AddRubricModal from "../../../Rubric/Components/AddRubricModal";
import Sidebar from "../../../../../../../Components/Common/Sidebar";
import AddNewCriteriaForm from "../../../Rubric/Components/AddNewCriteriaForm";

import { fetchRubricsBySubjectId } from "../../../../../../../Store/Slices/Admin/Class/Rubric/rubricThunks";
import toast from "react-hot-toast";
import ProtectedAction from "../../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../../config/permission";

const CreateQuizHeader = ({
  onSave,
  isEditing,
  quizId,
  criteriaList,
  setCriteriaList,
  existingRubricId,
  setExistingRubricId, // Make sure to receive this prop
  activeTab,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [criteriaToEdit, setCriteriaToEdit] = useState(null);
  const { sid } = useParams();
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

  const handleEditCriteria = (index) => {
    setCriteriaToEdit({ ...criteriaList[index], index });
    setSidebarOpen(true);
  };

  return (
    <div className="flex h-14 items-center justify-between p-2 bg-white border-b border-gray-300 shadow-sm">
      <div className="flex items-center">
        <IoIosArrowBack
          className="mr-2 text-gray-600 text-2xl cursor-pointer"
          onClick={() => navigate(-1)} // Navigate to the previous page
        />
        <h1 className="text-lg font-semibold text-gray-800">
          {isEditing ? "Update Quiz" : "Create New Quiz"}
        </h1>
      </div>

      {activeTab === "instructions" && (
        <div className="flex items-center space-x-2">
          <ProtectedAction requiredPermission={PERMISSIONS.UPDATE_QUIZ}>
            <button
              onClick={() => onSave(true)}
              className="flex-grow rounded-md py-2 px-4 text-center bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-500">
                {isEditing ? "Update & Publish" : "Save & Publish"}
              </span>
            </button>
          </ProtectedAction>

          <ProtectedAction requiredPermission={PERMISSIONS.CREATE_QUIZ}>
            <button
              onClick={() => onSave(false)}
              className="px-4 py-2 text-white font-semibold rounded-md bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 transition"
            >
              Save
            </button>
          </ProtectedAction>

          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setSidebarOpen(false)} // Pass down function to close sidebar
            title="Add New Criteria"
          >
            <AddNewCriteriaForm
              onSave={handleAddNewCriteria}
              initialData={criteriaToEdit}
              editMode={editMode}
            />
          </Sidebar>
        </div>
      )}
    </div>
  );
};

export default CreateQuizHeader;
