import React, { useEffect, useState } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import AssignmentDetailCard from "./AssignmentComponents/AssignmentDetailCard";
import AssignmentSection from "./AssignmentComponents/AssignmentSection";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssignmentByIdThunk } from "../../../../../Store/Slices/Admin/Class/Assignment/assignmentThunks";
import { useParams } from "react-router-dom";

const MainSection = () => {
  const { aid: assignmentId } = useParams();
  const dispatch = useDispatch();

  const {
    assignmentDetails: assignment,
    loading,
    error,
  } = useSelector((state) => state.admin.assignments);

  useEffect(() => {
    dispatch(fetchAssignmentByIdThunk(assignmentId));
  }, [assignmentId, dispatch]);

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border">
        <AssignmentSection />
      </div>
      <div className="w-[30%]">
        <AssignmentDetailCard
          isPublish={assignment?.publish}
          assignment={assignment}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default MainSection;
