import React from "react";
import { Input, DatePicker, Select } from "antd";
import { useFormikContext } from "formik";
import moment from "moment";

const { Option } = Select;

const PersonalInfoStep = ({ stepRef }) => {
  const { values, errors, touched, setFieldValue, getFieldProps } =
    useFormikContext();

  // Example for date of birth using Ant Design DatePicker
  const handleDateChange = (date) => {
    setFieldValue("dateOfBirth", date ? date.format("YYYY-MM-DD") : "");
  };

  return (
    <div ref={stepRef}>
      <h3 className="text-xl font-semibold mb-4">Personal Info</h3>

      {/* First Name */}
      <div className="my-2">
        <label className="block mb-1">First Name</label>
        <Input
          {...getFieldProps("firstName")}
          status={touched.firstName && errors.firstName ? "error" : ""}
          placeholder="Enter first name"
        />
        {touched.firstName && errors.firstName && (
          <div className="text-red-500 text-sm">{errors.firstName}</div>
        )}
      </div>

      {/* Last Name */}
      <div className="my-2">
        <label className="block mb-1">Last Name</label>
        <Input
          {...getFieldProps("lastName")}
          status={touched.lastName && errors.lastName ? "error" : ""}
          placeholder="Enter last name"
        />
        {touched.lastName && errors.lastName && (
          <div className="text-red-500 text-sm">{errors.lastName}</div>
        )}
      </div>

      {/* Date of Birth */}
      <div className="my-2">
        <label className="block mb-1">Date of Birth</label>
        <DatePicker
          style={{ width: "100%" }}
          onChange={handleDateChange}
          value={values.dateOfBirth ? moment(values.dateOfBirth) : null}
          status={touched.dateOfBirth && errors.dateOfBirth ? "error" : ""}
        />
        {touched.dateOfBirth && errors.dateOfBirth && (
          <div className="text-red-500 text-sm">{errors.dateOfBirth}</div>
        )}
      </div>

      {/* Gender */}
      <div className="my-2">
        <label className="block mb-1">Gender</label>
        <Select
          style={{ width: "100%" }}
          value={values.gender}
          onChange={(val) => setFieldValue("gender", val)}
          status={touched.gender && errors.gender ? "error" : ""}
          placeholder="Select Gender"
        >
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="other">Other</Option>
        </Select>
        {touched.gender && errors.gender && (
          <div className="text-red-500 text-sm">{errors.gender}</div>
        )}
      </div>

      {/* Religion */}
      <div className="my-2">
        <label className="block mb-1">Religion</label>
        <Select
          style={{ width: "100%" }}
          value={values.religion}
          onChange={(val) => setFieldValue("religion", val)}
          status={touched.religion && errors.religion ? "error" : ""}
          placeholder="Select Religion"
        >
          <Option value="Islam">Islam</Option>
          <Option value="Christianity">Christianity</Option>
          <Option value="Hinduism">Hinduism</Option>
          <Option value="Buddhism">Buddhism</Option>
          <Option value="Other">Other</Option>
        </Select>
        {touched.religion && errors.religion && (
          <div className="text-red-500 text-sm">{errors.religion}</div>
        )}
      </div>

      {/* Blood Group */}
      <div className="my-2">
        <label className="block mb-1">Blood Group</label>
        <Select
          style={{ width: "100%" }}
          value={values.bloodGroup}
          onChange={(val) => setFieldValue("bloodGroup", val)}
          status={touched.bloodGroup && errors.bloodGroup ? "error" : ""}
          placeholder="Select Blood Group"
        >
          <Option value="O+">O+</Option>
          <Option value="O-">O-</Option>
          <Option value="A+">A+</Option>
          <Option value="A-">A-</Option>
          <Option value="B+">B+</Option>
          <Option value="B-">B-</Option>
          <Option value="AB+">AB+</Option>
          <Option value="AB-">AB-</Option>
        </Select>
        {touched.bloodGroup && errors.bloodGroup && (
          <div className="text-red-500 text-sm">{errors.bloodGroup}</div>
        )}
      </div>

      {/* Place of Birth */}
      <div className="my-2">
        <label className="block mb-1">Place of Birth</label>
        <Input
          {...getFieldProps("placeOfBirth")}
          status={touched.placeOfBirth && errors.placeOfBirth ? "error" : ""}
          placeholder="Place of Birth"
        />
        {touched.placeOfBirth && errors.placeOfBirth && (
          <div className="text-red-500 text-sm">{errors.placeOfBirth}</div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoStep;
