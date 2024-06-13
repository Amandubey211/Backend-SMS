

// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import { dummyStudentsList } from "../dummyData/dummyData";
// import Layout from "../../../../Components/Common/Layout";
// import DashLayout from "../../../../Components/Admin/AdminDashLayout";
// import SubjectSideBar from "../SubjectSideBar";
// import {
//   OverView,
//   CourseProgress,
//   Finance,
//   Quizzes,
//   Information,
//   Parents,
//   Grades,
//   Attendance,
//   Syllabus,
// } from "../MenuComponents"; // Assuming the components are exported from MenuComponents.js
// import BookIssue from "../Components/BookIssue";
// import ParentsProfile from "../Components/ParentsProfile";
// import StudentFinance from "../Components/StudentFinance";

// const SingleStudent = () => {
//   const { cid } = useParams();
//   const student = dummyStudentsList.find((student) => student.id === cid);
//   const [activeItem, setActiveItem] = useState("Book Issue");

//   if (!student) {
//     return <div className="text-center text-red-500">Student not found</div>;
//   }

//   const renderContent = () => {
//     switch (activeItem) {
//       case "OverView":
//         return <OverView />;
//       case "Course Progress":
//         return <CourseProgress />;
//       case "Finance":
//         return <StudentFinance student={student} />;
//       case "Quizzes":
//         return <Quizzes />;
//       case "Information":
//         return <Information />;
//       case "Parents":
//         return <ParentsProfile student={student} />;
//       case "Grades":
//         return <Grades />;
//       case "Attendance":
//         return <Attendance />;
//       case "Syllabus":
//         return <Syllabus />;
//       case "Book Issue":
//         return <BookIssue student={student} />;
//       default:
//         return <div>Select a menu item</div>;
//     }
//   };

//   return (
//     <Layout title="Student Details">
//       <DashLayout>
//         <div className="flex gap-2">
//           {/* /left side */}
//           <div className="flex flex-col   min-h-screen h-full w-[25%] ">
           
//     <div className="flex  flex-col items-center p-3 py-5  gap-2 justify-center  ">
//       <img src={student.imageUrl} alt="studnet_image" className="rounded-full w-[100px] h-[100px] " />
//       <span className="font-bold ">{student.name}</span>
//       <div className="flex  gap-4 ">
//         <span>class {student.name}</span>
//         <span>section {student.section}</span>
//         <span>id :{student.id}</span>
//       </div>
//       <div className="border rounded-md px-9 py-1 border-red-500  border-r-[50%] border-l-[50$%] ">
//       <span> Class 8</span>
//       </div>
     
//     </div>
//             {/* menu */}
//             <div className=  " flex flex-col min-h-screen h-full space-y-4  bg-gray-100 text-start items-center ">
//               {[
//                 "OverView",
//                 "Course Progress",
//                 "Finance",
//                 "Quizzes",
//                 "Information",
//                 "Parents",
//                 "Grades",
//                 "Attendance",
//                 "Syllabus",
//                 "Book Issue",
//               ].map((item, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setActiveItem(item)}
//                   className={` mt-2 px-4  ${
//                     activeItem === item
//                       ? "inline-flex items-center border border-transparent  font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white  rounded-md hover:from-pink-600 hover:to-purple-600  py-2 w-[60%] px-4 "
//                       : "text-black px-4 py-1 font-medium"
//                   } transition duration-200 ease-in-out`}
//                 >
//                   {item}
//                 </button>
//               ))}
//             </div>
//           </div>
//           {/* right side  */}

//           <div className="flex    w-[75%]">
//             <div className=" w-full  ">
//               {/* <div className=" bg-white shadow-lg rounded-lg "> */}
//               {renderContent()}
//               {/* </div> */}
//             </div>
//           </div>
//         </div>
//       </DashLayout>
//     </Layout>
//   );
// };

// export default SingleStudent;











//-----------------------------



import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { dummyStudentsList } from "../dummyData/dummyData";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import StudentProfile from "./StudentProfileCard";
import NavigationMenu from "./NavigationMenu ";
import {
  OverView,
  CourseProgress,
  Finance,
  Quizzes,
  Information,
  Parents,
  Grades,
  Attendance,
  Syllabus,
} from "../MenuComponents"; // Assuming these are properly exported
import BookIssue from "../Components/BookIssueMenu/BookIssue";
import ParentsProfile from "../Components/ParentMenu/ParentsProfile";
import StudentFinance from "../Components/FinanceMenu/StudentFinance";
import StudentAttendance from "../Components/studentAttendance/StudentAttendance";
import StudentInformationMenu from "../Components/StudentInformationMenu/StudentInformationMenu";
import StudentCourseProgress from "../Components/StudentCourseProgress/StudentCourseProgress";
import StudentGradesAccordion from "../Components/studentGradeMenu/StudentGradesAccordion";

const SingleStudent = () => {
  const { cid } = useParams();
  const student = dummyStudentsList.find((s) => s.id === cid);
  const [activeItem, setActiveItem] = useState("Book Issue");

  if (!student) {
    return <div className="text-center text-red-500">Student not found</div>;
  }

  
  const renderContent = () => {
    const menuComponents = {
      "OverView": <OverView />,
      "Course Progress": <StudentCourseProgress student={student} />,
      "Finance": <StudentFinance student={student} />,
      // "Quizzes": <Quizzes />,
      "Information": <StudentInformationMenu student={student} />,
      "Parents": <ParentsProfile student={student} />,
      "Grades": <StudentGradesAccordion student={student} />,
      "Attendance": <StudentAttendance student={student} />,
      // "Attendance": <AttendanceScheduler student={student} />,
      // "Attendance": <AttendanceCalendar  student={student} />,
      // "Syllabus": <Syllabus />,
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
