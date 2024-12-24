import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import BillDetails from "./Components/BillDetails";
import ReturnItems from "./Components/ReturnItems";
import PaymentDetails from "./Components/PaymentDetails";
import RefundDetails from "./Components/RefundDetails";

const AddReturnInvoice = () => {
    const initialValues = {
        referenceId: "342577056",
        returnReason: "",
        customReason: "",
        items: [{ returnItem: "", quantity: 1, rate: 0, totalAmount: 0 }],
        dueDate: "",
        subAmount: 0,
        tax: 0,
        discount: 0,
        penalty: 0,
        finalAmount: 0,
        refundAmount: 0,
        paymentStatus: "",
    };

    const validationSchema = Yup.object().shape({
        returnReason: Yup.string().required("Reason for return is required"),
        items: Yup.array().of(
            Yup.object().shape({
                returnItem: Yup.string().required("Return item is required"),
                quantity: Yup.number().min(1, "Quantity must be at least 1"),
                rate: Yup.number().min(0, "Rate must be positive"),
            })
        ),
        dueDate: Yup.string().required("Due Date is required"),
        refundAmount: Yup.number().min(0, "Refund amount must be positive"),
    });

    const handleSubmit = (values) => {
        console.log("Form Submitted", values);
    };

    return (
        <DashLayout>
            <div className="p-6 min-h-screen">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Return Invoice</h1>
                    <div className="flex gap-4">
                        <button
                            type="reset"
                            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
                        >
                            Preview
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md text-white"
                            style={{
                                background: "linear-gradient(to right, #ec4899, #a855f7)", // from-pink-500 to-purple-500
                            }}
                        >
                            Save Invoice
                        </button>
                    </div>

                </div>

                {/* Form Section */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue }) => (
                        <Form>
                            <BillDetails />
                            <ReturnItems values={values} setFieldValue={setFieldValue} />
                            <PaymentDetails />
                            <RefundDetails />
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="reset"
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                                >
                                    Reset
                                </button>
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                >
                                    Preview
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md text-white"
                                    style={{
                                        background: "linear-gradient(to right, #ec4899, #a855f7)", // from-pink-500 to-purple-500
                                    }}
                                >
                                    Save Invoice
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </DashLayout>
    );
};

export default AddReturnInvoice;
