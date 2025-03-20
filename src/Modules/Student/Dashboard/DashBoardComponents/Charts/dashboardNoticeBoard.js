import React, { useEffect, memo } from "react";
import Fallback from "../../../../../Components/Common/Fallback";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotices } from "../../../../../Store/Slices/Admin/Dashboard/adminDashboard.action";
import icon1 from "../../../../../Assets/DashboardAssets/Images/image1.png";
import icon2 from "../../../../../Assets/DashboardAssets/Images/image2.png";
import { FaCalendarAlt } from "react-icons/fa";
import NoticeCard from "../../DashboardData/NoticeCard";

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

const DashboardNoticeBoard = (descriptionLength) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, notices } = useSelector(
    (state) => state.admin.adminDashboard
  );

  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  if (loading) {
    return <Fallback />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const topNotices = notices;

  return (
    <div className="py-4 h-full">
      <div className="flex justify-between pb-2 items-center pr-5 mb-2">
        <h2 className="text-lg font-semibold mb-2 text-black">
          Upcoming Notices
        </h2>
        <span
          className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] bg-clip-text text-transparent font-normal cursor-pointer"
          onClick={() => navigate("/student/noticeboard/announcements")}
        >
          See All
        </span>
      </div>
      <div className="overflow-hidden h-[90%]">
        {topNotices?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <FaCalendarAlt className="text-gray-400 text-3xl mb-4" />
            <p className="text-gray-500 text-md">
              No Upcoming Notice Available
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-[70vh] overflow-y-auto scrollbar-hide hover:scrollbar-auto">
            {topNotices
              ?.slice(0, 5)
              .map((notice, index) => (
                <NoticeCard
                  key={index}
                  image={icons[index % icons.length]}
                  title={notice?.title}
                  date={new Date(notice.startDate).toLocaleDateString()}
                  priority={notice?.priority}
                  authorName={notice?.authorName}
                  content={notice?.description}
                  backgroundColor={generateRandomColor()}
                  descriptionLength={descriptionLength}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(DashboardNoticeBoard);
