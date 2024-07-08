import React from "react";

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
    <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden ">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <img
            className="w-16 h-16 rounded-full"
            src="https://avatars.githubusercontent.com/u/109097090?v=4" // Placeholder image, replace with actual profile picture URL from student object
            alt={`${student?.firstName} ${student?.lastName}`}
          />
          <div className="text-center sm:text-left">
            <h2 className="text-xl capitalize font-semibold text-gray-800">{`${student?.firstName} ${student?.lastName}`}</h2>
            <p className="text-gray-600">{student?.role}</p>
            <p className="text-gray-600">{student?.placeOfBirth}</p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-100 rounded-md p-4 transition-opacity duration-500 ease-in-out hover:opacity-80">
              <span className="font-medium text-gray-700">Email:</span>
              <p className="text-gray-600">{student?.email}</p>
            </div>
            <div className="bg-gray-100 rounded-md p-4 transition-opacity duration-500 ease-in-out hover:opacity-80">
              <span className="font-medium text-gray-700">Contact Number:</span>
              <p className="text-gray-600">{student?.contactNumber}</p>
            </div>
            <div className="bg-gray-100 rounded-md p-4 transition-opacity duration-500 ease-in-out hover:opacity-80">
              <span className="font-medium text-gray-700">Age:</span>
              <p className="text-gray-600">{student?.age}</p>
            </div>
            <div className="bg-gray-100 rounded-md p-4 transition-opacity duration-500 ease-in-out hover:opacity-80">
              <span className="font-medium text-gray-700">Date of Birth:</span>
              <p className="text-gray-600">
                {formatDate(student?.dateOfBirth)}
              </p>
            </div>
            <div className="bg-gray-100 rounded-md p-4 transition-opacity duration-500 ease-in-out hover:opacity-80">
              <span className="font-medium text-gray-700">Birth Place:</span>
              <p className="text-gray-600">{student?.placeOfBirth}</p>
            </div>
            <div className="bg-gray-100 rounded-md p-4 transition-opacity duration-500 ease-in-out hover:opacity-80">
              <span className="font-medium text-gray-700">Gender:</span>
              <p className="text-gray-600">{student?.gender}</p>
            </div>

            <div className="bg-gray-100 rounded-md p-4 transition-opacity duration-500 ease-in-out hover:opacity-80">
              <span className="font-medium text-gray-700">Mother's Name:</span>
              <p className="text-gray-600">{student?.motherName}</p>
            </div>
            <div className="bg-gray-100 rounded-md p-4 transition-opacity duration-500 ease-in-out hover:opacity-80">
              <span className="font-medium text-gray-700">
                Guardian's Name:
              </span>
              <p className="text-gray-600">{student?.guardianName}</p>
            </div>
            <div className="bg-gray-100 rounded-md p-4 transition-opacity duration-500 ease-in-out hover:opacity-80">
              <span className="font-medium text-gray-700">
                Guardian's Contact:
              </span>
              <p className="text-gray-600">{student?.guardianContactNumber}</p>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-4 border-t pt-4">
            Addresses
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 rounded-md p-4 transition-opacity duration-500 ease-in-out hover:opacity-80">
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
            <div className="bg-gray-100 rounded-md p-4 transition-opacity duration-500 ease-in-out hover:opacity-80">
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
          <h3 className="text-lg font-medium text-gray-800 mb-4 border-t pt-4">
            Other Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-100 rounded-md p-4 transition-opacity duration-500 ease-in-out hover:opacity-80">
              <span className="font-medium text-gray-700">QID:</span>
              <p className="text-gray-600">{student?.Q_Id}</p>
            </div>
            <div className="bg-gray-100 rounded-md p-4 transition-opacity duration-500 ease-in-out hover:opacity-80">
              <span className="font-medium text-gray-700">
                Admission Number:
              </span>
              <p className="text-gray-600">{student?.admissionNumber}</p>
            </div>
            <div className="bg-gray-100 rounded-md p-4 transition-opacity duration-500 ease-in-out hover:opacity-80">
              <span className="font-medium text-gray-700">
                Verified Documents:
              </span>
              <p className="text-gray-600">{student?.isVerifiedDocuments}</p>
            </div>
            <div className="bg-gray-100 rounded-md p-4 transition-opacity duration-500 ease-in-out hover:opacity-80">
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
    </div>
  );
};

export default Details;
