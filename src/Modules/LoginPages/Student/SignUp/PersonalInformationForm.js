import React, { useEffect } from "react";
import useGetAllSchools from "../../../../Hooks/AuthHooks/Staff/Admin/useGetAllSchool";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import RadioGroup from "./RadioGroup";

const PersonalInformationForm = ({
  studentDetails,
  handleChange,
  imagePreview,
  setImagePreview,
  handleImageChange,
}) => {
  const { fetchSchools, schoolList } = useGetAllSchools();

  // Ensure options are in the correct format for the SelectInput component
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
          label="School*"
          name="schoolId"
          value={studentDetails.schoolId}
          onChange={handleChange}
          options={schoolList.map((school) => ({
            value: school._id,
            label: school.nameOfSchool,
          }))}
          required
        />
        <div className="w-1/2 flex justify-center">
          <div className="relative group">
            <input
              type="file"
              name="profile"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              required
            />
            <div className="h-32 w-32 rounded-full border border-gray-300 shadow-sm overflow-hidden cursor-pointer bg-gray-100 flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Selected Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-500">Upload Image</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <TextInput
          name="firstName"
          value={studentDetails.firstName}
          onChange={handleChange}
          placeholder="First Name*"
          required
        />
        <TextInput
          name="lastName"
          value={studentDetails.lastName}
          onChange={handleChange}
          placeholder="Last Name*"
          required
        />
      </div>
      <TextInput
        name="email"
        value={studentDetails.email}
        onChange={handleChange}
        placeholder="Email*"
        type="email"
        required
      />
      <div className="grid grid-cols-2 gap-4 my-4">
        <TextInput
          name="dateOfBirth"
          value={studentDetails.dateOfBirth}
          onChange={handleChange}
          placeholder="Date of Birth*"
          type="date"
          required
        />
        <TextInput
          name="placeOfBirth"
          value={studentDetails.placeOfBirth}
          onChange={handleChange}
          placeholder="Place of Birth*"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4 my-4">
        <TextInput
          name="age"
          value={studentDetails.age}
          onChange={handleChange}
          placeholder="Age*"
          type="number"
          required
        />
        <div className="flex flex-col mt-1 w-full">
          <select
            name="gender"
            value={studentDetails.gender}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-700 p-3"
            required
          >
            <option value="" disabled>
              Select Gender*
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <SelectInput
        label="Religion*"
        name="religion"
        value={studentDetails.religion}
        onChange={handleChange}
        options={religionOptions}
        required
      />
      <div className="grid grid-cols-2 gap-4 my-4">
        <TextInput
          name="contactNumber"
          value={studentDetails.contactNumber}
          onChange={handleChange}
          placeholder="Contact Number*"
          type="number"
          required
        />
        <TextInput
          name="emergencyNumber"
          value={studentDetails.emergencyNumber}
          onChange={handleChange}
          placeholder="Emergency Contact Number*"
          type="number"
          required
        />
      </div>
      <h3 className="text-lg font-semibold mb-2">Identity Information</h3>
      <TextInput
        name="Q_Id"
        value={studentDetails.Q_Id}
        onChange={handleChange}
        placeholder="QID*"
        required
      />
      <h3 className="text-lg font-semibold my-2">Guardian Information</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <TextInput
          name="motherName"
          value={studentDetails.motherName}
          onChange={handleChange}
          placeholder="Mother's Name*"
          required
        />
        <TextInput
          name="fatherName"
          value={studentDetails.fatherName}
          onChange={handleChange}
          placeholder="Father's Name*"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <TextInput
          name="guardianName"
          value={studentDetails.guardianName}
          onChange={handleChange}
          placeholder="Guardian's Name*"
          required
        />
        <TextInput
          name="guardianRelationToStudent"
          value={studentDetails.guardianRelationToStudent}
          onChange={handleChange}
          placeholder="Relation to Student*"
          required
        />
      </div>
      <TextInput
        name="guardianEmail"
        value={studentDetails.guardianEmail}
        onChange={handleChange}
        placeholder="Guardian's Email*"
        type="email"
        required
      />
      <div className="mt-4">
        <TextInput
          name="guardianContactNumber"
          value={studentDetails.guardianContactNumber}
          onChange={handleChange}
          placeholder="Guardian's Contact Number*"
          type="number"
          required
        />
      </div>
      <SelectInput
        label="Enrollment Status*"
        name="enrollmentStatus"
        value={studentDetails.enrollmentStatus}
        onChange={handleChange}
        options={[
          { value: "Full Time", label: "Full Time" },
          { value: "Part Time", label: "Part Time" },
        ]}
        required
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
        required
      />
    </>
  );
};

export default PersonalInformationForm;
