import React, { useEffect } from 'react';
import { FaUser, FaBook, FaGraduationCap, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBirthdayCake, FaUsers, FaCalendarAlt, FaBriefcaseMedical, FaBusAlt, FaCertificate, FaCheckCircle, FaShieldAlt, FaGlobe, FaCalendarCheck, FaClipboardCheck, FaUserShield } from 'react-icons/fa';
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

  if (!student) return null; // Ensure there's a student to display

  return (
    <div className="sidebar-wrapper fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50 transition-opacity ease-in-out">
      <div className="sidebar-content fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg transform transition-transform duration-1000 ease-in-out p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <div className="relative h-full pb-20"> {/* Added padding-bottom for content spacing */}

          {/* Close button */}
          <button
            onClick={closeSidebar}
            className="absolute top-4 right-5 text-gray-600 hover:text-gray-800 transition-all duration-200"
          >
            <VscChromeClose size={28} className="font-thin" />
          </button>

          {/* Profile Section */}
          <div className="flex items-center mb-6">
            <img
              src={student.profile}
              alt={`${student.firstName} ${student.lastName}`}
              className="w-20 h-20 p-0.5 rounded-full border-2 border-gray-300 mr-4"
            />
            <div>
              <h2 className="text-2xl font-semibold">{student.firstName} {student.lastName}</h2>
              <p className="text-sm text-gray-500">Admission Number: <span className="font-medium text-gray-700">{student.admissionNumber}</span></p>
            </div>
          </div>

          <hr className="my-4 border-gray-300" />

          {/* Personal Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-800">
              <FaUser className="mr-2 text-blue-600" /> Personal Information
            </h3>
            <p className="text-gray-600"><FaEnvelope className="inline mr-2 text-gray-500" /> <span className="font-bold">Email:</span> {student.email}</p>
            <p className="text-gray-600"><FaPhone className="inline mr-2 text-gray-500" /> <span className="font-bold">Phone:</span> {student.contactNumber}</p>
            <p className="text-gray-600"><FaBirthdayCake className="inline mr-2 text-gray-500" /> <span className="font-bold">Date of Birth:</span> {new Date(student.dateOfBirth).toLocaleDateString()}</p>
            <p className="text-gray-600"><FaUser className="inline mr-2 text-gray-500" /> <span className="font-bold">Gender:</span> {student.gender}</p>
            <p className="text-gray-600"><FaBriefcaseMedical className="inline mr-2 text-gray-500" /> <span className="font-bold">Blood Group:</span> {student.bloodGroup}</p>
            <p className="text-gray-600"><FaGlobe className="inline mr-2 text-gray-500" /> <span className="font-bold">Religion:</span> {student.religion}</p>
          </div>

          <hr className="my-4 border-gray-300" />

          {/* Guardian Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-800">
              <FaUser className="mr-2 text-purple-600" /> Guardian Information
            </h3>
            <p className="text-gray-600"><FaUser className="inline mr-2 text-gray-500" /> <span className="font-bold">Name:</span> {student.guardianName} ({student.guardianRelationToStudent})</p>
            <p className="text-gray-600"><FaPhone className="inline mr-2 text-gray-500" /> <span className="font-bold">Guardian Phone:</span> {student.guardianContactNumber}</p>
            <p className="text-gray-600"><FaEnvelope className="inline mr-2 text-gray-500" /> <span className="font-bold">Guardian Email:</span> {student.guardianEmail}</p>
          </div>

          <hr className="my-4 border-gray-300" />

          {/* Address Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-800">
              <FaMapMarkerAlt className="mr-2 text-green-600" /> Address Information
            </h3>
            <div>
              <h4 className="font-medium flex items-center"><FaMapMarkerAlt className="mr-2 text-gray-500" /> Permanent Address:</h4>
              <p className="text-gray-600">{student.permanentAddress.street}, {student.permanentAddress.city}, {student.permanentAddress.state}, {student.permanentAddress.country}, {student.permanentAddress.postalCode}</p>
            </div>
            <div className="mt-3">
              <h4 className="font-medium flex items-center"><FaMapMarkerAlt className="mr-2 text-gray-500" /> Residential Address:</h4>
              <p className="text-gray-600">{student.residentialAddress.street}, {student.residentialAddress.city}, {student.residentialAddress.state}, {student.residentialAddress.country}, {student.residentialAddress.postalCode}</p>
            </div>
          </div>

          <hr className="my-4 border-gray-300" />

          {/* Academic Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-800">
              <FaGraduationCap className="mr-2 text-yellow-600" /> Academic Information
            </h3>
            <p className="text-gray-600"><FaBook className="inline mr-2 text-gray-500" /> <span className="font-bold">Academic Year:</span> {student.academicYear.year}</p>
            <p className="text-gray-600"><FaCertificate className="inline mr-2 text-gray-500" /> <span className="font-bold">Enrollment Status:</span> {student.enrollmentStatus}</p>
            <p className="text-gray-600"><FaCalendarAlt className="inline mr-2 text-gray-500" /> <span className="font-bold">Batch End:</span> {new Date(student.batchEnd).toLocaleDateString()}</p>
            <p className="text-gray-600"><FaUsers className="inline mr-2 text-gray-500" /> <span className="font-bold">Group IDs:</span> {student.presentGroupId.join(", ")}</p>
          </div>

          <hr className="my-4 border-gray-300" />

          {/* Additional Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-800">
              <FaShieldAlt className="mr-2 text-red-600" /> Additional Information
            </h3>
            <p className="text-gray-600"><FaUserShield className="inline mr-2 text-gray-500" /> <span className="font-bold">Verified Documents:</span> {student.isVerifiedDocuments}</p>
            <p className="text-gray-600"><FaBusAlt className="inline mr-2 text-gray-500" /> <span className="font-bold">Transport Requirement:</span> {student.transportRequirement ? "Yes" : "No"}</p>
            <p className="text-gray-600"><FaPhone className="inline mr-2 text-gray-500" /> <span className="font-bold">Emergency Contact:</span> {student.emergencyNumber}</p>
            <p className="text-gray-600"><FaCheckCircle className="inline mr-2 text-gray-500" /> <span className="font-bold">Student Verified:</span> {student.isStudentVerified ? "Yes" : "No"}</p>
          </div>

          {/* Bottom Buttons */}
          <div className="flex gap-4 mt-8 justify-center pb-6"> {/* Moved buttons to the bottom with margin-top and centered */}
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all">Edit</button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all">Demote Student</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;