import React, { useState } from "react";
import DiscussionCard from "./Components/DiscussionCard";
import PinnedDiscussions from "./Components/PinnedDiscussions";
import DiscussionHeader from "./Components/DiscussionHeader";
import { MdKeyboardArrowDown } from "react-icons/md";
import { GoDiscussionClosed } from "react-icons/go";
import { RiAddFill } from "react-icons/ri";
import { NavLink, useParams } from "react-router-dom";
import dummyDiscussionData from "./DummyData/dummyDiscussionData";
import SubjectSideBar from "../../Component/SubjectSideBar";

const MainSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { cid, sid } = useParams();
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredDiscussions = dummyDiscussionData.filter((discussion) =>
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex  ">
      <SubjectSideBar/>
      <div className="w-full p-3 border-l">
        <DiscussionHeader onSearch={handleSearch} />
        <PinnedDiscussions />
        <div className=" p-3 ">
          <div className="flex items-center gap-2 ml-3 mb-2">
            <GoDiscussionClosed className="text-xl text-green-600" />
            <h2 className="text-xl "> All Discussions</h2>
            <MdKeyboardArrowDown className="text-gray-500 h-8 w-8" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredDiscussions.map((discussion, index) => (
              <DiscussionCard key={index} discussion={discussion} />
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default MainSection;
