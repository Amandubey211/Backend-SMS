import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";
import { GoDiscussionClosed } from "react-icons/go";
import { RiAddFill } from "react-icons/ri";
import DiscussionCard from "./Components/DiscussionCard";
import PinnedDiscussions from "./Components/PinnedDiscussions";
import DiscussionHeader from "./Components/DiscussionHeader";
import Spinner from "../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../Components/Common/NoDataFound";
import SubjectSideBar from "../../Component/SubjectSideBar";
import { fetchClassDiscussions } from "../../../../../Store/Slices/Admin/Class/Discussion/discussionThunks";

const MainSection = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const { cid, sid } = useParams();

  const { discussions, loading, error } = useSelector(
    (state) => state.admin.discussions
  );

  useEffect(() => {
    dispatch(fetchClassDiscussions({ cid }));
  }, [dispatch, cid]);

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
      <div className="w-full p-3 border-l">
        <DiscussionHeader
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />
        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="flex justify-center">
            <p role="alert" className="text-red-400 my-4">
              {error}
            </p>
          </div>
        ) : (
          <>
            <PinnedDiscussions
              discussions={pinnedDiscussions}
              fetchClassDiscussions={() =>
                dispatch(fetchClassDiscussions({ cid }))
              }
            />
            <div className="p-3">
              <div className="flex items-center gap-2 ml-3 mb-2">
                <GoDiscussionClosed className="text-xl text-green-600" />
                <h2 className="text-xl">All Discussions</h2>
                <MdKeyboardArrowDown className="text-gray-500 h-8 w-8" />
              </div>
              {filteredDiscussions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredDiscussions.map((discussion, index) => (
                    <DiscussionCard
                      key={index}
                      discussion={discussion}
                      fetchClassDiscussions={() =>
                        dispatch(fetchClassDiscussions({ cid }))
                      }
                    />
                  ))}
                </div>
              ) : (
                <NoDataFound title="Discussions" />
              )}
            </div>
          </>
        )}
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
