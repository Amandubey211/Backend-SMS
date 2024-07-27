import React, { useState, useEffect } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import AnnouncementHeader from "./AnnouncementHeader";
import AnnouncementCard from "./AnnouncementCard";
import useGetAllAnnouncements from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Announcement/useGetAllAnnouncements";

const AnnouncementList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { loading, fetchAnnouncements, announcementData } = useGetAllAnnouncements();
  const { cid } = useParams();

  useEffect(() => {
    fetchAnnouncements(cid);
  }, [cid, fetchAnnouncements]);

  const filteredAnnouncements = announcementData.filter((card) =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full ps-3">
      <AnnouncementHeader onSearch={setSearchTerm} />
      {filteredAnnouncements.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-72">
          <FaExclamationCircle className="text-6xl text-gray-400" />
          <p className="mt-4 text-gray-600">No announcements Found</p>
        </div>
      ) : (
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
