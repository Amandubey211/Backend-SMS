// import React from "react";
// import SubjectSideBar from "../../../Component/SubjectSideBar";
// import List from "../../Assignments/Component/List";
// import FilterCard from "../../Assignments/Component/FilterCard";
// import { RiAddFill, RiFileUnknowLine } from "react-icons/ri";
// import { assignments } from "../../Assignments/AllAssignments/DummyData/assignments";
// import { NavLink, useParams } from "react-router-dom";
// import useNavHeading from "../../../../../../../Hooks/CommonHooks/useNavHeading ";
// // import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
// // useNavHeading
// const MainSection = () => {
//   const { cid, sid } = useParams();
//   useNavHeading(cid, sid);
//   return (
//     <div className="flex  ">
//       <SubjectSideBar />
//       <div className="w-[65%] border-l">
//         <List title="All Quizzes"  data={assignments} icon={<RiFileUnknowLine />} />
//       </div>
//       <div className="w-[30%] px-2">
//         <FilterCard />
//       </div>
//       <NavLink
//         to={`/class/${cid}/${sid}/create_quiz`}
//         className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4"
//       >
//         <RiAddFill size={24} />
//       </NavLink>
//     </div>
//   );
// };

// export default MainSection;




import React, { useState, useEffect } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
// import List from "../Component/List";
// import FilterCard from "../Component/FilterCard";

import { RiFileUnknowLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import FilterCard from "../Component/FilterCard";
import List from "../Component/List";

const MainSection = () => {
  const { selectedClass, selectedSection, selectedSubject } = useSelector((state) => state.Common);

  const { cid, sid, subjectId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
console.log("this component");
  useEffect(() => {
    console.log("Class ID (cid):", selectedClass);
    console.log("Section ID (sid):", selectedSection);
    console.log("Subject ID (subjectId):", selectedSubject);

    console.log("sid:", sid);
    console.log("cid:", cid);

    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('student:token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(`http://localhost:8080/student/studentquiz/class/${selectedClass}?subjectId=${selectedSubject}`, {
          headers: {
            'Authorization': token,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch quizzes, status: ${response.status}`);
        }

        const data = await response.json();
        console.log("data in quiz mainsection", data)
        if (data.success && data.quizzes) {
          setQuizzes(data.quizzes);
        } else {
          console.error("No quiz data or unsuccessful response");
        }
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [cid, sid, subjectId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">

      <SubjectSideBar />
      <div className="w-[65%] border-l">
        <List
          type="Quiz"
          title="All Quizzes"
          data={quizzes}
          icon={<RiFileUnknowLine />}
        />
      </div>
      <div className="w-[30%] p-2">
        <FilterCard />
      </div>
    </div>
  );
};

export default MainSection;
