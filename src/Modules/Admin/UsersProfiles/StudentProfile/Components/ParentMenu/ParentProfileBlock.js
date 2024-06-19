import React from "react";
import { MdMarkChatUnread } from "react-icons/md";
import ParentProfileDetail from "./ParentProfileDetail";

const ParentProfileBlock = ({ title, imageSrc, name, details }) => {
  return (
    <div className="flex flex-col flex-1 h-full p-4 border border-gray-300 rounded-lg">
      <div className="flex justify-between">
        <h2 className="font-semibold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
          {title}
        </h2>
        <MdMarkChatUnread className="text-green text-2xl p-1 border border-black rounded-full h-[30px] w-[30px]" />
      </div>
      <div className="p-3 gap-2 flex flex-col justify-center items-center">
        <img src={imageSrc} alt={`${title} Image`} className="rounded-full w-[90px] h-[90px]" />
        <span className="font-semibold">{name}</span>
      </div>
      <div className="flex flex-col h-full p-3">
        {details.map((detail) => (
          <ParentProfileDetail key={detail.type} type={detail.type} label={detail.label} value={detail.value} />
        ))}
      </div>
    </div>
  );
};

export default ParentProfileBlock;
