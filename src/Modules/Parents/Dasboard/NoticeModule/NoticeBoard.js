import React, { useEffect, useState } from "react";
import Notice from "./Notice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import { format } from 'date-fns'; // Import format function from date-fns

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem("parent:token");
        const response = await axios.get("http://localhost:8080/admin/all/notices", {
          headers: {
            Authentication: `${token}`, 
          },
        });
        const formattedNotices = response.data.notices.map(notice => ({
          ...notice,
          startDate: format(new Date(notice.startDate), 'yyyy-MM-dd'),
          endDate: format(new Date(notice.endDate), 'yyyy-MM-dd')
        }));
        // Sort notices by startDate in descending order and slice the first three
        const latestNotices = formattedNotices.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)).slice(0, 3);
        setNotices(latestNotices);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch notices", error);
        message.error("Failed to fetch notices");
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-2">
      <div className="flex justify-between p-4 items-center px-6">
        <h2 className="text-md font-bold text-gray-600">Noticeboard</h2>
        <button className="text-blue-500" onClick={() => navigate("/parentchildnotice")}>
          See All
        </button>
      </div>
      {notices.map((notice, index) => (
        <Notice
          key={index}
          image={notice.image}
          title={notice.title}
          startDate={notice.startDate} // Changed to startDate
          endDate={notice.endDate}   // Added endDate
          priority={notice.priority}
          content={notice.content}
        />
      ))}
    </div>
  );
};

export default NoticeBoard;
