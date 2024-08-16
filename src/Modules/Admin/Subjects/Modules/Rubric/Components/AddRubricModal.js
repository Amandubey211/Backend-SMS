import React, { useState, useRef, useEffect, useCallback } from "react";
import { HiOutlinePlus } from "react-icons/hi2";
import { CiBoxList } from "react-icons/ci";
import RubricModalRow from "./RubricModalRow";
import toast from "react-hot-toast";
import useGetFilteredAssignments from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useGetFilteredAssignments";
import useGetFilteredQuizzes from "../../../../../../Hooks/AuthHooks/Staff/Admin/Quiz/useGetFilteredQuizzes";
import useGetRubricById from "../../../../../../Hooks/AuthHooks/Staff/Admin/Rubric/useGetRubricById.js";
import Spinner from "../../../../../../Components/Common/Spinner"; // Import your Spinner component
import { useParams } from "react-router-dom";

const AddRubricModal = ({
  type, // Can be "assignment", "quiz", or undefined
  isOpen,
  onClose,
  onAddCriteria,
  criteriaList,
  setCriteriaList,
  onEditCriteria,
  onSubmit,
  createLoading,
  updateLoading,
  editMode,
  AssignmentId, // Use this to fetch rubric for a specific assignment
  QuizId, // To fetch rubric for a specific quiz
  setExistingRubricId, // Pass this function as a prop
  readonly = false, // Readonly prop for view-only mode
}) => {
  const [rubricName, setRubricName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(
    AssignmentId || ""
  );
  const [selectedQuizId, setSelectedQuizId] = useState(QuizId || "");

  const dropdownRef = useRef(null);
  const dropdownRef2 = useRef(null);
  const { sid } = useParams();
  const { fetchFilteredAssignments, assignments } = useGetFilteredAssignments();
  const { fetchFilteredQuizzes, quizzes } = useGetFilteredQuizzes();
  const { getRubric, loading } = useGetRubricById();

  useEffect(() => {
    fetchFilteredAssignments(sid);
    fetchFilteredQuizzes();
  }, [fetchFilteredAssignments, fetchFilteredQuizzes, sid]);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Fetch rubric data based on AssignmentId or QuizId
      if (AssignmentId) {
        fetchRubricData(AssignmentId);
        setSelectedAssignmentId(AssignmentId); // Use internal state
      } else if (QuizId) {
        fetchRubricData(QuizId);
        setSelectedQuizId(QuizId);
      }
    }
  }, [isOpen, AssignmentId, QuizId]);

  const fetchRubricData = async (id) => {
    const result = await getRubric(id);
    if (result.success) {
      setCriteriaList(result.rubric.criteria);
      setRubricName(result.rubric.name);
      setExistingRubricId(result.rubric._id); // Update parent component's rubric ID
    } else {
      setCriteriaList([]);
      setRubricName("");
      setExistingRubricId(null);
    }
  };

  const handleClickOutside = useCallback(
    (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        dropdownRef2.current &&
        !dropdownRef2.current.contains(event.target)
      ) {
        setDropdownOpen2(false);
      }
    },
    [dropdownRef, dropdownRef2]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const resetSelection = () => {
    setSelectedAssignmentId("");
    setSelectedQuizId("");
    setCriteriaList([]);
    setRubricName("");
    setExistingRubricId(null);
  };

  const handleSelectAssignmentChange = (id) => {
    if (id === "reset") {
      resetSelection();
    } else {
      setSelectedAssignmentId(id);
      setSelectedQuizId(""); // Hide quiz selection when an assignment is selected
      fetchRubricData(id);
    }
    setDropdownOpen(false);
  };

  const handleSelectQuizChange = (id) => {
    if (id === "reset") {
      resetSelection();
    } else {
      setSelectedQuizId(id);
      setSelectedAssignmentId(""); // Hide assignment selection when a quiz is selected
      fetchRubricData(id);
    }
    setDropdownOpen2(false);
  };

  const handleAddRating = (criteriaIndex, ratings) => {
    setCriteriaList((prevCriteriaList) =>
      prevCriteriaList.map((crit, idx) =>
        idx === criteriaIndex ? { ...crit, ratings } : crit
      )
    );
  };

  const handleDeleteCriteria = (index) => {
    setCriteriaList((prevCriteriaList) =>
      prevCriteriaList.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async () => {
    const targetId = selectedAssignmentId || selectedQuizId;
    if (!targetId) {
      toast.error("Please select either an assignment or a quiz.");
      return;
    }

    const selectedData =
      type === "assignment"
        ? assignments.find((a) => a._id === selectedAssignmentId)
        : quizzes.find((q) => q._id === selectedQuizId);

    const totalScore = criteriaList.reduce((acc, criterion) => {
      return (
        acc +
        criterion.ratings.reduce(
          (ratingAcc, rating) => ratingAcc + Number(rating.ratingScore),
          0
        )
      );
    }, 0);

    const maxPoints =
      type === "assignment" ? selectedData?.points : selectedData?.totalPoints;

    if (totalScore != maxPoints) {
      toast.error(`Total points shoud be equal to  ${maxPoints}`);
      return;
    }

    const rubricData = {
      name: rubricName,
      criteria: criteriaList,
      assignmentId: selectedAssignmentId,
      quizId: selectedQuizId,
      totalScore,
    };

    try {
      if (selectedAssignmentId) {
        const result = await onSubmit(rubricData, "createAssignmentRubric");
        if (result.success) {
          toast.success(`Rubric for ${type} created successfully`);
        } else {
          toast.error(`Failed to create rubric for ${type}`);
        }
        onClose();
      } else {
        const result = await onSubmit(rubricData, "createQuizRubric");
        if (result.success) {
          toast.success(`Rubric for ${type} created successfully`);
        } else {
          toast.error(`Failed to create rubric for ${type}`);
        }
        onClose();
      }
    } catch (error) {
      console.log(error, "in Rubric");
    }
  };

  const selectedPoints = selectedAssignmentId
    ? assignments.find((a) => a._id === selectedAssignmentId)?.points
    : quizzes.find((q) => q._id === selectedQuizId)?.totalPoints;

  return (
    <div
      className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white w-full p-3 h-[97vh] rounded-t-lg shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center p-1">
          <h2 className="text-lg font-semibold">
            {editMode ? "Update" : readonly ? "View" : "Add"} Rubric
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 text-3xl hover:text-gray-900"
          >
            &times;
          </button>
        </div>
        <div className="flex items-center px-2">
          <div className="p-2 flex-1">
            <label className="block mb-2 text-sm text-gray-700">
              Rubric Name
            </label>
            <input
              type="text"
              value={rubricName}
              onChange={(e) => setRubricName(e.target.value)}
              className="block w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Type here"
              disabled={readonly}
            />
          </div>

          {(type === "assignment" || !type) && selectedQuizId === "" && (
            <div className="p-2 flex-1 relative" ref={dropdownRef}>
              <label className="block text-gray-700 mb-1">Assignment</label>
              <div
                className="block w-full pl-3 pr-10 py-2 text-base border rounded-md cursor-pointer focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onClick={() => !readonly && setDropdownOpen(!dropdownOpen)}
              >
                {assignments.find((a) => a._id === selectedAssignmentId)
                  ?.name || "Select"}
              </div>
              {dropdownOpen && (
                <ul className="absolute left-0 right-0 mt-2 max-h-72 overflow-auto bg-white border rounded-md shadow-lg z-10 py-2">
                  <li
                    onClick={() => handleSelectAssignmentChange("reset")}
                    className="px-4 py-2 hover:bg-gray-100 transition duration-300 transform cursor-pointer hover:translate-x-[-8px] ps-6 text-red-600"
                  >
                    Reset
                  </li>
                  {assignments.map((assignment) => (
                    <li
                      key={assignment._id}
                      onClick={() =>
                        handleSelectAssignmentChange(assignment._id)
                      }
                      className="px-4 py-2 hover:bg-gray-100 transition duration-300 transform cursor-pointer hover:translate-x-[-8px] ps-6"
                    >
                      {assignment.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {(type === "quiz" || !type) && selectedAssignmentId === "" && (
            <div className="p-2 flex-1 relative" ref={dropdownRef2}>
              <label className="block text-gray-700 mb-1">Quizzes</label>
              <div
                className="block w-full pl-3 pr-10 py-2 text-base border rounded-md cursor-pointer focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onClick={() => !readonly && setDropdownOpen2(!dropdownOpen2)}
              >
                {quizzes.find((q) => q._id === selectedQuizId)?.name ||
                  "Select"}
              </div>
              {dropdownOpen2 && (
                <ul className="absolute left-0 right-0 mt-2 max-h-72 overflow-auto bg-white border rounded-md shadow-lg z-10 py-2">
                  <li
                    onClick={() => handleSelectQuizChange("reset")}
                    className="px-4 py-2 hover:bg-gray-100 transition duration-300 transform cursor-pointer hover:translate-x-[-8px] ps-6 text-red-600"
                  >
                    Reset
                  </li>
                  {quizzes.map((quiz) => (
                    <li
                      key={quiz._id}
                      onClick={() => handleSelectQuizChange(quiz._id)}
                      className="px-4 py-2 hover:bg-gray-100 transition duration-300 transform cursor-pointer hover:translate-x-[-8px] ps-6"
                    >
                      {quiz.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <div
          className={`m-2 overflow-auto border ${
            readonly ? "h-[60vh]" : "h-[47vh]"
          } `}
        >
          <div className="flex px-4 font-semibold justify-between items-center p-2 w-full bg-gradient-to-r from-pink-100 to-purple-100">
            {["Criteria", "Ratings", "Point"].map((heading, idx) => (
              <div
                key={idx}
                className="w-2/8 bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent"
              >
                {heading}
              </div>
            ))}
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : criteriaList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <CiBoxList className="text-6xl text-gray-300" />
              <p className="mt-4 text-sm text-gray-600">
                No criteria added yet
              </p>
            </div>
          ) : (
            criteriaList.map((item, index) => (
              <RubricModalRow
                key={index}
                data={item}
                criteriaIndex={index}
                onDeleteCriteria={handleDeleteCriteria}
                onAddRating={handleAddRating}
                onEditCriteria={onEditCriteria}
                readonly={readonly} // Pass readonly to RubricModalRow
              />
            ))
          )}
        </div>

        <div className="flex justify-between items-center p-4 border-t">
          {!readonly && (
            <button
              onClick={onAddCriteria}
              className="flex items-center gap-2 font-semibold p-2 rounded-md bg-gradient-to-r from-pink-100 to-purple-100 hover:shadow-md transition-shadow duration-300"
            >
              <HiOutlinePlus className="text-red-600 text-2xl" />
              <span className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
                Add New Criteria
              </span>
            </button>
          )}
          <div className="text-transparent text-xl font-bold bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Total Points: {selectedPoints}
          </div>
        </div>

        {!readonly && (
          <div className="flex justify-end gap-3 items-center p-2 mb-2">
            <button
              onClick={onClose}
              className="text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 px-4 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={createLoading || updateLoading}
              className="flex items-center gap-2 font-semibold p-2 px-4 rounded-md bg-gradient-to-r from-pink-100 to-purple-100 hover:shadow-md transition-shadow duration-300"
            >
              {createLoading || updateLoading ? (
                "please wait..."
              ) : (
                <span className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
                  {editMode ? "Update Rubric" : "Save Rubric"}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddRubricModal;
