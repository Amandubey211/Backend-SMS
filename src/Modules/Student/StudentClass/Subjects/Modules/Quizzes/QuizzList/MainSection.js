


// import React, { useState, useEffect } from "react";
// import SubjectSideBar from "../../../Component/SubjectSideBar";
// // import List from "../Component/List";
// // import FilterCard from "../Component/FilterCard";

// import { RiFileUnknowLine } from "react-icons/ri";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import FilterCard from "../Component/FilterCard";
// import List from "../Component/List";

// const MainSection = () => {

//   const [filters, setFilters] = useState({
//     moduleId: "",
//     chapterId: "",
//   });
//   const { selectedClass, selectedSection, selectedSubject } = useSelector((state) => state.Common);

//   const { cid, sid, subjectId } = useParams();
//   const [quizzes, setQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
// console.log("this component");
//   useEffect(() => {
//     console.log("Class ID (cid):", selectedClass);
//     console.log("Section ID (sid):", selectedSection);
//     console.log("Subject ID (subjectId):", selectedSubject);

//     console.log("sid:", sid);
//     console.log("cid:", cid);

//     const fetchQuizzes = async () => {
//       try {
//         const token = localStorage.getItem('student:token');
//         if (!token) {
//           throw new Error('Authentication token not found');
//         }

//         const response = await fetch(`http://localhost:8080/student/studentquiz/class/${selectedClass}?subjectId=${selectedSubject}`, {
//           headers: {
//             // 'Authorization': token,
            
//             'Authentication': token

//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Failed to fetch quizzes, status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("data in quiz mainsection", data)
//         if (data.success && data.quizzes) {
//           setQuizzes(data.quizzes);
//         } else {
//           console.error("No quiz data or unsuccessful response");
//         }
//       } catch (error) {
//         console.error("Failed to fetch quizzes:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuizzes();
//   }, [cid, sid, subjectId]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex">

//       <SubjectSideBar />
//       <div className="w-[65%] border-l">
//         <List
//           type="Quiz"
//           title="All Quizzes"
//           data={quizzes}
//           icon={<RiFileUnknowLine />}
//         />
//       </div>
//       <div className="w-[30%] p-2">
//         <FilterCard />
//       </div>
//     </div>
//   );
// };

// export default MainSection;



import React, { useState, useCallback, useEffect } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import List from "../Component/List";
import FilterCard from "../../../Component/FilterCard";
import { RiFileUnknowLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useFetchQuizzes from "../../../../../../../Hooks/AuthHooks/Student/Quiz/useFetchQuizzes";
import { FaEllipsisV, FaExclamationTriangle } from "react-icons/fa";
import Spinner from "../../../../../../../Components/Common/Spinner";

const MainSection = () => {
  const { cid, sid } = useParams();
  const { selectedClass, selectedSubject } = useSelector((state) => state.Common);

  const [filters, setFilters] = useState({
    moduleId: "",
    chapterId: "",
  });

  // Use the custom hook for fetching quizzes with filters
  const { quizzes, loading, error, fetchFilteredQuizzes } = useFetchQuizzes(selectedClass, selectedSubject);

  const refetchQuizzes = useCallback(() => {
    const { moduleId, chapterId } = filters;
    fetchFilteredQuizzes(selectedClass, selectedSubject, moduleId, chapterId);
  }, [filters, selectedClass, selectedSubject, fetchFilteredQuizzes]);

  useEffect(() => {
    refetchQuizzes();
  }, [refetchQuizzes]);

  // if (loading) {
  //   return (
  //     <Spinner/>
  //   )
  // }

  // if (error) {
  //   return (

      
  //     <div className="flex flex-col items-center justify-center py-10 text-gray-500">
  //       <FaExclamationTriangle className="w-12 h-12 mb-3" />
  //       <p className="text-lg font-semibold">No data found</p>
  //     </div>
  //   )
  // }

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border-l">
        <List
          type="Quiz"
          title="All Quizes"
          data={quizzes}
          icon={<RiFileUnknowLine />}
          loading={loading}
          error={error}
        />
      </div>
      <div className="w-[30%] p-2">
        <FilterCard filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
};

export default MainSection;
