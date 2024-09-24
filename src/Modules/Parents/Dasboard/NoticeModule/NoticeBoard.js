import React, { useEffect } from "react";
import Notice from "./Notice";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { format } from 'date-fns';
import { FaBell } from "react-icons/fa";
import Spinner from "../../../../Components/Common/Spinner";
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotices } from '../../../../Store/Slices/Parent/Dashboard/dashboardThunks';

const gradientBackgrounds = [
  "linear-gradient(90deg, #FBB778 0%, #F9B279 100%)",
  "linear-gradient(90deg, #FF7AA5 0%, #FF5B92 80%)",
  "linear-gradient(90deg, #33C4FE 0%, #36D5FF 100%)",
  "linear-gradient(90deg, #FBB778 0%, #F9B279 100%)"
];

const NoticeBoard = ({ numberOfChildren }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get the notices and loading state from Redux
  const { notices = [], loading = false, error = null } = useSelector((state) => state.Parent.dashboard);

  useEffect(() => {
    dispatch(fetchNotices()); // Fetch notices using Redux thunk
  }, [dispatch]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    message.error("Failed to fetch notices");
    return <p>Error: {error}</p>;
  }

  const formattedNotices = notices.map((notice) => {
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


  const numberOfNoticesToShow = numberOfChildren > 1 ? 5 : 3;


  const latestNotices = formattedNotices
    .filter((notice) => notice.startDate !== "Invalid Date")
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    .slice(0, numberOfNoticesToShow);


  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="p-2">
      <div className="flex justify-between p-4 items-center px-6">
        <h2 className="text-md font-bold text-gray-600">Noticeboard</h2>
        <button
          className="text-transparent bg-clip-text bg-gradient-to-r from-[#C83B62] to-[#7F35CD]"
          onClick={() => navigate("/parentchildnotice")}
        >
          See All
        </button>
      </div>
      {latestNotices.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <FaBell className="text-gray-400 text-6xl mb-4" />
          <p className="text-gray-600 text-lg">No Notices Available</p>
        </div>
      ) : (
        latestNotices.map((notice, index) => (
          <Notice
            key={index}
            image={notice.image}
            title={notice.title}
            startDate={notice.startDate}
            endDate={notice.endDate}
            priority={notice.priority}
            content={truncateText(notice.description, 50)}
            backgroundColor={gradientBackgrounds[index % gradientBackgrounds.length]}
          />
        ))
      )}
    </div>
  );
};

export default NoticeBoard;
