import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import Layout from "../../../../Components/Common/Layout";
// import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import StudentProfile from "./StudentProfileCard";
import NavigationMenu from "./NavigationMenu.js";
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
import { useDispatch, useSelector } from "react-redux";
import { fetchAllStudents } from "../../../../../Store/Slices/Admin/Users/Students/student.action.js";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection.js";
import { PERMISSIONS } from "../../../../../config/permission.js";

const SingleStudent = () => {
  const { cid } = useParams();
  const { allStudents, loading } = useSelector(
    (store) => store.admin.all_students
  );
  const { role } = useSelector((store) => store.common.auth);
  const dispatch = useDispatch();
  const [activeItem, setActiveItem] = useState(
    role == "librarian"
      ? "Information"
      : role == "finance"
      ? "Information"
      : "OverView"
  );
  useEffect(() => {
    dispatch(fetchAllStudents());
  }, [dispatch]);
  const student = allStudents.find((s) => s._id === cid);

  console.log("sadasd", student);

  if (!loading && !student) {
    return <div className="text-center my-10">Student not found</div>;
  }
  //   "Finance": <StudentFinance student={student} />,
  const renderContent = () => {
    const menuComponents = {
      OverView: <StudentOverView student={student} />,
      "Course Progress": <StudentCourseProgress student={student} />,
      Information: <StudentInformationMenu student={student} />,
      Parents: <ParentsProfile student={student} />,
      Grades: <StudentGradesAccordion student={student} />,
      Attendance: <StudentAttendance student={student} />,
      "Book Issue": <BookIssue />,
    };
    return menuComponents[activeItem] || <div>Select a menu item</div>;
  };

  return (
    <Layout title="Student Details">
      <DashLayout>
        <div className="flex gap-2   ">
          <div className="flex flex-col  h-auto w-[25%]">
            <StudentProfile student={student} />
            <NavigationMenu
              activeItem={activeItem}
              setActiveItem={setActiveItem}
              items={
                role == "admin"
                  ? [
                      "OverView",
                      "Course Progress",
                      "Information",
                      "Parents",
                      "Grades",
                      "Attendance",
                      "Book Issue",
                    ]
                  : role == "teacher"
                  ? [
                      "OverView",
                      "Course Progress",
                      "Information",
                      "Parents",
                      "Grades",
                      "Attendance",
                      "Book Issue",
                    ]
                  : role == "finance"
                  ? ["Information", "Parents"]
                  : role == "librarian"
                  ? ["Information", "Parents", "Book Issue"]
                  : []
              }
            />
          </div>
          <div className="flex w-[75%] border border-l-1 border-l-gray-200">
            <div className="w-full">{renderContent()}</div>
          </div>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default SingleStudent;
