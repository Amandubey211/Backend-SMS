


import React, { useState, useEffect } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import List from "../Component/List";
import FilterCard from "../Component/FilterCard";
import { RiListCheck3 } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const MainSection = () => {
  const { selectedClass, selectedSection, selectedSubject } = useSelector((state) => state.Common);
  

  const { cid, sid, subjectId } = useParams(); // Ensure subjectId is part of the route parameters
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Class ID (cid):", selectedClass);
    console.log("Section ID (sid):", selectedSection);
    console.log("Subject ID (subjectId):", selectedSubject);

    console.log("sid:", sid);
    console.log("cid:", cid);

    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem('student:token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        // const response = await fetch(`http://localhost:8080/studentAssignment/class/${cid}/section/${sid}?subjectId=${subjectId}`, {
        const response = await fetch(`http://localhost:8080/student/studentAssignment/class/${selectedClass}/section/${selectedSection}?subjectId=${selectedSubject}`, {
          headers: {
            'Authentication': token,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch assignments, status: ${response.status}`);
        }

        const data = await response.json();
        console.log("data in assignment maisection", data)
        console.log("data in assignment maisection", data)
        if (data.success && data.data) {
          setAssignments(data.data);
        } else {
          console.error("No assignment data or unsuccessful response");
        }
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [cid, sid, subjectId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="w-[65%] border-l ">
        <List
          type="Assignment"
          title="All Assignments"
          data={assignments}
          icon={<RiListCheck3 />}
        />
      </div>
      <div className="w-[30%] p-2 ">
        <FilterCard />
      </div>
    </div>
  );
};

export default MainSection;
