import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubjectSideBar from "../../Component/SubjectSideBar";
import GradeAccordionItem from "./StudentGradeViewModal/Component/GradeAccordionItem";
import StudentGradeSummary from "./StudentGradeViewModal/Component/StudentGradeSummary";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import { useParams } from "react-router-dom";

const MainSection = () => {
  const { selectedClass, studentId } = useSelector((state) => state.Common);
  const [gradesData, setGradesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const {sid} = useParams();
  useEffect(() => {
    if (!studentId || !selectedClass) return;

    const fetchGradesData = async () => {
      try {
        const token = localStorage.getItem("student:token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          `http://localhost:8080/admin/grades/student/${studentId}/class/${selectedClass}/?subjectId=${sid}`,
          {
            headers: {
              Authentication: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch grades, status: ${response.status}`);
        }

        const data = await response.json();
        setGradesData(data);
      } catch (error) {
        console.error("Error fetching grades data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGradesData();
  }, [studentId, selectedClass]);

  let content;
  if (loading) {
    content = (
      <div className="flex justify-center items-center w-full h-full">
        <Spinner />
      </div>
    );
  } else if (
    error ||
    !gradesData ||
    !Array.isArray(gradesData.grades) ||
    gradesData.grades.length === 0
  ) {
    content = <NoDataFound title="Grades" />;
  } else {
    const studentData = {
      avatar: gradesData.student.profile,
      name: gradesData.student.fullName,
      section: gradesData.student.presentSectionId,
      assignment: gradesData.totalScoreOfAllAssignments,
      groupAssignment: gradesData.submittedGroupAssignmentScore || "0",
      quiz: gradesData.totalScoreOfAllQuizzes,
      groupQuiz: gradesData.submittedGroupQuizScore || "0",
      attendance: gradesData.attendance,
      totalScore: gradesData.totalScoreOfSubmitAssignments,
      totalGroupAssignmentScore: gradesData.totalGroupAssignmentScore,
      totalGroupQuizScore: gradesData.totalGroupQuizScore,
      totalQuizCompletedScore: gradesData.totalQuizCompletedScore,
      total: gradesData.total,
    };

    content = (
      <div className="flex flex-row w-full h-full">
        <div className="w-[70%] p-4 min-h-full">
          <GradeAccordionItem grade={gradesData.grades} />
        </div>
        <div className="w-[30%] h-full border-l border-gray-200">
          <StudentGradeSummary studentGrade={studentData} />
        </div>
      </div>
    );
  }
  console.log(gradesData,"sdfsdf");
  return (
    <div className="flex w-full h-full">
      <SubjectSideBar />
      <div className="flex-grow p-4 border-l h-full">{content}</div>
    </div>
  );
};

export default MainSection;
