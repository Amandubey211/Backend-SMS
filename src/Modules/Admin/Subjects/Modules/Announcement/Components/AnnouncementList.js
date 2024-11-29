import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AnnouncementHeader from "./AnnouncementHeader";
import AnnouncementCard from "./AnnouncementCard";
import Spinner from "../../../../../../Components/Common/Spinner";
import { AiOutlineFileSearch } from "react-icons/ai";
import { fetchAnnouncements } from "../../../../../../Store/Slices/Admin/Class/Announcement/announcementThunk";
import { useParams } from "react-router-dom";

// Define an array of colors for random selection.
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

// Utility function to get a random color
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors?.length);
  return colors[randomIndex];
};

const AnnouncementList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { loading, announcements } = useSelector(
    (store) => store.admin.announcements
  );
  const { cid } = useParams();

  // Fetch announcements on component mount
  useEffect(() => {
    dispatch(fetchAnnouncements(cid));
  }, [dispatch, cid]);

  // Add random colors to each announcement
  const coloredAnnouncements = announcements?.map((announcement) => ({
    ...announcement,
    color: getRandomColor(),
  }));

  // Filter announcements based on the search term
  const filteredAnnouncements = coloredAnnouncements.filter((announcement) =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full ps-3">
      <AnnouncementHeader onSearch={setSearchTerm} />
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
          {filteredAnnouncements?.length > 0 ? (
            filteredAnnouncements?.map((announcement) => (
              <AnnouncementCard key={announcement._id} {...announcement} />
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
