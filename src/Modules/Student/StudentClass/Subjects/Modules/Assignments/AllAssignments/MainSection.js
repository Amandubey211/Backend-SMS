// import React, { useState, useCallback, useEffect } from "react";
// import SubjectSideBar from "../../../Component/SubjectSideBar";
// import List from "../../../Component/List";
// import FilterCard from "../../../Component/FilterCard";
// import { RiListCheck3 } from "react-icons/ri";
// import useFetchAssignedAssignments from "../../../../../../../Hooks/AuthHooks/Student/Assignment/useFetchAssignedAssignments";
// import { useSelector } from "react-redux";

// const MainSection = () => {
//   const sectionId = useSelector((state) => state.Common.selectedSection);
//   const [filters, setFilters] = useState({
//     moduleId: "",
//     chapterId: "",
//   });

//   const { assignments, error, loading, fetchFilteredAssignments } =
//     useFetchAssignedAssignments(sectionId);

//   const refetchAssignments = useCallback(() => {
//     const { moduleId, chapterId } = filters;
//     fetchFilteredAssignments(sectionId, moduleId, chapterId);
//   }, [filters, sectionId, fetchFilteredAssignments]);

//   useEffect(() => {
//     refetchAssignments();
//   }, [refetchAssignments]);

//   return (
//     <div className="flex">
//       <SubjectSideBar />
//       <div className="w-[65%] border-l ">
//         <List
//           type="Assignment"
//           title="All Assignments"
//           data={assignments}
//           icon={<RiListCheck3 />}
//           loading={loading}
//           error={error}
//         />
//       </div>
//       <div className="w-[30%] p-4">
//         <FilterCard filters={filters} setFilters={setFilters} />
//       </div>
//     </div>
//   );
// };

// export default MainSection;






import React, { useState, useCallback, useEffect } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import List from "../../../Component/List";
import FilterCard from "../../../Component/FilterCard";
import { RiListCheck3 } from "react-icons/ri";
import useFetchAssignedAssignments from "../../../../../../../Hooks/AuthHooks/Student/Assignment/useFetchAssignedAssignments";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useGetFilteredAssignments from "../../../../../../../Hooks/AuthHooks/Student/Assignment/useFetchAssignedAssignments";




const MainSection = () => {
  const { selectedClass, selectedSection, selectedSubject } = useSelector((state) => state.Common);

  const { cid, sid, subjectId } = useParams(); // Ensure subjectId is part of the route parameters
  // const [assignments, setAssignments] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [filters, setFilters] = useState({
  //   moduleId: "",
  //   chapterId: "",
  // });

  const { loading, error, assignments, fetchFilteredAssignments } =
  useGetFilteredAssignments();

const [filters, setFilters] = useState({
  moduleId: "",
  chapterId: "",
});

const refetchAssignments = useCallback(() => {
  const { moduleId, chapterId, } = filters;
  fetchFilteredAssignments(sid, moduleId, chapterId, );
}, [filters, sid, fetchFilteredAssignments]);

useEffect(() => {
  refetchAssignments();
}, [refetchAssignments]);


  // useEffect(() => {
  //   console.log("Class ID (cid):", selectedClass);
  //   console.log("Section ID (sid):", selectedSection);
  //   console.log("Subject ID (subjectId):", selectedSubject);

  //   console.log("sid:", sid);
  //   console.log("cid:", cid);

  //   const fetchAssignments = async () => {
  //     // try {
  //     //   const token = localStorage.getItem('student:token');
  //     //   if (!token) {
  //     //     throw new Error('Authentication token not found');
  //     //   }

  //     //   // const response = await fetch(`http://localhost:8080/studentAssignment/class/${cid}/section/${sid}?subjectId=${subjectId}`, {
  //     //   const response = await fetch(`http://localhost:8080/student/studentAssignment/class/${selectedClass}/section/${selectedSection}?subjectId=${selectedSubject}`, {
  //     //     headers: {
  //     //       // 'Authorization': token,

  //     //       'Authentication': token
  //     //     },
  //     //   });

  //     //   if (!response.ok) {
  //     //     throw new Error(`Failed to fetch assignments, status: ${response.status}`);
  //     //   }

  //     //   console.log(response)
  //     //   const data = await response.json();
  //     //   console.log("data in assignment maisection", data)
  //     //   if (data.success && data.data) {
  //     //     setAssignments(data.data);
  //     //   } else {
  //     //     console.error("No assignment data or unsuccessful response");
  //     //   }
  //     // } catch (error) {
  //     //   console.error("Failed to fetch assignments:", error);
  //     // } finally {
  //     //   setLoading(false);
  //     // }
  //   };

  //   fetchAssignments();
  // }, [cid, sid, subjectId]);

  // if (loading) {
  //   return <div>Loading..😍.</div>;
  // }

  return (
    <div className="flex">
      {/* <SubjectSideBar />
      <div className="w-[65%] border-l ">
        <List
          type="Assignment"
          title="All Assignments"
          data={assignments}
          icon={<RiListCheck3 />}
        />
      </div>
      <div className="w-[30%] p-2 ">
        <FilterCard assignments={assignments} />
      </div> */}


      <SubjectSideBar />
      <div className="w-[65%] border-l">
        <List
          type="Assignment"
          title="All Assignments"
          data={assignments}
          icon={<RiListCheck3 />}
          loading={loading}
          error={error}
          refetchData={refetchAssignments}
        />
      </div>
      <div className="w-[30%] p-2">
        <FilterCard filters={filters} setFilters={setFilters} />
      </div>
      


    </div>
  );
};

export default MainSection;
