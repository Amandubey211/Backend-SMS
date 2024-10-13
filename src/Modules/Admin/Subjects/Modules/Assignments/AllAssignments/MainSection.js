import React, { useEffect, useMemo } from "react";
import { RiListCheck3, RiAddFill } from "react-icons/ri";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import FilterCard from "../Component/FilterCard";
import List from "../Component/List";
import { fetchFilteredAssignments } from "../../../../../../Store/Slices/Admin/Class/Assignment/assignmentThunks";

const MainSection = () => {
  const { sid, cid } = useParams();
  const dispatch = useDispatch();
  const { assignments, loading, error } = useSelector(
    (state) => state.admin.assignments
  );

  const [filters, setFilters] = React.useState({
    moduleId: "",
    chapterId: "",
    publish: null,
  });

  useEffect(() => {
    dispatch(fetchFilteredAssignments({ sid, ...filters }));
  }, [dispatch, sid, filters]);

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
