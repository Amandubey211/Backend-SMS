import React from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import AnnouncementViewHeader from "./Components/AnnouncementHeader";
import { assignmentDetails } from "../../Assignments/AssignmentComponents/MockData";

const MainSection = () => {
  const { description } = assignmentDetails;
  return (
    <div className="flex w-full">
      <SubjectSideBar />
      <div className="border-l w-full">
        <AnnouncementViewHeader />
        <div className="p-4 bg-white ">
          <img
            src="https://media.licdn.com/dms/image/D4D16AQG65LyLN4Z9Ig/profile-displaybackgroundimage-shrink_350_1400/0/1714532169714?e=1723680000&v=beta&t=AmLTMAr6mBYPMbd0Fu0LSoV5t1NNee8Iq0CmUcyrpWs"
            alt="Assignment"
            className="w-full  rounded-sm mb-4"
          />
          <p className="text-gray-700 mb-6">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
