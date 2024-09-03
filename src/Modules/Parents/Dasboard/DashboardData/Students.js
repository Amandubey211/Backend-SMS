import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import { baseUrl } from '../../../../config/Common';
import { FaChild } from 'react-icons/fa';
import Spinner from "../../../../Components/Common/Spinner"; // Import Spinner

const StudentCard = ({ student, index }) => {
  const defaultImage = "https://via.placeholder.com/150";
  const profileImage = student.profile || defaultImage;

  // Fallback values for fields
  const studentClass = student.class || "N/A";
  const admissionNumber = student.admissionNumber || "N/A";
  const section = student.section || "N/A";
  const group = student.group || "N/A";

  return (
    <div className="border-b p-4 pb-4 pt-6 text-center relative border-gray-300"> {/* Removed border-r */}
      <div className="absolute top-2 left-2 bg-gray-100 text-gray-800 py-1 px-2 rounded-l-sm rounded-r-sm text-sm">
        Child: {index + 1}
      </div>
      <img
        src={profileImage}
        alt={student.name}
        className="w-20 h-20 rounded-full mx-auto mb-2"
        onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
      />
      <h2 className="text-lg font-semibold mb-1">{student.name || "N/A"}</h2>
      <div className="text-gray-600 text-sm mb-1">
        Class: {studentClass} | Id: {admissionNumber} | Section: {section}
      </div>
      <div className="text-green-600 text-sm">Group: {group}</div>
    </div>
  );
};

const StudentParentCard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Use useNavigate for navigation

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
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

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || "Network response was not ok");
        }

        const data = await response.json();

        if (data && data.children) {
          setStudents(data.children);
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

  const renderErrorOrNoChildren = (message) => (
    <div className="flex flex-col items-center justify-center h-full text-center py-10">
      <FaChild className="text-gray-400 text-6xl mb-4" />
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );

  return (
    <div className="relative border-r border-gray-300"> {/* Added border-r to cover entire section */}
      <div className="flex justify-between p-4 items-center px-6">
        <h2 className="text-md font-bold text-gray-600">My Children</h2>
        {!loading && !error && students.length > 3 && (
          <button
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#C83B62] to-[#7F35CD] font-normal"
            onClick={() => navigate("/children")}
          >
            See All
          </button>
        )}
      </div>
      {loading && <Spinner />}
      {!loading && error && renderErrorOrNoChildren("No Children Data Found!")}
      {!loading && !error && students.length === 0 && renderErrorOrNoChildren("No Children Found!")}
      {!loading && !error && students.length > 0 && (
        <>
          {students.slice(0, 3).map((student, index) => (
            <StudentCard key={student.id} student={student} index={index} />
          ))}
        </>
      )}
    </div>
  );
};

export default StudentParentCard;
