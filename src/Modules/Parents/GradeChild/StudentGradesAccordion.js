import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// Parent-Side Grades & Semesters
import { fetchParentStudentGrades } from "../../../Store/Slices/Parent/Grades/parentGrade.action";
import { fetchSemestersByClass } from "../../../Store/Slices/Parent/Semesters/parentSemester.action";

// Admin-Side Subjects
import { fetchStudentSubjects } from "../../../Store/Slices/Admin/Users/Students/student.action";

import GradeAccordionItem from "./GradeAccordionItem";

const StudentGradesAccordion = () => {
  const dispatch = useDispatch();
  const { studentId } = useParams();

  // ==============================
  // Redux Data
  // ==============================
  // 1) Parent's children slice
  const { children } = useSelector((state) => state.Parent.children || {});
  // 2) Parent's grades slice
  const { grades } = useSelector((state) => state.Parent.grades || {});

  // Find the child that matches the URL param
  const Child = children?.find((child) => child.id === studentId);

  // ==============================
  // Local State for Semesters
  // ==============================
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);

  // ==============================
  // Handler to Fetch Grades
  // ==============================
  const getStudentGrades = (subjectId, semesterId) => {
    if (!Child?.presentClassId) return;

    // Only pass subject info in params
    const params = {};
    if (subjectId) params.subjectId = subjectId;

    // Dispatch parent-side grades thunk
    dispatch(
      fetchParentStudentGrades({
        params,
        studentId,
        studentClassId: Child.presentClassId,
        semesterId,
      })
    );
  };

  // ==============================
  // Load Semesters & Auto-Select First
  // ==============================
  const loadSemesters = async () => {
    if (!Child?.presentClassId) return;
    try {
      const response = await dispatch(
        fetchSemestersByClass({ classId: Child.presentClassId })
      ).unwrap();

      if (Array.isArray(response) && response.length > 0) {
        setSemesters(response);
        // Auto-select the first semester
        const firstSem = response[0];
        setSelectedSemester(firstSem._id);

        // Immediately fetch grades with the first semester
        getStudentGrades(null, firstSem._id);
      }
    } catch (error) {
      console.error("Failed to fetch semesters:", error);
    }
  };

  // ==============================
  // On Mount
  // ==============================
  useEffect(() => {
    if (Child?.presentClassId) {
      // 1) Fetch admin side subjects
      dispatch(fetchStudentSubjects(studentId));
      // 2) Load parent side semesters
      loadSemesters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Child]);

  return (
    <div className="flex flex-col md:flex-row w-full p-4 pl-0">
      {/* LEFT: Accordion Section */}
      <div className="md:w-3/4 w-full">
        <GradeAccordionItem
          // Pass getData that includes the selected semester
          getData={(subjectId) => getStudentGrades(subjectId, selectedSemester)}
          semesters={semesters}
          selectedSemester={selectedSemester}
          setSelectedSemester={setSelectedSemester}
        />
      </div>

      {/* RIGHT: Grade Summary Section */}
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
