import React, { useState, useCallback, useEffect } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import FilterCard from "../../../Component/FilterCard";
import { RiListCheck3 } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import List from "../../../Component/List";
import { stdGetFilteredAssignment } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Assignment/assignment.action";

const AssignmentMainSection = () => {
  const dispatch = useDispatch();
  const { cid, sid, subjectId } = useParams();

  const { filteredAssignments, loading } = useSelector(
    (store) => store?.student?.studentAssignment
  );

  const [filters, setFilters] = useState({ moduleId: "", chapterId: "" });
  const { selectedSemester } = useSelector(
    (state) => state.common.user.classInfo
  );
  // Fetch assignments based on selected filters
  const refetchAssignments = useCallback(() => {
    const { moduleId, chapterId } = filters;
    //fetchFilteredAssignments(sid, moduleId, chapterId);
    dispatch(
      stdGetFilteredAssignment({ cid, subjectId: sid, moduleId, chapterId })
    );
  }, [filters, sid, dispatch, selectedSemester]);

  useEffect(() => {
    refetchAssignments();
  }, [refetchAssignments]);

  const getItemName = (item) => item.title;
  const getItemDetails = (item) =>
    `Module: ${item.module}`;
  const navLinkPath = (cid, sid, item) =>
    `/student_class/${cid}/${sid}/assignments/${item.assignmentId}/view`;

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border-l">
        <List
          type="Assignment"
          title="All Assignments"
          data={filteredAssignments}
          icon={<RiListCheck3 />}
          loading={loading}
          getItemName={getItemName}
          getItemDetails={getItemDetails}
          navLinkPath={navLinkPath}
        />
      </div>
      <div className="w-[30%] p-2">
        <FilterCard filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
};

export default AssignmentMainSection;
