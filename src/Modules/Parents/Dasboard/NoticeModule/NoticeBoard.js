import React, { useEffect, useState } from "react";
import Notice from "./Notice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import { format } from 'date-fns'; // Import format function from date-fns
import { baseUrl } from "../../../../config/Common";
import { FaBell } from "react-icons/fa"; // Importing an icon for the no notices message
import Spinner from "../../../../Components/Common/Spinner"; // Import Spinner

// Define the gradient backgrounds
const gradientBackgrounds = [
  "linear-gradient(90deg, #FBB778 0%, #F9B279 100%)",
  "linear-gradient(90deg, #FF7AA5 0%, #FF5B92 80%)",
  "linear-gradient(90deg, #33C4FE 0%, #36D5FF 100%)",
  "linear-gradient(90deg, #FBB778 0%, #F9B279 100%)"
];

const NoticeBoard = ({ numberOfChildren }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem("parent:token");
        const response = await axios.get(`${baseUrl}/admin/all/notices`, {
          headers: {
            Authentication: `${token}`, 
          },
        });

        console.log("Fetched Notices:", response.data.notices);

        const formattedNotices = response.data.notices.map(notice => {
          let startDate, endDate;

          try {
            startDate = format(new Date(notice.startDate), 'yyyy-MM-dd');
          } catch (e) {
            console.error(`Invalid start date value for notice "${notice.title}":`, notice.startDate);
            startDate = "Invalid Date";
          }

          try {
            endDate = format(new Date(notice.endDate), 'yyyy-MM-dd');
          } catch (e) {
            console.error(`Invalid end date value for notice "${notice.title}":`, notice.endDate);
            endDate = "Invalid Date";
          }

          return {
            ...notice,
            startDate,
            endDate
          };
        });

        // Determine the number of notices to show based on the number of children
        const numberOfNoticesToShow = numberOfChildren > 1 ? 5 : 3;

        // Sort notices by startDate in descending order (most recent first) and slice according to the number of children
        const latestNotices = formattedNotices
          .filter(notice => notice.startDate !== "Invalid Date") // Filter out notices with invalid dates
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
          .slice(0, numberOfNoticesToShow);

        console.log("Sorted and Filtered Notices:", latestNotices);

        setNotices(latestNotices);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Failed to fetch notices:", error);
        message.error("Failed to fetch notices");
        setLoading(false); // Set loading to false even on error
      }
    };

    fetchNotices();
  }, [numberOfChildren]);

  if (loading) {
    return <Spinner />; // Show spinner while loading
  }

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
      {notices.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <FaBell className="text-gray-400 text-6xl mb-4" />
          <p className="text-gray-600 text-lg">No Notices Available</p>
        </div>
      ) : (
        notices.map((notice, index) => (
          <Notice
            key={index}
            image={notice.image}
            title={notice.title}
            startDate={notice.startDate}
            endDate={notice.endDate}
            priority={notice.priority}
            content={truncateText(notice.description, 50)}
            backgroundColor={gradientBackgrounds[index % gradientBackgrounds.length]} // Apply dynamic background
          />
        ))
      )}
    </div>
  );
};

export default NoticeBoard;
