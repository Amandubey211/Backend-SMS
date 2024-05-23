import React from "react";
import Notice from "./NoticeModule/Notice";

const NoticeBoard = ({ notices }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Notice Board</h2>
        <button className="text-blue-500">View all</button>
      </div>
      {notices.map((notice, index) => (
        <Notice key={index} notice={notice} />
      ))}
    </div>
  );
};

export default NoticeBoard;
