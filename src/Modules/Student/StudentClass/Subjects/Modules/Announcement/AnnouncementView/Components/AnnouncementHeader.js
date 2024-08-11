import React, { useState } from "react";
import { BsChat } from "react-icons/bs";
import { ImSpinner3 } from "react-icons/im";
import { FaExclamationTriangle } from "react-icons/fa";
import AnnouncementMessage from "./AnnouncementMessage";
import Sidebar from "../../../../../../../../Components/Common/Sidebar";

const AnnouncementHeader = ({ announcement, loading, error }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex items-end justify-between p-2 px-4 border-b">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <ImSpinner3 className="w-12 h-12 animate-spin mb-3" />
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <FaExclamationTriangle className="w-12 h-12 mb-3" />
          <p className="text-lg font-semibold">{error}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center">
            <img
              src={
                announcement?.authorProfile ||
                `https://avatars.githubusercontent.com/u/109097090?v=4`
              }
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-3">
              <h1 className="text-lg font-semibold">
                {announcement?.title || "Announcement Title"}
              </h1>
              <p className="text-sm text-green-600">
                {announcement?.author || "Author Name"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1 justify-center">
            <div className="flex gap-2 items-center">
              <div className="text-sm flex items-center gap-1 pr-2 border-r">
                <span className="bg-gradient-to-r from-purple-100 rounded-full px-1 gap-1 to-pink-100 text-white">
                  <span className="text-gradient text-xs font-semibold">
                    {announcement?.replies?.length || 0}
                  </span>
                </span>
                <span>Comments</span>
              </div>
              <span className="text-sm pr-2 border-r">
                For: {announcement?.postTo || "Everyone"}
              </span>
              <span className="text-sm">
                Posted on: {formatDate(announcement?.createdAt) || "Date"}
              </span>
            </div>
            <div className="flex items-center justify-end py-2">
              <button
                onClick={handleSidebarOpen}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white items-center rounded-md flex gap-2"
              >
                <BsChat /> <span> View Comments</span>
              </button>
              <Sidebar
                width="70%"
                title="Announcement"
                isOpen={isSidebarOpen}
                onClose={handleSidebarClose}
              >
                <AnnouncementMessage announcement={announcement} />
              </Sidebar>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnnouncementHeader;
