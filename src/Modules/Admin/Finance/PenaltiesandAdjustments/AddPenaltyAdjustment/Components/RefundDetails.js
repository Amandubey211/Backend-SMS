import React from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";

const RefundDetails = () => (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Refund Details</h2>
      <div className="grid grid-cols-2 gap-6">
        <TextInput name="refundAmount" label="Refund Amount" type="number" placeholder="Enter refund amount" />
        <SelectInput name="paymentStatus" label="Payment Status" options={["Refunded", "Pending"]} />
      </div>
    </div>
  );
  

export default RefundDetails;
