import React from "react";
import { useFormikContext } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import FileInput from "./FileInput";
import * as Yup from "yup";

const PaymentStatus = ({ setFieldValue }) => {
  const { values } = useFormikContext();

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

// Define initialValues and validationSchema for reuse
PaymentStatus.initialValues = {
  paymentStatus: "",
  paidAmount: "",
  paymentType: "",
  advanceAmount: "",
  remainingAmount: "",
  chequeNumber: "",
  transactionId: "",
  receipt: null,
};

PaymentStatus.validationSchema = {
  paymentStatus: Yup.string().required("Payment Status is required"),
  paidAmount: Yup.number().min(0, "Invalid paid amount"),
  paymentType: Yup.string().required("Payment Type is required"),
  advanceAmount: Yup.number().min(0, "Invalid advance amount"),
  remainingAmount: Yup.number().min(0, "Invalid remaining amount"),
  chequeNumber: Yup.string().when("paymentType", {
    is: "Cheque",
    then: Yup.string().required("Cheque Number is required"),
    otherwise: Yup.string().notRequired(),
  }),
  transactionId: Yup.string().when("paymentType", {
    is: "Online",
    then: Yup.string().required("Transaction ID is required"),
    otherwise: Yup.string().notRequired(),
  }),
  receipt: Yup.mixed().required("Receipt/document is required"),
};

export default PaymentStatus;
