import React, { useEffect, useMemo, useCallback } from "react";
import Notice from "./Notice";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import { FaBell } from "react-icons/fa"; // Keeping the bell icon for consistency
import Spinner from "../../../../Components/Common/Spinner";
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotices } from '../../../../Store/Slices/Parent/Dashboard/dashboard.action';
import { useTranslation } from "react-i18next"; // Import useTranslation from i18next
import { DashNoticeSkeleton } from "../../Skeletons";

// Gradient backgrounds for the notices
const gradientBackgrounds = [
  "linear-gradient(90deg, #FBB778 0%, #F9B279 100%)",
  "linear-gradient(90deg, #FF7AA5 0%, #FF5B92 80%)",
  "linear-gradient(90deg, #33C4FE 0%, #36D5FF 100%)",
  "linear-gradient(90deg, #FBB778 0%, #F9B279 100%)"
];

const NoticeBoard = ({ textTrimCount }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('prtNotices'); // Use i18n translation hook with namespace 'prtNotices'

  // Get the notices, loading, and error states from Redux
  const { notices, loadingNotices, errorNotices } = useSelector((state) => state?.Parent?.dashboard);

  useEffect(() => {    
      dispatch(fetchNotices());
  }, [dispatch]);

  // Handle navigate click using useCallback to prevent re-creation on each render
  const handleNavigate = useCallback(() => {
    navigate("/parentchildnotice");
  }, [navigate]);

  // Memoize the formatted notices to avoid recalculations on each render
  const formattedNotices = useMemo(() => {
    return notices?.map((notice) => {
      let startDate = "Invalid Date", endDate = "Invalid Date";

      if (notice?.startDate) {
        try {
          startDate = format(new Date(notice.startDate), 'yyyy-MM-dd');
        } catch (e) {
          console.error(`Invalid start date value for notice "${notice?.title}":`, notice?.startDate);
        }
      }

      if (notice?.endDate) {
        try {
          endDate = format(new Date(notice.endDate), 'yyyy-MM-dd');
        } catch (e) {
          console.error(`Invalid end date value for notice "${notice?.title}":`, notice?.endDate);
        }
      }

      return {
        ...notice,
        startDate,
        endDate
      };
    });
  }, [notices]);

  // Instead of slicing, we sort and show all data.
  const latestNotices = useMemo(() => {
    return formattedNotices
      ?.filter((notice) => notice?.startDate !== "Invalid Date")
      ?.sort((a, b) => new Date(b?.startDate) - new Date(a?.startDate));
  }, [formattedNotices]);

  // Utility function to truncate text
  const truncateText = useCallback((text, maxLength) => {
    return text && text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  }, []);

  // Loading state with spinner displayed at the center
  if (loadingNotices) {
    return (
      <div className="p-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-600">{t("Upcoming Notices")}</h2>
        </div>
        <div className="flex flex-col items-center justify-center h-64 text-center overflow-x-hidden shadow rounded-lg p-4">
          <DashNoticeSkeleton />
        </div>
      </div>
    );
  }

  // Error state handling
  if (errorNotices) {
    return (
      <div className="p-2 border-l border-gray-300">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-600">{t("Upcoming Notices")}</h2>
        </div>
        <div className="flex flex-col items-center justify-center h-64 text-center overflow-x-auto shadow rounded-lg p-4">
          <FaBell className="text-gray-400 text-6xl mb-4" />
          <p className="text-gray-600 text-lg">{errorNotices}: {t("Unable to fetch Notices")}</p>
        </div>
      </div>
    );
  }

  // No data available state
  if (!notices?.length) {
    return (
      <div className=" ">
        <div className="flex justify-between items-center mb-2 flex-row">
          <h2 className="text-lg font-semibold text-gray-600">Upcoming Notices</h2>
          <div className="inline-block">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg transition-all duration-300 ease-in-out 
                 text-transparent bg-clip-text bg-gradient-to-r from-[#C83B62] to-[#7F35CD]
                 hover:bg-gray-100 hover:shadow-md"
              onClick={handleNavigate}
            >
              {t("View All")}
            </button>
          </div>
        </div>
        <div className="rounded-lg bg-white">
          <div className="flex flex-col items-center justify-center h-64 text-center overflow-x-auto rounded-lg p-4">
            <FaBell className="text-gray-400 text-6xl mb-4" />
            <p className="text-gray-600 text-lg">No Notices Available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 ">
      <div className="flex justify-between items-center px-2 pr-4 pt-0">
        <h2 className="text-lg font-semibold text-gray-600">{t("Upcoming Notices")}</h2>
        <div className="inline-block">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg transition-all duration-300 ease-in-out 
               text-transparent bg-clip-text bg-gradient-to-r from-[#C83B62] to-[#7F35CD]
               hover:bg-gray-100 hover:shadow-md"
            onClick={handleNavigate}
          >
            {t("View All")}
          </button>
        </div>
      </div>
      {/* Notice list container with fixed height to show roughly 3 notices.
          On hover, the container scrolls if there is more content */}
      <div className="group relative overflow-y-hidden hover:overflow-y-auto" style={{ maxHeight: '16rem' }}>
        {latestNotices?.map((notice, index) => (
          <Notice
            key={index}
            image={notice?.image || ""}
            title={notice?.title || t("Untitled")}
            startDate={notice?.startDate || "N/A"}
            endDate={notice?.endDate || "N/A"}
            authorName={notice?.authorName}
            priority={
              <span
                className={notice?.priority === "High priority"
                  ? "bg-pink-200 text-pink-600 font-semibold px-2 py-1 rounded-md"
                  : "bg-gray-200 text-gray-600 font-semibold px-2 py-1 rounded-md"}
              >
                {t(notice?.priority === "High priority" ? "High Priority" : "Low Priority")}
              </span>
            }
            content={truncateText(notice?.description || "", textTrimCount)}
            backgroundColor={gradientBackgrounds[index % gradientBackgrounds.length]}
          />
        ))}
      </div>
    </div>
  );
};

export default NoticeBoard;
