import React from "react";
import { FaExclamationTriangle, FaUserGraduate } from "react-icons/fa"; // Import icons
import Spinner from "../../../../Components/Common/Spinner";
import { useTranslation } from 'react-i18next';
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../config/permission";

const GraduateList = ({
  students,
  selectedStudents,
  setSelectedStudents,
  onViewDetails,
  onDemoteStudents,
  loading,
  error,
}) => {
  const { t } = useTranslation('admDashboard'); // Initialize i18next hook

  // Function to handle individual row selection
  const handleSelect = (studentId) => {
    setSelectedStudents((prevSelected) => {
      if (prevSelected.includes(studentId)) {
        return prevSelected.filter((id) => id !== studentId);
      } else {
        return [...prevSelected, studentId];
      }
    });
  };

  // Function to handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectedStudents?.length === students?.length) {
      setSelectedStudents([]); // Deselect all if all are already selected
    } else {
      const allStudentIds = students?.map((student) => student._id);
      setSelectedStudents(allStudentIds); // Select all
    }
  };

  // Check if all students are selected
  const isAllSelected = selectedStudents?.length === students?.length;

  // Determine error message based on status code
  const getErrorMessage = () => {
    if (error?.status === 404) {
      return t("No Graduates Yet");
    }
    return t("No Graduates Found");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">{t("All Graduates")}</h1>
        <ProtectedAction permission={"PERMISSIONS.DEMOTE_GRADUATE"}>
          {selectedStudents?.length > 0 && (
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={() => onDemoteStudents(selectedStudents)}
            >
              {selectedStudents?.length === 1
                ? t("Demote Student")
                : t("Demote All Students")}
            </button>
          )}
        </ProtectedAction>
      </div>

      <div className="overflow-hidden ">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-3 text-center align-middle w-10">
                <input
                  type="checkbox"
                  className="align-middle"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-600">
                {t("Profile")}
              </th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-600">
                {t("Name")}
              </th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-600">
                {t("QID")}
              </th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-600">
                {t("Admission Number")}
              </th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-600">
                {t("Graduation Year")}
              </th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-600">
                {t("Email")}
              </th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-600">
                {t("Contact")}
              </th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-600">
                {t("Parent Contact")}
              </th>
              <th className="py-2 px-3 text-sm"></th>
            </tr>
          </thead>
          <tbody>
            {/* Loading State */}
            {loading && (
              <tr>
                <td colSpan="10" className="text-center py-8">
                  <Spinner />
                </td>
              </tr>
            )}

            {/* Error State */}
            {error && (
              <tr>
                <td colSpan="10" className="text-center py-8">
                  <FaExclamationTriangle
                    className="text-gray-500 mx-auto mb-4"
                    size={40}
                  />
                  <p className="text-gray-500">{getErrorMessage()}</p>
                </td>
              </tr>
            )}

            {/* No Data State */}
            {!loading && !error && students?.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center py-8">
                  <FaUserGraduate
                    className="text-gray-500 mx-auto mb-4"
                    size={40}
                  />
                  <p className="text-gray-500">{t("No Graduates Yet")}</p>
                </td>
              </tr>
            )}

            {/* Data Rows */}
            {!loading &&
              !error &&
              students?.length > 0 &&
              students?.map((student) => (
                <tr
                  key={student._id} // Use _id as the key since that's the ID from backend
                  className="hover:bg-gray-50 transition-all duration-200 border-b"
                >
                  <td className="py-2 px-3 text-center align-middle w-10">
                    <input
                      type="checkbox"
                      className="align-middle"
                      checked={selectedStudents.includes(student._id)}
                      onChange={() => handleSelect(student._id)}
                    />
                  </td>
                  <td className="py-2 px-3">
                    <img
                      src={student.profile}
                      alt={`${student.firstName} ${student.lastName}`}
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                    />
                  </td>
                  <td className="py-2 px-3 text-sm whitespace-nowrap">
                    {student.firstName || 'N/A'} {student.lastName || 'N/A'}
                  </td>
                  <td className="py-2 px-3 text-sm whitespace-nowrap">
                    {student.Q_Id || 'N/A'}
                  </td>
                  <td className="py-2 px-3 text-sm whitespace-nowrap">
                    {student.admissionNumber || 'N/A'}
                  </td>
                  <td className="py-2 px-3 text-sm whitespace-nowrap">
                    {student.academicYear?.year || 'N/A'}
                  </td>
                  <td className="py-2 px-3 text-sm truncate max-w-xs">
                    {student.email || 'N/A'}
                  </td>
                  <td className="py-2 px-3 text-sm whitespace-nowrap">
                    {student.contactNumber || 'N/A'}
                  </td>
                  <td className="py-2 px-3 text-sm whitespace-nowrap">
                    {student.guardianContactNumber || 'N/A'}
                  </td>
                  <td className="py-2 px-3">
                    <ProtectedAction permission={"PERMISSIONS.VIEW_GRADUATE_DETAILS"}>
                      <button
                        onClick={() => onViewDetails(student)}
                        className="px-2 py-1 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 hover:shadow-md transition-all duration-200 text-sm"
                      >
                        {t("View Details")}
                      </button>
                    </ProtectedAction>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GraduateList;
