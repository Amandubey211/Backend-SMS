import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// Parent-side thunk
import { fetchParentStudentGrades } from "../../../Store/Slices/Parent/Grades/parentGrade.action";
// Suppose we also fetch parent semesters
import { fetchSemestersByClass } from "../../../Store/Slices/Parent/Semesters/parentSemester.action";
// Suppose we fetch admin subjects
import { fetchStudentSubjects } from "../../../Store/Slices/Admin/Users/Students/student.action";

import GradeAccordionItem from "./GradeAccordionItem";

const StudentGradesAccordion = () => {
  const dispatch = useDispatch();
  const { studentId } = useParams();

  // Parent children data
  const { children } = useSelector((state) => state.Parent.children || {});
  // Parent grades data
  const { grades } = useSelector((state) => state.Parent.grades || {});

  // Find the relevant child
  const Child = children?.find((child) => child.id === studentId);

  // =============== Semesters ===============
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);

  // =============== Handler to Fetch Grades ===============
  const getStudentGrades = (subjectId, semesterId) => {
    if (!Child?.presentClassId) return;

    // Build only "params" for subject, module, etc.
    const params = {};
    if (subjectId) params.subjectId = subjectId;

    // Call the parent thunk
    dispatch(
      fetchParentStudentGrades({
        params,
        studentId,
        studentClassId: Child.presentClassId,
        semesterId, // pass it as a separate arg to the thunk
      })
    );
  };

  // =============== Load Semesters & Auto-Select First ===============
  const loadSemesters = async () => {
    if (!Child?.presentClassId) return;
    try {
      const response = await dispatch(
        fetchSemestersByClass({ classId: Child.presentClassId })
      ).unwrap();
      if (Array.isArray(response) && response.length > 0) {
        setSemesters(response);
        // auto-select first
        const first = response[0];
        setSelectedSemester(first._id);
        // fetch grades immediately with first semester
        getStudentGrades(null, first._id);
      }
    } catch (error) {
      console.error("Failed to fetch semesters:", error);
    }
  };

  // =============== On Mount ===============
  useEffect(() => {
    if (Child?.presentClassId) {
      // fetch admin subjects
      dispatch(fetchStudentSubjects(studentId));
      // load parent semesters
      loadSemesters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Child]);

  return (
    <div className="flex flex-col md:flex-row w-full p-4 pl-0">
      {/* LEFT: Accordion */}
      <div className="md:w-3/4 w-full">
        <GradeAccordionItem
          getData={(subjectId) => getStudentGrades(subjectId, selectedSemester)}
          semesters={semesters}
          selectedSemester={selectedSemester}
          setSelectedSemester={setSelectedSemester}
        />
      </div>

      {/* RIGHT: Grade Summary */}
      <div className="md:w-1/4 w-full mt-4 md:mt-0 border-l border-gray-200 pl-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Grade Summary</h3>

        <div className="flex items-center justify-between mb-2 text-gray-600">
          <span>Assignment</span>
          <span>
            {grades?.totalScoreOfSubmitAssignments ?? 0} /{" "}
            {grades?.totalScoreOfAllAssignments ?? 0}
          </span>
        </div>

        <div className="flex items-center justify-between mb-2 text-gray-600">
          <span>Group Assignment</span>
          <span>
            {grades?.submittedGroupAssignmentScore ?? 0} /{" "}
            {grades?.totalGroupAssignmentScore ?? 0}
          </span>
        </div>

        <div className="flex items-center justify-between mb-2 text-gray-600">
          <span>Quiz</span>
          <span>
            {grades?.totalQuizCompletedScore ?? 0} /{" "}
            {grades?.totalScoreOfAllQuizzes ?? 0}
          </span>
        </div>

        <div className="flex items-center justify-between mb-2 text-gray-600">
          <span>Group Quiz</span>
          <span>
            {grades?.submittedGroupQuizScore ?? 0} /{" "}
            {grades?.totalGroupQuizScore ?? 0}
          </span>
        </div>

        <div className="flex items-center justify-between mb-2 text-gray-600">
          <span>Attendance</span>
          <span>{grades?.attendance ?? 0} DAY</span>
        </div>

        <div className="border-t mt-4 pt-3 flex items-center justify-between text-gray-700">
          <p className="text-lg font-semibold">Total Score:</p>
          <p className="text-pink-500 text-xl font-semibold">
            {grades?.total ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentGradesAccordion;
