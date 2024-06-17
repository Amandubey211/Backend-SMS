import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { RiAddFill } from "react-icons/ri";
import { assignmentDetails } from "../../../Assignments/AssignmentComponents/MockData";

const SyllabusSection = () => {
    const { cid, sid } = useParams();
  const { description } = assignmentDetails;
  return (
    <div className="p-3 bg-white ">
      <img
        src="https://media.licdn.com/dms/image/D4D16AQG65LyLN4Z9Ig/profile-displaybackgroundimage-shrink_350_1400/0/1714532169714?e=1723680000&v=beta&t=AmLTMAr6mBYPMbd0Fu0LSoV5t1NNee8Iq0CmUcyrpWs"
        alt="Assignment"
        className="w-full  rounded-md mb-3"
      />
      <p className="text-gray-700 mb-6">{description}</p>
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
