import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { RiAddFill } from "react-icons/ri";

const SyllabusSection = ({ title, content }) => {
  const { cid, sid } = useParams();

  return (
    <div className="p-3 bg-white mb-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div
        className="text-gray-700 mb-6"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <NavLink
        to={`/class/${cid}/${sid}/syllabus/create_syllabus`}
        className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4"
      >
        <RiAddFill size={24} />
      </NavLink>
    </div>
  );
};

export default SyllabusSection;
