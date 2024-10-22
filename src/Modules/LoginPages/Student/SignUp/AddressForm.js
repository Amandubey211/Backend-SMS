// AddressForm.js

import React from "react";
import TextInput from "./TextInput";

const AddressForm = ({
  type,
  address,
  handleAddressChange,
  validationErrors,
  inputRefs,
  prefix,
}) => (
  <>
    <h3 className="text-lg font-semibold mb-2">{type}</h3>
    <TextInput
      ref={(el) => (inputRefs.current[`${prefix}street`] = el)}
      name="street"
      value={address.street}
      onChange={handleAddressChange}
      placeholder="Street*"
      error={validationErrors.street}
    />
    <div className="grid grid-cols-2 gap-4 my-4">
      <TextInput
        ref={(el) => (inputRefs.current[`${prefix}city`] = el)}
        name="city"
        value={address.city}
        onChange={handleAddressChange}
        placeholder="City*"
        error={validationErrors.city}
      />
      <TextInput
        ref={(el) => (inputRefs.current[`${prefix}state`] = el)}
        name="state"
        value={address.state}
        onChange={handleAddressChange}
        placeholder="State*"
        error={validationErrors.state}
      />
    </div>
    <div className="grid grid-cols-2 gap-4 my-4">
      <TextInput
        ref={(el) => (inputRefs.current[`${prefix}postalCode`] = el)}
        name="postalCode"
        value={address.postalCode}
        onChange={handleAddressChange}
        placeholder="Postal Code*"
        error={validationErrors.postalCode}
      />
      <TextInput
        ref={(el) => (inputRefs.current[`${prefix}country`] = el)}
        name="country"
        value={address.country}
        onChange={handleAddressChange}
        placeholder="Country*"
        error={validationErrors.country}
      />
    </div>
  </>
);

export default AddressForm;
