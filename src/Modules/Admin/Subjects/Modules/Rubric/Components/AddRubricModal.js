// src/components/Components/AddRubricModal.js

import React, { useEffect, useRef, useCallback, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi2";
import { CiBoxList, CiWarning } from "react-icons/ci";
import { AiOutlineInfoCircle } from "react-icons/ai"; // For the "i" icon
import { FaCheckCircle } from "react-icons/fa"; // For checklist bullets
import RubricModalRow from "./RubricModalRow";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../../../../Components/Common/Spinner";
import {
  createAssignmentRubricThunk,
  createQuizRubricThunk,
  updateRubricThunk,
  fetchRubricsBySubjectId,
  getRubricByIdThunk,
} from "../../../../../../Store/Slices/Admin/Class/Rubric/rubricThunks";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  setRubricField,
  resetRubricState,
} from "../../../../../../Store/Slices/Admin/Class/Rubric/rubricSlice";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import AddNewCriteriaForm from "./AddNewCriteriaForm";
import { fetchFilteredAssignments } from "../../../../../../Store/Slices/Admin/Class/Assignment/assignmentThunks";
import { fetchFilteredQuizzesThunk } from "../../../../../../Store/Slices/Admin/Class/Quiz/quizThunks";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import RubricModalShimmer from "./RubricModalShimmer";

const AddRubricModal = ({ readonly = false }) => {
  const { t } = useTranslation("admModule");
  const dispatch = useDispatch();
  const { sid } = useParams();

  // Redux state
  const {
    isModalOpen,
    criteria,
    rubricName,
    selectedAssignmentId,
    selectedQuizId,
    existingRubricId,
    totalPoints,
    rubricLoading,
    editMode,
    isSidebarOpen,
  } = useSelector((state) => state?.admin?.rubrics ?? {});

  const { assignments } = useSelector(
    (state) => state?.admin?.assignments ?? {}
  );
  const { quizzes } = useSelector((state) => state?.admin?.quizzes ?? {});

  // Local state for toggling dropdowns
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRef2 = useRef(null);

  // Local state for the “Exceeding Points” modal
  const [exceedModalOpen, setExceedModalOpen] = useState(false);

  // NEW: Local state for the “Rubric Guidelines” modal
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  // Effects
  useEffect(() => {
    if (isModalOpen) {
      dispatch(fetchFilteredAssignments({ sid }));
      dispatch(fetchFilteredQuizzesThunk({ sid }));

      if (selectedAssignmentId || selectedQuizId) {
        const targetId = selectedAssignmentId || selectedQuizId;
        dispatch(getRubricByIdThunk(targetId));
      }
    }
  }, [isModalOpen, sid, dispatch, selectedAssignmentId, selectedQuizId]);

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // Handlers
  const handleSelectAssignmentChange = (id) => {
    if (id === "reset") {
      dispatch(resetRubricState());
    } else {
      dispatch(setRubricField({ field: "criteria", value: [] }));
      dispatch(setRubricField({ field: "rubricName", value: "" }));
      dispatch(setRubricField({ field: "existingRubricId", value: null }));
      dispatch(setRubricField({ field: "selectedAssignmentId", value: id }));
      dispatch(setRubricField({ field: "selectedQuizId", value: "" }));

      const selectedAssignment = (assignments ?? []).find((a) => a._id === id);
      dispatch(
        setRubricField({
          field: "totalPoints",
          value: selectedAssignment?.points ?? 0,
        })
      );

      dispatch(getRubricByIdThunk(id));
    }
    setDropdownOpen(false);
  };

  const handleSelectQuizChange = (id) => {
    if (id === "reset") {
      dispatch(resetRubricState());
    } else {
      dispatch(setRubricField({ field: "criteria", value: [] }));
      dispatch(setRubricField({ field: "rubricName", value: "" }));
      dispatch(setRubricField({ field: "existingRubricId", value: null }));
      dispatch(setRubricField({ field: "selectedQuizId", value: id }));
      dispatch(setRubricField({ field: "selectedAssignmentId", value: "" }));

      const selectedQuiz = (quizzes ?? []).find((q) => q._id === id);
      dispatch(
        setRubricField({
          field: "totalPoints",
          value: selectedQuiz?.totalPoints ?? 0,
        })
      );

      dispatch(getRubricByIdThunk(id));
    }
    setDropdownOpen2(false);
  };

  const handleAddCriteria = () => {
    dispatch(setRubricField({ field: "isSidebarOpen", value: true }));
    dispatch(setRubricField({ field: "editMode", value: false }));
    dispatch(setRubricField({ field: "criteriaToEdit", value: null }));
  };

  const handleSubmit = () => {
    if (!rubricName) {
      toast.error(t("Rubric name is required."));
      return;
    }

    const targetId = selectedAssignmentId || selectedQuizId;
    if (!targetId) {
      toast.error(t("Please select either an assignment or a quiz."));
      return;
    }

    if ((criteria ?? []).length === 0) {
      toast.error(t("Please add at least one criteria."));
      return;
    }

    // Calculate total score from all ratings
    const totalScore = (criteria ?? []).reduce((acc, criterion) => {
      const ratingSum = (criterion?.ratings ?? []).reduce(
        (ratingAcc, rating) => ratingAcc + Number(rating?.ratingScore ?? 0),
        0
      );
      return acc + ratingSum;
    }, 0);

    // Check if totalScore exceeds totalPoints
    if (totalScore > (totalPoints ?? 0)) {
      setExceedModalOpen(true);
      return;
    }

    // Construct rubric data
    const rubricData = {
      name: rubricName,
      criteria: criteria ?? [],
      assignmentId: selectedAssignmentId,
      quizId: selectedQuizId,
      totalScore,
    };

    // Update or create rubric
    if (existingRubricId) {
      dispatch(updateRubricThunk({ rubricId: existingRubricId, rubricData }));
    } else {
      if (selectedAssignmentId) {
        dispatch(createAssignmentRubricThunk(rubricData));
      } else {
        dispatch(createQuizRubricThunk(rubricData));
      }
    }

    // Close modal and refresh
    dispatch(setRubricField({ field: "isModalOpen", value: false }));
    dispatch(resetRubricState());
    dispatch(fetchRubricsBySubjectId(sid));
  };

  return (
    <>
      {/* MAIN MODAL */}
      <div
        className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
          isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {rubricLoading ? (
          <RubricModalShimmer />
        ) : (
          <div
            className={`bg-white w-full p-3 h-[97vh] rounded-t-lg shadow-lg transform transition-transform duration-300 ${
              isModalOpen ? "translate-y-0" : "translate-y-full"
            }`}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-1">
              {/* Title with Info Icon inline */}
              <h2 className="text-lg font-semibold flex items-center gap-2">
                {editMode ? t("Update") : readonly ? t("View") : t("Add")}{" "}
                Rubric
                <button
                  onClick={() => setGuideModalOpen(true)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <AiOutlineInfoCircle className="text-xl" />
                </button>
              </h2>

              {/* Close button */}
              <button
                onClick={() =>
                  dispatch(
                    setRubricField({ field: "isModalOpen", value: false })
                  )
                }
                className="text-gray-600 text-3xl hover:text-gray-900"
              >
                &times;
              </button>
            </div>

            {/* Protected Section */}
            <ProtectedSection
              requiredPermission={
                PERMISSIONS.UPDATE_RUBRIC || PERMISSIONS.CREATE_RUBRIC
              }
              title="Add/Edit Rubric"
            >
              {/* Input fields */}
              <div className="flex items-center px-2">
                <div className="p-2 flex-1">
                  <label className="block mb-2 text-sm text-gray-700">
                    {t("Rubric Name")}
                  </label>
                  <input
                    type="text"
                    value={rubricName ?? ""}
                    onChange={(e) =>
                      dispatch(
                        setRubricField({
                          field: "rubricName",
                          value: e.target.value,
                        })
                      )
                    }
                    className="block w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder={t("Type here")}
                    disabled={readonly}
                  />
                </div>

                {/* Assignment Dropdown */}
                {selectedQuizId === "" && (
                  <div className="p-2 flex-1 relative" ref={dropdownRef}>
                    <label className="block text-gray-700 mb-1">
                      {t("Assignment")}
                    </label>
                    <div
                      className={`block w-full pl-3 pr-10 py-2 text-base border rounded-md ${
                        readonly ? "" : "cursor-pointer"
                      } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      onClick={() =>
                        !readonly && setDropdownOpen(!dropdownOpen)
                      }
                    >
                      {(assignments ?? []).find(
                        (a) => a._id === selectedAssignmentId
                      )?.name ?? t("Select")}
                    </div>
                    {dropdownOpen && !readonly && (
                      <ul className="absolute left-0 right-0 mt-2 max-h-72 overflow-auto bg-white border rounded-md shadow-lg z-10 py-2">
                        {(assignments ?? []).length === 0 ? (
                          <li className="flex items-center justify-center py-2 text-gray-500">
                            <CiBoxList className="mr-2" />{" "}
                            {t("No assignments available")}
                          </li>
                        ) : (
                          <>
                            <li
                              onClick={() =>
                                handleSelectAssignmentChange("reset")
                              }
                              className="px-4 py-2 hover:bg-gray-100 transition duration-300 transform cursor-pointer hover:translate-x-[-8px] ps-6 text-red-600"
                            >
                              {t("Reset")}
                            </li>
                            {(assignments ?? []).map((assignment) => (
                              <li
                                key={assignment?._id}
                                onClick={() =>
                                  handleSelectAssignmentChange(assignment?._id)
                                }
                                className="px-4 py-2 hover:bg-gray-100 transition duration-300 transform cursor-pointer hover:translate-x-[-8px] ps-6"
                              >
                                {assignment?.name}
                              </li>
                            ))}
                          </>
                        )}
                      </ul>
                    )}
                  </div>
                )}

                {/* Quiz Dropdown */}
                {selectedAssignmentId === "" && (
                  <div className="p-2 flex-1 relative" ref={dropdownRef2}>
                    <label className="block text-gray-700 mb-1">
                      {t("Quizzes")}
                    </label>
                    <div
                      className={`block w-full pl-3 pr-10 py-2 text-base border rounded-md ${
                        readonly ? "" : "cursor-pointer"
                      } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      onClick={() =>
                        !readonly && setDropdownOpen2(!dropdownOpen2)
                      }
                    >
                      {(quizzes ?? []).find((q) => q._id === selectedQuizId)
                        ?.name ?? t("Select")}
                    </div>
                    {dropdownOpen2 && !readonly && (
                      <ul className="absolute left-0 right-0 mt-2 max-h-72 overflow-auto bg-white border rounded-md shadow-lg z-10 py-2">
                        {(quizzes ?? []).length === 0 ? (
                          <li className="flex items-center justify-center py-4 text-gray-500">
                            <CiBoxList className="mr-2" />{" "}
                            {t("No quizzes available")}
                          </li>
                        ) : (
                          <>
                            <li
                              onClick={() => handleSelectQuizChange("reset")}
                              className="px-4 py-2 hover:bg-gray-100 transition duration-300 transform cursor-pointer hover:translate-x-[-8px] ps-6 text-red-600"
                            >
                              {t("Reset")}
                            </li>
                            {(quizzes ?? []).map((quiz) => (
                              <li
                                key={quiz?._id}
                                onClick={() =>
                                  handleSelectQuizChange(quiz?._id)
                                }
                                className="px-4 py-2 hover:bg-gray-100 transition duration-300 transform cursor-pointer hover:translate-x-[-8px] ps-6"
                              >
                                {quiz?.name}
                              </li>
                            ))}
                          </>
                        )}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Criteria List */}
              <div
                className={`m-2 overflow-auto border ${
                  readonly ? "h-[60vh]" : "h-[47vh]"
                }`}
              >
                <div className="flex px-4 font-semibold justify-between items-center p-2 w-full bg-gradient-to-r from-pink-100 to-purple-100">
                  {["Criteria", "Ratings", "Point"]?.map((heading, idx) => (
                    <div
                      key={idx}
                      className="w-2/8 bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent"
                    >
                      {t(heading)}
                    </div>
                  ))}
                </div>
                {rubricLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Spinner />
                  </div>
                ) : (criteria ?? []).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <CiBoxList className="text-6xl text-gray-300" />
                    <p className="mt-4 text-sm text-gray-600">
                      {t("No criteria added yet")}
                    </p>
                  </div>
                ) : (
                  (criteria ?? []).map((item, index) => (
                    <RubricModalRow
                      key={index}
                      data={item}
                      criteriaIndex={index}
                      readonly={readonly}
                    />
                  ))
                )}
              </div>

              {/* Bottom Section */}
              <div
                className={`flex ${
                  !readonly ? "justify-between" : "justify-end"
                } items-center p-4 border-t`}
              >
                {!readonly && (
                  <button
                    onClick={handleAddCriteria}
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
                    ? t("Total Assignment Points: ") + (totalPoints ?? 0)
                    : t("Total Quiz Points: ") + (totalPoints ?? 0)}
                </div>
              </div>

              {/* Save/Cancel (only if not read-only) */}
              {!readonly && (
                <div className="flex justify-end gap-3 items-center p-2 mb-2">
                  <button
                    onClick={() =>
                      dispatch(
                        setRubricField({ field: "isModalOpen", value: false })
                      )
                    }
                    className="text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 px-4 rounded-md"
                  >
                    {t("Cancel")}
                  </button>
                  <ProtectedAction
                    requiredPermission={PERMISSIONS.CREATE_RUBRIC}
                  >
                    <button
                      onClick={handleSubmit}
                      className="flex items-center gap-2 font-semibold p-2 px-4 rounded-md bg-gradient-to-r from-pink-100 to-purple-100 hover:shadow-md transition-shadow duration-300"
                    >
                      {t("Save Rubric")}
                    </button>
                  </ProtectedAction>
                </div>
              )}

              {/* Sidebar for adding/editing criteria */}
              {!readonly && (
                <Sidebar
                  isOpen={isSidebarOpen}
                  onClose={() => {
                    dispatch(
                      setRubricField({ field: "isSidebarOpen", value: false })
                    );
                    dispatch(
                      setRubricField({ field: "editMode", value: false })
                    );
                    dispatch(
                      setRubricField({ field: "criteriaToEdit", value: null })
                    );
                  }}
                  title={t(editMode ? "Update Criteria" : "Add New Criteria")}
                >
                  <AddNewCriteriaForm editMode={editMode} />
                </Sidebar>
              )}
            </ProtectedSection>
          </div>
        )}
      </div>

      {/* FEEDBACK MODAL FOR EXCEEDING POINTS */}
      <div
        className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          exceedModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-white w-full max-w-md mx-auto p-6 rounded shadow-lg transform transition-transform duration-300 ${
            exceedModalOpen ? "translate-y-0" : "translate-y-10"
          }`}
        >
          {/* Header with pulsing Icon, Title, etc. */}
          <div className="relative mb-6">
            <div className="absolute left-0 animate-pulse">
              <div className="bg-pink-100 rounded-full p-3">
                <CiWarning className="text-pink-500 text-4xl" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-red-600 text-center">
              {t("Exceeding Points")}
            </h2>
          </div>

          {/* Body with bold text */}
          <p className="text-gray-700 mb-4 text-center">
            <span className="font-semibold">
              {t("The total rating score exceeds the total points.")}{" "}
            </span>
            {t(
              "Please adjust your criteria or scores so that the total does not exceed"
            )}{" "}
            <span className="font-semibold">{totalPoints ?? 0}</span>.
          </p>

          {/* Enhanced display of totalScore / totalPoints */}
          <div className="flex justify-center my-6">
            <div className="bg-pink-100 text-pink-600 rounded-full h-32 w-32 flex items-center justify-center text-3xl font-bold shadow-md">
              {(criteria ?? []).reduce((acc, criterion) => {
                const ratingSum = (criterion?.ratings ?? []).reduce(
                  (rAcc, rating) => rAcc + Number(rating?.ratingScore ?? 0),
                  0
                );
                return acc + ratingSum;
              }, 0) ?? 0}
              /{totalPoints ?? 0}
            </div>
          </div>

          {/* Footer: Close button at bottom-right */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setExceedModalOpen(false)}
              className="bg-gradient-to-r from-pink-100 to-purple-100 text-gray-700 px-6 py-2 rounded hover:shadow-md transition-shadow duration-300"
            >
              {t("Close")}
            </button>
          </div>
        </div>
      </div>

      {/* GUIDE MODAL for rubric guidelines */}
      {guideModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-md mx-auto p-6 rounded shadow-lg relative">
            {/* Icon + Title at top */}
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <AiOutlineInfoCircle className="text-blue-500 text-2xl" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                {t("Rubric Creation Guidelines")}
              </h2>
            </div>
            {/* Bullet points */}
            <ul className="list-none space-y-2 text-gray-700 mb-6 pl-2">
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-500 mt-1" />
                <span>{t("Use a descriptive rubric name.")}</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-500 mt-1" />
                <span>{t("Select a valid assignment or quiz.")}</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-500 mt-1" />
                <span>{t("Add at least one criteria.")}</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-500 mt-1" />
                <span>
                  {t(
                    "Ensure the total rating points do not exceed total points."
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-500 mt-1" />
                <span>{t("Fill out all required fields.")}</span>
              </li>
            </ul>
            {/* Close button at bottom-right */}
            <div className="flex justify-end">
              <button
                onClick={() => setGuideModalOpen(false)}
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                {t("Close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddRubricModal;
