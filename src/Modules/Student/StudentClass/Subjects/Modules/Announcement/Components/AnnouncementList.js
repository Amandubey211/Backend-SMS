import React, { useState, useEffect } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { ImSpinner3 } from "react-icons/im";
import { useParams } from "react-router-dom";
import AnnouncementHeader from "./AnnouncementHeader";
import AnnouncementCard from "./AnnouncementCard";
import NoDataFound from "../../../../../../../Components/Common/NoDataFound";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentAnnounce } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Announcement/announcement.action";

const AnnouncementList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { loading, error, announcementData } = useSelector((store) => store?.student?.studentAnnounce)

  const { cid } = useParams();

  useEffect(() => {
    dispatch(fetchStudentAnnounce(cid))
  }, [cid, dispatch]);

  const filteredAnnouncements = announcementData.filter((card) =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(filteredAnnouncements, "filteredAnnouncements");

  return (
    <div className="w-full ps-3">
      <AnnouncementHeader onSearch={setSearchTerm} />

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <ImSpinner3 className="w-12 h-12 animate-spin mb-3" />
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center h-full text-red-500">
          <FaExclamationCircle className="w-12 h-12 mb-3" />
          <p className="text-lg font-semibold">Error: {error}</p>
        </div>
      )}

      {/* No Announcements Found */}
      {!loading && !error && filteredAnnouncements.length === 0 && (
        <NoDataFound title="announcements" />
      )}

      {/* Display Announcements */}
      {!loading && !error && filteredAnnouncements.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
          {filteredAnnouncements.map((card) => (
            <AnnouncementCard
              key={card._id}
              title={card.title}
              section={card.sectionId || "General"}
              date={new Date(card.createdAt).toLocaleDateString()}
              id={card._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementList;
