import React, { useEffect, useState } from "react";
import AnnouncementHeader from "./AnnouncementHeader";
import AnnouncementCard from "./AnnouncementCard";
import useGetAllAnnouncements from "../../../../../../Hooks/AuthHooks/Staff/Admin/Announcement/useGetAllAnnouncements";
import { useParams } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import { AiOutlineFileSearch } from "react-icons/ai";

const colors = [
  "#efc42f",
  "#ee69b6",
  "#0066ad",
  "#b2cd09",
  "#5ac67c",
  "#e040ff",
  "#fd8263",
  "#5b9ef2",
  "#9966f6",
  "#5ac67c",
];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const AnnouncementList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [coloredAnnouncements, setColoredAnnouncements] = useState([]);
  const { cid } = useParams();
  const { error, fetchAnnouncements, loading, announcementData } =
    useGetAllAnnouncements();

  useEffect(() => {
    const fetchData = async () => {
      await fetchAnnouncements(cid);
    };

    fetchData();
  }, [fetchAnnouncements, cid]);

  useEffect(() => {
    if (announcementData.length) {
      const coloredData = announcementData.map((announcement) => ({
        ...announcement,
        color: getRandomColor(),
      }));
      setColoredAnnouncements(coloredData);
    }
  }, [announcementData]);

  const filteredAnnouncements = coloredAnnouncements.filter((announcement) =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full ps-3">
      <AnnouncementHeader onSearch={setSearchTerm} />
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <ImSpinner3 className="w-12 h-12 animate-spin mb-3" />
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement._id}
                title={announcement.title}
                section={announcement.sectionId || "Default Section"}
                date={announcement.createdAt}
                id={announcement._id}
                color={announcement.color}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center col-span-full py-10 text-gray-500">
              <AiOutlineFileSearch className="w-12 h-12 mb-3" />
              <p className="text-lg font-semibold">No announcements found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnnouncementList;
