import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { baseUrl } from '../../../../config/Common';

const StudentCard = ({ student, index }) => {
  const defaultImage = "https://via.placeholder.com/150"; // Placeholder image URL
  const profileImage = student.profile || defaultImage; // Use the student profile image or the default image

  return (
    <div className="border rounded-lg p-4 mb-4 text-center shadow-lg relative">
      <div className="absolute top-2 left-2 bg-gray-200 text-gray-800 py-1 px-2 rounded-full">
        Child {index + 1}
      </div>
      <img
        src={profileImage}
        alt={student.name}
        className="w-24 h-24 rounded-full mx-auto mb-4"
        onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }} // Fallback to default image if the provided src fails
      />
      <h2 className="text-xl font-semibold mb-2">{student.name}</h2>
      <div className="text-gray-700">
        Class: {student.class} | Id: {student.admissionNumber} | Section: {student.section}
      </div>
      <div className="text-green-500">Group: {student.group}</div>
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
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
    </div>
  );
};

export default StudentParentCard;
