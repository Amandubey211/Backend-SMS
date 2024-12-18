// // PaymentStatus.jsx
// import React from "react";
// import { useFormikContext } from "formik";
// import { motion, AnimatePresence } from "framer-motion";
// import TextInput from "./TextInput";
// import SelectInput from "./SelectInput";
// import FileInput from "./FileInput";

// const PaymentStatus = () => {
//   const { values, setFieldValue } = useFormikContext();

//   const fieldVariants = {
//     hidden: { opacity: 0, y: -10 },
//     visible: { opacity: 1, y: 0 },
//     exit: { opacity: 0, y: 10 },
//   };

//   return (
//     <div className="mb-6">
//       <h2 className="text-lg font-semibold text-gray-800 mb-4">
//         Payment Status
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <SelectInput
//           label="Payment Status"
//           name="paymentStatus"
//           options={["Paid", "Unpaid", "Partial", "Advance"]}
//           value={values?.paymentStatus}
//           onChange={(value) => setFieldValue("paymentStatus", value)}
//         />
//         <TextInput
//           label="Paid Amount (QR)"
//           name="paidAmount"
//           placeholder="Enter paid amount"
//           type="number"
//           value={values?.paidAmount}
//           onChange={(e) => setFieldValue("paidAmount", e.target.value)}
//         />
//         <SelectInput
//           label="Paid By"
//           name="paidBy"
//           options={["Manual", "Auto"]}
//           value={values?.paidBy}
//           onChange={(value) => setFieldValue("paidBy", value)}
//         />
//         <SelectInput
//           label="Payment Type"
//           name="paymentType"
//           options={["Cash", "Card", "Online", "Cheque", "Others"]}
//           value={values?.paymentType}
//           onChange={(value) => setFieldValue("paymentType", value)}
//         />

//         {/* Animate conditional fields */}
//         <AnimatePresence>
//           {values?.paymentType === "Cheque" && (
//             <motion.div
//               variants={fieldVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               transition={{ duration: 0.3 }}
//             >
//               <TextInput
//                 label="Cheque Number"
//                 name="chequeNumber"
//                 placeholder="Enter cheque number"
//                 type="text"
//                 value={values?.chequeNumber}
//                 onChange={(e) => setFieldValue("chequeNumber", e.target.value)}
//               />
//             </motion.div>
//           )}
//           {values?.paymentType === "Online" && (
//             <motion.div
//               variants={fieldVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               transition={{ duration: 0.3 }}
//             >
//               <TextInput
//                 label="Transaction ID"
//                 name="transactionId"
//                 placeholder="Enter transaction ID"
//                 type="text"
//                 value={values?.transactionId}
//                 onChange={(e) => setFieldValue("transactionId", e.target.value)}
//               />
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <TextInput
//           label="Advance Amount (QR)"
//           name="advanceAmount"
//           placeholder="Enter advance amount"
//           type="number"
//           value={values?.advanceAmount}
//           onChange={(e) => setFieldValue("advanceAmount", e.target.value)}
//         />
//         <TextInput
//           label="Remaining Amount (QR)"
//           name="remainingAmount"
//           placeholder="Enter remaining amount"
//           type="number"
//           value={values?.remainingAmount}
//           onChange={(e) => setFieldValue("remainingAmount", e.target.value)}
//         />
//         <FileInput
//           label="Add Receipt/Document"
//           name="receipt"
//           onChange={(event) =>
//             setFieldValue("receipt", event?.target?.files?.[0] || null)
//           }
//         />
//       </div>
//     </div>
//   );
// };

// export default PaymentStatus;
// PaymentStatus.jsx// PaymentStatus.jsx
import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Adjust the path as necessary

const PaymentStatus = () => {
  const { setFieldValue, values } = useFormikContext();

  // Define static fields
  const paymentStatusFields = [
    {
      name: "paymentStatus",
      label: "Payment Status",
      type: "select",
      options: ["Paid", "Unpaid", "Partial", "Advance"],
    },
    {
      name: "paidAmount",
      label: "Paid Amount (QR)",
      type: "number",
      placeholder: "Enter paid amount",
      min: 0,
    },
    {
      name: "paidBy",
      label: "Paid By",
      type: "select",
      options: ["Manual", "Auto"],
    },
    {
      name: "paymentType",
      label: "Payment Type",
      type: "select",
      options: ["Cash", "Card", "Online", "Cheque", "Others"],
    },
    {
      name: "advanceAmount",
      label: "Advance Amount (QR)",
      type: "number",
      placeholder: "Enter advance amount",
      min: 0,
    },
    {
      name: "remainingAmount",
      label: "Remaining Amount (QR)",
      type: "number",
      placeholder: "Enter remaining amount",
      min: 0,
    },
    {
      name: "receipt",
      label: "Add Receipt/Document",
      type: "file",
    },
  ];

  // Define conditional fields based on paymentType
  const conditionalFields = [];

  if (values?.paymentType === "Cheque") {
    conditionalFields.push({
      name: "chequeNumber",
      label: "Cheque Number",
      type: "text",
      placeholder: "Enter cheque number",
    });
  }

  if (values?.paymentType === "Online") {
    conditionalFields.push({
      name: "transactionId",
      label: "Transaction ID",
      type: "text",
      placeholder: "Enter transaction ID",
    });
  }

  // Combine static and conditional fields, ensuring conditional fields are after paymentType
  const combinedFields = [...paymentStatusFields];

  // Find the index of paymentType field
  const paymentTypeIndex = combinedFields.findIndex(
    (field) => field.name === "paymentType"
  );

  // Insert conditional fields right after paymentType
  if (paymentTypeIndex !== -1 && conditionalFields.length > 0) {
    combinedFields.splice(paymentTypeIndex + 1, 0, ...conditionalFields);
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Payment Status
      </h2>

      {/* Render combined fields in a single FormSection */}
      <FormSection
        title="" // No title as it's already provided above
        fields={combinedFields}
        setFieldValue={setFieldValue}
        values={values}
      />
    </div>
  );
};

export default PaymentStatus;
