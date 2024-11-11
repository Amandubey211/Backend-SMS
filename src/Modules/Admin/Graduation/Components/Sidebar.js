import React, { useEffect, memo } from 'react';
import { FaUser, FaBook, FaGraduationCap, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBirthdayCake, FaUsers, FaCalendarAlt, FaBriefcaseMedical, FaBusAlt, FaCertificate, FaCheckCircle, FaShieldAlt, FaGlobe, FaUserShield } from 'react-icons/fa';
import { VscChromeClose } from "react-icons/vsc";
import { useTranslation } from 'react-i18next';

const Sidebar = ({ student, closeSidebar, onDemote }) => {
  const { t } = useTranslation('admDashboard'); // Initialize i18next hook

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.sidebar-content') && event.target.closest('.sidebar-wrapper') !== null) {
        closeSidebar();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeSidebar]);

  if (!student) return null; // Ensure there's a student to display

  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : t("N/A"); // Default date format with "N/A"

  return (
    <div className="sidebar-wrapper fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50 transition-opacity ease-in-out">
      <div className="sidebar-content fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg transform transition-transform duration-1000 ease-in-out p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <div className="relative h-full pb-20">

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
              src={student?.profile || 'https://via.placeholder.com/150'}
              alt={`${student?.firstName || t("N/A")} ${student?.lastName || t("N/A")}`}
              className="w-20 h-20 p-0.5 rounded-full border-2 border-gray-300 mr-4"
            />
            <div>
              <h2 className="text-2xl font-semibold">{student?.firstName || t("N/A")} {student?.lastName || t("N/A")}</h2>
              <p className="text-sm text-gray-500">{t("Admission Number")}: <span className="font-medium text-gray-700">{student?.admissionNumber || t("N/A")}</span></p>
            </div>
          </div>

          <hr className="my-4 border-gray-300" />

          {/* Personal Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-800">
              <FaUser className="mr-2 text-blue-600" /> {t("Personal Information")}
            </h3>
            <p className="text-gray-600"><FaEnvelope className="inline mr-2 text-gray-500" /> <span className="font-bold">{t("Email")}:</span> {student?.email || t("N/A")}</p>
            <p className="text-gray-600"><FaPhone className="inline mr-2 text-gray-500" /> <span className="font-bold">{t("Phone")}:</span> {student?.contactNumber || t("N/A")}</p>
            <p className="text-gray-600"><FaBirthdayCake className="inline mr-2 text-gray-500" /> <span className="font-bold">{t("Date of Birth")}:</span> {formatDate(student?.dateOfBirth)}</p>
            <p className="text-gray-600"><FaUser className="inline mr-2 text-gray-500" /> <span className="font-bold">{t("Gender")}:</span> {student?.gender || t("N/A")}</p>
            <p className="text-gray-600"><FaBriefcaseMedical className="inline mr-2 text-gray-500" /> <span className="font-bold">{t("Blood Group")}:</span> {student?.bloodGroup || t("N/A")}</p>
            <p className="text-gray-600"><FaGlobe className="inline mr-2 text-gray-500" /> <span className="font-bold">{t("Religion")}:</span> {student?.religion || t("N/A")}</p>
          </div>

          <hr className="my-4 border-gray-300" />

          {/* Guardian Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-800">
              <FaUser className="mr-2 text-purple-600" /> {t("Guardian Information")}
            </h3>
            <p className="text-gray-600"><FaUser className="inline mr-2 text-gray-500" /> <span className="font-bold">{t("Name")}:</span> {student?.guardianName || t("N/A")} ({student?.guardianRelationToStudent || t("N/A")})</p>
            <p className="text-gray-600"><FaPhone className="inline mr-2 text-gray-500" /> <span className="font-bold">{t("Guardian Phone")}:</span> {student?.guardianContactNumber || t("N/A")}</p>
            <p className="text-gray-600"><FaEnvelope className="inline mr-2 text-gray-500" /> <span className="font-bold">{t("Guardian Email")}:</span> {student?.guardianEmail || t("N/A")}</p>
          </div>

          <hr className="my-4 border-gray-300" />

          {/* Address Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-800">
              <FaMapMarkerAlt className="mr-2 text-green-600" /> {t("Address Information")}
            </h3>
            <div>
              <h4 className="font-medium flex items-center"><FaMapMarkerAlt className="mr-2 text-gray-500" /> {t("Permanent Address")}:</h4>
              <p className="text-gray-600">{student?.permanentAddress?.street || t("N/A")}, {student?.permanentAddress?.city || t("N/A")}, {student?.permanentAddress?.state || t("N/A")}, {student?.permanentAddress?.country || t("N/A")}, {student?.permanentAddress?.postalCode || t("N/A")}</p>
            </div>
            <div className="mt-3">
              <h4 className="font-medium flex items-center"><FaMapMarkerAlt className="mr-2 text-gray-500" /> {t("Residential Address")}:</h4>
              <p className="text-gray-600">{student?.residentialAddress?.street || t("N/A")}, {student?.residentialAddress?.city || t("N/A")}, {student?.residentialAddress?.state || t("N/A")}, {student?.residentialAddress?.country || t("N/A")}, {student?.residentialAddress?.postalCode || t("N/A")}</p>
            </div>
          </div>

          <hr className="my-4 border-gray-300" />

          {/* Academic Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-800">
              <FaGraduationCap className="mr-2 text-yellow-600" /> {t("Academic Information")}
            </h3>
            <p className="text-gray-600"><FaBook className="inline mr-2 text-gray-500" /> <span className="font-bold">{t("Academic Year")}:</span> {student?.academicYear?.year || t("N/A")}</p>
            <p className="text-gray-600"><FaCertificate className="inline mr-2 text-gray-500" /> <span className="font-bold">{t("Enrollment Status")}:</span> {student?.enrollmentStatus || t("N/A")}</p>
            <p className="text-gray-600"><FaCalendarAlt className="inline mr-2 text-gray-500" /> <span className="font-bold">{t("Batch End")}:</span> {formatDate(student?.batchEnd)}</p>
            <p className="text-gray-600"><FaUsers className="inline mr-2 text-gray-500" /> <span className="font-bold">{t("Group IDs")}:</span> {student?.presentGroupId?.join(", ") || t("N/A")}</p>
          </div>

          <hr className="my-4 border-gray-300" />

          {/* Additional Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-800">
              <FaShieldAlt className="mr-2 text-red-600" /> {t("Additional Information")}
            </h3>
            <p className="text-gray-600"><FaUserShield className="inline mr-2 text-gray-500" /> <span className="font-bold">{t("Verified Documents")}:</span> {student?.isVerifiedDocuments ? t("Yes") : t("No")}</p>
            <p className="text-gray-600"><FaBusAlt className="inline mr-2 text-gray-500" /> <span className="font-bold">{t("Transport Requirement")}:</span> {student?.transportRequirement ? t("Yes") : t("No")}</p>
            <p className="text-gray-600"><FaPhone className="inline mr-2 text-gray-500" /> <span className="font-bold">{t("Emergency Contact")}:</span> {student?.emergencyNumber || t("N/A")}</p>
            <p className="text-gray-600"><FaCheckCircle className="inline mr-2 text-gray-500" /> <span className="font-bold">{t("Student Verified")}:</span> {student?.isStudentVerified ? t("Yes") : t("No")}</p>
          </div>

          {/* Bottom Buttons */}
          <div className="flex gap-4 mt-8 justify-center pb-6">
            {/* <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all">{t("Edit")}</button> */}
            <button
              onClick={() => onDemote(student._id)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
            >
              {t("Demote Student")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Sidebar);
