import React, { useEffect, useState } from "react";
import ChildCard from "../../../Components/Parents/Children/ChildCard";
import { baseUrl } from "../../../config/Common";
import Spinner from "../../../Components/Common/Spinner";
import { FaChild } from 'react-icons/fa';

const MyChildren = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        console.log(userData);
        const token = localStorage.getItem('parent:token');

        if (!userData) {
          throw new Error("No user data found");
        }

        const { email } = userData;

        if (!token) {
          throw new Error("No token found");
        }
        if (!email) {
          throw new Error("No guardian email found");
        }

        const response = await fetch(`${baseUrl}/parent/api/children?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authentication': `${token}`
          }
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const textResponse = await response.text();
          console.error("Response is not JSON:", textResponse);
          throw new Error("Server response is not JSON");
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || "Network response was not ok");
        }

        const data = await response.json();

        // Ensure data contains children array
        if (data && data.children) {
          setStudents(data.children);
          // Store the children data in localStorage
          localStorage.setItem('childrenData', JSON.stringify(data.children));
        } else {
          throw new Error("No children data found");
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-10">
        <FaChild className="text-gray-400 text-6xl mb-4" />
        <p className="text-gray-600 text-lg">Unable to fetch children data!</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-10">
        <FaChild className="text-gray-400 text-6xl mb-4" />
        <p className="text-gray-600 text-lg">No Children Found!</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="w-full p-2">
        <div className="min-h-screen flex-wrap flex items-start">
          {students.map(student => (
            <ChildCard key={student.id} student={student} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyChildren;
