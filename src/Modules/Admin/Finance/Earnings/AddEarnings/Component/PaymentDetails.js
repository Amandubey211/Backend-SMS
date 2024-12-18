// // PaymentDetails.jsx
// import React from "react";
// import { useFormikContext } from "formik";
// import TextInput from "./TextInput";
// import SelectInput from "./SelectInput";

// const PaymentDetails = () => {
//   const { values, setFieldValue } = useFormikContext();

//   return (
//     <div className="mb-6">
//       <h2 className="text-lg font-semibold text-gray-800 mb-4">
//         Payment Details
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <SelectInput
//           label="Frequency of Payment"
//           name="frequencyOfPayment"
//           options={[
//             "Monthly",
//             "Quarterly",
//             "Half Yearly",
//             "Yearly",
//             "Custom Date",
//           ]}
//           value={values?.frequencyOfPayment}
//           onChange={(value) => setFieldValue("frequencyOfPayment", value)}
//         />
//         <TextInput
//           label="Date & Time"
//           name="dateTime"
//           type="datetime-local"
//           value={values?.dateTime}
//           onChange={(e) => setFieldValue("dateTime", e.target.value)}
//         />
//         {/* Uncomment and update if needed
//         <TextInput
//           label="Tax (Inc/Exc)"
//           name="tax"
//           placeholder="Enter tax percentage"
//           value={values?.tax}
//           onChange={(e) => setFieldValue("tax", e.target.value)}
//         />
//         */}
//         <TextInput
//           label="Discount (%)"
//           name="discount"
//           placeholder="Enter discount percentage"
//           type="number"
//           value={values?.discount}
//           onChange={(e) => setFieldValue("discount", e.target.value)}
//         />
//         <TextInput
//           label="Penalty (QR)"
//           name="penalty"
//           placeholder="Enter penalty amount"
//           type="number"
//           value={values?.penalty}
//           onChange={(e) => setFieldValue("penalty", e.target.value)}
//         />
//         <TextInput
//           label="Total Amount (QR)"
//           name="totalAmount"
//           placeholder="Enter total amount"
//           type="number"
//           value={values?.totalAmount}
//           onChange={(e) => setFieldValue("totalAmount", e.target.value)}
//         />
//         <TextInput
//           label="Final Amount (After Tax/Discount/Penalty) (QR)"
//           name="finalAmount"
//           placeholder="Enter final amount"
//           type="number"
//           value={values?.finalAmount}
//           onChange={(e) => setFieldValue("finalAmount", e.target.value)}
//         />
//       </div>
//     </div>
//   );
// };

// export default PaymentDetails;

// PaymentDetails.jsx
import React from "react";
import { useFormikContext } from "formik";
import FormSection from "./FormSection";

const paymentDetailsFields = [
  {
    name: "frequencyOfPayment",
    label: "Frequency of Payment",
    type: "select",
    options: ["Monthly", "Quarterly", "Half Yearly", "Yearly", "Custom Date"],
  },
  {
    name: "dateTime",
    label: "Date & Time",
    type: "datetime-local",
    placeholder: "Select Date & Time",
  },
  // Uncomment and update if needed
  // {
  //   name: "tax",
  //   label: "Tax (Inc/Exc)",
  //   type: "number",
  //   placeholder: "Enter tax percentage",
  //   min: 0,
  // },
  {
    name: "discount",
    label: "Discount (%)",
    type: "number",
    placeholder: "Enter discount percentage",
    min: 0,
  },
  {
    name: "penalty",
    label: "Penalty (QR)",
    type: "number",
    placeholder: "Enter penalty amount",
    min: 0,
  },
  {
    name: "totalAmount",
    label: "Total Amount (QR)",
    type: "number",
    placeholder: "Enter total amount",
    min: 0,
  },
  {
    name: "finalAmount",
    label: "Final Amount (After Tax/Discount/Penalty) (QR)",
    type: "number",
    placeholder: "Enter final amount",
    min: 0,
  },
];

const PaymentDetails = () => {
  const { setFieldValue, values } = useFormikContext();

  return (
    <FormSection
      title="Payment Details"
      fields={paymentDetailsFields}
      setFieldValue={setFieldValue}
      values={values}
    />
  );
};

export default PaymentDetails;
