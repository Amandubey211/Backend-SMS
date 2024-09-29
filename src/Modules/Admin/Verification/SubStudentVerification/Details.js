import React from "react";
import { CiUser } from "react-icons/ci";
import VerificationForm from "./VerificationForm"; // Assuming this is the form you're referencing

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const Details = ({ student }) => {
  return (
    <div className="relative container mx-auto p-1 ">
      {/* Main container to hold details and form */}
      <div className="relative">
        {/* Main Details Section */}
        <div className="relative z-0 flex-1  bg-white rounded-lg overflow-hidden  ">
          <div className="flex bg-pink-100 rounded-tl-full rounded-tr-full flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white flex justify-center items-center bg-gray-200 text-gray-800">
              {student?.profile ? (
                <img
                  className="w-full h-full object-cover"
                  src={student.profile}
                  alt={`${student?.firstName} ${student?.lastName}`}
                />
              ) : (
                <CiUser size={32} />
              )}
            </div>
            <div className="text-center">
              <h2 className="text-2xl capitalize font-semibold text-gray-800">{`${student?.firstName} ${student?.lastName}`}</h2>
              <p className="rounded-full text-center border py-1 mt-1 border-green-900 bg-green-100 text-green-800">
                {student?.role}
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-800 mt-24">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">Email:</span>
                <p className="text-gray-600 truncate">{student?.email}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">
                  Contact Number:
                </span>
                <p className="text-gray-600">{student?.contactNumber}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">Age:</span>
                <p className="text-gray-600">{student?.age}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">
                  Date of Birth:
                </span>
                <p className="text-gray-600">
                  {formatDate(student?.dateOfBirth)}
                </p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">Birth Place:</span>
                <p className="text-gray-600">{student?.placeOfBirth}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">Gender:</span>
                <p className="text-gray-600">{student?.gender}</p>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Parent Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">
                  Mother's Name:
                </span>
                <p className="text-gray-600">{student?.motherName}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">
                  Guardian's Name:
                </span>
                <p className="text-gray-600">{student?.guardianName}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">
                  Guardian's Contact:
                </span>
                <p className="text-gray-600">
                  {student?.guardianContactNumber}
                </p>
              </div>
            </div>

            {/* Addresses */}
            <h3 className="text-lg font-medium text-gray-800 mb-4 border-t pt-4">
              Addresses
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">
                  Permanent Address:
                </span>
                <p className="text-gray-600">
                  {student?.permanentAddress?.street},{" "}
                  {student?.permanentAddress?.city},{" "}
                  {student?.permanentAddress?.state},{" "}
                  {student?.permanentAddress?.postalCode}
                </p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">
                  Residential Address:
                </span>
                <p className="text-gray-600">
                  {student?.residentialAddress?.street},{" "}
                  {student?.residentialAddress?.city},{" "}
                  {student?.residentialAddress?.state},{" "}
                  {student?.residentialAddress?.postalCode}
                </p>
              </div>
            </div>

            {/* Other Details */}
            <h3 className="text-lg font-medium text-gray-800 mb-4 border-t pt-4">
              Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">QID:</span>
                <p className="text-gray-600">{student?.Q_Id}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">
                  Student Applied for Class:
                </span>
                <p className="text-gray-600">
                  {student?.applyingClass?.className}
                </p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">
                  Verified Documents:
                </span>
                <p className="text-gray-600">
                  {student?.isVerifiedDocuments ? "Yes" : "No"}
                </p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">
                  Verified School ID:
                </span>
                <p className="text-gray-600">
                  {student?.isVerifiedSchoolId ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky and Overlapping Form */}
        <div className="absolute -top-10 right-11 w-full lg:w-1/3 z-10">
          <div className="bg-white p-4 border rounded-lg shadow-lg sticky top-6">
            <VerificationForm email={student?.email} studentId={student?._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
