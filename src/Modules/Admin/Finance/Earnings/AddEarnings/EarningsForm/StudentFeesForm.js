import React, { useRef, useState } from "react";
import { Formik, Form, useFormikContext } from "formik";

import StudentDetails from "../Component/StudentDetails";
import { VscDebugBreakpointLog } from "react-icons/vsc";
import { OnePaymentDetail } from "../Component/SelectDynamicInput";
import FileInput from "../Component/FileInput";
import SelectInput from "../Component/SelectInput";
import TextInput from "../Component/TextInput";
import { useDispatch } from "react-redux";
import { createStudentFee, createStudentFeeRecordForClass } from "../../../../../../Store/Slices/Finance/StudentFees/studentFeesThunks";
import StudentPaymentDetails from "../Component/StudentPaymentDetails";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const StudentFeesForm = ({ selectCategories, allData, setStudentDetail, setFormData, formData, studentDetail }) => {
  const formikRef = useRef(null);
  const dispatch = useDispatch();
  const navigate  = useNavigate()
  const handleCustomSubmit = () => {
    if (formikRef.current) {
      const { values, validateForm } = formikRef.current;

      validateForm().then((errors) => {
        if (Object.keys(errors).length === 0) {
          console.log("Submitted values:", values);

          let updatedFormData = [...formData]; // Create a copy of the existing formData

          Object.keys(values).forEach((key) => {
            const field = key.split('_')[0];
            const subCategory = key.split('_')[1];

            const existingIndex = updatedFormData.findIndex(
              (item) => item.subCategory === subCategory
            );

            if (existingIndex !== -1) {
              // Update the specific category if it exists
              updatedFormData[existingIndex] = {
                ...updatedFormData[existingIndex],
                [field]: values[key],
                studentId: studentDetail.studentId,
                classId: studentDetail.classId,
                sectionId: studentDetail.sectionId,
              };
              console.log(`Updated specific category ${subCategory}:`, updatedFormData);
            } else {
              // Add the field to every object in the array
              updatedFormData = updatedFormData.map((item) => ({
                ...item,
                [key]: values[key],
              }));
              console.log(
                `Added new field '${field}' to all categories:`,
                updatedFormData
              );
            }
          });

          // Set the updated data in state
          setFormData(updatedFormData);
          console.log("Final formData after updates:", updatedFormData);
          if (updatedFormData?.length == 0) {
            toast.dismiss()
            toast.error('Please Select Category')
          } else {
            if(updatedFormData[0]?.studentId  == 'ALL' ){
              dispatch(createStudentFeeRecordForClass(updatedFormData));
            }else{
              dispatch(createStudentFee({feeData:updatedFormData, navigate}));
            }
       
          }
        } else {
          toast.dismiss()
          toast.error('Please fill the required Fields !');
        }
      });
    }
  };
  const getNestedValue = (values, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], values);
  };
  const [imageUrl, setImageUrl] = useState('')
  return (
    <Formik
      innerRef={formikRef}
      initialValues={allData}
      onSubmit={(values) => {

      }}
    >
      {({ setFieldValue }) => (
        <Form className="bg-white px-5 py-2">
          <StudentDetails setStudentDetail={setStudentDetail} />
          {selectCategories.map((sc) => (
            <div key={sc}>
              <h1 className="font-bold flex flex-row items-center gap-1 mb-4 text-xl">
                <VscDebugBreakpointLog /> {sc} Details
              </h1>

              <StudentPaymentDetails category={sc} />
              <OnePaymentDetail category={sc} />

            </div>
          ))}
          <div className="grid grid-cols-3 gap-6">
            <TextInput
              label="Entry Date  & Time"
              name="dateTime"
              type="datetime-local"
              required
            />
            <SelectInput
              label="Paid By"
              name="paidBy"
              options={["Self", "Parent", "Relative", "other"]}
              required
            />
            <SelectInput
              label="Payment Type"
              name="paymentType"
              options={["cash", "card", "online", "cheque", "other"]}
              required
            />
            <TextInput
              label="Cheque Number (*If payment type is cheque)"
              name="chequeNumber"
            />
            <TextInput
              label="Online Transaction-ID (*If payment type is online)"
              name="onlineTransactionId"
            />
            <FileInput
              label="Add receipt/document"
              name="document"

              onChange={
                (e) => { setFieldValue("document", e.target.value || null); setImageUrl(e.target.value) } // Set to URL string
              }
              value={imageUrl}
            />

          </div>
          {/* Custom Submit Button */}
          <button
            onClick={handleCustomSubmit}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium px-6 py-2 rounded-md shadow-md hover:from-pink-600 hover:to-purple-600 transition"
          >
            Add Fee
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default StudentFeesForm;
