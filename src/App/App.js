import React, { Suspense, lazy, useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Error from "../Components/Common/Error.js";
import Offline from "../Components/Common/Offline.js";
import Home from "../Modules/HomePage/Home";
import ParentLogin from "../Modules/LoginPages/Parent/ParentLogin";
import StudentLogin from "../Modules/LoginPages/Student/Login/StudentLogin.js";
import StudentSignUp from "../Modules/LoginPages/Student/SignUp/StudentSignUp.js";
import ResetPassword from "../Modules/LoginPages/Student/ResetPassword/ResetPassword.js";
import Fallback from "../Components/Common/Fallback.js";
import ProtectRoute from "../Routes/ProtectedRoutes/ProtectedRoute";
import { useFirebaseMessaging } from "../Hooks/NotificationHooks/NotificationHooks.js";
import AllStudents from "../Modules/Admin//UsersProfiles/StudentProfile/MainSection.js/AllStudents.js";
import SingleStudent from "../Modules/Admin/UsersProfiles/StudentProfile/MainSection.js/SingleStudent.js";

import AllTeachers from "../Modules/Admin/UsersProfiles/TeacherProfile/AllTeachers.js";
import AllLibraian from "../Modules/Admin/UsersProfiles/LibraianProfile/AllLibraian.js";
import AllStaff from "../Modules/Admin/UsersProfiles/StaffProfile/AllStaff.js";
import AllAccountants from "../Modules/Admin/UsersProfiles/AccountantProfile/AllAccountants.js";

import StudentParentProfile from "../Modules/Admin/UsersProfiles/StudentParentsProfile/StudentParentProfile.js";
import UserProfile from "../Modules/Admin/UsersProfiles/AdminProfile/UserProfile.js";

import "./App.css";
import StudentLibrary from "../Modules/Student/Library/StudentLibrary.js";
import StudentFinance from "../Modules/Student/StudentFinance.js";
import StudentLibrarySection from "../Modules/Student/Library/MainSection/Libary.js";
import StudentEvent from "../Modules/Student/StudentEvent/StudentEvent.js";
import StudentAnnounce from "../Modules/Student/Announcements/StudentAnnounce.js";
import StaffLogin from "../Modules/LoginPages/Staff/StaffLogin.js";
import ForgetPassword from "../Modules/LoginPages/Student/Login/ForgetPassword/ForgetPassword.js";

//Parents
const ViewPage = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Pages/ViewPage/ViewPage.js")
);
const AddPage = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Pages/AddPage/AddPage.js")
);

const Page = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Pages/Page.js")
);

const Grade = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Grades/Grade.js")
);
const CreateAnnouncement = lazy(() =>
  import(
    "../Modules/Admin/Subjects/Modules/Announcement/CreateAnnouncement/CreateAnnouncement.js"
  )
);
const AnnouncementView = lazy(() =>
  import(
    "../Modules/Admin/Subjects/Modules/Announcement/AnnouncementView/AnnouncementView.js"
  )
);
const Announcement = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Announcement/Announcement.js")
);
const CreateSyllabus = lazy(() =>
  import(
    "../Modules/Admin/Subjects/Modules/Syllabus/CreateSyllabus/CreateSyllabus.js"
  )
);

const AccountingSection = lazy(() =>
  import("../Modules/Admin/Accounting/MainSection/AccountingSection.js")
);
const Syllabus = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Syllabus/SyllabusView/Syllabus.js")
);
const DiscussionView = lazy(() =>
  import(
    "../Modules/Admin/Subjects/Modules/Discussion/DiscussionView/DiscussionView.js"
  )
);
const Libary = lazy(() =>
  import("../Modules/Admin/Libary/MainSection/Libary.js")
);
const Events = lazy(() =>
  import("../Modules/Admin/Dashboard/EventModule/Event.js")
);
const EventSchool = lazy(() =>
  import("../Modules/Admin/NoticeBoard/Events/MainSection/EventSchool.js")
);
const Announce = lazy(() =>
  import("../Modules/Admin/NoticeBoard/Announcements/Announce.js")
);
const Earning = lazy(() =>
  import("../Modules/Admin/Accounting/Earnings/Earning.js")
);
const Expenses = lazy(() =>
  import("../Modules/Admin/Accounting/Expenses/Expenses.js")
);
// const AllStudents = lazy(() =>
//   import("../Modules/Admin/StudentProfile/MainSection.js/AllStudents.js")
// );
// const SingleStudent = lazy(() =>
//   import("../Modules/Admin/StudentProfile/MainSection.js/SingleStudent.js")
// );

const AssignmentList = lazy(() =>
  import(
    "../Modules/Admin/Subjects/Modules/Assignments/AllAssignments/AssignmentList.js"
  )
);
const AddDiscussion = lazy(() =>
  import(
    "../Modules/Admin/Subjects/Modules/Discussion/AddDiscussion/AddDiscussion.js"
  )
);
const TakeAttendance = lazy(() =>
  import("../Modules/Admin/Attendance/TakeAttendance/TakeAttendance.js")
);
const Discussion = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Discussion/Discussion.js")
);
const QuizzList = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Quizzes/QuizzList/QuizzList.js")
);
const CreateQuizzes = lazy(() =>
  import(
    "../Modules/Admin/Subjects/Modules/Quizzes/CreateQuizzes/CreateQuizzes.js"
  )
);
const Quizzes = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Quizzes/Quizzes.js")
);
const CreateAssignment = lazy(() =>
  import(
    "../Modules/Admin/Subjects/Modules/Assignments/CreateAssignment/CreateAssignment.js"
  )
);
const Group_Section = lazy(() =>
  import("../Modules/Admin/Groups&Sections/Group_Section.js")
);
const Rubric = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Rubric/Rubric.js")
);
const Assignment = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Assignments/Assignment.js")
);
const Module = lazy(() =>
  import("../Modules/Admin/Subjects/Modules/Module/Module.js")
);
const StudentModule = lazy(() =>
  import("../Modules/Student/StudentClass/Subjects/Modules/Module/Module.js")
);
const StudentAssignmentList = lazy(() =>
  import(
    "../Modules/Student/StudentClass/Subjects/Modules/Assignments/AllAssignments/AssignmentList.js"
  )
);

const StudentAssignmentView = lazy(() =>
  import(
    "../Modules/Student/StudentClass/Subjects/Modules/Assignments/Assignment.js"
  )
);

// student quiz import

const StudentQuizzList = lazy(() =>
  import(
    "../Modules/Student/StudentClass/Subjects/Modules/Quizzes/QuizzList/QuizzList.js"
  )
);

const StudentQuizzesView = lazy(() =>
  import("../Modules/Student/StudentClass/Subjects/Modules/Quizzes/Quizzes.js")
);
// ---------

// student Discussion import

const StudentDiscussion = lazy(() =>
  import(
    "../Modules/Student/StudentClass/Subjects/Modules/Discussion/Discussion.js"
  )
);
const StudentDiscussionView = lazy(() =>
  import(
    "../Modules/Student/StudentClass/Subjects/Modules/Discussion/DiscussionView/DiscussionView.js"
  )
);
// ---------
// student Announcemnt  import

const StudentAnnouncementView = lazy(() =>
  import(
    "../Modules/Student/StudentClass/Subjects/Modules/Announcement/AnnouncementView/AnnouncementView.js"
  )
);
const StudentAnnouncement = lazy(() =>
  import(
    "../Modules/Student/StudentClass/Subjects/Modules/Announcement/Announcement.js"
  )
);
// ---------

// student Grade import

const StudentGrade = lazy(() =>
  import("../Modules/Student/StudentClass/Subjects/Modules/Grades/Grade.js")
);

// ---------
// student Grade import

const StudentSyllabus = lazy(() =>
  import(
    "../Modules/Student/StudentClass/Subjects/Modules/Syllabus/SyllabusView/Syllabus.js"
  )
);

// ---------
// student page import

const StudentPage = lazy(() =>
  import("../Modules/Student/StudentClass/Subjects/Modules/Pages/Page.js")
);

const StudentPageView = lazy(() =>
  import(
    "../Modules/Student/StudentClass/Subjects/Modules/Pages/PageView/PageView.js"
  )
);

// ---------

const Attendance = lazy(() =>
  import("../Modules/Admin/Attendance/Attendance.js")
);
const Students = lazy(() => import("../Modules/Admin/Students/Students.js"));
const Addmission = lazy(() =>
  import("../Modules/Admin/Addmission/Addmission.js")
);
const Classes = lazy(() => import("../Modules/Admin/Classes/Classes.js"));
const Class = lazy(() => import("../Modules/Admin/Classes/SubClass/Class.js"));
const StudentClass = lazy(() =>
  import("../Modules/Student/StudentClass/SubClass/StudentClass.js")
);
// import StudentClass from "../Modules/Student/StudentClass.js";
const StudentCreateAssignment = lazy(() =>
  import(
    "../Modules/Student/StudentClass/Subjects/Modules/Assignments/CreateAssignment/CreateAssignment.js"
  )
);
const Teachers = lazy(() => import("../Modules/Admin/Teachers/Teacher.js"));
const UnVerifiedStudentDetails = lazy(() =>
  import(
    "../Modules/Admin/Verification/SubStudentVerification/UnVerifiedStudentDetails.js"
  )
);
const VerificationPage = lazy(() =>
  import("../Modules/Admin/Verification/VerificationPage.js")
);
const StudentDash = lazy(() =>
  import("../Modules/Student/Dashboard/StudentDash.js")
);
const ParentDash = lazy(() =>
  import("../Modules/Parents/Dasboard/ParentDash.js")
);
const MyChildren = lazy(() =>
  import("../Modules/Parents/Childrens/ChildScreen.js")
);
const MyTeacher = lazy(() =>
  import("../Modules/Parents/Teachers/TeacherScreen.js")
);
const Calendar = lazy(() =>
  import("../Modules/Parents/Attendance/ChildrenAttendence.js")
);
const ParentStudentNotice = lazy(() =>
  import("../Modules/Parents/Notice/Annoucements/AllNotice.js")
);
const LibraryParent = lazy(() =>
  import("../Modules/Parents/Libary/LibraryDash.js")
);
const ParentFinance = lazy(() => import("../Modules/Parents/ParentFinance.js"));
const CheckProgress = lazy(() =>
  import("../Modules/Parents/Grades/CheckProgress.js")
);
const ChildGrade = lazy(() =>
  import("../Modules/Parents/GradeChild/GradeChild.js")
);
const ParentAnnounce = lazy(() =>
  import("../Modules/Parents/Notice/Annoucements/Announce.js")
);
const StudentTeacher = lazy(() =>
  import(
    "../Modules/Student/StudentHeaderFiles/StudentTeacher/StudentTeacher.js"
  )
);
const StudentClassMates = lazy(() =>
  import(
    "../Modules/Student/StudentHeaderFiles/StudentClassMates/StudentClassMates.js"
  )
);

const Dash = lazy(() => import("../Modules/Admin/Dashboard/Dash.js"));

function App() {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  useFirebaseMessaging();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const AppRouter = createBrowserRouter([
    { path: "/", element: <Home />, errorElement: <Error /> },
    {
      path: "/studentlogin",
      element: <StudentLogin />,
      errorElement: <Error />,
    },
    { path: "/parentlogin", element: <ParentLogin />, errorElement: <Error /> },
    { path: "/stafflogin", element: <StaffLogin />, errorElement: <Error /> },
    { path: "/signup", element: <StudentSignUp />, errorElement: <Error /> },
    {
      path: "/reset_password",
      element: <ResetPassword />,
      errorElement: <Error />,
    },
    {
      path: "/forget_password",
      element: <ForgetPassword />,
      errorElement: <Error />,
    },

    // Admin Routes
    {
      path: "/dashboard",
      element: (
        <ProtectRoute Component={Dash} allowedRoles={["admin", "teacher"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class",
      element: <ProtectRoute Component={Classes} allowedRoles={["admin"]} />,
      errorElement: <Error />,
    },
    {
      path: "/class/:cid",
      element: <ProtectRoute Component={Class} allowedRoles={["admin"]} />,
      errorElement: <Error />,
    },
    {
      path: "/verify_students",
      element: (
        <ProtectRoute Component={VerificationPage} allowedRoles={["admin"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/verify_students/:sid",
      element: (
        <ProtectRoute
          Component={UnVerifiedStudentDetails}
          allowedRoles={["admin"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/admissions",
      element: <ProtectRoute Component={Addmission} allowedRoles={["admin"]} />,
      errorElement: <Error />,
    },
    // Admin Class Routes
    {
      path: "/class/:cid/teachers",
      element: <ProtectRoute Component={Teachers} allowedRoles={["admin"]} />,
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/section_group",
      element: (
        <ProtectRoute Component={Group_Section} allowedRoles={["admin"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/students",
      element: <ProtectRoute Component={Students} allowedRoles={["admin"]} />,
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/attendance",
      element: (
        <ProtectRoute
          Component={Attendance}
          allowedRoles={["admin", "teacher"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/take_attendance",
      element: (
        <ProtectRoute
          Component={TakeAttendance}
          allowedRoles={["admin", "teacher"]}
        />
      ),
      errorElement: <Error />,
    },
    // Admin Subject Module Routes
    {
      path: "/class/:cid/:sid/module",
      element: (
        <ProtectRoute Component={Module} allowedRoles={["admin", "teacher"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/assignment",
      element: (
        <ProtectRoute
          Component={AssignmentList}
          allowedRoles={["admin", "teacher"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/assignment/:aid/view",
      element: (
        <ProtectRoute
          Component={Assignment}
          allowedRoles={["admin", "teacher"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/createassignment",
      element: (
        <ProtectRoute
          Component={CreateAssignment}
          allowedRoles={["admin", "teacher"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/rubric",
      element: (
        <ProtectRoute Component={Rubric} allowedRoles={["admin", "teacher"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/quiz",
      element: (
        <ProtectRoute
          Component={QuizzList}
          allowedRoles={["admin", "teacher"]}
        />
      ),
      errorElement: <Error />,
    },

    {
      path: "/class/:cid/:sid/quiz/:qid/view",
      element: (
        <ProtectRoute Component={Quizzes} allowedRoles={["admin", "teacher"]} />
      ),
      errorElement: <Error />,
    },

    {
      path: "/class/:cid/:sid/create_quiz",
      element: (
        <ProtectRoute
          Component={CreateQuizzes}
          allowedRoles={["admin", "teacher"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/discussions",
      element: (
        <ProtectRoute
          Component={Discussion}
          allowedRoles={["admin", "teacher"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/create_discussion",
      element: (
        <ProtectRoute
          Component={AddDiscussion}
          allowedRoles={["admin", "teacher"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/discussions/:did/view",
      element: (
        <ProtectRoute
          Component={DiscussionView}
          allowedRoles={["admin", "teacher"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/syllabus",
      element: (
        <ProtectRoute
          Component={Syllabus}
          allowedRoles={["admin", "teacher"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/syllabus/create_syllabus",
      element: (
        <ProtectRoute
          Component={CreateSyllabus}
          allowedRoles={["admin", "teacher"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/announcements",
      element: (
        <ProtectRoute
          Component={Announcement}
          allowedRoles={["admin", "teacher"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/announcements/:aid/view",
      element: (
        <ProtectRoute
          Component={AnnouncementView}
          allowedRoles={["admin", "teacher"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/announcements/create_announcement",
      element: (
        <ProtectRoute
          Component={CreateAnnouncement}
          allowedRoles={["admin", "teacher"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/grades",
      element: (
        <ProtectRoute Component={Grade} allowedRoles={["admin", "teacher"]} />
      ),
      errorElement: <Error />,
    },

    {
      path: "/class/:cid/:sid/page",
      element: (
        <ProtectRoute Component={Page} allowedRoles={["admin", "teacher"]} />
      ),
      errorElement: <Error />,
    },

    {
      path: "/class/:cid/:sid/page/create_page",
      element: (
        <ProtectRoute Component={AddPage} allowedRoles={["admin", "teacher"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/class/:cid/:sid/page/:pid/view",
      element: (
        <ProtectRoute
          Component={ViewPage}
          allowedRoles={["admin", "teacher"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_dash",
      element: (
        <ProtectRoute Component={StudentDash} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    // {
    //   path: "accounting/studentfees",
    //   element: <ProtectRoute Component={AccountingSection} allowedRoles={["admin, accountant"]} />,
    //   errorElement: <Error />,
    // },

    {
      path: "accounting/studentfees",
      element: (
        <ProtectRoute
          Component={AccountingSection}
          allowedRoles={["admin", "accountant"]}
        />
      ),
      errorElement: <Error />,
    },

    {
      path: "library",
      element: <Libary />,
      errorElement: <Error />,
    },
    // { path: "library", element: <Libary />, errorElement: <Error /> },

    {
      path: "noticeboard/events",
      element: (
        <ProtectRoute
          Component={EventSchool}
          allowedRoles={["admin", "librarian", "peon"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/noticeboard/announcements",
      element: (
        <ProtectRoute
          Component={Announce}
          allowedRoles={["admin", "librarian", "peon"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/accounting/earning",
      element: (
        <ProtectRoute
          Component={Earning}
          allowedRoles={["admin", "accountant"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/accounting/expenses",
      element: (
        <ProtectRoute
          Component={Expenses}
          allowedRoles={["admin", "accountant"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/users/students",

      element: <AllStudents />,
      errorElement: <Error />,
    },
    {
      path: "/user/:cid",
      element: <SingleStudent />,
      errorElement: <Error />,
    },
    {
      path: "/users/teachers",
      element: <AllTeachers/>,
      errorElement: <Error />,
    },
    {
      path: "/users/accountants",
      element: <AllAccountants />,
      errorElement: <Error />,
    },
    {
      path: "/users/parents",
      element: <StudentParentProfile />,
      element: (
        <ProtectRoute
          Component={AllStudents}
          allowedRoles={["admin", "teacher"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/users/libraians",
      element: <AllLibraian />,
      errorElement: <Error />,
    },
    {
      path: "/users/staffs",
      element: <AllStaff />,
      errorElement: <Error />,
    },
    {
      path: "/users/admin",
      element: <UserProfile />,
      errorElement: <Error />,
    },
    // Student Routes-----------------------------

    // Student Routes-----------------------------
    {
      path: "/student_dash",
      element: <ProtectRoute Component={StudentDash} role="student" />,
      errorElement: <Error />,
    },
    {
      path: "/student_library",
      element: <StudentLibrarySection />,
      errorElement: <Error />,
    },
    {
      path: "/student_finance",
      element: <StudentFinance />,
      errorElement: <Error />,
    },
    {
      path: "/student_class",
      element: <StudentClass />,
      errorElement: <Error />,
    },
    {
      path: "/student/noticeboard/events",
      element: <StudentEvent />,
      errorElement: <Error />,
    },
    {
      path: "/student/noticeboard/announcements",
      element: <StudentAnnounce />,
      errorElement: <Error />,
    },

    {
      path: "/student_dash",
      element: <ProtectRoute Component={StudentDash} role="student" />,
      errorElement: <Error />,
    },
    {
      path: "/student_Library",
      element: <StudentLibrarySection />,
      errorElement: <Error />,
    },
    // {
    //   path: "/student_Library",
    //   element: <ProtectRoute Component={Libary} role="student" />,
    //   errorElement: <Error />,
    // },
    {
      path: "/student_finance",
      element: <StudentFinance />,
      errorElement: <Error />,
    },
    {
      path: "/student_class",
      element: <StudentClass />,
      errorElement: <Error />,
    },
    {
      path: "/student/noticeboard/events",
      element: <StudentEvent />,
      errorElement: <Error />,
    },
    {
      path: "/student/noticeboard/announcements",
      element: <StudentAnnounce />,
      errorElement: <Error />,
    },
    {
      path: "/student_dash/student/noticeboard/events",
      element: <StudentEvent />,
      errorElement: <Error />,
    },
    {
      path: "/student_dash/student/noticeboard/announcements",
      element: <StudentAnnounce />,
      errorElement: <Error />,
    },
    //Parent Routes
    {
      path: "/parent_dash",
      element: <ParentDash />,
      errorElement: <Error />,
    },
    {
      path: "/children",
      element: <MyChildren />,
      errorElement: <Error />,
    },
    {
      path: "/teacher",
      element: <MyTeacher />,
      errorElement: <Error />,
    },
    {
      path: "/attendance",
      element: <Calendar />,
      errorElement: <Error />,
    },
    {
      path: "/parentchildnotice",
      element: <ParentStudentNotice />,
      errorElement: <Error />,
    },
    {
      path: "/parentlibrary",
      element: <LibraryParent />,
      errorElement: <Error />,
    },
    {
      path: "/parentfinance",
      element: <ParentFinance />,
      errorElement: <Error />,
    },
    {
      path: "/checkprogress",
      element: <CheckProgress />,
      errorElement: <Error />,
    },
    {
      path: "/parentannounce",
      element: <ParentAnnounce />,
      errorElement: <Error />,
    },
    {
      path: "/childgrade",
      element: <ChildGrade />,
      errorElement: <Error />,
    },

    // Student Routes-----------------------------

    // {
    //   path: "/student_library",
    //   element: <StudentLibrarySection />,
    //   errorElement: <Error />,
    // },
    // {
    //   path: "/student_finance",
    //   element: <StudentFinance />,
    //   errorElement: <Error />,
    // },
    // {
    //   path: "/student_class",
    //   element: <StudentClass />,
    //   errorElement: <Error />,
    // },
    // {
    //   path: "/student/noticeboard/events",
    //   element: <StudentEvent />,
    //   errorElement: <Error />,
    // },
    // {
    //   path: "/student/noticeboard/announcements",
    //   element: <StudentAnnounce />,
    //   errorElement: <Error />,
    // },

    {
      path: "/student_dash",
      element: (
        <ProtectRoute Component={StudentDash} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_library",
      element: (
        <ProtectRoute
          Component={StudentLibrarySection}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_finance",
      element: (
        <ProtectRoute Component={StudentFinance} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student/noticeboard/events",
      element: (
        <ProtectRoute Component={StudentEvent} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student/noticeboard/announcements",
      element: (
        <ProtectRoute Component={StudentAnnounce} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    // { path: "/student_class/:cid", element: <ProtectRoute Component={StudentClass} allowedRoles={['student']} />, errorElement: <Error /> },
    {
      path: "/student_class",
      element: (
        <ProtectRoute Component={StudentClass} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    // { path: "/class/:cid", element: <ProtectRoute Component={StudentClass} allowedRoles={['student']} />, errorElement: <Error /> },
    {
      path: "/student_class/:cid/section/:sid/module",
      element: (
        <ProtectRoute Component={StudentModule} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/:cid/section/:sid/assignments",
      element: (
        <ProtectRoute
          Component={StudentAssignmentList}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },
    // { path: "/student_class/:sid/assignments", element: <ProtectRoute Component={StudentAssignmentList} allowedRoles={['student']} />, errorElement: <Error /> },
    {
      path: "/student_class/:cid/section/:sid/assignments/:aid/view",
      element: (
        <ProtectRoute
          Component={StudentAssignmentView}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },
    // { path: "/student_class/:sid/assignments/:aid/view", element: <ProtectRoute Component={StudentAssignmentView} allowedRoles={['student']} />, errorElement: <Error /> },
    {
      path: "/student_class/:sid/createassignment",
      element: (
        <ProtectRoute
          Component={StudentCreateAssignment}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/:cid/section/:sid/quizzes",
      element: (
        <ProtectRoute Component={StudentQuizzList} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/:cid/section/:sid/quizzes/:qid/view",
      element: (
        <ProtectRoute
          Component={StudentQuizzesView}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },
    {
      path: "/student_class/:cid/section/:sid/discussions",
      element: (
        <ProtectRoute
          Component={StudentDiscussion}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },
    // { path: "/student_class/:sid/discussions", element: <ProtectRoute Component={StudentDiscussion} allowedRoles={['student']} />, errorElement: <Error /> },
    {
      path: "/student_class/:cid/section/:sid/discussions/:did/view",
      element: (
        <ProtectRoute
          Component={StudentDiscussionView}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },
    // { path: "/student_class/:sid/discussions/:did/view", element: <ProtectRoute Component={StudentDiscussionView} allowedRoles={['student']} />, errorElement: <Error /> },
    {
      path: "/student_class/:cid/section/:sid/grades",
      element: (
        <ProtectRoute Component={StudentGrade} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    // { path: "/student_class/:sid/grades", element: <ProtectRoute Component={StudentGrade} allowedRoles={['student']} />, errorElement: <Error /> },
    {
      path: "/student_class/:cid/section/:sid/announcements",
      element: (
        <ProtectRoute
          Component={StudentAnnouncement}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },
    // { path: "/student_class/:sid/announcements", element: <ProtectRoute Component={StudentAnnouncement} allowedRoles={['student']} />, errorElement: <Error /> },
    {
      path: "/student_class/:cid/section/:sid/announcements/:aid/view",
      element: (
        <ProtectRoute
          Component={StudentAnnouncementView}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },
    // { path: "/student_class/:sid/announcements/:aid/view", element: <ProtectRoute Component={StudentAnnouncementView} allowedRoles={['student']} />, errorElement: <Error /> },
    {
      path: "/student_class/:cid/section/:sid/syllabus",
      element: (
        <ProtectRoute Component={StudentSyllabus} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    // { path: "/student_class/:sid/syllabus", element: <ProtectRoute Component={StudentSyllabus} allowedRoles={['student']} />, errorElement: <Error /> },
    {
      path: "/student_class/:cid/section/:sid/page",
      element: (
        <ProtectRoute Component={StudentPage} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    // { path: "/student_class/:sid/page", element: <ProtectRoute Component={StudentPage} allowedRoles={['student']} />, errorElement: <Error /> },
    {
      path: "/student_class/:cid/section/:sid/pages/:did/view",
      element: (
        <ProtectRoute Component={StudentPageView} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    // { path: "/student_class/:sid/pages/:did/view", element: <ProtectRoute Component={StudentPageView} allowedRoles={['student']} />, errorElement: <Error /> },

    {
      path: "student_class/class/:cid/teachers",
      element: (
        <ProtectRoute Component={StudentTeacher} allowedRoles={["student"]} />
      ),
      errorElement: <Error />,
    },
    // {
    //   path: "student_class/class/:cid/section_group",
    //   element: <ProtectRoute Component={Group_Section} allowedRoles={["student"]} />,
    //   errorElement: <Error />,
    // },
    {
      path: "student_class/class/:cid/classmates",
      element: (
        <ProtectRoute
          Component={StudentClassMates}
          allowedRoles={["student"]}
        />
      ),
      errorElement: <Error />,
    },
    // {
    //   path: "student_class/class/:cid/attendance",
    //   element: <ProtectRoute Component={Attendance} allowedRoles={["student", "teacher"]} />,
    //   errorElement: <Error />,
    // },

    // {
    //   path: "/student_dash",
    //   element: <ProtectRoute Component={StudentDash} role="student" />,
    //   errorElement: <Error />,
    // },
    // {
    //   path: "/student_class/:sid/module",
    //   element: <ProtectRoute Component={StudentModule} role="student" />,
    //   errorElement: <Error />,
    // },

    // {
    //   path: "/student_class/:sid/assignments",
    //   element: <ProtectRoute Component={StudentAssignmentList} role="student" />,
    //   errorElement: <Error />,
    // },
    // {
    //   path: "/student_class/:sid/assignments/:aid/view",
    //   element: <ProtectRoute Component={StudentAssignmentView} role="student" />,
    //   errorElement: <Error />,
    // },
    // {
    //   path: "/student_class/:sid/createassignment",
    //   element: <ProtectRoute Component={StudentCreateAssignment} role="student" />,
    //   errorElement: <Error />,
    // },

    // {
    //   path: "/student_class/:sid/quizzes",
    //   element: <ProtectRoute Component={StudentQuizzList} role="student" />,
    //   errorElement: <Error />,
    // },
    // {
    //   path: "/student_class/:sid/quizzes/:qid/view",
    //   element: <ProtectRoute Component={StudentQuizzesView} role="student" />,
    //   errorElement: <Error />,
    // },
    // {
    //   path: "/student_class/:sid/discussions",
    //   element: <ProtectRoute Component={StudentDiscussion} role="student" />,
    //   errorElement: <Error />,
    // },
    // {
    //   path: "/student_class/:sid/discussions/:did/view",
    //   element: <ProtectRoute Component={StudentDiscussionView} role="student" />,
    //   errorElement: <Error />,
    // },
    // {
    //   path: "/student_class/:sid/grades",
    //   element: <ProtectRoute Component={StudentGrade} role="student" />,
    //   errorElement: <Error />,
    // },

    // {
    //   path: "/student_class/:sid/announcements",
    //   element: <ProtectRoute Component={StudentAnnouncement} role="student" />,
    //   errorElement: <Error />,
    // },
    // {
    //   path: "/student_class/:sid/announcements/:aid/view",
    //   element: <ProtectRoute Component={StudentAnnouncementView} role="student" />,
    //   errorElement: <Error />,
    // },
    // {
    //   path: "/student_class/:sid/syllabus",
    //   element: <ProtectRoute Component={StudentSyllabus} role="student" />,
    //   errorElement: <Error />,
    // },

    // {
    //   path: "/student_class/:sid/page",
    //   element: <ProtectRoute Component={StudentPage} role="student" />,
    //   errorElement: <Error />,
    // },

    // {
    //   path: "/student_class/:sid/pages/:did/view",
    //   element: <ProtectRoute Component={StudentPageView} role="student" />,
    //   errorElement: <Error />,
    // },

    { path: "/user/:cid", element: <SingleStudent />, errorElement: <Error /> },
  ]);

  return (
    <>
      {!isOnline && <Offline />}
      <Suspense fallback={<Fallback />}>
        <RouterProvider router={AppRouter} />
      </Suspense>
    </>
  );
}

export default App;
