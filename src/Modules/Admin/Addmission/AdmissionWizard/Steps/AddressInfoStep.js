import React, { useState } from "react";
import { Input, Checkbox } from "antd";
import { useFormikContext } from "formik";

const AddressInfoStep = ({ stepRef }) => {
  const { values, errors, touched, getFieldProps, setFieldValue } =
    useFormikContext();
  const [sameAddress, setSameAddress] = useState(false);

  const handleSameAddress = (checked) => {
    setSameAddress(checked);
    if (checked) {
      // Copy permanentAddress to residentialAddress
      setFieldValue("residentialAddress", { ...values.permanentAddress });
    } else {
      setFieldValue("residentialAddress", {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      });
    }
  };

  return (
    <div ref={stepRef}>
      <h3 className="text-xl font-semibold mb-4">Address Info</h3>

      {/* Contact Number */}
      <div className="my-2">
        <label className="block mb-1">Contact Number</label>
        <Input
          {...getFieldProps("contactNumber")}
          status={touched.contactNumber && errors.contactNumber ? "error" : ""}
          placeholder="e.g., 000-0000"
        />
        {touched.contactNumber && errors.contactNumber && (
          <div className="text-red-500 text-sm">{errors.contactNumber}</div>
        )}
      </div>

      {/* Emergency Number */}
      <div className="my-2">
        <label className="block mb-1">Emergency Number</label>
        <Input
          {...getFieldProps("emergencyNumber")}
          status={
            touched.emergencyNumber && errors.emergencyNumber ? "error" : ""
          }
          placeholder="e.g., 000-0000"
        />
        {touched.emergencyNumber && errors.emergencyNumber && (
          <div className="text-red-500 text-sm">{errors.emergencyNumber}</div>
        )}
      </div>

      {/* Email */}
      <div className="my-2">
        <label className="block mb-1">Email</label>
        <Input
          {...getFieldProps("email")}
          status={touched.email && errors.email ? "error" : ""}
          placeholder="email@example.com"
        />
        {touched.email && errors.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}
      </div>

      {/* QID */}
      <div className="my-2">
        <label className="block mb-1">QID Number</label>
        <Input
          {...getFieldProps("Q_Id")}
          status={touched.Q_Id && errors.Q_Id ? "error" : ""}
          placeholder="11 digits"
        />
        {touched.Q_Id && errors.Q_Id && (
          <div className="text-red-500 text-sm">{errors.Q_Id}</div>
        )}
      </div>

      {/* Permanent Address */}
      <h4 className="font-semibold mt-4">Permanent Address</h4>
      <div className="my-2">
        <label className="block mb-1">Street</label>
        <Input
          {...getFieldProps("permanentAddress.street")}
          status={
            touched.permanentAddress?.street && errors.permanentAddress?.street
              ? "error"
              : ""
          }
          placeholder="Street"
        />
        {touched.permanentAddress?.street &&
          errors.permanentAddress?.street && (
            <div className="text-red-500 text-sm">
              {errors.permanentAddress.street}
            </div>
          )}
      </div>

      {/* City, State, PostalCode, Country similarly... */}

      <div className="my-2">
        <Checkbox
          checked={sameAddress}
          onChange={(e) => handleSameAddress(e.target.checked)}
        >
          Residential Address is the same
        </Checkbox>
      </div>

      {!sameAddress && (
        <>
          <h4 className="font-semibold mt-2">Residential Address</h4>
          <div className="my-2">
            <label className="block mb-1">Street</label>
            <Input
              {...getFieldProps("residentialAddress.street")}
              placeholder="Street"
            />
          </div>
          {/* ...more fields for residentialAddress */}
        </>
      )}
    </div>
  );
};

export default AddressInfoStep;
