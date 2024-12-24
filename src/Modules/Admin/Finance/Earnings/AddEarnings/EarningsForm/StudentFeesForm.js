import React, { useRef } from "react";
import { Formik, Form } from "formik";

import PaymentDetails from "../Component/PaymentDetails";
import StudentDetails from "../Component/StudentDetails";
import { VscDebugBreakpointLog } from "react-icons/vsc";
import { OnePaymentDetail } from "../Component/SelectDynamicInput";
import FileInput from "../Component/FileInput";
import SelectInput from "../Component/SelectInput";
import TextInput from "../Component/TextInput";

const StudentFeesForm = ({ selectCategories, allData, setStudentDetail,setFormData,fromData,studentDetail }) => {
  const formikRef = useRef(null);

  const handleCustomSubmit = () => {
    if (formikRef.current) {
      const { values, validateForm } = formikRef.current;
      validateForm().then((errors) => {
        if (Object.keys(errors).length === 0) {
          console.log("Submitted values:", values);
  
          Object.keys(values).forEach((key) => {
            let field = key.split('_')[0];
            let subCategory = key.split('_')[1];
  
            setFormData((prev) => {
 
              const existingIndex = prev.findIndex(
                (item) => item.subCategory === subCategory
              );
                
              if (existingIndex !== -1) {
               
                const updated = [...prev];
                updated[existingIndex] = {
                  ...updated[existingIndex],
                  [field]: values[key], 
                  studentId: studentDetail.studentId,
                  classId: studentDetail.classId,
                  sectionId: studentDetail.sectionId,
                  
                };
                console.log(`Updated specific category ${subCategory}:`, updated);
                return updated;
              } else {
                // Add the field to every object in the array
                const updated = prev.map((item) => ({
                  ...item,
                  [key]: values[key],
                }));
                console.log(
                  `Added new field '${field}' to all categories:`,
                  updated
                );
                return updated;
              }
             
            });
          });
  
          console.log("Final formData after updates:", fromData);
        } else {
          console.error("Validation errors:", errors);
        }
      });
    }
  };
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

              <PaymentDetails category={sc}  />
              <OnePaymentDetail category={sc} />
             
            </div>
          ))}
          <div className="grid grid-cols-3 gap-6">
          <TextInput
          label="Entry Date  & Time"
          name="dateTime"
          type="datetime-local"
        />
            <SelectInput
              label="Paid By"
              name="paidBy"
              options={["Self", "Parent","Relative","other"]}
            />
            <SelectInput
              label="Payment Type"
              name="paymentType"
              options={["Cash", "Card", "Online", "Cheque", "Others"]}
            />
            <FileInput
              label="Add receipt/document"
              name="receipt"
              onChange={(event) => setFieldValue("receipt", event.target.files[0])}
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
