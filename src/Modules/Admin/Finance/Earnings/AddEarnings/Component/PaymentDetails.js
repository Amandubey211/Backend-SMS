import React from "react";
import { useFormikContext } from "formik";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";

const PaymentDetails = ({ onFormChange }) => {
  const { values } = useFormikContext();

  // Optionally pass form values back to the parent component if needed
  onFormChange(values);

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Payment Details
      </h2>
      <div className="grid grid-cols-3 gap-6">
        <SelectInput
          label="Frequency of payment"
          name="frequencyOfPayment"
          options={[
            "Monthly",
            "Quarterly",
            "Half yearly",
            "Yearly",
            "Custom Date",
          ]}
          value={values.paymentType}
        />
        <TextInput
          label="Date & Time"
          name="dateTime"
          type="datetime-local"
          value={values.dateTime}
        />
        {/* <TextInput
          label="Tax (Inc/Exc)"
          name="tax"
          placeholder="Enter tax percentage"
          value={values.tax}
        /> */}
        <TextInput
          label="Discount"
          name="discount"
          placeholder="Enter discount percentage"
          value={values.discount}
        />
        <TextInput
          label="Penalty"
          name="penalty"
          placeholder="Enter penalty amount"
          value={values.penalty}
        />
        <TextInput
          label="Total Amount"
          name="totalAmount"
          placeholder="Enter total amount"
          value={values.totalAmount}
        />
        <TextInput
          label="Final amount (After tax/discount/penalty)"
          name="finalAmount"
          placeholder="Enter final amount"
          value={values.finalAmount}
        />
      </div>
    </div>
  );
};

export default PaymentDetails;
