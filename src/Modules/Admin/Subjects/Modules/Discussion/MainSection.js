import React, { useEffect, useState } from "react";
import DiscussionCard from "./Components/DiscussionCard";
import PinnedDiscussions from "./Components/PinnedDiscussions";
import DiscussionHeader from "./Components/DiscussionHeader";
import { MdKeyboardArrowDown } from "react-icons/md";
import { GoDiscussionClosed } from "react-icons/go";
import { RiAddFill } from "react-icons/ri";
import { NavLink, useParams } from "react-router-dom";
import SubjectSideBar from "../../Component/SubjectSideBar";
import useFetchClassDiscussions from "../../../../../Hooks/AuthHooks/Staff/Admin/Disscussion/useFetchClassDiscussions";

const MainSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const { cid, sid } = useParams();
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  const handleFilterChange = (filter) => {
    setFilter(filter);
  };
  const { discussions, error, fetchClassDiscussions, loading } =
    useFetchClassDiscussions();

  useEffect(() => {
    fetchClassDiscussions();
  }, []);

  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filter === "all" || 
      (filter === "unread" && !discussion.isRead) ||
      (filter === "read" && discussion.isRead);
    return matchesSearch && matchesFilter;
  });

  const pinnedDiscussions = discussions.filter((discussion) => discussion.isPinned);

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-full p-3 border-l">
        <DiscussionHeader onSearch={handleSearch} onFilterChange={handleFilterChange} />
        <PinnedDiscussions discussions={pinnedDiscussions} />
        <div className="p-3">
          <div className="flex items-center gap-2 ml-3 mb-2">
            <GoDiscussionClosed className="text-xl text-green-600" />
            <h2 className="text-xl">All Discussions</h2>
            <MdKeyboardArrowDown className="text-gray-500 h-8 w-8" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredDiscussions.map((discussion, index) => (
              <DiscussionCard key={index} discussion={discussion} />
            ))}
          </div>
        </div>
        <NavLink
          to={`/class/${cid}/${sid}/create_discussion`}
          className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4"
        >
          <RiAddFill size={24} />
        </NavLink>
      </div>
    </div>
  );
};

export default MainSection;
