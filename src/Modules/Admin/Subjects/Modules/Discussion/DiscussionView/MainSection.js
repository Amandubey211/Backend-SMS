import React from "react";
import { useParams } from "react-router-dom";
import Header from "./Components/Header";
import { assignmentDetails } from "../../Assignments/AssignmentComponents/MockData";
import SubjectSideBar from "../../../Component/SubjectSideBar";

const MainSection = () => {
  const { did } = useParams();
  console.log(did); // call the get discussion data by this id
  const { description } = assignmentDetails;
  return (
    <div className="flex ">
      <SubjectSideBar />
      <div className="border-l">
        <Header />
        <div className="p-6 bg-white ">
          <img
            src="https://media.licdn.com/dms/image/D4D16AQG65LyLN4Z9Ig/profile-displaybackgroundimage-shrink_350_1400/0/1714532169714?e=1723680000&v=beta&t=AmLTMAr6mBYPMbd0Fu0LSoV5t1NNee8Iq0CmUcyrpWs"
            alt="Assignment"
            className="w-full  rounded-lg mb-4"
          />
          <p className="text-gray-700 mb-6">{description}</p>
          <p className="text-gray-700 mb-6">{description}</p>
          <div className="relative"></div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
