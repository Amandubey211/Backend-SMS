import React from "react";
import { Input } from "antd";
import { useFormikContext } from "formik";

const ParentInfoStep = ({ stepRef }) => {
  const { getFieldProps, errors, touched } = useFormikContext();

  return (
    <div ref={stepRef}>
      <h3 className="text-xl font-semibold mb-4">Parent Information</h3>

      {/* Father Name */}
      <div className="my-2">
        <label className="block mb-1">Father Name</label>
        <Input
          {...getFieldProps("fatherName")}
          status={touched.fatherName && errors.fatherName ? "error" : ""}
          placeholder="Enter father's name"
        />
        {touched.fatherName && errors.fatherName && (
          <div className="text-red-500 text-sm">{errors.fatherName}</div>
        )}
      </div>

      {/* Mother Name */}
      <div className="my-2">
        <label className="block mb-1">Mother Name</label>
        <Input
          {...getFieldProps("motherName")}
          status={touched.motherName && errors.motherName ? "error" : ""}
          placeholder="Enter mother's name"
        />
        {touched.motherName && errors.motherName && (
          <div className="text-red-500 text-sm">{errors.motherName}</div>
        )}
      </div>

      {/* Guardian Name */}
      <div className="my-2">
        <label className="block mb-1">Guardian Name</label>
        <Input
          {...getFieldProps("guardianName")}
          status={touched.guardianName && errors.guardianName ? "error" : ""}
          placeholder="Enter guardian name"
        />
        {touched.guardianName && errors.guardianName && (
          <div className="text-red-500 text-sm">{errors.guardianName}</div>
        )}
      </div>

      {/* Guardian Relation */}
      <div className="my-2">
        <label className="block mb-1">Guardian Relation to Student</label>
        <Input
          {...getFieldProps("guardianRelationToStudent")}
          status={
            touched.guardianRelationToStudent &&
            errors.guardianRelationToStudent
              ? "error"
              : ""
          }
          placeholder="Enter relation (Uncle, Aunt, etc.)"
        />
        {touched.guardianRelationToStudent &&
          errors.guardianRelationToStudent && (
            <div className="text-red-500 text-sm">
              {errors.guardianRelationToStudent}
            </div>
          )}
      </div>

      {/* Guardian Email */}
      <div className="my-2">
        <label className="block mb-1">Guardian Email</label>
        <Input
          {...getFieldProps("guardianEmail")}
          placeholder="Enter guardian email"
          status={touched.guardianEmail && errors.guardianEmail ? "error" : ""}
        />
        {touched.guardianEmail && errors.guardianEmail && (
          <div className="text-red-500 text-sm">{errors.guardianEmail}</div>
        )}
      </div>

      {/* Guardian Phone */}
      <div className="my-2">
        <label className="block mb-1">Guardian Contact Number</label>
        <Input
          {...getFieldProps("guardianContactNumber")}
          placeholder="0000-0000"
          status={
            touched.guardianContactNumber && errors.guardianContactNumber
              ? "error"
              : ""
          }
        />
        {touched.guardianContactNumber && errors.guardianContactNumber && (
          <div className="text-red-500 text-sm">
            {errors.guardianContactNumber}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentInfoStep;
