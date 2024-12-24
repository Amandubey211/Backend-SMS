import React from "react";
import { useFormikContext } from "formik";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";

const PaymentDetails = ({ category }) => {
  const { values, setFieldValue } = useFormikContext();

  return (
    <div className="mb-6">
      <div className="grid grid-cols-3 gap-6">
        {category === "Exam Fees" ? (
          <TextInput
            label="Exam Type"
            name={`examType_${category}`}
            placeholder="Enter Exam Type"
          />
        ) : (<>
          <SelectInput
            label="Frequency of payment"
            name={`frequencyOfPayment_${category}`}
            options={[
              "Monthly",
              "Quarterly",
              "Half yearly",
              "Yearly",
              "Custom Date",
            ]}
          />
          <TextInput
            label="Start Date"
            name={`startDate_${category}`}
            type="date"
          />

          {/* Conditionally render End Date */}
          {values[`frequencyOfPayment_${category}`] === "Custom Date" && (
            <TextInput
              label="End Date"
              name={`endDate_${category}`}
              type="date"
            />
          )}</>
        )}

        <TextInput
          label={`Due Date & Time (${category})`}
          name={`dueDateTime_${category}`}
          type="datetime-local"
        />

        <SelectInput
          label={`Payment Status (${category})`}
          name={`paymentStatus_${category}`}
          options={["paid", "unpaid", "partial", "advance"]}
        />

        <TextInput
          label="Discount"
          name={`discount_${category}`}
          placeholder="Enter discount percentage"
          type="Number"
        />
        <TextInput
          label="Penalty"
          name={`penalty_${category}`}
          placeholder="Enter penalty amount"
          type="Number"
        />


      </div>
    </div>
  );
};

export default PaymentDetails;
