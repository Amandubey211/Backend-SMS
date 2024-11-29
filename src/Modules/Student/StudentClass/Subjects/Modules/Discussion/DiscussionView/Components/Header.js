// Header.js
import React, { useState } from "react";
import { BsChat } from "react-icons/bs";
import DiscussionMessage from "../../DiscussionMessage/DiscussionMessage";
import Sidebar from "../../../../../../../../Components/Common/Sidebar";
import { ImSpinner3 } from 'react-icons/im';
import { FaExclamationTriangle } from 'react-icons/fa';
import { CiUser } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarOpen } from "../../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Discussion/discussionSlice";
const Header = () => {
  const dispatch = useDispatch();
  const { discussion, isSidebarOpen } = useSelector((store) => store?.student?.studentDiscussion)

  //const [isSidebarOpen, setSidebarOpen] = useState(false);
  // console.log("disccussion", discussion)
  const handleSidebarOpen = () => {
    //setSidebarOpen(true)
    dispatch(setSidebarOpen(true))
  };
  const handleSidebarClose = () => {
    dispatch(setSidebarOpen(false))
    //setSidebarOpen(false);
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!discussion) return <p>No discussion found.</p>;

  return (
    <div className="flex items-end justify-between p-2 px-4 border-b">
      <div className="flex items-center">
        {discussion?.authorProfile ? (
          <img
            src={discussion.authorProfile}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <CiUser className="w-10 h-10 rounded-full text-gray-500" />
        )}
        {/* <img
          src={
            discussion?.authorProfile ||
            ""
          }
          alt="Profile"
          className="w-10 h-10 rounded-full"
        /> */}
        <div className="ml-3">
          <h1 className="text-lg font-semibold">
            {discussion?.title || "Discussion Title"}
          </h1>
          <p className="text-sm text-green-600">
            {discussion?.createdBy || "Author Name"}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1 justify-center">
        <div className="flex gap-2 items-center">
          <div className="text-sm flex items-center gap-1 pr-2 border-r">
            <span className="bg-gradient-to-r from-purple-100 rounded-full px-1 gap-1 to-pink-100 text-white">
              <span className="text-gradient text-xs font-semibold">
                {discussion?.replies?.length || 0}
              </span>
            </span>
            <span>Comments</span>
          </div>
          <span className="text-sm pr-2 border-r">
            For: {discussion?.postTo || "Everyone"}
          </span>
          <span className="text-sm">
            Due: {formatDate(discussion?.dueDate) || "Date"}
          </span>
        </div>
        <div className="flex items-center justify-end py-2">
          <button
            onClick={handleSidebarOpen}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white items-center rounded-md flex gap-2"
          >
            <BsChat /> <span>View Comments</span>
          </button>
          <Sidebar
            width="70%"
            title="Discussion"
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
          >
            <DiscussionMessage />
          </Sidebar>
        </div>
      </div>
    </div>
  );
};

export default Header;
