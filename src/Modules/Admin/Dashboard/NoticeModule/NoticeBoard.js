import React, { useEffect, memo } from "react";
import Notice from "./Notice";
import Fallback from "../../../../Components/Common/Fallback";
import { useNavigate } from "react-router-dom"; // Updated import
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { fetchNotices } from "../../../../Store/Slices/Admin/Dashboard/adminDashboard.action"; // Import Redux action
import icon1 from "../../../../Assets/DashboardAssets/Images/image1.png"; // Update with correct path
import icon2 from "../../../../Assets/DashboardAssets/Images/image2.png"; // Update with correct path
import { FaCalendarAlt } from "react-icons/fa"; // For "No data found" icon
import { useTranslation } from "react-i18next";

const icons = [icon1, icon2];

const generateRandomColor = () => {
  const colors = [
    "rgba(255, 122, 165, 0.8)",
    "rgba(255, 91, 146, 0.8)",
    "#33C4FE",
    "#36D5FF",
    "#FBB778",
    "#F9B279",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const NoticeBoard = (descriptionLength) => {
  const dispatch = useDispatch(); // Use useDispatch to dispatch actions
  const navigate = useNavigate(); // Use useNavigate for navigation

  const { t } = useTranslation('dashboard');

  // Get notices data from Redux state
  const { loadingNotices:loading, errorNotices:error, notices } = useSelector((state) => state.admin.adminDashboard);
  useEffect(() => {
  
    dispatch(fetchNotices());
  }, [dispatch]);

  if (loading) {
    return <Fallback />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Ensure notices is an array and create a copy before sorting
  const noticesArray = Array.isArray(notices) ? [...notices] : [];
  const noticesSort = noticesArray.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  const topNotices = noticesSort.slice(0, 3);

  return (
    <div className="p-2">
      <div className="flex justify-between p-4 items-center px-6">
        <h2 className="text-xl font-semibold text-gray-600">{t("Notice Board")}</h2>
        <button
          className="text-black border border-gray-300 px-4 py-2 rounded-md hover:shadow-md transition duration-300 ease-in-out"
          onClick={() => navigate('/noticeboard/notice')}
        >
          {t("View All")}
        </button>



      </div>
      {topNotices.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-10">
          <FaCalendarAlt className="text-gray-400 text-6xl mb-4" />
          <p className="text-gray-500 text-xl">{t("No noticeboard data found")}</p>
        </div>
      ) : (
        topNotices.map((notice, index) => (
          <Notice
            key={index}
            image={icons[index % icons.length]} // Use cyclic icons
            title={notice?.title}
            authorName={notice?.authorName}
            date={new Date(notice?.startDate).toLocaleDateString()} // Formatting date
            priority={notice?.priority}
            content={notice?.description} // Changed 'content' to 'description' based on API response
            backgroundColor={generateRandomColor()}
            descriptionLength={descriptionLength}
          />
        ))
      )}
    </div>
  );
};

export default memo(NoticeBoard);
