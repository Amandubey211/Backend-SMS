import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Notice from "./Notice";
import useGetNotices from "../../../../Hooks/AuthHooks/Staff/Admin/Notices/useGetNotices";
import Fallback from "../../../../Components/Common/Fallback";
import icon1 from "../../../../Assets/DashboardAssets/Images/image1.png"; // Update with correct path
import icon2 from "../../../../Assets/DashboardAssets/Images/image2.png"; // Update with correct path

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
  const navigate = useNavigate();

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

  const handleViewAllClick = () => {
    navigate("/noticeboard/announcements");
  };

  return (
    <div className="p-2">
      <div className="flex justify-between p-4 items-center px-6">
        <h2 className="text-xl font-semibold text-gray-600">Notice Board</h2>
        <button onClick={handleViewAllClick} className="text-blue-500">view all</button>
      </div>
      {noticesSort.map((notice, index) => (
        <Notice
          key={index}
          image={icons[index % icons.length]} // Use cyclic icons
          title={notice.title}
          date={new Date(notice.startDate).toLocaleDateString()} // Formatting date
          priority={notice.priority}
          content={notice.description} // Changed 'content' to 'description' based on API response
          backgroundColor={generateRandomColor()}
        />
      ))}
    </div>
  );
};

export default NoticeBoard;
