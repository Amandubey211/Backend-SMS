import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AnnouncementHeader from "./AnnouncementHeader";
import AnnouncementCard from "./AnnouncementCard";
import AnnouncementSkeletonCard from "./AnnouncementSkeletonCard";
import { fetchAnnouncements } from "../../../../../../Store/Slices/Admin/Class/Announcement/announcementThunk";
import { useParams } from "react-router-dom";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import { AiOutlineBell } from "react-icons/ai";
import { Tabs } from "antd";

const { TabPane } = Tabs;

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
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const AnnouncementList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { loading, announcements } = useSelector(
    (store) => store.admin.announcements
  );
  const { cid, sid } = useParams();

  // Fetch announcements on component mount
  useEffect(() => {
    dispatch(fetchAnnouncements({ cid, sid }));
  }, [dispatch, cid, sid]);

  // Add random colors to each announcement
  const coloredAnnouncements = announcements?.map((announcement) => ({
    ...announcement,
    color: getRandomColor(),
  }));

  // Filter announcements based on the search term
  const filteredAnnouncements = coloredAnnouncements?.filter((announcement) =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current date for filtering
  const now = new Date();

  // Separate announcements into categories
  const postedAnnouncements = filteredAnnouncements?.filter((announcement) => {
    if (announcement.delayPosting) {
      return new Date(announcement.delayPosting) <= now;
    }
    return true; // If no delayPosting, consider it as posted
  });

  const scheduledAnnouncements = filteredAnnouncements?.filter(
    (announcement) =>
      announcement.delayPosting && new Date(announcement.delayPosting) > now
  );

  // Utility to render announcements grid or a no-data placeholder
  const renderGrid = (announcementsArray) => {
    return announcementsArray?.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
        {announcementsArray.map((announcement) => (
          <AnnouncementCard key={announcement._id} {...announcement} />
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center col-span-full py-10">
        <NoDataFound
          title="Announcements"
          desc="No announcements found. Please check back later or add a new announcement."
          icon={AiOutlineBell}
        />
      </div>
    );
  };

  return (
    <div className="w-full ps-3">
      <AnnouncementHeader onSearch={setSearchTerm} />
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
          {[...Array(6)].map((_, idx) => (
            <AnnouncementSkeletonCard key={idx} />
          ))}
        </div>
      ) : (
        <Tabs defaultActiveKey="all">
          <TabPane tab="All" key="all">
            {renderGrid(filteredAnnouncements)}
          </TabPane>
          <TabPane tab="Posted" key="posted">
            {renderGrid(postedAnnouncements)}
          </TabPane>
          <TabPane tab="Scheduled" key="scheduled">
            {renderGrid(scheduledAnnouncements)}
          </TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default AnnouncementList;
