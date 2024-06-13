import React from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import List from "../../Assignments/Component/List";
import FilterCard from "../../Assignments/Component/FilterCard";
import { RiAddFill, RiFileUnknowLine } from "react-icons/ri";
import { assignments } from "../../Assignments/AllAssignments/DummyData/assignments";
import { NavLink, useParams } from "react-router-dom";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";

const MainSection = () => {
  const { cid, sid } = useParams();
  useNavHeading(cid, sid);
  return (
    <div className="flex  ">
      <SubjectSideBar />
      <div className="w-[65%] border-l">
        <List title="All Quizzes"  data={assignments} icon={<RiFileUnknowLine />} />
      </div>
      <div className="w-[30%] px-2">
        <FilterCard />
      </div>
      <NavLink
        to={`/class/${cid}/${sid}/create_quiz`}
        className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4"
      >
        <RiAddFill size={24} />
      </NavLink>
    </div>
  );
};

export default MainSection;
