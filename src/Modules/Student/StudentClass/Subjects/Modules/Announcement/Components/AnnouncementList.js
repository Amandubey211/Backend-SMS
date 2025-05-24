import React, { useState, useEffect } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { ImSpinner3 } from "react-icons/im";
import { useParams } from "react-router-dom";
import AnnouncementHeader from "./AnnouncementHeader";
import AnnouncementCard from "./AnnouncementCard";
import NoDataFound from "../../../../../../../Components/Common/NoDataFound";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentAnnounce,
  markAsReadStudentAnnounce,
} from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Announcement/announcement.action";
import OfflineModal from "../../../../../../../Components/Common/Offline";
import { setShowError } from "../../../../../../../Store/Slices/Common/Alerts/alertsSlice";
import { CiSearch } from "react-icons/ci";
import { setIsRead } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Announcement/announcementSlice";

const AnnouncementList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { loading, error, announcementData, isRead } = useSelector(
    (store) => store?.student?.studentAnnounce
  );
  const { showError } = useSelector((store) => store?.common?.alertMsg);

  const { cid, sid } = useParams();

  useEffect(() => {
    dispatch(fetchStudentAnnounce({ cid, sid }));
  }, [cid, dispatch, sid]);

  const filteredAnnouncements = announcementData?.filter((card) => {
    const titleMatch = card.title
      .toLowerCase()
      ?.includes(searchTerm.toLowerCase());
    const readStatusMatch =
      isRead === "all" || (isRead === "unread" && !card.isRead);
    return titleMatch && readStatusMatch;
  });

  const handleDismiss = () => {
    dispatch(setShowError(false));
  };

  const handleFilterChange = (event) => {
    dispatch(setIsRead(event.target.value));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };


  return (
    <div className="w-full ps-3 ">
      <div className=" pb-4">
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-semibold mb-4">All Announcement</h2>
        </div>
        <div className="flex items-center justify-between pe-9 mt-3">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search here"
              className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-80"
              onChange={handleSearchChange}
            />
            <button className="absolute right-3">
              <CiSearch className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">Status : </span>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="filter"
                value="all"
                checked={isRead === "all"}
                onChange={handleFilterChange}
                className="custom-radio cursor-pointer"
              />
              <span className="ml-2">All</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="filter"
                value="unread"
                checked={isRead === "unread"}
                onChange={handleFilterChange}
                className="custom-radio cursor-pointer"
              />
              <span className="ml-2">Unread</span>
            </label>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <ImSpinner3 className="w-12 h-12 animate-spin mb-3" />
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      )}

      {/* No Announcements Found */}
      {!loading && filteredAnnouncements?.length === 0 && (
        <NoDataFound title="announcements" />
      )}

      {/* Display Announcements */}
      {!loading && !error && filteredAnnouncements?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {filteredAnnouncements?.map((card) => (
            <AnnouncementCard
              key={card._id}
              title={card.title}
              section={card.sectionId || "General"}
              date={new Date(card.createdAt).toLocaleDateString()}
              id={card._id}
              isRead={card.isRead}
              // onClick={() => handleMarkAsRead(card._id)}
            />
          ))}
        </div>
      )}
      {!loading && showError && (
        <OfflineModal error={error} onDismiss={handleDismiss} />
      )}
    </div>
  );
};

export default AnnouncementList;
