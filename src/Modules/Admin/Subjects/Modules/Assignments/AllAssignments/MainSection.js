import React from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import List from "../Component/List";
import { assignments } from "./DummyData/assignments";
import FilterCard from "../Component/FilterCard";
import { RiListCheck3, RiAddFill } from "react-icons/ri";
import { NavLink, useParams } from "react-router-dom";

const MainSection = () => {
  const { sid, cid } = useParams();
  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border-l ">
        <List
          type="Assignment"
          title="All Assignments"
          data={assignments}
          icon={<RiListCheck3 />}
        />
      </div>
      <div className="w-[30%] p-2 ">
        <FilterCard />
      </div>
      <NavLink
        to={`/class/${cid}/${sid}/createassignment`}
        className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4"
      >
        <RiAddFill size={24} />
      </NavLink>
    </div>
  );
};

export default MainSection;
