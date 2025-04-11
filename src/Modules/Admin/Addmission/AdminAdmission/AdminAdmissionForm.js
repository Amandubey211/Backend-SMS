import React, { useRef, useEffect, useCallback, useState } from "react";
import { Formik, Form, useFormikContext } from "formik";
import { Button, message, Form as AntForm } from "antd";
import AcademicSessionCandidate from "./Sections/AcademicSessionCandidate";
import AcademicHistory from "./Sections/AcademicHistory";
import AddressInformation from "./Sections/AddressInformation";
import ParentGuardianInfo from "./Sections/ParentGuardianInfo";
import AttachmentsUpload from "./Sections/AttachmentsUpload";
import { initialValues, AdminAdmissionSchema } from "./validations";
import { registerStudentDetails } from "../../../../Store/Slices/Common/Auth/actions/studentActions";
import { useDispatch, useSelector } from "react-redux";

// Updated FormDataWatcher Component:
// Uses a ref to store previous values and only calls onChange when values truly change.
const FormDataWatcher = ({ onChange }) => {
  const { values } = useFormikContext();
  const prevValuesRef = useRef(values);

  useEffect(() => {
    // Compare stringified versions of values to decide whether to update.
    if (JSON.stringify(values) !== JSON.stringify(prevValuesRef.current)) {
      prevValuesRef.current = values;
      onChange(values);
    }
  }, [values, onChange]);

  return null;
};

const AdminAdmissionForm = ({ onFormDataChange }) => {
  const formRefs = useRef({});
  const dispatch = useDispatch();
  const schoolId = useSelector(
    (state) => state.common.user.userDetails.schoolId
  );

  const handleFormikErrorScroll = (errors) => {
    const errorKeys = Object.keys(errors);
    if (!errorKeys.length) return;
    const firstErrorKey = errorKeys[0];
    const fieldRef = formRefs.current[firstErrorKey];
    if (fieldRef && fieldRef.scrollIntoView) {
      fieldRef.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        fieldRef.focus();
      }, 300);
    }
  };

  const handleFormSubmit = async (values, actions) => {
    try {
      const formData = new FormData();

      // Candidate Information
      formData.append("firstName", values.candidateInformation.firstName);
      formData.append("lastName", values.candidateInformation.lastName);
      formData.append("email", values.candidateInformation.email);
      formData.append("dateOfBirth", values.candidateInformation.dob);
      formData.append("placeOfBirth", values.candidateInformation.placeOfBirth);
      formData.append("gender", values.candidateInformation.gender);
      formData.append("contactNumber", values.candidateInformation.phoneNumber);
      formData.append("religion", values.candidateInformation.religion);
      formData.append("bloodGroup", values.candidateInformation.bloodGroup);
      formData.append(
        "emergencyNumber",
        values.candidateInformation.emergencyNumber
      );
      formData.append("Q_Id", values.candidateInformation.studentId);
      // Append bloodGroup again if needed
      formData.append("bloodGroup", values.candidateInformation.bloodGroup);

      // Academic & Class Information
      formData.append(
        "enrollmentStatus",
        values.academicSession.enrollmentStats
      );
      formData.append("applyingClass", values.academicSession.class);
      formData.append("schoolId", schoolId);

      // Parent / Guardian Information
      formData.append(
        "fatherName",
        `${values.fatherInfo.firstName} ${values.fatherInfo.lastName}`
      );
      formData.append(
        "motherName",
        `${values.motherInfo.firstName} ${values.motherInfo.lastName}`
      );
      formData.append("motherPhoto", values.motherInfo.motherPhoto.file);
      formData.append("fatherPhoto", values.fatherInfo.fatherPhoto.file);
      formData.append("guardianName", values.guardianInformation.guardianName);
      formData.append(
        "guardianRelationToStudent",
        values.guardianInformation.guardianRelationToStudent
      );
      formData.append(
        "guardianContactNumber",
        values.guardianInformation.guardianContactNumber
      );
      formData.append(
        "guardianEmail",
        values.guardianInformation.guardianEmail
      );

      // Address / Transport Information
      formData.append(
        "transportRequirement",
        values.addressInformation.transportRequired
      );

      // Files from attachments
      if (values.attachments.mandatory.studentIdCopy) {
        formData.append(
          "studentIdCopy",
          values.attachments.mandatory.studentIdCopy.file
        );
      }
      if (values.attachments.mandatory.studentPassport) {
        formData.append(
          "studentPassport",
          values.attachments.mandatory.studentPassport.file
        );
      }
      if (values.attachments.mandatory.studentPicture) {
        formData.append(
          "studentPicture",
          values.attachments.mandatory.studentPicture.file
        );
      }
      if (values.attachments.mandatory.lastReportCard) {
        formData.append(
          "lastReportCard",
          values.attachments.mandatory.lastReportCard.file
        );
      }
      if (values.attachments.optional.medicalReport) {
        formData.append(
          "medicalReport",
          values.attachments.optional.medicalReport.file
        );
      }
      if (values.attachments.optional.birthCertificate) {
        formData.append(
          "birthCertificate",
          values.attachments.optional.birthCertificate.file
        );
      }
      if (values.attachments.optional.vaccinationCard) {
        formData.append(
          "vaccinationCard",
          values.attachments.optional.vaccinationCard.file
        );
      }

      const response = await dispatch(registerStudentDetails(formData));
      if (response?.success) {
        message.success("Registration successful!");
      }
    } catch (error) {
      message.error("Registration failed. Please try again.");
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-md p-4">
      <Formik
        initialValues={initialValues}
        validationSchema={AdminAdmissionSchema}
        onSubmit={handleFormSubmit}
        validateOnMount
      >
        {({ errors, touched, handleSubmit, validateForm }) => (
          <Form onFinish={handleSubmit}>
            <FormDataWatcher onChange={onFormDataChange} />
            <AcademicSessionCandidate
              formRefs={formRefs}
              errors={errors}
              touched={touched}
            />
            <AcademicHistory
              formRefs={formRefs}
              errors={errors}
              touched={touched}
            />
            <AddressInformation
              formRefs={formRefs}
              errors={errors}
              touched={touched}
            />
            <ParentGuardianInfo
              formRefs={formRefs}
              errors={errors}
              touched={touched}
            />
            <AttachmentsUpload
              formRefs={formRefs}
              errors={errors}
              touched={touched}
            />
            <div className="mt-6">
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                style={{
                  background: "linear-gradient(to right, #ff0080, #ff99cc)",
                  border: "none",
                  color: "#ffffff",
                }}
                onClick={async () => {
                  const formErrors = await validateForm();
                  if (Object.keys(formErrors).length > 0) {
                    handleFormikErrorScroll(formErrors);
                    message.error("Please correct the errors in the form.");
                  }
                }}
                block
              >
                Save &amp; Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AdminAdmissionForm;
