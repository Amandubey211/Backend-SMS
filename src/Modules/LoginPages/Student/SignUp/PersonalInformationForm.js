// PersonalInformationForm.js

import React, { useEffect } from "react";
import useGetAllSchools from "../../../../Hooks/AuthHooks/Staff/Admin/useGetAllSchool";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import RadioGroup from "./RadioGroup";
import { RiImageAddFill } from "react-icons/ri";

const PersonalInformationForm = ({
  studentDetails,
  handleChange,
  imagePreview,
  setImagePreview,
  handleImageChange,
  validationErrors,
  inputRefs,
}) => {
  const { fetchSchools, schoolList } = useGetAllSchools();

  const religionOptions = [
    { value: "Islam", label: "Islam" },
    { value: "Christianity", label: "Christianity" },
    { value: "Hinduism", label: "Hinduism" },
    { value: "Buddhism", label: "Buddhism" },
    { value: "Judaism", label: "Judaism" },
    { value: "Sikhism", label: "Sikhism" },
    { value: "Other", label: "Other" },
  ];

  useEffect(() => {
    fetchSchools();
  }, []);

  return (
    <>
      <div className="flex items-center space-x-6">
        <SelectInput
          ref={(el) => (inputRefs.current["schoolId"] = el)}
          label="School*"
          name="schoolId"
          value={studentDetails.schoolId}
          onChange={handleChange}
          options={schoolList.map((school) => ({
            value: school._id,
            label: school.nameOfSchool,
          }))}
          error={validationErrors.schoolId}
        />
        <div className="w-1/2 flex justify-center">
          <div className="relative group">
            <input
              type="file"
              name="profile"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
            />
            <div
              className={`h-36 w-36 rounded-full border ${
                validationErrors.profile ? "border-red-500" : "border-pink-400"
              } shadow-sm overflow-hidden cursor-pointer bg-pink-50 flex items-center justify-center`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Selected Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 ">
                  <RiImageAddFill className="text-4xl text-pink-400" />
                  <span className="text-pink-500">Upload Image</span>
                </div>
              )}
            </div>
            {validationErrors.profile && (
              <span className="text-red-500 text-sm">
                {validationErrors.profile}
              </span>
            )}
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <TextInput
          ref={(el) => (inputRefs.current["firstName"] = el)}
          name="firstName"
          value={studentDetails.firstName}
          onChange={handleChange}
          placeholder="First Name*"
          error={validationErrors.firstName}
        />
        <TextInput
          ref={(el) => (inputRefs.current["lastName"] = el)}
          name="lastName"
          value={studentDetails.lastName}
          onChange={handleChange}
          placeholder="Last Name*"
          error={validationErrors.lastName}
        />
      </div>
      <TextInput
        ref={(el) => (inputRefs.current["email"] = el)}
        name="email"
        value={studentDetails.email}
        onChange={handleChange}
        placeholder="Email*"
        type="email"
        error={validationErrors.email}
      />
      <div className="grid grid-cols-2 gap-4 my-4">
        <TextInput
          ref={(el) => (inputRefs.current["dateOfBirth"] = el)}
          name="dateOfBirth"
          value={studentDetails.dateOfBirth}
          onChange={handleChange}
          placeholder="Date of Birth*"
          type="date"
          error={validationErrors.dateOfBirth}
        />
        <TextInput
          ref={(el) => (inputRefs.current["placeOfBirth"] = el)}
          name="placeOfBirth"
          value={studentDetails.placeOfBirth}
          onChange={handleChange}
          placeholder="Place of Birth*"
          error={validationErrors.placeOfBirth}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 my-4">
        <TextInput
          ref={(el) => (inputRefs.current["age"] = el)}
          name="age"
          value={studentDetails.age}
          onChange={handleChange}
          placeholder="Age*"
          type="number"
          readOnly
          error={validationErrors.age}
        />
        <div className="flex flex-col mt-1 w-full">
          <select
            ref={(el) => (inputRefs.current["gender"] = el)}
            name="gender"
            value={studentDetails.gender}
            onChange={handleChange}
            className={`block w-full rounded-lg border ${
              validationErrors.gender ? "border-red-500" : "border-gray-300"
            } bg-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-700 p-3`}
          >
            <option value="" disabled>
              Select Gender*
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {validationErrors.gender && (
            <span className="text-red-500 text-sm">
              {validationErrors.gender}
            </span>
          )}
        </div>
      </div>
      <SelectInput
        ref={(el) => (inputRefs.current["religion"] = el)}
        label="Religion*"
        name="religion"
        value={studentDetails.religion}
        onChange={handleChange}
        options={religionOptions}
        error={validationErrors.religion}
      />
      <div className="grid grid-cols-2 gap-4 my-4">
        <TextInput
          ref={(el) => (inputRefs.current["contactNumber"] = el)}
          name="contactNumber"
          value={studentDetails.contactNumber}
          onChange={handleChange}
          placeholder="Contact Number*"
          type="number"
          error={validationErrors.contactNumber}
        />
        <TextInput
          ref={(el) => (inputRefs.current["emergencyNumber"] = el)}
          name="emergencyNumber"
          value={studentDetails.emergencyNumber}
          onChange={handleChange}
          placeholder="Emergency Contact Number*"
          type="number"
          error={validationErrors.emergencyNumber}
        />
      </div>
      <h3 className="text-lg font-semibold mb-2">Identity Information</h3>
      <TextInput
        ref={(el) => (inputRefs.current["Q_Id"] = el)}
        name="Q_Id"
        value={studentDetails.Q_Id}
        onChange={handleChange}
        placeholder="QID*"
        error={validationErrors.Q_Id}
      />
      <h3 className="text-lg font-semibold my-2">Guardian Information</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <TextInput
          ref={(el) => (inputRefs.current["motherName"] = el)}
          name="motherName"
          value={studentDetails.motherName}
          onChange={handleChange}
          placeholder="Mother's Name*"
          error={validationErrors.motherName}
        />
        <TextInput
          ref={(el) => (inputRefs.current["fatherName"] = el)}
          name="fatherName"
          value={studentDetails.fatherName}
          onChange={handleChange}
          placeholder="Father's Name*"
          error={validationErrors.fatherName}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <TextInput
          ref={(el) => (inputRefs.current["guardianName"] = el)}
          name="guardianName"
          value={studentDetails.guardianName}
          onChange={handleChange}
          placeholder="Guardian's Name*"
          error={validationErrors.guardianName}
        />
        <TextInput
          ref={(el) => (inputRefs.current["guardianRelationToStudent"] = el)}
          name="guardianRelationToStudent"
          value={studentDetails.guardianRelationToStudent}
          onChange={handleChange}
          placeholder="Relation to Student*"
          error={validationErrors.guardianRelationToStudent}
        />
      </div>
      <TextInput
        ref={(el) => (inputRefs.current["guardianEmail"] = el)}
        name="guardianEmail"
        value={studentDetails.guardianEmail}
        onChange={handleChange}
        placeholder="Guardian's Email*"
        type="email"
        error={validationErrors.guardianEmail}
      />
      <div className="mt-4">
        <TextInput
          ref={(el) => (inputRefs.current["guardianContactNumber"] = el)}
          name="guardianContactNumber"
          value={studentDetails.guardianContactNumber}
          onChange={handleChange}
          placeholder="Guardian's Contact Number*"
          type="number"
          error={validationErrors.guardianContactNumber}
        />
      </div>
      <SelectInput
        ref={(el) => (inputRefs.current["enrollmentStatus"] = el)}
        label="Enrollment Status*"
        name="enrollmentStatus"
        value={studentDetails.enrollmentStatus}
        onChange={handleChange}
        options={[
          { value: "Full Time", label: "Full Time" },
          { value: "Part Time", label: "Part Time" },
        ]}
        error={validationErrors.enrollmentStatus}
      />
      <RadioGroup
        label="Transport Requirement*"
        name="transportRequirement"
        value={studentDetails.transportRequirement}
        onChange={handleChange}
        options={[
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ]}
        error={validationErrors.transportRequirement}
      />
    </>
  );
};

export default PersonalInformationForm;
