import React, { useEffect, useState } from "react";
import SubjectsSlider from "./SubjectsSlider";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { GoAlertFill } from "react-icons/go";
import { baseUrl } from "../../../../../config/Common";

const AllSubjects = () => {
  const [studentSubjects, setStudentSubjects] = useState([]);
  const { role } = useSelector((state) => state.common.auth); // Access role from Auth slice
  const { studentId } = useSelector((state) => state.common.user.userDetails); // Access studentId from User slice

  const { cid } = useParams(); // cid is used but not in current logic; keep it if needed for future use

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem(`${role}:token`);
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.get(
          `${baseUrl}/api/studentDashboard/subjects/${studentId}`,
          {
            headers: { Authentication: token },
          }
        );

        // Log response for debugging
        console.log("Response in All Subjects:", response);

        setStudentSubjects(response.data.subjects);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    };

    if (studentId) {
      fetchSubjects(); // Only fetch subjects if studentId is available
    }
  }, [role, studentId]);

  return (
    <div className="px-4">
      {/* My Courses Section */}  {/* Updated title */}
      <hr className="-mx-4" /> {/* Remove parent padding to make line full width */}
      <div className="mt-4">
        <span className="text-xl font-semibold text-gray-600">My Courses</span>
        {studentSubjects.length > 0 ? (
          <SubjectsSlider subjects={studentSubjects} />
        ) : (
          <div className="flex w-full h-full text-gray-500 items-center justify-center flex-col text-2xl mt-4 mb-8">
            <GoAlertFill className="text-[4rem]" />
            <span className="mt-2 text-xl font-semibold text-center">No Data Found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSubjects;