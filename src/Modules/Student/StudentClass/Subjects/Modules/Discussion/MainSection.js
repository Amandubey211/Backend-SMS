import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DiscussionCard from "./Components/DiscussionCard";
import PinnedDiscussions from "./Components/PinnedDiscussions";
import DiscussionHeader from "./Components/DiscussionHeader";
import { MdKeyboardArrowDown } from "react-icons/md";
import { GoDiscussionClosed } from "react-icons/go";
import SubjectSideBar from "../../Component/SubjectSideBar";
import useFetchClassDiscussions from "../../../../../../Hooks/AuthHooks/Staff/Admin/Disscussion/useFetchClassDiscussions";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import Spinner from "../../../../../../Components/Common/Spinner"; // Assuming you have a Spinner component

const MainSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const { cid } = useParams();
  const { discussions, loading, error, fetchClassDiscussions } =
    useFetchClassDiscussions();

  useEffect(() => {
    fetchClassDiscussions();
  }, [fetchClassDiscussions]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter) => {
    setFilter(filter);
  };

  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesSearch = discussion.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !discussion.isRead) ||
      (filter === "read" && discussion.isRead);
    return matchesSearch && matchesFilter;
  });

  const pinnedDiscussions = discussions.filter(
    (discussion) => discussion.isPinned
  );

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-full h-full p-3 border-l flex flex-col">
        {loading ? (
          <div className="flex justify-center items-center w-full h-screen">
            <Spinner />
          </div>
        ) : (
          <>
            <DiscussionHeader
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              loading={loading}
              error={error}
            />
            <PinnedDiscussions discussions={pinnedDiscussions} />
            <div className="p-3 w-full flex-grow flex flex-col">
              <div className="flex items-center gap-2 ml-3 mb-2">
                <GoDiscussionClosed className="text-xl text-green-600" />
                <h2 className="text-xl">All Discussions</h2>
                <MdKeyboardArrowDown className="text-gray-500 h-8 w-8" />
              </div>
              <div className="flex-grow flex justify-center items-center">
                {filteredDiscussions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    {filteredDiscussions.map((discussion) => (
                      <DiscussionCard
                        key={discussion._id}
                        discussion={discussion}
                      />
                    ))}
                  </div>
                ) : (
                  <NoDataFound title="Discussions" />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MainSection;
