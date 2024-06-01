import TeacherBtnLogo from "../../../Assets/HomeAssets/TeacherBtnLogo.png";
import StudentBtnLogo from "../../../Assets/HomeAssets/StudentBtnLogo.png";
import ParentBtnLogo from "../../../Assets/HomeAssets/ParentBtnLogo.png";

const HomeData = [
  {
    path: "/stafflogin",
    imgSrc: TeacherBtnLogo,
    altText: "TeacherAccessLogo",
    title: "Teacher Account",
    description: "I’m an Instructor/School Admin/IT Specialist",
  },
  {
    path: "/studentlogin",
    imgSrc: StudentBtnLogo,
    altText: "StudentAccessLogo",
    title: "Student Account",
    description: "I’m a Student",
  },
  {
    path: "/parentlogin",
    imgSrc: ParentBtnLogo,
    altText: "ParentAccessLogo",
    title: "Parent Account",
    description: "I’m a Parent/Legal Guardian",
  },
];

export default HomeData;
