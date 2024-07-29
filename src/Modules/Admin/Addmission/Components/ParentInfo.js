import React from "react";
import ImageUpload from "./ImageUpload";

const ParentInfo = ({
  studentInfo,
  handleInputChange,
  // fatherImagePreview,
  // motherImagePreview,
  // handleFatherImageChange,
  // handleMotherImageChange,
  // handleRemoveFatherImage,
  // handleRemoveMotherImage,
}) => {
  return (
    <div className="mt-6 mb-4">
      <h2 className="text-xl font-semibold mb-4">Parent Information</h2>
      {/* <div className="grid grid-cols-2 gap-8 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">Father Image</label>
          <ImageUpload
            imagePreview={fatherImagePreview}
            handleBrowseClick={() => {}}
            handleImageChange={handleFatherImageChange}
            handleRemoveImage={handleRemoveFatherImage}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Mother Image</label>
          <ImageUpload
            imagePreview={motherImagePreview}
            handleBrowseClick={() => {}}
            handleImageChange={handleMotherImageChange}
            handleRemoveImage={handleRemoveMotherImage}
          />
        </div>
      </div> */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Father Name</label>
          <input
            type="text"
            name="fatherName"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.fatherName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-gray-700">Mother Name</label>
          <input
            type="text"
            name="motherName"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.motherName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-gray-700">Guardian Name</label>
          <input
            type="text"
            name="guardianName"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.guardianName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-gray-700">Relation to Student</label>
          <input
            type="text"
            name="guardianRelationToStudent"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.guardianRelationToStudent}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="guardianEmail"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.guardianEmail}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-gray-700">Phone</label>
          <input
            type="tel"
            name="guardianContactNumber"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.guardianContactNumber}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ParentInfo;
