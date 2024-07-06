import React from "react";

const AddressForm = ({ type, address, handleAddressChange }) => {
  return (
    <>
      <h3 className="text-lg font-semibold mb-2">{type}</h3>
      <div className="mb-4">
        <input
          type="text"
          name="street"
          value={address.street}
          onChange={handleAddressChange}
          placeholder="Street*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="city"
          value={address.city}
          onChange={handleAddressChange}
          placeholder="City*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
        <input
          type="text"
          name="state"
          value={address.state}
          onChange={handleAddressChange}
          placeholder="State*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          name="postalCode"
          value={address.postalCode}
          onChange={handleAddressChange}
          placeholder="Postal Code*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          name="country"
          value={address.Country}
          onChange={handleAddressChange}
          placeholder="Country*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
    </>
  );
};

export default AddressForm;
