<<<<<<< HEAD
import React from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import AssignmentDetailCard from "./AssignmentComponents/AssignmentDetailCard";
import AssignmentSection from "./AssignmentComponents/AssignmentSection";
import AssignmentHeader from "./AssignmentComponents/AssignmentHeader";


const MainSection = () => {
  return (
    <div className="flex  ">
      <SubjectSideBar />
      <div className="w-[65%] border">
     {/* <AssignmentHeader/> */}
        <AssignmentSection />
      </div>
      <div className="w-[30%]">
        <AssignmentDetailCard />
      </div>
    </div>
  );
};

export default MainSection;
=======
import React, { useEffect } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import AssignmentDetailCard from "./AssignmentComponents/AssignmentDetailCard";
import AssignmentSection from "./AssignmentComponents/AssignmentSection";
import useGetAssignmentById from "../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useGetAssignmentById";
import { useParams } from "react-router-dom";

const MainSection = () => {
  const { assignmentId } = useParams();
  const { assignment, error, fetchAssignmentById, loading } = useGetAssignmentById();

  useEffect(() => {
    fetchAssignmentById(assignmentId);
    console.log(assignment);
  }, [assignmentId, fetchAssignmentById]);

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border">
        <AssignmentSection assignment={assignment} loading={loading} error={error} />
      </div>
      <div className="w-[30%]">
        <AssignmentDetailCard assignment={assignment} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default MainSection;
>>>>>>> main
