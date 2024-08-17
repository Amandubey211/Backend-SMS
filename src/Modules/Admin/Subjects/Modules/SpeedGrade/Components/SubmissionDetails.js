import React, { useState, useEffect, useCallback } from "react";
import { AiOutlineFileText } from "react-icons/ai";
import { FaRegComment, FaFileAlt } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { RxPerson } from "react-icons/rx";
import { AiOutlineEye } from "react-icons/ai";
import { RiFileWord2Line } from "react-icons/ri";
import AddRubricModal from "../../Rubric/Components/AddRubricModal";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import AddNewCriteriaForm from "../../Rubric/Components/AddNewCriteriaForm";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import useAssignQuizGrade from "../../../../../../Hooks/AuthHooks/Staff/Admin/SpeedGrade/Quiz/useAssignQuizGrade";
import useAssignAssignmentGrade from "../../../../../../Hooks/AuthHooks/Staff/Admin/SpeedGrade/Assignment/useAssignAssignmentGrade";

const SubmissionDetails = ({
  details,
  student,
  initialGrade,
  totalMarksForMultipleChoiceAndTrueFalse,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [criteriaList, setCriteriaList] = useState([]);
  const [existingRubricId, setExistingRubricId] = useState(null);
  const [grade, setGrade] = useState(initialGrade || 0);
  const [attemptDate, setAttemptDate] = useState("");
  const [status, setStatus] = useState("Missing");
  const { type } = useParams();

  const {
    loading: assignGradeLoading,
    error: assignGradeError,
    assignGrade,
  } = useAssignAssignmentGrade();

  const {
    loading: assignQuizGradeLoading,
    error: assignQuizGradeError,
    assignQuizGrade,
  } = useAssignQuizGrade();

  const loading =
    type === "Assignment" ? assignGradeLoading : assignQuizGradeLoading;

  const { dueDate, points, totalPoints, comments, files } =
    details?.assignmentId || details?.quizId || {};

  const maxPoints = type === "Quiz" ? totalPoints : points;

  const wordCount = details.content ? details.content.split(/\s+/).length : 0;
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
  const { sgid } = useParams();

  useEffect(() => {
    // Reset state variables when new details are selected
    setGrade(initialGrade); // Use initial grade passed from AssignmentDetails
    setAttemptDate(
      details.submittedAt
        ? new Date(details.submittedAt).toISOString().split("T")[0]
        : ""
    );
    setStatus(details.status || "Missing");
  }, [details, initialGrade]);

  const handleGradeChange = (e) => {
    const inputGrade = e.target.value;

    // Allow clearing the input by setting grade to an empty string
    if (inputGrade === "") {
      setGrade("");
    } else {
      const parsedGrade = parseFloat(inputGrade);

      // Ensure that parsedGrade is a number and does not exceed maxPoints
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
      gradeData.score = grade; // use score instead of grade for quizzes
    }

    const result =
      type === "Assignment"
        ? await assignGrade(gradeData)
        : await assignQuizGrade(gradeData);

    if (result) {
      // Handle success (e.g., show a success message or update state)
    }
  }, [
    assignGrade,
    assignQuizGrade,
    sgid,
    grade,
    attemptDate,
    status,
    student._id,
    type,
  ]);

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
          {/* Word Count */}
          {wordCount > 0 && (
            <div className="flex items-center space-x-2 mb-3">
              <RiFileWord2Line className="text-blue-500" />
              <span className="font-medium text-sm">Word Count:</span>
              <span className="text-green-500">{wordCount} Words</span>
            </div>
          )}
          {/* Files */}
          {files && files.length > 0 && (
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
          )}
        </>
      );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 p-2 justify-center items-center border-b pb-3">
        {/* Total Marks Display */}

        {/* Grade Display */}
        <div className="flex items-center bg-white border text-sm gap-1 border-gray-300 font-semibold py-2 px-4 rounded-full hover:bg-gray-100 focus:outline-none">
          <RxPerson className="inline-block" />
          <span>
            Graded:{" "}
            <span className=" text-purple-500">
              {grade !== "" ? `${grade}` : "N/A"}
            </span>
          </span>
        </div>

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
            <p className="text-gray-500 mb-1">
              Total Marks for MCQs & True/False:
            </p>
            <p className="text-green-500 font-bold text-md">
              {totalMarksForMultipleChoiceAndTrueFalse || 0}
            </p>
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
        </div>

        <div className="mt-3">
          <h3 className="text-lg bg-gray-50 py-1 ps-3 font-semibold ">
            Submission Details
          </h3>
          <div className="space-y-2 px-3 p-2">{renderSubmissionDetails()}</div>
        </div>
      </div>

      <div className="p-4 mb-10 border-t border-gray-200">
        <button
          className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-md shadow-md hover:from-purple-500 hover:to-pink-500 focus:outline-none"
          onClick={handleSubmitGrade}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Grade →"}
        </button>
      </div>

      <AddRubricModal
        type={type === "Assignment" ? "assignment" : "quiz"}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        assignmentId={details._id}
        criteriaList={criteriaList}
        setCriteriaList={setCriteriaList}
        setExistingRubricId={setExistingRubricId}
        onAddCriteria={() => setSidebarOpen(true)}
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
