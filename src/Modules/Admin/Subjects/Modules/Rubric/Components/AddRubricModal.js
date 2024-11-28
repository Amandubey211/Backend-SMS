// src/components/Components/AddRubricModal.js

import React, { useEffect, useRef, useCallback } from "react";
import { HiOutlinePlus } from "react-icons/hi2";
import { CiBoxList } from "react-icons/ci";
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

const AddRubricModal = ({ readonly = false }) => {
  const { t } = useTranslation("admModule");
  const dispatch = useDispatch();
  const { sid } = useParams();

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
    criteriaToEdit,
  } = useSelector((state) => state.admin.rubrics);

  const { assignments } = useSelector((state) => state.admin.assignments);
  const { quizzes } = useSelector((state) => state.admin.quizzes);

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

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [dropdownOpen2, setDropdownOpen2] = React.useState(false);

  const dropdownRef = useRef(null);
  const dropdownRef2 = useRef(null);

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

  const handleSelectAssignmentChange = (id) => {
    if (id === "reset") {
      dispatch(resetRubricState());
    } else {
      // Clear specific fields
      dispatch(setRubricField({ field: "criteria", value: [] }));
      dispatch(setRubricField({ field: "rubricName", value: "" }));
      dispatch(setRubricField({ field: "existingRubricId", value: null }));
      dispatch(setRubricField({ field: "selectedAssignmentId", value: id }));
      dispatch(setRubricField({ field: "selectedQuizId", value: "" }));

      const selectedAssignment = assignments.find((a) => a._id === id);
      dispatch(
        setRubricField({
          field: "totalPoints",
          value: selectedAssignment?.points || 0,
        })
      );

      // Fetch the rubric by ID (assignment ID)
      dispatch(getRubricByIdThunk(id));
    }
    setDropdownOpen(false);
  };

  const handleSelectQuizChange = (id) => {
    if (id === "reset") {
      dispatch(resetRubricState());
    } else {
      // Clear specific fields
      dispatch(setRubricField({ field: "criteria", value: [] }));
      dispatch(setRubricField({ field: "rubricName", value: "" }));
      dispatch(setRubricField({ field: "existingRubricId", value: null }));
      dispatch(setRubricField({ field: "selectedQuizId", value: id }));
      dispatch(setRubricField({ field: "selectedAssignmentId", value: "" }));

      const selectedQuiz = quizzes.find((q) => q._id === id);
      dispatch(
        setRubricField({
          field: "totalPoints",
          value: selectedQuiz?.totalPoints || 0,
        })
      );

      // Fetch the rubric by ID (quiz ID)
      dispatch(getRubricByIdThunk(id));
    }
    setDropdownOpen2(false);
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

    if (criteria.length === 0) {
      toast.error(t("Please add at least one criteria."));
      return;
    }

    const totalScore = criteria?.reduce(
      (acc, criterion) =>
        acc +
        criterion.ratings?.reduce(
          (ratingAcc, rating) => ratingAcc + Number(rating.ratingScore),
          0
        ),
      0
    );

    const rubricData = {
      name: rubricName,
      criteria,
      assignmentId: selectedAssignmentId,
      quizId: selectedQuizId,
      totalScore,
    };

    if (existingRubricId) {
      dispatch(updateRubricThunk({ rubricId: existingRubricId, rubricData }));
    } else {
      if (selectedAssignmentId) {
        dispatch(createAssignmentRubricThunk(rubricData));
      } else {
        dispatch(createQuizRubricThunk(rubricData));
      }
    }
    dispatch(setRubricField({ field: "isModalOpen", value: false }));
    dispatch(resetRubricState());
    dispatch(fetchRubricsBySubjectId(sid));
  };

  const handleAddCriteria = () => {
    dispatch(setRubricField({ field: "isSidebarOpen", value: true }));
    dispatch(setRubricField({ field: "editMode", value: false }));
    dispatch(setRubricField({ field: "criteriaToEdit", value: null }));
  };

  return (
    <div
      className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
        isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white w-full p-3 h-[97vh] rounded-t-lg shadow-lg transform transition-transform duration-300 ${
          isModalOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center p-1">
          <h2 className="text-lg font-semibold">
            {editMode ? t("Update") : readonly ? t("View") : t("Add")} Rubric
          </h2>
          <button
            onClick={() =>
              dispatch(setRubricField({ field: "isModalOpen", value: false }))
            }
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
              onChange={(e) =>
                dispatch(
                  setRubricField({ field: "rubricName", value: e.target.value })
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
                onClick={() => !readonly && setDropdownOpen(!dropdownOpen)}
              >
                {assignments?.find((a) => a._id === selectedAssignmentId)
                  ?.name || t("Select")}
              </div>
              {dropdownOpen && !readonly && (
                <ul className="absolute left-0 right-0 mt-2 max-h-72 overflow-auto bg-white border rounded-md shadow-lg z-10 py-2">
                  {assignments?.length === 0 ? (
                    <li className="flex items-center justify-center py-2 text-gray-500">
                      <CiBoxList className="mr-2" />{" "}
                      {t("No assignments available")}
                    </li>
                  ) : (
                    <>
                      <li
                        onClick={() => handleSelectAssignmentChange("reset")}
                        className="px-4 py-2 hover:bg-gray-100 transition duration-300 transform cursor-pointer hover:translate-x-[-8px] ps-6 text-red-600"
                      >
                        {t("Reset")}
                      </li>
                      {assignments?.map((assignment) => (
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

          {/* Quiz Dropdown */}
          {selectedAssignmentId === "" && (
            <div className="p-2 flex-1 relative" ref={dropdownRef2}>
              <label className="block text-gray-700 mb-1">{t("Quizzes")}</label>
              <div
                className={`block w-full pl-3 pr-10 py-2 text-base border rounded-md ${
                  readonly ? "" : "cursor-pointer"
                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                onClick={() => !readonly && setDropdownOpen2(!dropdownOpen2)}
              >
                {quizzes?.find((q) => q._id === selectedQuizId)?.name ||
                  t("Select")}
              </div>
              {dropdownOpen2 && !readonly && (
                <ul className="absolute left-0 right-0 mt-2 max-h-72 overflow-auto bg-white border rounded-md shadow-lg z-10 py-2">
                  {quizzes?.length === 0 ? (
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
                      {quizzes?.map((quiz) => (
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
          {rubricLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : criteria?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <CiBoxList className="text-6xl text-gray-300" />
              <p className="mt-4 text-sm text-gray-600">
                {t("No criteria added yet")}
              </p>
            </div>
          ) : (
            criteria?.map((item, index) => (
              <RubricModalRow
                key={index}
                data={item}
                criteriaIndex={index}
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
              ? t("Total Assignment Points: ") + totalPoints
              : t("Total Quiz Points: ") + totalPoints}
          </div>
        </div>

        {!readonly && (
          <div className="flex justify-end gap-3 items-center p-2 mb-2">
            <button
              onClick={() =>
                dispatch(setRubricField({ field: "isModalOpen", value: false }))
              }
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

        {!readonly && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => {
              dispatch(
                setRubricField({ field: "isSidebarOpen", value: false })
              );
              dispatch(setRubricField({ field: "editMode", value: false }));
              dispatch(
                setRubricField({ field: "criteriaToEdit", value: null })
              );
            }}
            title={t(editMode ? "Update Criteria" : "Add New Criteria")}
          >
            <AddNewCriteriaForm editMode={editMode} />
          </Sidebar>
        )}
      </div>
    </div>
  );
};

export default AddRubricModal;
