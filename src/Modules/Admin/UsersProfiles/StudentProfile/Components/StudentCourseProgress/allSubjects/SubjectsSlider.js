import React, { useEffect, useState } from "react";
import SubjectCard from "./SubjectCard";
import { color } from "@cloudinary/url-gen/qualifiers/background";

const SubjectsSlider = ({ subjects }) => {
 
  return (
    <div className="flex  flex-wrap ml-[-10px] gap-4">
      {subjects.map((subject, index) => (
        <>
          <div className="">
            <SubjectCard key={index}  subject={subject} i={index}  />
          </div>
        </>
      ))}
    </div>
  );
};

export default SubjectsSlider;
