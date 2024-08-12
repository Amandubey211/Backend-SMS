import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import AddRubricModal from "../../../Rubric/Components/AddRubricModal";
import Sidebar from "../../../../../../../Components/Common/Sidebar";
import AddNewCriteriaForm from "../../../Rubric/Components/AddNewCriteriaForm";
import toast from "react-hot-toast";

const CreateQuizHeader = ({ onSave, isEditing, quizId }) => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Add criteriaList state
  const [criteriaList, setCriteriaList] = useState([]);

  return (
    <div className="flex items-center justify-between p-2 bg-white border-b border-gray-300 shadow-sm">
      <div className="flex items-center">
        <IoIosArrowBack
          className="mr-2 text-gray-600 text-2xl cursor-pointer"
          onClick={() => navigate(-1)} // Navigate to the previous page
        />
        <h1 className="text-lg font-semibold text-gray-800">
          {isEditing ? "Update Quiz" : "Create New Quiz"}
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        {/* <button
          onClick={() => setModalOpen(true)}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-pink-500 hover:bg-gray-100 transition"
        >
          <span className="mr-1">+</span>
          <span>Add Rubric</span>
        </button> */}
        <button
          onClick={() => {
            onSave(true);
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
          }}
          className="px-4 py-2 text-white font-semibold rounded-md bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 transition"
        >
          Save
        </button>
        <AddRubricModal
          type="quiz"
          quizId={quizId}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onAddCriteria={() => setSidebarOpen(true)} // Pass down function to open sidebar
          criteriaList={criteriaList} // Pass criteriaList state
          setCriteriaList={setCriteriaList} // Pass setCriteriaList function
        />
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)} // Pass down function to close sidebar
          title="Add New Criteria"
        >
          <AddNewCriteriaForm />
        </Sidebar>
      </div>
    </div>
  );
};

export default CreateQuizHeader;
