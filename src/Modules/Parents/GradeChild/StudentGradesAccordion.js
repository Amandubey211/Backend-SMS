import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentGrades } from "../../../Store/Slices/Admin/Users/Students/student.action";
import { useParams } from "react-router-dom";
import GradeAccordionItem from "./GradeAccordionItem";

const StudentGradesAccordion = () => {
  const { grades } = useSelector((store) => store.admin.all_students);
  const { children } = useSelector((state) => state?.Parent?.children || {});
  const { studentId } = useParams();
  const dispatch = useDispatch();

  // Filter the child whose id matches the URL param
  const Child = children?.filter((child) => child.id === studentId);

  const getStudentGrades = async (
    subjectId,
    moduleId,
    chapterId,
    arrangeBy
  ) => {
    const params = {};
    if (subjectId) params.subjectId = subjectId;
    if (moduleId) params.moduleId = moduleId;
    if (chapterId) params.chapterId = chapterId;
    if (arrangeBy) params.arrangeBy = arrangeBy;

    dispatch(
      fetchStudentGrades({
        params,
        studentId,
        studentClassId: Child?.[0]?.presentClassId,
      })
    );
  };

  useEffect(() => {
    getStudentGrades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div className="flex flex-col md:flex-row w-full p-4 pl-0">
      {/* Accordion Section */}
      <div className="md:w-3/4 w-full">
        <GradeAccordionItem getData={(subjectId) => getStudentGrades(subjectId)} />
      </div>

      {/* Vertical Divider and Grade Summary Section */}
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
