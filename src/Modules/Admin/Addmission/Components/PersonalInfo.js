import React, { useEffect, useRef } from "react";
import TextInput from "./TextInput";
import { useTranslation } from "react-i18next";

const PersonalInfo = ({
  studentInfo,
  handleInputChange,
  errors,
  inputRefs,
}) => {
  const { t } = useTranslation("admAdmission");

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
        label={t("First Name")}
        name="firstName"
        value={studentInfo.firstName || ""}
        onChange={handleInputChange}
        placeholder={t("Enter First Name")}
        error={errors.firstName}
        ref={inputRefs.firstName}
        aria-invalid={errors.firstName ? "true" : "false"}
      />
      <TextInput
        label={t("Last Name")}
        name="lastName"
        value={studentInfo.lastName || ""}
        onChange={handleInputChange}
        placeholder={t("Enter Last Name")}
        error={errors.lastName}
        ref={inputRefs.lastName}
        aria-invalid={errors.lastName ? "true" : "false"}
      />
      <TextInput
        label={t("Date of Birth")}
        name="dateOfBirth"
        type="date"
        value={studentInfo.dateOfBirth || ""}
        onChange={handleInputChange}
        placeholder={t("Enter Date of Birth")}
        error={errors.dateOfBirth}
        ref={inputRefs.dateOfBirth}
        aria-invalid={errors.dateOfBirth ? "true" : "false"}
      />
      <div>
        <label className="block text-gray-700">{t("Gender")}</label>
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
          <option value="">{t("Choose Options")}</option>
          <option value="male">{t("Male")}</option>
          <option value="female">{t("Female")}</option>
          <option value="other">{t("Other")}</option>
        </select>
        {errors.gender && (
          <span className="text-red-500 text-sm mt-1">{errors.gender}</span>
        )}
      </div>
      <div>
        <label className="block text-gray-700">{t("Religion")}</label>
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
          <option value="">{t("Choose Options")}</option>
          <option>{t("Islam")}</option>
          <option>{t("Christianity")}</option>
          <option>{t("Hinduism")}</option>
          <option>{t("Buddhism")}</option>
        </select>
        {errors.religion && (
          <span className="text-red-500 text-sm mt-1">{errors.religion}</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">{t("Blood Group")}</label>
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
            <option value="">{t("Choose")}</option>
            <option>{t("O+")}</option>
            <option>{t("O-")}</option>
            <option>{t("A+")}</option>
            <option>{t("A-")}</option>
            <option>{t("B+")}</option>
            <option>{t("B-")}</option>
            <option>{t("AB+")}</option>
            <option>{t("AB-")}</option>
          </select>
          {errors.bloodGroup && (
            <span className="text-red-500 text-sm mt-1">
              {errors.bloodGroup}
            </span>
          )}
        </div>
        <TextInput
          label={t("Age")}
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
