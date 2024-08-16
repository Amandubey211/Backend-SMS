import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { baseUrl } from '../../../../config/Common';
import { FaChild } from 'react-icons/fa';
import Spinner from "../../../../Components/Common/Spinner"; // Import Spinner

const StudentCard = ({ student, index }) => {
  const defaultImage = "https://via.placeholder.com/150";
  const profileImage = student.profile || defaultImage;

  return (
    <div className="border-r border-b p-4 mb-4 text-center relative border-gray-300">
      <div className="absolute top-2 left-2 bg-gray-100 text-gray-800 py-1 px-2 rounded-l-sm rounded-r-sm text-sm">
        Child: {index + 1}
      </div>
      <img
        src={profileImage}
        alt={student.name}
        className="w-20 h-20 rounded-full mx-auto mb-2"
        onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
      />
      <h2 className="text-lg font-semibold mb-1">{student.name}</h2>
      <div className="text-gray-600 text-sm mb-1">
        Class: {student.class} | Id: {student.admissionNumber} | Section: {student.section}
      </div>
      <div className="text-green-500 text-sm">Group: {student.group}</div>
    </div>
  );
};

const StudentParentCard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="flex flex-col items-center justify-center h-full text-center py-10"> {/* Added padding */}
      <FaChild className="text-gray-400 text-6xl mb-4" />
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );

  return (
    <div className="p-4"> {/* Added padding */}
      <h2 className="text-lg font-semibold mb-4">My Children</h2> {/* Heading */}
      {loading && <Spinner />} {/* Show spinner while loading */}
      {!loading && error && renderErrorOrNoChildren("No Children Data Found!")} {/* Show icon with error message */}
      {!loading && !error && students.length === 0 && renderErrorOrNoChildren("No Children Found!")} {/* Show icon with no children message */}
      {!loading && !error && students.length > 0 && (
        <>
          {students.slice(0, 3).map((student, index) => (
            <StudentCard key={student.id} student={student} index={index} />
          ))}
          {students.length > 3 && (
            <div className="text-center mt-4">
              <Link to="/children" className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-700">
                Show All
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentParentCard;
