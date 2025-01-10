import React from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";

const BillDetails = () => (
  <div className="mb-6">
    {/* Title */}
    <h2 className="text-lg font-semibold mb-4">Bill Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Reference ID */}
      <div className="flex flex-col">
        <TextInput
          name="referenceId"
          label="Reference ID"
          readOnly={true}
          defaultValue="342577056" // Example value
        />
      </div>
      {/* Reason For Return */}
      <div className="flex flex-col">
        <SelectInput
          name="returnReason"
          label="Reason For Return"
          options={["Damaged", "Incorrect", "Other"]}
        />
      </div>
      {/* Enter Reason Here */}
      <div className="flex flex-col">
        <TextInput
          name="customReason"
          label="Enter Reason Here"
          placeholder="Type here..."
        />
      </div>
    </div>
  </div>
);

export default BillDetails;
