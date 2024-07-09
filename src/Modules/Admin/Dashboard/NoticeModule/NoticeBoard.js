import React from "react";
import Notice from "./Notice";
import notices from "../DashboardData/NoticeData";

const NoticeBoard = () => {
  return (
    <div className="p-2">
      <div className="flex justify-between  p-4 items-center px-6">
        <h2 className="text-xl font-semibold text-gray-600">Notice Board</h2>
        <button className="text-blue-500">view all</button>
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
