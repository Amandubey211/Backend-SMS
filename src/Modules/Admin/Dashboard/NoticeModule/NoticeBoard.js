import React, { useEffect } from "react";
import Notice from "./Notice";
import useGetNotices from "../../../../Hooks/AuthHooks/Staff/Admin/Notices/useGetNotices";
import Fallback from "../../../../Components/Common/Fallback";
import { useNavigate } from "react-router-dom"; // Updated import
import icon1 from "../../../../Assets/DashboardAssets/Images/image1.png"; // Update with correct path
import icon2 from "../../../../Assets/DashboardAssets/Images/image2.png"; // Update with correct path
import { FaCalendarAlt } from "react-icons/fa"; // For "No data found" icon

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

const NoticeBoard = () => {
  const { loading, error, notices, fetchNotices } = useGetNotices();
  const navigate = useNavigate(); // Use useNavigate
  console.log("This is notices",fetchNotices)
  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  if (loading) {
    return <Fallback />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  
  const noticesSort = notices.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  const topNotices = noticesSort.slice(0, 5);

  return (
    <div className="p-2">
      <div className="flex justify-between p-4 items-center px-6">
        <h2 className="text-xl font-semibold text-gray-600">Notice Boardy</h2>
        <button className="text-blue-500" onClick={() => navigate('/noticeboard/announcements')}>View All</button>
      </div>
      {topNotices.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-10">
          <FaCalendarAlt className="text-gray-400 text-6xl mb-4" />
          <p className="text-gray-500 text-xl">No noticeboard data found</p>
        </div>
      ) : (
        topNotices.map((notice, index) => (
          <Notice
            key={index}
            image={icons[index % icons.length]} // Use cyclic icons
            title={notice.title}
            date={new Date(notice.startDate).toLocaleDateString()} // Formatting date
            priority={notice.priority}
            content={notice.description} // Changed 'content' to 'description' based on API response
            backgroundColor={generateRandomColor()}
          />
        ))
      )}
    </div>
  );
};

export default NoticeBoard;
