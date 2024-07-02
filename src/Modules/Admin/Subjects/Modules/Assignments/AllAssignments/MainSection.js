import React, { useState, useEffect, useMemo } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import List from "../Component/List";
import FilterCard from "../Component/FilterCard";
import { RiListCheck3, RiAddFill } from "react-icons/ri";
import { NavLink, useParams } from "react-router-dom";
import useGetFilteredAssignments from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useGetFilteredAssignments";

const MainSection = () => {
  const { sid, cid } = useParams();
  const { loading, error, assignments, fetchFilteredAssignments } =
    useGetFilteredAssignments();

  const [filters, setFilters] = useState({
    moduleId: "",
    chapterId: "",
    publish: null,
  });

  useEffect(() => {
    const { moduleId, chapterId, publish } = filters;
    if (publish !== null) {
      fetchFilteredAssignments(cid, moduleId, chapterId, publish);
    } else {
      fetchFilteredAssignments(cid, moduleId, chapterId);
    }
  }, [cid, filters, fetchFilteredAssignments]);

  const navLinkStyles = useMemo(
    () => ({
      className:
        "bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4",
    }),
    []
  );

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border-l">
        <List
          type="Assignment"
          title="All Assignments"
          data={assignments}
          icon={<RiListCheck3 />}
          loading={loading}
          error={error}
        />
      </div>
      <div className="w-[30%] p-2">
        <FilterCard filters={filters} setFilters={setFilters} />
      </div>
      <NavLink to={`/class/${cid}/${sid}/createassignment`} {...navLinkStyles}>
        <RiAddFill size={24} />
      </NavLink>
    </div>
  );
};

export default MainSection;
