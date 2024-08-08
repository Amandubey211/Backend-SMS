import React, { useEffect, useState } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import AssignmentDetailCard from "./AssignmentComponents/AssignmentDetailCard";
import AssignmentSection from "./AssignmentComponents/AssignmentSection";
import useGetAssignmentById from "../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useGetAssignmentById";
import { useParams } from "react-router-dom";

const MainSection = () => {
  const { assignmentId } = useParams();
  const [refreshKey, setRefreshKey] = useState(0); // State to trigger refetch

  const { assignment, error, fetchAssignmentById, loading } =
    useGetAssignmentById();

  useEffect(() => {
    fetchAssignmentById(assignmentId);
  }, [assignmentId, fetchAssignmentById, refreshKey]); // Include refreshKey as a dependency

  const handleDataRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1); // Update refreshKey to trigger refetch
  };

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border">
        <AssignmentSection
          assignment={assignment}
          loading={loading}
          error={error}
        />
      </div>
      <div className="w-[30%]">
        <AssignmentDetailCard
          isPublish={assignment?.publish}
          assignment={assignment}
          loading={loading}
          error={error}
          onRefresh={handleDataRefresh} // Pass the refresh callback
        />
      </div>
    </div>
  );
};

export default MainSection;
