import React, { useState } from "react";

const AddressInfo = ({
  studentInfo,
  handleInputChange,
  handleAddressChange,
}) => {
  const [sameAddress, setSameAddress] = useState(false);

  const handleSameAddressChange = (e) => {
    setSameAddress(e.target.checked);
    if (e.target.checked) {
      handleInputChange({
        target: {
          name: "residentialAddress",
          value: studentInfo.permanentAddress,
        },
      });
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Contact Info</h2>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div>
          <label className="block text-gray-700">Phone</label>
          <input
            type="text"
            placeholder="000-000-0000"
            name="contactNumber"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.contactNumber}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-gray-700">Emergency Number</label>
          <input
            type="text"
            placeholder="000-000-0000"
            name="emergencyNumber"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.emergencyNumber}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="mt-3">
          <label className="block text-gray-700">Email</label>
          <input
            type="text"
            name="email"
            placeholder="studentdiwan@gmail.com"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.email}
            onChange={handleInputChange}
          />
        </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Permanent Address</h3>
        <TextInput
          name="street"
          value={studentInfo.permanentAddress.street}
          onChange={(e) => handleAddressChange(e, "permanentAddress")}
          placeholder="Street*"
          required
        />
        <div className="grid grid-cols-2 gap-4 my-4">
          <TextInput
            name="city"
            value={studentInfo.permanentAddress.city}
            onChange={(e) => handleAddressChange(e, "permanentAddress")}
            placeholder="City*"
            required
          />
          <TextInput
            name="state"
            value={studentInfo.permanentAddress.state}
            onChange={(e) => handleAddressChange(e, "permanentAddress")}
            placeholder="State*"
            required
          />{" "}
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
          <TextInput
            name="postalCode"
            value={studentInfo.permanentAddress.postalCode}
            onChange={(e) => handleAddressChange(e, "permanentAddress")}
            placeholder="Postal Code*"
            required
          />
          <TextInput
            name="country"
            value={studentInfo.permanentAddress.country}
            onChange={(e) => handleAddressChange(e, "permanentAddress")}
            placeholder="Country*"
            required
          />
        </div>
      </div>
      <div className="mb-2 mt-2">
        <input
          type="checkbox"
          checked={sameAddress}
          onChange={handleSameAddressChange}
          className="mr-2"
        />
        <label className="text-sm">
          Residential Address is the same as Permanent Address
        </label>
      </div>
      {!sameAddress && (
        <div className="mt-3">
          <h3 className="text-lg font-semibold mb-2">Residential Address</h3>
          <TextInput
            name="street"
            value={studentInfo.residentialAddress.street}
            onChange={(e) => handleAddressChange(e, "residentialAddress")}
            placeholder="Street*"
            required
          />
          <div className="grid grid-cols-2 gap-4 my-4">
            <TextInput
              name="city"
              value={studentInfo.residentialAddress.city}
              onChange={(e) => handleAddressChange(e, "residentialAddress")}
              placeholder="City*"
              required
            />
            <TextInput
              name="state"
              value={studentInfo.residentialAddress.state}
              onChange={(e) => handleAddressChange(e, "residentialAddress")}
              placeholder="State*"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 my-4">
            <TextInput
              name="postalCode"
              value={studentInfo.residentialAddress.postalCode}
              onChange={(e) => handleAddressChange(e, "residentialAddress")}
              placeholder="Postal Code*"
              required
            />
            <TextInput
              name="country"
              value={studentInfo.residentialAddress.country}
              onChange={(e) => handleAddressChange(e, "residentialAddress")}
              placeholder="Country*"
              required
            />
          </div>
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">Place of Birth</h3>
      <TextInput
        name="placeOfBirth"
        value={studentInfo.placeOfBirth}
        onChange={handleInputChange}
        placeholder="Place"
        required
      />
    </div>
  );
};

const TextInput = ({
  name,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}) => (
  <div className="flex flex-col w-full">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      required={required}
    />
  </div>
);

export default AddressInfo;
