import React from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import AnnouncementViewHeader from "./Components/AnnouncementHeader";
import { assignmentDetails } from "../../Assignments/AssignmentComponents/MockData";
import { RiListCheck3, RiAddFill } from "react-icons/ri";

const MainSection = () => {
  const { description } = assignmentDetails;
  return (
    <div className="flex w-full">
      <SubjectSideBar />
      <div className="border-l w-full">
        <AnnouncementViewHeader />
        <div className="p-4 bg-white ">
          <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg mb-4">
            <img
              src="https://media.licdn.com/dms/image/D4D16AQG65LyLN4Z9Ig/profile-displaybackgroundimage-shrink_350_1400/0/1714532169714?e=1725494400&v=beta&t=MC2UOZUt8a8-CUsCznXdEJz65mT6H6HSziQeP0xBHEk"
              alt="Announcement"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
          <p className="text-gray-700 mb-6">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
