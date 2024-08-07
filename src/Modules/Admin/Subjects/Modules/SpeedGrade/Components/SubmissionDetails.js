import React, { useState } from "react";
import { AiOutlineFileText } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa"; // Import icon for user
import { AiOutlineEye } from "react-icons/ai"; // Import icon for view
import AddRubricModal from "../../Rubric/Components/AddRubricModal"; // Import the Rubric Modal component
import Sidebar from "../../../../../../Components/Common/Sidebar"; // Import Sidebar component
import AddNewCriteriaForm from "../../Rubric/Components/AddNewCriteriaForm"; // Import AddNewCriteriaForm

const SubmissionDetails = ({ assignmentId }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State for sidebar
  const [criteriaList, setCriteriaList] = useState([]);
  const [existingRubricId, setExistingRubricId] = useState(null);

  const handleViewRubric = () => {
    setModalOpen(true);
  };

  const handleAddCriteria = () => {
    setSidebarOpen(true); // Open sidebar to add new criteria
  };

  return (
    <div className="flex flex-col h-full">
      {/* New Buttons */}
      <div className="flex gap-2 justify-center items-center border-b pb-3">
        <button className="flex items-center bg-white border text-sm gap-1 border-gray-300 text-purple-500 font-semibold py-2 px-4 rounded-full shadow-md hover:bg-gray-100 focus:outline-none">
          <FaUser className="inline-block text-purple-500" />
          <span>Graded: 20/50</span>
        </button>

        <button
          className="flex items-center bg-gradient-to-r text-sm gap-1 from-pink-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:from-purple-500 hover:to-pink-500 focus:outline-none"
          onClick={handleViewRubric} // Open modal on click
        >
          <AiOutlineEye className="inline-block" />
          <span>View Rubric</span>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-2">
        {/* Submission Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Submission</h3>
          <span className="text-red-500 text-sm font-medium bg-red-100 px-2 py-0.5 rounded-full">
            8 days late
          </span>
        </div>

        <div className="space-y-4">
          {/* Due Date */}
          <div className="flex items-center space-x-2">
            <IoCalendarOutline className="text-green-500 h-5 w-5" />
            <span className="text-sm text-green-500">
              Due Date: <span>02/10/2024</span>
            </span>
          </div>

          {/* Attempt Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Attempt Date
            </label>
            <input
              type="date"
              className="mt-1 block w-full border border-gray-300 bg-white rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>

          {/* Grade */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Grade{" "}
              <span className="text-xs text-purple-600">(out of 100)</span>
            </label>
            <input
              type="number"
              defaultValue="80"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center">
                <input
                  id="status-submit"
                  name="status"
                  type="radio"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <label
                  htmlFor="status-submit"
                  className="ml-2 block text-sm text-gray-700"
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
                />
                <label
                  htmlFor="status-excused"
                  className="ml-2 block text-sm text-gray-700"
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
                />
                <label
                  htmlFor="status-missing"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Missing
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3">Submission Details</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <AiOutlineFileText className="text-blue-500" />
              <span className="font-medium text-sm">Word Count:</span>
              <span className="text-green-500">500 Word</span>
            </div>
            <div className="mt-4">
              <h4 className="font-medium text-sm mb-2">File Uploaded</h4>
              {/* <ul className="space-y-2 text-sm">
                {submission.files.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-2 text-blue-500"
                  >
                    <IoIosDocument />
                    <a href="#" className="hover:underline">
                      {file}
                    </a>
                  </li>
                ))}
              </ul> */}
            </div>
          </div>
        </div>

        <div className="space-y-2 flex-col flex justify-center items-center mb-4">
          <button className="w-52 py-2 border border-purple-300 text-green-600 font-semibold rounded-full hover:bg-purple-50 focus:outline-none flex items-center justify-center space-x-2">
            <FaRegComment className="inline-block" />
            <span>View Comments (50)</span>
          </button>
        </div>
      </div>

      {/* Fixed Submit Grade Button at the bottom */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-md shadow-md hover:from-purple-500 hover:to-pink-500 focus:outline-none">
          Submit Grade &rarr;
        </button>
      </div>

      {/* Rubric Modal */}
      <AddRubricModal
        type="assignment" // or type="quiz" based on your context
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        AssignmentId={assignmentId} // Pass assignment ID for rubric fetching
        criteriaList={criteriaList}
        setCriteriaList={setCriteriaList}
        setExistingRubricId={setExistingRubricId}
        onAddCriteria={handleAddCriteria} // Open sidebar to add new criteria
      />

      {/* Sidebar for Adding New Criteria */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title="Add New Criteria"
      >
        <AddNewCriteriaForm />
      </Sidebar>
    </div>
  );
};

export default SubmissionDetails;
