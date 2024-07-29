import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import AddRubricModal from "../../../Rubric/Components/AddRubricModal";
import Sidebar from "../../../../../../../Components/Common/Sidebar";
import AddNewCriteriaForm from "../../../Rubric/Components/AddNewCriteriaForm";

const CreateAssignmentHeader = ({ onSave, id, isEditing }) => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [criteriaList, setCriteriaList] = useState([]);

  const handleAddCriteria = () => {
    setSidebarOpen(true);
  };

  const handleSaveCriteria = (criteria) => {
    setCriteriaList([...criteriaList, criteria]);
    setSidebarOpen(false);
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
          <span>Add Rubric</span>
        </button>
        <button
          onClick={() => {
            onSave(true);
            toast.success("Saved and Published", { position: "bottom-left" });
          }}
          className="flex-grow rounded-md py-2 px-4 text-center bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-500">
            {isEditing ? "Update & Publish" : "Save & Publish"}
          </span>
        </button>
        <button
          onClick={() => {
            onSave(false);
            toast.success("Saved", { position: "bottom-left" });
          }}
          className="px-4 py-2 text-white font-semibold rounded-md bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 transition"
        >
          Save
        </button>
        <AddRubricModal
          AssignmentId={id}
          type="assignment"
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          criteriaList={criteriaList}
          setCriteriaList={setCriteriaList}
          onAddCriteria={handleAddCriteria}
        />
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          title="Add New Criteria"
        >
          <AddNewCriteriaForm onSave={handleSaveCriteria} />
        </Sidebar>
      </div>
    </div>
  );
};

export default CreateAssignmentHeader;
