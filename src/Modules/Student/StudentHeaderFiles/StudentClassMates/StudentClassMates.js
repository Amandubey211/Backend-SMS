import React, { useState, useEffect } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Student/StudentDashLayout";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileCard from "./ProfileCard";

const StudentClassMates = () => {
  const { selectedClass, selectedSection, selectedSubject } = useSelector((state) => state.Common);
  const { cid } = useParams(); // Ensure classId is part of the route parameters
  const [classmates, setClassmates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("cid from URL params:", cid);
    console.log("Class ID from Redux (selectedClass):", selectedClass);

    if (!selectedClass) {
      console.error("Class ID is undefined");
      return;
    }

    const fetchClassmates = async () => {
      try {
        const token = localStorage.getItem("student:token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          `http://localhost:8080/student/my_classmates/${selectedClass}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch classmates, status: ${response.status}`);
        }

        const data = await response.json();
        console.log("classmates data", data);
        if (data.status && data.data) {
          setClassmates(data.data);
        } else {
          console.error("No classmates data or unsuccessful response");
        }
      } catch (error) {
        console.error("Failed to fetch classmates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassmates();
  }, [cid, selectedClass]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout title="My Classmates">
      <DashLayout>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Classmates</h2>
          </div>
          <div className="flex flex-wrap -mx-2">
            {classmates.map((classmate, index) => (
              <ProfileCard key={index} profile={classmate} />
            ))}
          </div>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default StudentClassMates;
