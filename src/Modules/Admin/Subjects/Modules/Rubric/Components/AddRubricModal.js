// src/components/Components/AddRubricModal.js

import React, { useState, useEffect, useRef, useCallback } from "react";
import { HiOutlinePlus } from "react-icons/hi2";
import { CiBoxList } from "react-icons/ci"; // Icon for no data placeholder
import RubricModalRow from "./RubricModalRow";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../../../../Components/Common/Spinner";
import {
  fetchFilteredAssignmentsThunk,
  fetchFilteredQuizzesThunk,
  getRubricByIdThunk,
} from "../../../../../../Store/Slices/Admin/Class/Rubric/rubricThunks";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AddRubricModal = ({
  isOpen,
  onClose,
  onAddCriteria,
  criteriaList,
  setCriteriaList,
  onEditCriteria,
  onSubmit,
  editMode,
  AssignmentId,
  QuizId,
  setExistingRubricId,
  readonly = false,
}) => {
  const { t } = useTranslation('admModule');
  const [rubricName, setRubricName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(
    AssignmentId || ""
  );
  const [selectedQuizId, setSelectedQuizId] = useState(QuizId || "");
  const [totalPoints, setTotalPoints] = useState(0); // To store the total points from the selected assignment/quiz
  const [selectLoading, setSelectLoading] = useState(false); // Loading state for rubric data

  const dropdownRef = useRef(null);
  const dropdownRef2 = useRef(null);
  const dispatch = useDispatch();
  const { sid } = useParams();

  // Redux state
  const { assignments, quizzes, loading } = useSelector(
    (state) => state.admin.rubrics
  );

  // Fetch filtered assignments and quizzes when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchFilteredAssignmentsThunk(sid));
      dispatch(fetchFilteredQuizzesThunk(sid));
    }
  }, [isOpen, sid, dispatch]);

  // Fetch rubric if editing an existing rubric
  useEffect(() => {
    if (isOpen && (AssignmentId || QuizId)) {
      const rubricId = AssignmentId || QuizId;
      setSelectLoading(true); // Start loading for rubric data
      dispatch(getRubricByIdThunk(rubricId)).then((result) => {
        if (result.success) {
          setCriteriaList(result.rubric.criteria);
          setRubricName(result.rubric.name);
          setExistingRubricId(result.rubric._id);

          if (AssignmentId) {
            setTotalPoints(
              assignments.find((a) => a._id === AssignmentId)?.points || 0
            );
          } else if (QuizId) {
            setTotalPoints(
              quizzes.find((q) => q._id === QuizId)?.totalPoints || 0
            );
          }
        } else {
          setCriteriaList([]); // Show empty row if no data is available
          setRubricName("");
          setExistingRubricId(null);
          setTotalPoints(0); // Reset total points if no data
        }
        setSelectLoading(false); // Stop loading
      });
    }
  }, [
    isOpen,
    AssignmentId,
    QuizId,
    dispatch,
    assignments,
    quizzes,
    setCriteriaList,
    setExistingRubricId,
  ]);

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
    setTotalPoints(0); // Reset total points
    setExistingRubricId(null);
  };

  const handleSelectAssignmentChange = (id) => {
    if (id === "reset") {
      resetSelection();
    } else {
      setSelectedAssignmentId(id);
      setSelectedQuizId(""); // Hide quiz selection when assignment is selected
      setSelectLoading(true); // Start loading
      dispatch(getRubricByIdThunk(id)).then((result) => {
        if (result.success) {
          setCriteriaList(result.rubric.criteria); // Display rubric data
          setRubricName(result.rubric.name);
          setTotalPoints(assignments.find((a) => a._id === id)?.points || 0); // Set total points for the selected assignment
          setExistingRubricId(result.rubric._id);
        } else {
          setCriteriaList([]); // Show empty row if no data is available
          setTotalPoints(
            assignments.find((a) => a._id === id)?.totalPoints || 0
          ); // Set total points even if no rubric data
        }
        setSelectLoading(false); // Stop loading
      });
    }
    setDropdownOpen(false);
  };

  const handleSelectQuizChange = (id) => {
    if (id === "reset") {
      resetSelection();
    } else {
      setSelectedQuizId(id);
      setSelectedAssignmentId(""); // Hide assignment selection when quiz is selected
      setSelectLoading(true); // Start loading
      dispatch(getRubricByIdThunk(id)).then((result) => {
        if (result.success) {
          setCriteriaList(result.rubric.criteria); // Display rubric data
          setRubricName(result.rubric.name);
          setTotalPoints(quizzes.find((q) => q._id === id)?.totalPoints || 0); // Set total points for the selected quiz
          setExistingRubricId(result.rubric._id);
        } else {
          setCriteriaList([]); // Show empty row if no data is available
          setRubricName("");
          setTotalPoints(quizzes.find((q) => q._id === id)?.totalPoints || 0); // Set total points even if no rubric data
        }
        setSelectLoading(false); // Stop loading
      });
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
    if (!rubricName) {
      toast.error(t("Rubric name is required.")); // Show toast if rubric name is empty
      return;
    }

    const targetId = selectedAssignmentId || selectedQuizId;
    if (!targetId) {
      toast.error(t("Please select either an assignment or a quiz."));
      return;
    }

    const totalScore = criteriaList.reduce(
      (acc, criterion) =>
        acc +
        criterion.ratings.reduce(
          (ratingAcc, rating) => ratingAcc + Number(rating.ratingScore),
          0
        ),
      0
    );

    const rubricData = {
      name: rubricName,
      criteria: criteriaList,
      assignmentId: selectedAssignmentId,
      quizId: selectedQuizId,
      totalScore,
    };

    await onSubmit(
      rubricData,
      selectedAssignmentId ? "createAssignmentRubric" : "createQuizRubric"
    );
  };

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
            {editMode ? t("Update") : readonly ? t("View") : t("Add")} Rubric
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
              {t("Rubric Name")}
            </label>
            <input
              type="text"
              value={rubricName}
              onChange={(e) => setRubricName(e.target.value)}
              className="block w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={t("Type here")}
              disabled={readonly}
            />
          </div>

          {/* Show only one select box based on selection */}
          {selectedQuizId === "" && (
            <div className="p-2 flex-1 relative" ref={dropdownRef}>
              <label className="block text-gray-700 mb-1">{t("Assignment")}</label>
              <div
                className="block w-full pl-3 pr-10 py-2 text-base border rounded-md cursor-pointer focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onClick={() => !readonly && setDropdownOpen(!dropdownOpen)}
              >
                {assignments.find((a) => a._id === selectedAssignmentId)
                  ?.name || t("Select")}
              </div>
              {dropdownOpen && (
                <ul className="absolute left-0 right-0 mt-2 max-h-72 overflow-auto bg-white border rounded-md shadow-lg z-10 py-2">
                  {assignments.length === 0 ? (
                    <li className="flex items-center justify-center py-2 text-gray-500">
                      <CiBoxList className="mr-2" /> {t("No assignments available")}
                    </li>
                  ) : (
                    <>
                      <li
                        onClick={() => handleSelectAssignmentChange("reset")}
                        className="px-4 py-2 hover:bg-gray-100 transition duration-300 transform cursor-pointer hover:translate-x-[-8px] ps-6 text-red-600"
                      >
                        {t("Reset")}
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
                    </>
                  )}
                </ul>
              )}
            </div>
          )}

          {selectedAssignmentId === "" && (
            <div className="p-2 flex-1 relative" ref={dropdownRef2}>
              <label className="block text-gray-700 mb-1">{t("Quizzes")}</label>
              <div
                className="block w-full pl-3 pr-10 py-2 text-base border rounded-md cursor-pointer focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onClick={() => !readonly && setDropdownOpen2(!dropdownOpen2)}
              >
                {quizzes.find((q) => q._id === selectedQuizId)?.name ||
                  t("Select")}
              </div>
              {dropdownOpen2 && (
                <ul className="absolute left-0 right-0 mt-2 max-h-72 overflow-auto bg-white border rounded-md shadow-lg z-10 py-2">
                  {quizzes.length === 0 ? (
                    <li className="flex items-center justify-center py-4 text-gray-500">
                      <CiBoxList className="mr-2" /> {t("No quizzes available")}
                    </li>
                  ) : (
                    <>
                      <li
                        onClick={() => handleSelectQuizChange("reset")}
                        className="px-4 py-2 hover:bg-gray-100 transition duration-300 transform cursor-pointer hover:translate-x-[-8px] ps-6 text-red-600"
                      >
                        {t("Reset")}
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
                    </>
                  )}
                </ul>
              )}
            </div>
          )}
        </div>

        <div
          className={`m-2 overflow-auto border ${
            readonly ? "h-[60vh]" : "h-[47vh]"
          }`}
        >
          <div className="flex px-4 font-semibold justify-between items-center p-2 w-full bg-gradient-to-r from-pink-100 to-purple-100">
            {["Criteria", "Ratings", "Point"].map((heading, idx) => (
              <div
                key={idx}
                className="w-2/8 bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent"
              >
                {t(heading)}
              </div>
            ))}
          </div>
          {selectLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : criteriaList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <CiBoxList className="text-6xl text-gray-300" />
              <p className="mt-4 text-sm text-gray-600">
                {t("No criteria added yet")}
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
                readonly={readonly}
              />
            ))
          )}
        </div>

        <div
          className={`flex ${
            !readonly ? "justify-between" : "justify-end"
          } items-center p-4 border-t`}
        >
          {!readonly && (
            <button
              onClick={onAddCriteria}
              className="flex items-center gap-2 font-semibold p-2 rounded-md bg-gradient-to-r from-pink-100 to-purple-100 hover:shadow-md transition-shadow duration-300"
            >
              <HiOutlinePlus className="text-red-600 text-2xl" />
              <span className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
                {t("Add New Criteria")}
              </span>
            </button>
          )}
          <div className="text-transparent text-xl font-bold bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            {selectedAssignmentId
              ? t("Total Assignment Points: ") + totalPoints
              : t("Total Quiz Points: ") + totalPoints}
          </div>
        </div>

        {!readonly && (
          <div className="flex justify-end gap-3 items-center p-2 mb-2">
            <button
              onClick={onClose}
              className="text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 px-4 rounded-md"
            >
              {t("Cancel")}
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 font-semibold p-2 px-4 rounded-md bg-gradient-to-r from-pink-100 to-purple-100 hover:shadow-md transition-shadow duration-300"
            >
              {t("Save Rubric")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddRubricModal;
