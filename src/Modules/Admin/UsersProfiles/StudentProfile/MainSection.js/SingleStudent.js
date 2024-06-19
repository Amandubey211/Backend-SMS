


import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { dummyStudentsList } from "../dummyData/dummyData";
// import Layout from "../../../../Components/Common/Layout";
// import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import StudentProfile from "./StudentProfileCard";
import NavigationMenu from "./NavigationMenu ";
import BookIssue from "../Components/BookIssueMenu/BookIssue";
import ParentsProfile from "../Components/ParentMenu/ParentsProfile";
import StudentFinance from "../Components/FinanceMenu/StudentFinance";
import StudentAttendance from "../Components/studentAttendance/StudentAttendance";
import StudentInformationMenu from "../Components/StudentInformationMenu/StudentInformationMenu";
import StudentCourseProgress from "../Components/StudentCourseProgress/StudentCourseProgress";
import StudentGradesAccordion from "../Components/studentGradeMenu/StudentGradesAccordion";
import StudentOverView from "../Components/StudentOverView/StudentOverView";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";

const SingleStudent = () => {
  const { cid } = useParams();
  const student = dummyStudentsList.find((s) => s.id === cid);
  const [activeItem, setActiveItem] = useState("OverView");

  if (!student) {
    return <div className="text-center text-red-500">Student not found</div>;
  }

  
  const renderContent = () => {
    const menuComponents = {
      "OverView": <StudentOverView />,
      "Course Progress": <StudentCourseProgress student={student} />,
      "Finance": <StudentFinance student={student} />,
      "Information": <StudentInformationMenu student={student} />,
      "Parents": <ParentsProfile student={student} />,
      "Grades": <StudentGradesAccordion student={student} />,
      "Attendance": <StudentAttendance student={student} />,
      "Book Issue": <BookIssue student={student} />
    };
    return menuComponents[activeItem] || <div>Select a menu item</div>;
  };

  return (
    <Layout title="Student Details">
      <DashLayout>
        <div className="flex gap-2">
          <div className="flex flex-col min-h-screen h-full w-[25%]">
            <StudentProfile student={student} />
            <NavigationMenu activeItem={activeItem} setActiveItem={setActiveItem} items={[
              "OverView", "Course Progress", "Finance", "Information", 
              "Parents", "Grades", "Attendance", "Book Issue"
            ]} />
          </div>
          <div className="flex w-[75%]">
            <div className="w-full">{renderContent()}</div>
          </div>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default SingleStudent;
