import React from "react";
import TextInput from "./TextInput";
import { useTranslation } from 'react-i18next';

const ParentInfo = ({ studentInfo, handleInputChange, errors, inputRefs }) => {
  const { t } = useTranslation('admAdmission');

  return (
    <div className="mt-6 mb-4">
      <h2 className="text-xl font-semibold mb-4">{t("Parent Information")}</h2>
      <div className="grid grid-cols-2 gap-4">
        <TextInput
          label={t("Father Name")}
          name="fatherName"
          value={studentInfo.fatherName || ""}
          onChange={handleInputChange}
          placeholder={t("Enter Father's Name")}
          error={errors.fatherName}
          ref={inputRefs.fatherName}
          aria-invalid={errors.fatherName ? "true" : "false"}
        />
        <TextInput
          label={t("Mother Name")}
          name="motherName"
          value={studentInfo.motherName || ""}
          onChange={handleInputChange}
          placeholder={t("Enter Mother's Name")}
          error={errors.motherName}
          ref={inputRefs.motherName}
          aria-invalid={errors.motherName ? "true" : "false"}
        />
        <TextInput
          label={t("Guardian Name")}
          name="guardianName"
          value={studentInfo.guardianName || ""}
          onChange={handleInputChange}
          placeholder={t("Enter Guardian's Name")}
          error={errors.guardianName}
          ref={inputRefs.guardianName}
          aria-invalid={errors.guardianName ? "true" : "false"}
        />
        <TextInput
          label={t("Relation to Student")}
          name="guardianRelationToStudent"
          value={studentInfo.guardianRelationToStudent || ""}
          onChange={handleInputChange}
          placeholder={t("Enter Relation to Student")}
          error={errors.guardianRelationToStudent}
          ref={inputRefs.guardianRelationToStudent}
          aria-invalid={errors.guardianRelationToStudent ? "true" : "false"}
        />
        <TextInput
          label={t("Guardian Email")}
          name="guardianEmail"
          type="email"
          value={studentInfo.guardianEmail || ""}
          onChange={handleInputChange}
          placeholder={t("Enter Guardian's Email")}
          error={errors.guardianEmail}
          ref={inputRefs.guardianEmail}
          aria-invalid={errors.guardianEmail ? "true" : "false"}
        />
        <TextInput
          label={t("Guardian Phone")}
          name="guardianContactNumber"
          type="tel"
          value={studentInfo.guardianContactNumber || ""}
          onChange={handleInputChange}
          placeholder={t("000-000-0000")}
          error={errors.guardianContactNumber}
          ref={inputRefs.guardianContactNumber}
          aria-invalid={errors.guardianContactNumber ? "true" : "false"}
        />
      </div>
    </div>
  );
};

export default ParentInfo;
