import React, { useEffect, useState } from "react";
import GradeAccordionItem from "./GradeAccordionItem";
import axios from "axios";
import { baseUrl } from "../../../config/Common";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";


const StudentGradesAccordion = () => {
  const { t } = useTranslation('prtChildrens');

  const { studentId } = useParams();
  const students = JSON.parse(localStorage.getItem('childrenData')) || []; // Added fallback for empty localStorage
  const student = students?.find((i) => i.id === studentId);
  const [grades, setGrades] = useState(null); // Default to null
  const [loading, setLoading] = useState(false); // Default to false
  const [showSidebar, setShowSidebar] = useState(false); // State to manage sidebar visibility


  // Fetch childrenData and presentClassId from Redux
  const childrenData = useSelector((state) => state.Parent.children.children);
  const presentClassId = childrenData && childrenData[0]?.presentClassId;
  const thestudentId = childrenData && childrenData[0]?.id; // Assuming 'id' is the field for student ID


  const fetchStudentGrades = async (subjectId, moduleId, chapterId, arrangeBy) => {
    const params = {};
    if (moduleId) params.moduleId = moduleId;
    if (chapterId) params.chapterId = chapterId;
    if (arrangeBy) params.arrangeBy = arrangeBy;

    setLoading(true);
    try {
      const token = localStorage.getItem(`parent:token`);
      const response = await axios.get(
        `${baseUrl}/admin/grades/student/${thestudentId}/class/${presentClassId}`,
        {
          headers: { Authentication: token },
          params: params,
        }
      );
      if (response.data.success) {
        setGrades(response.data);
      } else {
        setGrades({}); // Fallback to empty object if no data
      }
    } catch (err) {
      console.log("Error fetching grades");
      setGrades({}); // Even in case of error, set empty grades to avoid breaking the UI
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentGrades();
  }, []);

  const toggleSidebar = (isOpen) => {
    setShowSidebar(isOpen); // Show or hide sidebar based on accordion open state
  };

  return (
    <>
      <div className="flex flex-row w-[100%]">
        <div className="w-[75%]">
          <GradeAccordionItem
            getData={(subjectId) => fetchStudentGrades(subjectId)}
            grades={grades?.grades}
            loading={loading}
            onToggleSidebar={toggleSidebar} // Pass the function to control sidebar
          />
        </div>

        {/* Conditionally render the sidebar */}
        {showSidebar && (
          <div className="mt-4 p-3 w-[25%] border-l-2">
            <div className="flex flex-col items-center mb-8">
              <img src={student?.profile || 'https://www.iconpacks.net/icons/2/free-icon-user-3296.png'} alt="Profile" className="w-[5rem] h-[5rem] rounded-full" />
              <h2 className="text-2xl font-medium text-gray-800">{student?.name || ""}</h2> {/* Removed "N/A" */}
              <p className="text-gray-500">{t("Section")}: {student?.section || ""}</p> {/* Removed "N/A" */}
            </div>
            <h3 className="text-md font-semibold mb-4">{t("Grade Summary")}</h3>
            <div className="flex justify-between mb-2">
              <p className="text-sm">{t("Assignment")}</p>
              <p className="text-sm">
                {grades?.totalScoreOfSubmitAssignments ?? 0} / {grades?.totalScoreOfAllAssignments ?? 0}
              </p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">{t("Group Assignment")}</p>
              <p className="text-sm">
                {grades?.submittedGroupAssignmentScore ?? 0} / {grades?.totalGroupAssignmentScore ?? 0}
              </p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">{t("Quiz")}</p>
              <p className="text-sm">
                {grades?.totalQuizCompletedScore ?? 0} / {grades?.totalScoreOfAllQuizzes ?? 0}
              </p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">{t("Group Quiz")}</p>
              <p className="text-sm">
                {grades?.submittedGroupQuizScore ?? 0} / {grades?.totalGroupQuizScore ?? 0}
              </p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">{t("Attendance")}</p>
              <p className="text-sm">{grades?.attendance ?? 0} {t("Days")}</p>
            </div>
            <div className="border-t mt-4 flex p-3 justify-between gap-1">
              <p className="text-lg font-semibold">{t("Total Score")}: </p>
              <p className="text-pink-500 text-xl font-semibold">{grades?.total ?? 0}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentGradesAccordion;
