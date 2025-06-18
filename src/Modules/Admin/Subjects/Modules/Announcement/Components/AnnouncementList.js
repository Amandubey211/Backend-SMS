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






// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import AnnouncementHeader from "./AnnouncementHeader";
// import AnnouncementCard from "./AnnouncementCard";
// import AnnouncementSkeletonCard from "./AnnouncementSkeletonCard";
// import { fetchAnnouncements } from "../../../../../../Store/Slices/Admin/Class/Announcement/announcementThunk";
// import { useParams } from "react-router-dom";
// import NoDataFound from "../../../../../../Components/Common/NoDataFound";
// import { AiOutlineBell } from "react-icons/ai";
// import { Tabs } from "antd";

// const { TabPane } = Tabs;

// // Random brand colours for cards
// const COLORS = [
//   "#efc42f",
//   "#ee69b6",
//   "#0066ad",
//   "#b2cd09",
//   "#5ac67c",
//   "#e040ff",
//   "#fd8263",
//   "#5b9ef2",
//   "#9966f6",
//   "#5ac67c",
// ];
// const randomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

// const AnnouncementList = () => {
//   const dispatch = useDispatch();
//   const { cid, sid } = useParams();

//   /* ───── Local UI state ───── */
//   const [searchTerm, setSearchTerm] = useState("");

//   /* ───── Redux state ───── */
//   const { loading, announcements } = useSelector(
//     (store) => store.admin.announcements
//   );
//   const { role } = useSelector((store) => store.common.auth);
//   const isAdmin = role?.toLowerCase() === "admin";          // NEW

//   /* ───── Fetch announcements on mount ───── */
//   useEffect(() => {
//     dispatch(fetchAnnouncements({ cid, sid }));
//   }, [dispatch, cid, sid]);

//   /* ───── Decorate + Filter ───── */
//   const colored = announcements?.map((a) => ({ ...a, color: randomColor() }));

//   const filtered = colored?.filter((a) =>
//     a.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const now = new Date();
//   const posted = filtered?.filter((a) =>
//     a.delayPosting ? new Date(a.delayPosting) <= now : true
//   );
//   const scheduled = filtered?.filter(
//     (a) => a.delayPosting && new Date(a.delayPosting) > now
//   );

//   /* ───── Helper: announce grid or no-data component ───── */
//   const grid = (arr) =>
//     arr?.length ? (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
//         {arr.map((ann) => (
//           <AnnouncementCard key={ann._id} {...ann} />
//         ))}
//       </div>
//     ) : (
//       <div className="flex flex-col items-center justify-center col-span-full py-10">
//         <NoDataFound
//           title="Announcements"
//           desc="No announcements found. Please check back later."
//           icon={AiOutlineBell}
//         />
//       </div>
//     );

//   /* ───── Render ───── */
//   return (
//     <div className="w-full ps-3">
//       <AnnouncementHeader onSearch={setSearchTerm} />

//       {/* Loading skeletons */}
//       {loading ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
//           {Array.from({ length: 6 }).map((_, idx) => (
//             <AnnouncementSkeletonCard key={idx} />
//           ))}
//         </div>
//       ) : isAdmin ? (
//         /* ─── Admin view: tabs ─── */
//         <Tabs defaultActiveKey="all">
//           <TabPane tab="All" key="all">
//             {grid(filtered)}
//           </TabPane>
//           <TabPane tab="Posted" key="posted">
//             {grid(posted)}
//           </TabPane>
//           <TabPane tab="Scheduled" key="scheduled">
//             {grid(scheduled)}
//           </TabPane>
//         </Tabs>
//       ) : (
//         /* ─── Non-admin view: posted announcements only ─── */
//         grid(posted)
//       )}
//     </div>
//   );
// };

// export default AnnouncementList;
 