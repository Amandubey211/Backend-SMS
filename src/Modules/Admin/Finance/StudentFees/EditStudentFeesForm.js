import React, { useEffect, useState } from "react";
import TextInput from "../Earnings/AddEarnings/Component/TextInput";
import SelectInput from "../Earnings/AddEarnings/Component/SelectInput";
import FileInput from "../Earnings/AddEarnings/Component/FileInput";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { updateStudentFee } from "../../../../Store/Slices/Finance/StudentFees/studentFeesThunks";
import { fetchAllIncomes } from "../../../../Store/Slices/Finance/Earnings/earningsThunks";
import toast from "react-hot-toast";

export default function EditStudentFeesForm({ data }) {
    const [initialValues, setInitialValues] = useState({
        feeId: "",
        subCategory: "",
        feeCycle: "",
        startDate: "",
        endDate: "",
        dueDate: "",
        examType: "",
        paymentType: "",
        chequeNumber: "",
        onlineTransactionId: "",
        total_amount: 0,
        discountType: "amount",
        discount: 0,
        tax: 0,
        remaining_amount: 0,
        advance_amount: 0,
        penalty: 0,
        paid_amount: 0,
        paymentStatus: "",
        studentId: '',
        classId: '',
        sectionId: '',
    });

    const dispatch = useDispatch();

    useEffect(() => {
        if (data) {
            setInitialValues({
                feeId: data._id || "",
                subCategory: data.subCategory || "",
                feeCycle: data.feeCycle?.type || "",
                startDate: data.feeCycle?.startDate?.slice(0,10) || "",
                endDate: data.feeCycle?.endDate?.slice(0,10) || "",
                dueDate: data.dueDate?.slice(0,10) || "",
                paidDate: data.paidDate?.slice(0,10) || "",
                examType: data.examType || "",
                paymentType: data.paymentType || "",
                chequeNumber: data.chequeNumber || "",
                onlineTransactionId: data.onlineTransactionId || "",
                total_amount: data.total_amount || 0,
                discountType: data.discountType || "amount",
                discount: data.discount || 0,
                tax: data.tax || 0,
                remaining_amount: data.remaining_amount || 0,
                advance_amount: data.advance_amount || 0,
                penalty: data.penalty || 0,
                paid_amount: data.paid_amount || 0,
                final_amount:data.final_amount ||0,
                paymentStatus: data.paymentStatus || "",
                studentId: data.studentId,
                classId: data.classId,
                sectionId: data.sectionId
            });
        }
    }, [data]);

    const validationSchema = Yup.object().shape({
        subCategory: Yup.string().required("Subcategory is required"),
        paymentType: Yup.string().required("Payment type is required"),
        chequeNumber: Yup.string().when("paymentType", {
            is: "cheque",
            then: Yup.string().required("Cheque number is required for cheque payments"),
        }),
        onlineTransactionId: Yup.string().when("paymentType", {
            is: "online",
            then: Yup.string().required(
                "Online transaction ID is required for online payments"
            ),
        }),
        total_amount: Yup.number()
            .required("Total amount is required")
            .positive("Total amount must be a positive number"),
        discount: Yup.number().min(0, "Discount cannot be negative"),
        remaining_amount: Yup.number().min(0, "Remaining amount cannot be negative"),
        advance_amount: Yup.number().min(0, "Advance amount cannot be negative"),
        tax: Yup.number().min(0, "Tax cannot be negative"),
        penalty: Yup.number().min(0, "Penalty cannot be negative"),
        paid_amount: Yup.number()
            .required("Paid amount is required")
            .min(0, "Paid amount cannot be negative"),
    });

    const calculateAmounts = (values) => {
        const total = parseFloat(values.total_amount || 0);
        const discount =
            values.discountType === "percentage"
                ? (parseFloat(values.discount || 0) / 100) * total
                : parseFloat(values.discount || 0);
        const tax = parseFloat(values.tax || 0);
        const penalty = parseFloat(values.penalty || 0);
        const paid = parseFloat(values.paid_amount || 0);

        const finalAmount = total + tax + penalty - discount;
        const remainingAmount = finalAmount - paid;
        const advanceAmount = paid > finalAmount ? paid - finalAmount : 0;

        return { finalAmount, remainingAmount, advanceAmount };
    };

    return (

        <div className="flex w-full border flex-col">
            <div className="flex flex-row mx-4 gap-2 font-semibold justify-between my-2">
                <div className="flex flex-row gap-2">
                <h1 className="text-gray-500">Student : </h1>
                <h1>{data?.studentDetails?.firstName}</h1>
                <h1>{data?.studentDetails?.lastName}</h1>
                </div>
                <div className="flex flex-row mx-6 gap-2 ">
                <h1 className="text-gray-500">Class :</h1>
                <h1>{data?.classDetails?.className}</h1>
            </div>
            </div>
            
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    const { finalAmount, remainingAmount, advanceAmount } =
                        calculateAmounts(values);
                    const updatedValues = {
                        ...values,
                        final_amount: finalAmount,
                        remaining_amount: remainingAmount,
                        advance_amount: advanceAmount,
                    };
                    console.log("Submitted Data:", updatedValues);
                    dispatch(updateStudentFee(updatedValues)).then(() => {
                        toast.success('Fees update successfully!')
                        dispatch(
                            fetchAllIncomes({
                                page: 1,
                                limit: 20,
                                categoryName: "Student-Based Revenue",
                                includeDetails: true,
                            })
                        );
                    });
                }}
            >
                {({ setFieldValue, values, errors, touched }) => (
                    <Form className="bg-white px-5 py-2 flex w-full flex-col">
                        <div className="grid grid-cols-3 gap-6 w-full">
                            <SelectInput
                                label="Subcategory"
                                name="subCategory"
                                options={[
                                    "Tuition Fees",
                                    "Hostel Fees",
                                    "Application Fees",
                                    "Certificate Fees",
                                    "Meal Fees",
                                    "Event Fees",
                                    "Exam Fees",
                                    "Transport Fees",
                                    "Other",
                                ]}
                            />
                            {values.subCategory === "Exam Fees" ? (
                                <TextInput label="Exam Type" name="examType" type="text" />
                            ) : (
                                <>
                                    <SelectInput
                                        label="Fee Cycle"
                                        name="feeCycle"
                                        options={[
                                            "Monthly",
                                            "Quarterly",
                                            "Half yearly",
                                            "Yearly",
                                            "Custom Date",
                                        ]}
                                    />
                                    <TextInput label="Start Date" name="startDate" type="date" />
                                </>
                            )}
                        </div>
                        <div className="grid grid-cols-3 gap-6 w-full">
                            {values.feeCycle == "Custom Date" &&
                                <TextInput
                                    label="End Date"
                                    name="endDate"
                                    type="date"
                                />}
                            <TextInput
                                label="Due Date"
                                name="dueDate"
                                type="date"
                            />
                            <TextInput
                                label="Total Amount"
                                name="total_amount"
                                type="number"
                            />
                            <TextInput
                                label="Remaining Amount"
                                name="remaining_amount"
                                type="number"
                            />
                            <TextInput
                                label="Advance Amount"
                                name="advance_amount"
                                type="number"
                            />
                            <TextInput
                                label="Discount"
                                name="discount"
                                type="number"
                            />
                            <TextInput
                                label="Tax"
                                name="tax"
                                type="number"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-6 w-full">
                            <TextInput
                                label="Penalty"
                                name="penalty"
                                type="number"
                            />
                              <TextInput
                                label="Final Amount"
                                name="final_amount"
                                type="number"
                            />
                             <TextInput
                                label="Paid Date"
                                name="paidDate"
                                type="date"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-6 w-full">
                            <TextInput
                                label="Paid Amount"
                                name="paid_amount"
                                type="number"
                            />
                            <SelectInput
                                label="Payment Type"
                                name="paymentType"
                                options={["cash", "card", "online", "cheque", "other"]}
                            />
                            <SelectInput
                                label={"Payment Status"}
                                name="paymentStatus"
                                options={["paid", "unpaid", "partial", "advance"]}
                            />
                            {values.paymentType == "cheque" && <TextInput
                                label="Cheque Number"
                                name="chequeNumber"

                            />}
                            {values.paymentType == "online" && <TextInput
                                label="Online Transaction ID"
                                name="onlineTransactionId"

                            />}
                        </div>
                        <div className="grid grid-cols-3 gap-6 w-full">
                            <FileInput
                                label="Upload Receipt"
                                name="document"
                                onChange={(event) =>
                                    setFieldValue("document", event.target.files[0])
                                }
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium px-6 py-2 rounded-md shadow-md hover:from-pink-600 hover:to-purple-600 transition"
                        >
                            Update Fees
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
