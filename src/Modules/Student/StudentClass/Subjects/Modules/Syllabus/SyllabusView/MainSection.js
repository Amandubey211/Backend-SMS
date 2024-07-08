


import React, { useState, useEffect } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import SyllabusHeader from "./Components/SyllabusHeader";
import SyllabusSection from "./Components/SyllabusSection";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const MainSection = () => {
  const { cid } = useParams();

  const [syllabusData, setSyllabusData] = useState([]);
  const selectedSubjectId = useSelector(state => state.Common.selectedSubject);
console.log("selected subject id in syllabus",selectedSubjectId)
  useEffect(() => {
    const fetchSyllabusData = async () => {
      try {
        const token = localStorage.getItem("student:token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(`http://localhost:8080/admin/syllabus/${selectedSubjectId}/class/${cid}`, {
          headers: {
            Authorization: token
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch syllabus data, status: ${response.status}`);
        }

        const data = await response.json();
        console.log("data in syllabus is ",data)
        if (data.status) {
          setSyllabusData(data.data); // Assuming data.data is an array of syllabus items
        } else {
          console.error("Failed to fetch syllabus data");
        }
      } catch (error) {
        console.error("Error fetching syllabus:", error);
      }
    };

    fetchSyllabusData();
  }, [selectedSubjectId]); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="border-l w-full p-4">
        <SyllabusHeader />
        {/* {syllabusData.map((syllabusItem) => (
          <SyllabusSection key={syllabusItem._id} syllabus={syllabusItem} />
        ))} */}
        {syllabusData.map((syllabusItem) => {
          console.log("syllabusItem:", syllabusItem); // Log syllabusItem here
          return <SyllabusSection key={syllabusItem._id} syllabus={syllabusItem} />;
        })}
      </div>
    </div>
  );
};

export default MainSection;
