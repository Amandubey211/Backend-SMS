import React from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import List from "../Component/List";
import FilterCard from "../Component/FilterCard";
import { RiListCheck3 } from "react-icons/ri";
import { useParams } from "react-router-dom";
import useFetchAssignedAssignments from "../../../../../../../Hooks/AuthHooks/Student/Assignment/useFetchAssignedAssignments";
import { useSelector } from "react-redux";

const MainSection = () => {
  const sectionId =
    useSelector((state) => state.Common.selectedSection) || "sdf67890987"; // we need section id w
  const { assignments, loading, error } =
    useFetchAssignedAssignments(sectionId);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border-l p-4">
        <List
          type="Assignment"
          title="All Assignments"
          data={assignments}
          icon={<RiListCheck3 />}
        />
      </div>
      <div className="w-[30%] p-4">
        <FilterCard />
      </div>
    </div>
  );
};

export default MainSection;
