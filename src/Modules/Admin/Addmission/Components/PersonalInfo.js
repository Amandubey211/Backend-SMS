import React, { useEffect, useRef } from "react";
import TextInput from "./TextInput";

const PersonalInfo = ({
  studentInfo,
  handleInputChange,
  errors,
  inputRefs,
}) => {
  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const ageDiffMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const prevDob = useRef(studentInfo.dateOfBirth);

  useEffect(() => {
    if (
      studentInfo.dateOfBirth &&
      studentInfo.dateOfBirth !== prevDob.current
    ) {
      const age = calculateAge(studentInfo.dateOfBirth);
      if (studentInfo.age !== age) {
        handleInputChange({ target: { name: "age", value: age } });
      }
      prevDob.current = studentInfo.dateOfBirth;
    }
  }, [studentInfo.dateOfBirth, studentInfo.age, handleInputChange]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <TextInput
        label="First Name"
        name="firstName"
        value={studentInfo.firstName || ""}
        onChange={handleInputChange}
        placeholder="Enter First Name"
        error={errors.firstName}
        ref={inputRefs.firstName}
        aria-invalid={errors.firstName ? "true" : "false"}
      />
      <TextInput
        label="Last Name"
        name="lastName"
        value={studentInfo.lastName || ""}
        onChange={handleInputChange}
        placeholder="Enter Last Name"
        error={errors.lastName}
        ref={inputRefs.lastName}
        aria-invalid={errors.lastName ? "true" : "false"}
      />
      <TextInput
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        value={studentInfo.dateOfBirth || ""}
        onChange={handleInputChange}
        placeholder="Enter Date of Birth"
        error={errors.dateOfBirth}
        ref={inputRefs.dateOfBirth}
        aria-invalid={errors.dateOfBirth ? "true" : "false"}
      />
      <div>
        <label className="block text-gray-700">Gender</label>
        <select
          ref={inputRefs.gender}
          name="gender"
          className={`mt-1 p-2 block w-full rounded-md border ${
            errors.gender ? "border-red-500" : "border-gray-300"
          } shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
          value={studentInfo.gender || ""}
          onChange={handleInputChange}
          aria-invalid={errors.gender ? "true" : "false"}
        >
          <option value="">Choose Options</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && (
          <span className="text-red-500 text-sm mt-1">{errors.gender}</span>
        )}
      </div>
      <div>
        <label className="block text-gray-700">Religion</label>
        <select
          ref={inputRefs.religion}
          name="religion"
          className={`mt-1 p-2 block w-full rounded-md border ${
            errors.religion ? "border-red-500" : "border-gray-300"
          } shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
          value={studentInfo.religion || ""}
          onChange={handleInputChange}
          aria-invalid={errors.religion ? "true" : "false"}
        >
          <option value="">Choose Options</option>
          <option>Islam</option>
          <option>Christianity</option>
          <option>Hinduism</option>
          <option>Buddhism</option>
        </select>
        {errors.religion && (
          <span className="text-red-500 text-sm mt-1">{errors.religion}</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Blood Group</label>
          <select
            name="bloodGroup"
            ref={inputRefs.bloodGroup}
            className={`mt-1 p-2 block w-full rounded-md border ${
              errors.bloodGroup ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
            value={studentInfo.bloodGroup || ""}
            onChange={handleInputChange}
            aria-invalid={errors.bloodGroup ? "true" : "false"}
          >
            <option value="">Choose</option>
            <option>O+</option>
            <option>O-</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>
          {errors.bloodGroup && (
            <span className="text-red-500 text-sm mt-1">
              {errors.bloodGroup}
            </span>
          )}
        </div>
        <TextInput
          label="Age"
          name="age"
          value={studentInfo.age || ""}
          placeholder="00"
          error={errors.age}
          readOnly
          aria-invalid={errors.age ? "true" : "false"}
        />
      </div>
    </div>
  );
};

export default PersonalInfo;
