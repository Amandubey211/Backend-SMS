import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import AddRubricModal from "../../../Rubric/Components/AddRubricModal";
import Sidebar from "../../../../../../../Components/Common/Sidebar";
import AddNewCriteriaForm from "../../../Rubric/Components/AddNewCriteriaForm";
import { useTranslation } from "react-i18next";

const CreateAssignmentHeader = ({
  onSave,
  id,
  isEditing,
  criteriaList,
  setCriteriaList,
  existingRubricId,
  setExistingRubricId,
  saveLoading,
  publishLoading,
}) => {
  const { t } = useTranslation("admModule");
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
    <div className="flex items-center justify-between p-2 bg-white border border-gray-300 shadow-sm">
      <div className="flex items-center">
        <IoIosArrowBack
          className="mr-2 text-gray-600 text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
          aria-label={t("Back")}
        />
        <h1 className="text-lg font-semibold text-gray-800">
          {isEditing ? t("Update Assignment") : t("Create New Assignment")}
        </h1>
      </div>
      {/* <div className="flex items-center justify-center space-x-4">
      
        <button
          onClick={() => onSave(true)}
          className="flex items-center justify-center h-12 rounded-md px-8 bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition"
          disabled={publishLoading}
        >
          <div className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-500 text-sm font-semibold">
            {publishLoading
              ? t("please wait...")
              : isEditing
              ? t("Update & Publish")
              : t("Save & Publish")}
          </div>
        </button>
        <button
          onClick={() => onSave(false)}
          className="flex items-center justify-center h-12 px-8 text-white font-semibold rounded-md bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 transition"
          disabled={saveLoading}
        >
          {saveLoading ? t("please wait...") : t("Save")}
        </button>

        <AddRubricModal
          isOpen={isModalOpen}
          AssignmentId={id}
          onSubmit={handleSubmit}
          onClose={() => setModalOpen(false)}
          criteriaList={criteriaList}
          onEditCriteria={handleEditCriteria}
          setCriteriaList={setCriteriaList}
          setExistingRubricId={setExistingRubricId}
          readonly={false}
        />

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          title={t("Add New Criteria")}
        >
          <AddNewCriteriaForm
            onSave={handleAddNewCriteria}
            initialData={criteriaToEdit}
            editMode={editMode}
          />
        </Sidebar>
      </div> */}

      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={() => onSave(true)}
          className="flex items-center justify-center h-12 rounded-md px-8 bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition"
          disabled={publishLoading}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-500 text-sm font-semibold">
            {publishLoading
              ? t("please wait...")
              : isEditing
              ? t("Update & Publish")
              : t("Save & Publish")}
          </span>
        </button>
        <button
          onClick={() => onSave(false)}
          className="flex items-center justify-center h-12 px-8 text-white font-semibold rounded-md bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 transition"
          disabled={saveLoading}
        >
          {saveLoading ? t("please wait...") : t("Save")}
        </button>
      </div>
    </div>
  );
};

export default CreateAssignmentHeader;
