import React, { useEffect } from 'react';
import { FaUser, FaBook, FaGraduationCap } from 'react-icons/fa';
import { VscChromeClose } from "react-icons/vsc";

const Sidebar = ({ student, closeSidebar }) => {
  

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.sidebar-content') && event.target.closest('.sidebar-wrapper') !== null) {
        closeSidebar();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeSidebar]);

  return (
    <div className="sidebar-wrapper fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50 transition-opacity ease-in-out">
      {/* Sidebar Content */}
      <div className="sidebar-content fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg transform transition-transform duration-1000 ease-in-out p-5">
        <div className="relative h-full">

          {/* Close button */}
          <button
            onClick={closeSidebar}
            className="absolute top-4 right-5 text-gray-600 hover:text-gray-800 transition-all duration-200"
          >
            <VscChromeClose size={28} className="font-thin" /> {/* Thinner close button */}
          </button>

          {/* Profile Section */}
          <div className="flex items-center mb-6">
            <img
              src={student.profile}
              alt={student.firstName}
              className="w-20 h-20 p-0.5 rounded-full border-2 border-gray-300 mr-4"
            />
            <div>
              <h2 className="text-2xl font-semibold">{student.firstName} {student.lastName}</h2>
              <p className="text-sm text-gray-600">Admission Number: {student.admissionNumber}</p>
            </div>
          </div>

          {/* Horizontal Line */}
          <hr className="my-4 border-gray-300" />

          {/* Personal Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FaUser className="mr-2 text-blue-600" /> Personal Information
            </h3>
            <p>Email: {student.email}</p>
            <p>Phone: {student.contactNumber}</p>
            <p>Parent Contact: {student.guardianContactNumber}</p>
          </div>

          <hr className="my-4 border-gray-300" /> {/* Horizontal Line */}

          {/* Academic Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FaBook className="mr-2 text-green-600" /> Academic Information
            </h3>
            <p>Class & Section: {student.className} ({student.sectionName})</p>
            <p>Group: {student.groupName}</p>
            <p>Academic Year: {student.academicYear}</p>
          </div>

          <hr className="my-4 border-gray-300" /> {/* Horizontal Line */}

          {/* Achievements */}
          {student.achievements && student.achievements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <FaGraduationCap className="mr-2 text-yellow-600" /> Achievements
              </h3>
              <ul className="list-disc pl-5">
                {student.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Bottom Buttons */}
          <div className="absolute bottom-5 left-5 flex gap-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all">Edit</button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
