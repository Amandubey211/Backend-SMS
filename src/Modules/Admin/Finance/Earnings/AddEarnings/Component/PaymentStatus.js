import React from "react";
import { useFormikContext } from "formik"; // Importing useFormikContext
import { motion, AnimatePresence } from "framer-motion";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import FileInput from "./FileInput";

const PaymentStatus = () => {
  const { values, setFieldValue } = useFormikContext(); // Using Formik's useFormikContext hook

  const fieldVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Payment Status
      </h2>
      <div className="grid grid-cols-3 gap-6">
        <SelectInput
          label="Payment Status"
          name="paymentStatus"
          options={["Paid", "Unpaid", "Partial", "Advance"]}
          value={values.paymentStatus}
        />
        <TextInput
          label="Paid Amount"
          name="paidAmount"
          placeholder="Enter paid amount"
          value={values.paidAmount}
        />
        <SelectInput
          label="Paid By"
          name="paidBy"
          options={["Manual", "Auto"]}
          value={values.paymentType}
        />
        <SelectInput
          label="Payment Type"
          name="paymentType"
          options={["Cash", "Card", "Online", "Cheque", "Others"]}
          value={values.paymentType}
        />

        {/* Animate conditional fields */}
        <AnimatePresence>
          {values.paymentType === "Cheque" && (
            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <TextInput
                label="Cheque Number"
                name="chequeNumber"
                placeholder="Enter cheque number"
                value={values.chequeNumber}
              />
            </motion.div>
          )}
          {values.paymentType === "Online" && (
            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <TextInput
                label="Transaction ID"
                name="transactionId"
                placeholder="Enter transaction ID"
                value={values.transactionId}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <TextInput
          label="Advance Amount"
          name="advanceAmount"
          placeholder="Enter advance amount"
          value={values.advanceAmount}
        />
        <TextInput
          label="Remaining Amount"
          name="remainingAmount"
          placeholder="Enter remaining amount"
          value={values.remainingAmount}
        />
        <FileInput
          label="Add receipt/document"
          name="receipt"
          onChange={(event) => setFieldValue("receipt", event.target.files[0])}
        />
      </div>
    </div>
  );
};

export default PaymentStatus;
