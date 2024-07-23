import React, { useState, useEffect } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Student/StudentDashLayout";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileCard from "./ProfileCard";
import { baseUrl } from "../../../../config/Common";

const StudentTeacher = () => {
  const { selectedClass, selectedSection, selectedSubject } = useSelector((state) => state.Common);
  const { cid } = useParams(); // Ensure classId is part of the route parameters
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("cid from URL params:", cid);
    console.log("Class ID from Redux (selectedClass):", selectedClass);

    if (!selectedClass) {
      console.error("Class ID is undefined");
      return;
    }

    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("student:token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          `${baseUrl}/student/my_teachers/${selectedClass}`,
          {
            headers: {
              Authentication: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch teachers, status: ${response.status}`);
        }

        const data = await response.json();
        console.log("teacher data", data);
        if (data.status && data.data) {
          setTeachers(data.data);
        } else {
          console.error("No teachers data or unsuccessful response");
        }
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [cid, selectedClass]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout title="My Class Teachers">
      <DashLayout>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold">My Class Teachers </h2>
            <div className="flex justify-center items-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-full w-[25px] h-[25px] border border-gray-300">
              <p className="text-lg font-semibold text-purple-500">{teachers.length || 0}</p>
            </div>
          </div>
          <div className="flex flex-wrap -mx-2  ">
            {teachers.map((teacher, index) => (
              <ProfileCard key={index} profile={teacher} />
            ))}
          </div>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default StudentTeacher;
