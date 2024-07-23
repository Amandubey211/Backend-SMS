import React from "react";
import TextInput from "./TextInput";

const AddressForm = ({ type, address, handleAddressChange }) => (
  <>
    <h3 className="text-lg font-semibold mb-2">{type}</h3>
    <TextInput
      name="street"
      value={address.street}
      onChange={handleAddressChange}
      placeholder="Street*"
      required
    />
    <div className="grid grid-cols-2 gap-4 my-4">
      <TextInput
        name="city"
        value={address.city}
        onChange={handleAddressChange}
        placeholder="City*"
        required
      />
      <TextInput
        name="state"
        value={address.state}
        onChange={handleAddressChange}
        placeholder="State*"
        required
      />
    </div>
    <TextInput
      name="postalCode"
      value={address.postalCode}
      onChange={handleAddressChange}
      placeholder="Postal Code*"
      required
    />
  </>
);

export default AddressForm;
