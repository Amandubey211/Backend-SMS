import React, { useEffect, useMemo, useCallback } from "react";
import Notice from "./Notice";
import { useNavigate } from "react-router-dom";

import { format } from 'date-fns';
import { FaBell } from "react-icons/fa"; // Keeping the bell icon for consistency
import Spinner from "../../../../Components/Common/Spinner";
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotices } from '../../../../Store/Slices/Parent/Dashboard/dashboard.action';
import { useTranslation } from "react-i18next"; // Import useTranslation from i18next

// Gradient backgrounds for the notices
const gradientBackgrounds = [
  "linear-gradient(90deg, #FBB778 0%, #F9B279 100%)",
  "linear-gradient(90deg, #FF7AA5 0%, #FF5B92 80%)",
  "linear-gradient(90deg, #33C4FE 0%, #36D5FF 100%)",
  "linear-gradient(90deg, #FBB778 0%, #F9B279 100%)"
];

const NoticeBoard = ({ numberOfChildren }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('prtNotices'); // Use i18n translation hook with namespace 'prtNotices'

  // Get the notices and loading state from Redux
  const { notices, loading, error } = useSelector((state) => state.Parent.dashboard);

  // Fetch notices on component mount
  useEffect(() => {
    if (!notices.length) {
      dispatch(fetchNotices()); // Fetch notices using Redux thunk
    }
  }, [dispatch, notices]);

  // Handle navigate click using useCallback to prevent re-creation on each render
  const handleNavigate = useCallback(() => {
    navigate("/parentchildnotice");
  }, [navigate]);

  // Memoize the formatted notices to avoid recalculations on each render
  const formattedNotices = useMemo(() => {
    return notices.map((notice) => {
      let startDate = "Invalid Date", endDate = "Invalid Date";

      if (notice.startDate) {
        try {
          startDate = format(new Date(notice.startDate), 'yyyy-MM-dd');
        } catch (e) {
          console.error(`Invalid start date value for notice "${notice.title}":`, notice.startDate);
        }
      }

      if (notice.endDate) {
        try {
          endDate = format(new Date(notice.endDate), 'yyyy-MM-dd');
        } catch (e) {
          console.error(`Invalid end date value for notice "${notice.title}":`, notice.endDate);
        }
      }

      return {
        ...notice,
        startDate,
        endDate
      };
    });
  }, [notices]);

  // Get the number of notices to show based on the number of children
  const numberOfNoticesToShow = useMemo(() => (numberOfChildren > 1 ? 5 : 3), [numberOfChildren]);

  // Memoize latest notices filtering and sorting
  const latestNotices = useMemo(() => {
    return formattedNotices
      .filter((notice) => notice.startDate !== "Invalid Date")
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      .slice(0, numberOfNoticesToShow);
  }, [formattedNotices, numberOfNoticesToShow]);

  // Utility function to truncate text
  const truncateText = useCallback((text, maxLength) => {
    return text && text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  }, []);

  // Loading state with spinner correctly placed below the heading
  if (loading) {
    return (
      <div className="p-4 border-l border-gray-300"> {/* Apply the left border here */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-600">{t("Noticeboard")}</h2> {/* Use translation for "Noticeboard" */}
        </div>
        <div className="flex flex-col items-center justify-center h-64 text-center overflow-x-auto shadow rounded-lg p-4">
          <div className="flex justify-center items-center"> {/* Spinner positioned similarly to 'My Children' */}
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  // Error state handling
  if (error) {
  
    return (
      <div className="p-4 border-l border-gray-300"> {/* Apply the left border here */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-600">{t("Noticeboard")}</h2> {/* Use translation for "Noticeboard" */}
        </div>
        <div className="flex flex-col items-center justify-center h-64 text-center overflow-x-auto shadow rounded-lg p-4"> {/* Consistent layout */}
          <FaBell className="text-gray-400 text-6xl mb-4" />
          <p className="text-gray-600 text-lg">{error}: {t("Unable to fetch Notices")}</p> {/* Translated error message */}
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 border-l border-gray-300"> {/* Apply the left border here */}
      <div className="flex justify-between p-4 items-center px-6">
        <h2 className="text-md font-semibold text-gray-600">{t("Noticeboard")}</h2> {/* Use translation for "Noticeboard" */}
        <button
          className="text-transparent bg-clip-text bg-gradient-to-r from-[#C83B62] to-[#7F35CD]"
          onClick={handleNavigate}
        >
          {t("See All")} {/* Use translation for "See All" */}
        </button>
      </div>
      {latestNotices.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center overflow-x-auto shadow rounded-lg p-4">
          <FaBell className="text-gray-400 text-6xl mb-4" />
          <p className="text-gray-600 text-lg">{t("No Notices Available")}</p> {/* Use translation for "No Notices Available" */}
        </div>
      ) : (
        latestNotices.map((notice, index) => (
          <Notice
          key={index}
          image={notice.image || ""}
          title={notice.title || t("Untitled")} 
          startDate={notice.startDate || "N/A"}
          endDate={notice.endDate || "N/A"}
          priority={
            <span 
              className={notice.priority === "High priority" ? "bg-pink-200 text-pink-600 font-semibold px-2 py-1 rounded-md" : "bg-gray-200 text-gray-600 font-semibold px-2 py-1 rounded-md"}
            >
              {t(notice.priority === "High priority" ? "High Priority" : "Low Priority")}
            </span>
          }
          content={truncateText(notice.description || "", 50)}
          backgroundColor={gradientBackgrounds[index % gradientBackgrounds.length]}
        />
        
        ))
      )}
    </div>
  );
};

export default NoticeBoard;
