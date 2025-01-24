import React, { useEffect, useState } from "react";
import GradeAccordionItem from "./GradeAccordionItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentGrades } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";
import { useTranslation } from "react-i18next";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";

const StudentGradesAccordion = ({ student }) => {
  const { t } = useTranslation('admAccounts');
  const { grades, loading } = useSelector((store) => store.admin.all_students);
  const dispatch = useDispatch();

  const getStudentGrades = async (subjectId, moduleId, chapterId, arrangeBy) => {
    const params = {};
    if (subjectId) params.subjectId = subjectId;
    if (moduleId) params.moduleId = moduleId;
    if (chapterId) params.chapterId = chapterId;
    if (arrangeBy) params.arrangeBy = arrangeBy;
    dispatch(fetchStudentGrades({ params, studentId: student?._id, studentClassId: student?.presentClassId }));
  };

  useEffect(() => {
    getStudentGrades();
  }, [dispatch]);

  return (
    <>
    <ProtectedSection requiredPermission={PERMISSIONS. GET_STUDENT_GRADES}>
      <div className="flex flex-row w-[100%]">
        <div className="w-[75%] ">
          <GradeAccordionItem getData={(subjectId) => getStudentGrades(subjectId)} />
        </div>
        <div className="mt-4 p-3 w-[25%] border-l-2">
          <h3 className="text-md font-semibold mb-4">{t("Grade Summary")}</h3>
          <div className="flex justify-between mb-2">
            <p className="text-sm">{t("Assignment")}</p>
            <p className="text-sm">
              {grades?.totalScoreOfSubmitAssignments} / {grades?.totalScoreOfAllAssignments}
            </p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-sm">{t("Group Assignment")}</p>
            <p className="text-sm">
              {grades?.submittedGroupAssignmentScore} / {grades?.totalGroupAssignmentScore}
            </p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-sm">{t("Quiz")}</p>
            <p className="text-sm">
              {grades?.totalQuizCompletedScore} / {grades?.totalScoreOfAllQuizzes}
            </p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-sm">{t("Group Quiz")}</p>
            <p className="text-sm">
              {grades?.submittedGroupQuizScore} / {grades?.totalGroupQuizScore}
            </p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-sm">{t("Attendance")}</p>
            <p className="text-sm">
              {grades?.attendance} {t("DAY")}
            </p>
          </div>
          <div className="border-t mt-4 flex p-3 justify-between px-4 gap-1">
            <p className="text-lg font-semibold">{t("Total Score")}:</p>
            <p className="text-pink-500 text-xl font-semibold">{grades?.total}</p>
          </div>
        </div>
      </div>
      </ProtectedSection>
    </>
  );
};

export default StudentGradesAccordion;
