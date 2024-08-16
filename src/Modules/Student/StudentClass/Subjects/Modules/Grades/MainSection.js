

// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import SubjectSideBar from "../../Component/SubjectSideBar";
// import GradeHeader from "./Component/GradeHeader";
// import StudentTable from "./Component/StudentTable";
// // import studentGrades from "./dummydata/dummystudents";
// import StudentGradeModal from "./StudentGradeViewModal/StudentGradeModal";
// import { setStudentGrade } from "../../../../../../Redux/Slices/AdminSlice";
// import StudentGradesAccordion from "./StudentGradeViewModal/Component/StudentGradesAccordion";
// import { studentGrades } from "./dummydata/studentGradesAllSubject";
// import GradeAccordionItem from "./StudentGradeViewModal/Component/GradeAccordionItem";
// import StudentGradeSummary from "./StudentGradeViewModal/Component/StudentGradeSummary";

// const MainSection = () => {
//   const studentGrade = useSelector((store) => store.Admin.studentGrade);
//   const [search, setSearch] = useState("");
//   const [filters, setFilters] = useState({
//     section: "",
//     group: "",
//     assignment: "",
//     quizzes: "",
//   });
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const dispatch = useDispatch();

//   const handleSearchChange = (value) => {
//     setSearch(value);
//   };

//   const handleFilterChange = (name, value) => {
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       [name]: value,
//     }));
//   };

//   const fuzzySearch = (query, text) => {
//     // query = query.toLowerCase();
//     // text = text.toLowerCase();
//     let queryIndex = 0;
//     for (let i = 0; i < text.length; i++) {
//       if (text[i] === query[queryIndex]) {
//         queryIndex++;
//       }
//       if (queryIndex === query.length) {
//         return true;
//       }
//     }
//     return false;
//   };

//   const filteredStudents = [studentGrades].filter((student) => {
//     return (
//       fuzzySearch(search, student.name) &&
//       (filters.section ? student.section === filters.section : true) &&
//       (filters.group ? student.group === filters.group : true) &&
//       (filters.assignment ? student.assignment === filters.assignment : true) &&
//       (filters.quizzes ? student.quizzes === filters.quizzes : true)
//     );
//   });

//   const handleRowClick = (student) => {
//     dispatch(setStudentGrade(student));
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     dispatch(setStudentGrade({}));
//   };
//   const studentData = {
//     avatar: studentGrades.avatar,
//     name: studentGrades.name,
//     section: studentGrades.section,
//     assignment: studentGrades.assignment,
//     groupAssignment: "TBD", 
//     quiz: studentGrades.quizzes,
//     groupQuiz: "TBD", 
//     attendance: studentGrades.attendance,
//     totalScore: studentGrades.score,
//   };
//   return (
  

//     <>
//      {/* <SubjectSideBar /> */}
//       <div className="flex  w-full ">
//       <SubjectSideBar />
//         <div key={studentGrades.id} className=" w-[70%]">
//           {studentGrades.grades.map((grade, index) => (
//             <GradeAccordionItem key={index} grade={grade} />
//           ))}
//         </div>
//          <div className="w-[30%] h-full border-l border-gray-200  ">
//          <StudentGradeSummary studentGrade={studentData}/>
//          </div>
//       </div>
//     </>
//   );
// };

// export default MainSection;

//------------------------

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import SubjectSideBar from "../../Component/SubjectSideBar";
import GradeAccordionItem from "./StudentGradeViewModal/Component/GradeAccordionItem";
import StudentGradeSummary from "./StudentGradeViewModal/Component/StudentGradeSummary";
import { setStudentGrade } from "../../../../../../Redux/Slices/AdminSlice";
import Spinner from "../../../../../../Components/Common/Spinner";

const MainSection = ( ) => {
  const { selectedClass, selectedSection, selectedSubject, studentId } =
  useSelector((state) => state.Common);
  // const studentGrade = useSelector((store) => store.Admin.studentGrade);
  const [gradesData, setGradesData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch the grades data when the component mounts
    if (!studentId || !selectedClass) return;
    const fetchGradesData = async () => {
      try {
        const token = localStorage.getItem("student:token");
        if (!token) {
          throw new Error("Authentication token not found");
        }
        const response = await fetch(
          `http://localhost:8080/admin/grades/student/${studentId}/class/${selectedClass}`,
          {
            headers: {
              Authentication: token,
            },
          }
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch assignment, status: ${response.status}`
          );
        }
        const data = await response.json();

        console.log(data)
        // const response = await axios.get(`http://localhost:8080/admin/grades/student/${studentId}/class/${selectedClass}`);
        setGradesData(data);

        // dispatch(setStudentGrade(response.data.student));
       
      } catch (error) {
        console.error("Error fetching grades data:", error);
      }
    };

    fetchGradesData();
  }, [studentId, selectedClass, dispatch]);

  const handleRowClick = (student) => {
    dispatch(setStudentGrade(student));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(setStudentGrade({}));
  };

  if (!gradesData) {
    return (<Spinner/>)
  }
  console.log("gradesData",gradesData)

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
  console.log("studentData",studentData)
  return (
    <>
      <div className="flex w-full">
        <SubjectSideBar />
        <div key={gradesData.student.id} className="w-[70%]">
          
            <GradeAccordionItem  grade={gradesData.grades} />
         
          {/* {gradesData.grades.map((grade, index) => (
            <GradeAccordionItem key={index} grade={grade} />
          ))} */}
        </div>
        <div className="w-[30%] h-full border-l border-gray-200">
          <StudentGradeSummary studentGrade={studentData} />
        </div>
      </div>
    </>
  );
};

export default MainSection;





