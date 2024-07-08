import React, { useEffect, useState } from "react";
import Notice from "./Notice";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { message } from "antd";


const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem("parent:token");
        console.log(token);
        const response = await axios.get("http://localhost:8080/admin/all/notices", {
          headers: {
            Authentication: `${token}`,
          },
        });
        console.log(response);
        setNotices(response.data.notices);
        setLoading(false);
      } catch (error) {
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
        <h2 className="text-xl font-semibold text-gray-600">Notice Board</h2>
        <button className="text-blue-500" onClick={() => navigate("/parentchildnotice")}>
          View All
        </button>
      </div>
      {notices.map((notice, index) => (
        <Notice
          key={index}
          image={notice.image}
          title={notice.title}
          date={notice.date}
          priority={notice.priority}
          content={notice.content}
        />
      ))}
    </div>
  );
};

export default NoticeBoard;
