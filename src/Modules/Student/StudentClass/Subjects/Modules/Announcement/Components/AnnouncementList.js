import React, { useState, useEffect } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { ImSpinner3 } from "react-icons/im";
import { useParams } from "react-router-dom";
import AnnouncementHeader from "./AnnouncementHeader";
import AnnouncementCard from "./AnnouncementCard";
import NoDataFound from "../../../../../../../Components/Common/NoDataFound";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentAnnounce } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Announcement/announcement.action";
import OfflineModal from "../../../../../../../Components/Common/Offline";
import { setShowError } from "../../../../../../../Store/Slices/Common/Alerts/alertsSlice";

const AnnouncementList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { loading, error, announcementData } = useSelector(
    (store) => store?.student?.studentAnnounce
  );
  const { showError } = useSelector((store) => store?.common?.alertMsg);

  const { cid, sid } = useParams();

  useEffect(() => {
    dispatch(fetchStudentAnnounce({ cid, sid }));
  }, [cid, dispatch, sid]);

  const filteredAnnouncements = announcementData?.filter((card) =>
    card.title.toLowerCase()?.includes(searchTerm.toLowerCase())
  );
  // console.log(filteredAnnouncements, "filteredAnnouncements");

  const handleDismiss = () => {
    dispatch(setShowError(false));
  };

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

      {/* No Announcements Found */}
      {!loading && filteredAnnouncements?.length === 0 && (
        <NoDataFound title="announcements" />
      )}

      {/* Display Announcements */}
      {!loading && !error && filteredAnnouncements?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
          {filteredAnnouncements?.map((card) => (
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
      {!loading && showError && (
        <OfflineModal error={error} onDismiss={handleDismiss} />
      )}
    </div>
  );
};

export default AnnouncementList;
