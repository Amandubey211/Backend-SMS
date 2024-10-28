// import React from "react";
// import ImageUpload from "./ImageUpload";

// const ParentInfo = ({
//   studentInfo,
//   handleInputChange,
//   // fatherImagePreview,
//   // motherImagePreview,
//   // handleFatherImageChange,
//   // handleMotherImageChange,
//   // handleRemoveFatherImage,
//   // handleRemoveMotherImage,
// }) => {
//   return (
//     <div className="mt-6 mb-4">
//       <h2 className="text-xl font-semibold mb-4">Parent Information</h2>
//       {/* <div className="grid grid-cols-2 gap-8 mb-4">
//         <div>
//           <label className="block text-gray-700 mb-2">Father Image</label>
//           <ImageUpload
//             imagePreview={fatherImagePreview}
//             handleBrowseClick={() => {}}
//             handleImageChange={handleFatherImageChange}
//             handleRemoveImage={handleRemoveFatherImage}
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 mb-2">Mother Image</label>
//           <ImageUpload
//             imagePreview={motherImagePreview}
//             handleBrowseClick={() => {}}
//             handleImageChange={handleMotherImageChange}
//             handleRemoveImage={handleRemoveMotherImage}
//           />
//         </div>
//       </div> */}
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-gray-700">Father Name</label>
//           <input
//             type="text"
//             name="fatherName"
//             className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             value={studentInfo.fatherName}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">Mother Name</label>
//           <input
//             type="text"
//             name="motherName"
//             className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             value={studentInfo.motherName}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">Guardian Name</label>
//           <input
//             type="text"
//             name="guardianName"
//             className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             value={studentInfo.guardianName}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">Relation to Student</label>
//           <input
//             type="text"
//             name="guardianRelationToStudent"
//             className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             value={studentInfo.guardianRelationToStudent}
//             onChange={handleInputChange}
//           />
//         </div>

//         <div>
//           <label className="block text-gray-700">Email</label>
//           <input
//             type="email"
//             name="guardianEmail"
//             className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             value={studentInfo.guardianEmail}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">Phone</label>
//           <input
//             type="tel"
//             name="guardianContactNumber"
//             className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             value={studentInfo.guardianContactNumber}
//             onChange={handleInputChange}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ParentInfo;
import React from "react";
import TextInput from "./TextInput";

const ParentInfo = ({ studentInfo, handleInputChange, errors, inputRefs }) => {
  return (
    <div className="mt-6 mb-4">
      <h2 className="text-xl font-semibold mb-4">Parent Information</h2>
      {/* <div className="grid grid-cols-2 gap-8 mb-4">
//         <div>
//           <label className="block text-gray-700 mb-2">Father Image</label>
//           <ImageUpload
//             imagePreview={fatherImagePreview}
//             handleBrowseClick={() => {}}
//             handleImageChange={handleFatherImageChange}
//             handleRemoveImage={handleRemoveFatherImage}
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 mb-2">Mother Image</label>
//           <ImageUpload
//             imagePreview={motherImagePreview}
//             handleBrowseClick={() => {}}
//             handleImageChange={handleMotherImageChange}
//             handleRemoveImage={handleRemoveMotherImage}
//           />
//         </div>
//       </div> */}
      <div className="grid grid-cols-2 gap-4">
        <TextInput
          label="Father Name"
          name="fatherName"
          value={studentInfo.fatherName || ""}
          onChange={handleInputChange}
          placeholder="Enter Father's Name"
          error={errors.fatherName}
          ref={inputRefs.fatherName}
          aria-invalid={errors.fatherName ? "true" : "false"}
        />
        <TextInput
          label="Mother Name"
          name="motherName"
          value={studentInfo.motherName || ""}
          onChange={handleInputChange}
          placeholder="Enter Mother's Name"
          error={errors.motherName}
          ref={inputRefs.motherName}
          aria-invalid={errors.motherName ? "true" : "false"}
        />
        <TextInput
          label="Guardian Name"
          name="guardianName"
          value={studentInfo.guardianName || ""}
          onChange={handleInputChange}
          placeholder="Enter Guardian's Name"
          error={errors.guardianName}
          ref={inputRefs.guardianName}
          aria-invalid={errors.guardianName ? "true" : "false"}
        />
        <TextInput
          label="Relation to Student"
          name="guardianRelationToStudent"
          value={studentInfo.guardianRelationToStudent || ""}
          onChange={handleInputChange}
          placeholder="Enter Relation to Student"
          error={errors.guardianRelationToStudent}
          ref={inputRefs.guardianRelationToStudent}
          aria-invalid={errors.guardianRelationToStudent ? "true" : "false"}
        />
        <TextInput
          label="Guardian Email"
          name="guardianEmail"
          type="email"
          value={studentInfo.guardianEmail || ""}
          onChange={handleInputChange}
          placeholder="Enter Guardian's Email"
          error={errors.guardianEmail}
          ref={inputRefs.guardianEmail}
          aria-invalid={errors.guardianEmail ? "true" : "false"}
        />
        <TextInput
          label="Guardian Phone"
          name="guardianContactNumber"
          type="tel"
          value={studentInfo.guardianContactNumber || ""}
          onChange={handleInputChange}
          placeholder="000-000-0000"
          error={errors.guardianContactNumber}
          ref={inputRefs.guardianContactNumber}
          aria-invalid={errors.guardianContactNumber ? "true" : "false"}
        />
      </div>
    </div>
  );
};

export default ParentInfo;
