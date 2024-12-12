// src/Modules/Admin/Finance/StudentFees/Components/StudentCardSection.js
import React from "react";
import Card from "./Card"; // Reusing the Card component
import { studentCardsData } from "../Datafiles/studentEarning";

const StudentCardSection = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 place-items-center">
      {studentCardsData.map((item, index) => (
        <Card key={index} {...item} />
      ))}
    </div>
  );
};

export default StudentCardSection;
