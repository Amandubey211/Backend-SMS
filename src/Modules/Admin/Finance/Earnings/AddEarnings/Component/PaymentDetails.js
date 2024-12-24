import React from "react";
import { useFormikContext } from "formik";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";


const PaymentDetails = ({category }) => {
    
  return (
    <div className="mb-6">
      <div className="grid grid-cols-3 gap-6">
      {category == "Exam Fees"?<TextInput
          label="Exam Type"
          name={`examType_${category}`}
          placeholder="Enter Exam Type"
        />:<SelectInput
        label="Frequency of payment"
        name={`frequencyOfPayment_${category}`}
        options={[
          "Monthly",
          "Quarterly",
          "Half yearly",
          "Yearly",
          "Custom Date",
        ]}
      />}
        <TextInput
          label="Date & Time"
          name={`dateTime_${category}`}
          type="datetime-local"
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
        <TextInput
          label="Total Amount"
          name={`totalAmount_${category}`}
          placeholder="Enter total amount"
          type="Number"
        />
        <TextInput
          label="Final amount (After tax/discount/penalty)"
          name={`finalAmount_${category}`}
          placeholder={0}
          disabled={true}
        />
        
      </div>
    </div>
  );
};

export default PaymentDetails;
