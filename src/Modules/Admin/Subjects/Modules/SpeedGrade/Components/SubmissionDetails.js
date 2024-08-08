import React, { useState, useEffect } from "react";
import { AiOutlineFileText } from "react-icons/ai";
import { FaRegComment, FaFileAlt } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { RxPerson } from "react-icons/rx";
import { AiOutlineEye } from "react-icons/ai";
import { RiFileWord2Line } from "react-icons/ri";
import AddRubricModal from "../../Rubric/Components/AddRubricModal";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import AddNewCriteriaForm from "../../Rubric/Components/AddNewCriteriaForm";
import useAssignGradeToStudent from "../../../../../../Hooks/AuthHooks/Staff/Admin/SpeedGrade/useAssignGradeToStudent ";

const SubmissionDetails = ({ assignment, student }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [criteriaList, setCriteriaList] = useState([]);
  const [existingRubricId, setExistingRubricId] = useState(null);
  const [grade, setGrade] = useState(0);
  const [attemptDate, setAttemptDate] = useState("");
  const [status, setStatus] = useState("Missing");

  const { loading, error, assignGrade } = useAssignGradeToStudent();

  const { dueDate, points } = assignment.assignmentId;
  const { content, comments, files } = assignment;
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
  const commentCount = comments.length;

  useEffect(() => {
    // Reset state variables when a new assignment is selected
    setGrade(assignment.grade || 0);
    setAttemptDate(
      assignment.submittedAt
        ? new Date(assignment.submittedAt).toISOString().split("T")[0]
        : ""
    );
    setStatus(assignment.status || "Missing");
  }, [assignment]);

  const handleViewRubric = () => {
    setModalOpen(true);
  };

  const handleAddCriteria = () => {
    setSidebarOpen(true);
  };

  const handleSubmitGrade = async () => {
    const result = await assignGrade({
      studentId: student._id,
      assignmentId: assignment._id,
      grade,
      attemptDate,
      status,
    });
    if (result) {
      // Handle success (e.g., show a success message or update state)
    }
  };

  const renderWordCount = () => {
    if (wordCount === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-4">
          <AiOutlineFileText className="text-4xl" aria-hidden="true" />
          <p className="mt-2 text-sm">No content submitted</p>
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
    if (!files || files.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-7">
          <FaFileAlt className="text-xl" aria-hidden="true" />
          <p className="mt-1 text-sm">No files uploaded</p>
        </div>
      );
    } else {
      return (
        <ul className="space-y-2 text-sm">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center space-x-2 text-blue-500"
            >
              <a href="#" className="hover:underline">
                {file}
              </a>
            </li>
          ))}
        </ul>
      );
    }
  };

  const renderSubmissionDetails = () => {
    if (wordCount === 0 && (!files || files.length === 0)) {
      return (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-4">
          <FaFileAlt className="text-4xl" aria-hidden="true" />
          <p className="mt-2 text-sm">No submission found</p>
        </div>
      );
    } else {
      return (
        <>
          {renderWordCount()}
          {renderFiles()}
        </>
      );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 p-2 justify-center items-center border-b pb-3">
        <button className="flex items-center bg-white border text-sm gap-1 border-gray-300 font-semibold py-2 px-4 rounded-full hover:bg-gray-100 focus:outline-none">
          <RxPerson className="inline-block" />
          <span>
            Graded:{" "}
            <span className=" text-purple-500">
              {grade ? `${grade}` : "N/A"}
            </span>
          </span>
        </button>

        <button
          className="flex items-center bg-gradient-to-r text-sm gap-1 from-pink-100 to-purple-100 font-semibold py-2 px-4 rounded-full hover:from-purple-200 hover:to-pink-200 focus:outline-none"
          onClick={handleViewRubric}
        >
          <AiOutlineEye className="inline-block text-gradient" />
          <span className="text-gradient">View Rubric</span>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto no-scrollbar ">
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
                (Out of {points})
              </span>
            </label>
            <input
              type="number"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
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
        </div>

        <div className="mt-3">
          <h3 className="text-lg bg-gray-50 py-1 ps-3 font-semibold ">
            Submission Details
          </h3>
          <div className="space-y-2 px-3 p-2">{renderSubmissionDetails()}</div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2 flex-col flex justify-center items-center mb-2">
          <button className="w-48 p-1 border border-purple-300 text-green-600 rounded-full hover:bg-purple-50 focus:outline-none flex items-center justify-center space-x-2">
            <FaRegComment className="inline-block" />
            <span className="text-sm"> View Comments ({commentCount})</span>
          </button>
        </div>
        <button
          className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-md shadow-md hover:from-purple-500 hover:to-pink-500 focus:outline-none"
          onClick={handleSubmitGrade}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Grade →"}
        </button>
      </div>

      <AddRubricModal
        type="assignment"
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        assignmentId={assignment._id}
        criteriaList={criteriaList}
        setCriteriaList={setCriteriaList}
        setExistingRubricId={setExistingRubricId}
        onAddCriteria={handleAddCriteria}
      />

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
