import React, { useRef, useEffect, useMemo, useCallback, memo } from "react";
import { Formik, Form, useFormikContext } from "formik";
import { Button, message, Spin } from "antd";
import AcademicSessionCandidate from "./Sections/AcademicSessionCandidate";
import AcademicHistory from "./Sections/AcademicHistory";
import AddressInformation from "./Sections/AddressInformation";
import ParentGuardianInfo from "./Sections/ParentGuardianInfo";
import AttachmentsUpload from "./Sections/AttachmentsUpload";
import { initialValues, AdminAdmissionSchema } from "./validations";
import { registerStudentDetails } from "../../../../Store/Slices/Common/Auth/actions/studentActions";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchoolAttachmentsById } from "../../../../Store/Slices/Admin/Admission/admissionThunk";
import useDynamicAttachments from "../../../../Hooks/Admin/useDynamicAttachments";
const FormDataWatcher = memo(({ onChange }) => {
  const { values } = useFormikContext();
  const prevValuesRef = useRef(values);

  useEffect(() => {
    // Check if values have changed and only then trigger the callback
    if (JSON.stringify(values) !== JSON.stringify(prevValuesRef.current)) {
      prevValuesRef.current = values;
      onChange(values);
    }
  }, [values, onChange]);

  return null;
});
// Memoize AdminAdmissionForm to avoid unnecessary re-renders
const AdminAdmissionForm = memo(({ onFormDataChange }) => {
  const formRefs = useRef({});
  const dispatch = useDispatch();
  const schoolId = useSelector(
    (state) => state.common.user.userDetails.schoolId
  );
  const { attachments: attachmentsMeta, loading } = useSelector(
    (state) => state.admin.admissionAttachment
  );

  // Fetch attachments once when the component is mounted
  useEffect(() => {
    dispatch(fetchSchoolAttachmentsById());
  }, []);

  const { attachmentsInitialValues, attachmentsSchema } =
    useDynamicAttachments(attachmentsMeta);

  const mergedInitialValues = useMemo(
    () => ({
      ...initialValues,
      attachments: attachmentsInitialValues,
    }),
    [attachmentsInitialValues]
  );

  const mergedValidation = useMemo(
    () => AdminAdmissionSchema.concat(attachmentsSchema),
    [attachmentsSchema]
  );

  // Handle form validation errors by scrolling to the first error
  const handleFormikErrorScroll = useCallback((errors) => {
    const errorKeys = Object.keys(errors);
    console.log(errors, "errorserrors");
    if (!errorKeys.length) return;
    const firstErrorKey = errorKeys[0];
    const fieldRef = formRefs.current[firstErrorKey];
    if (fieldRef?.scrollIntoView) {
      fieldRef.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        fieldRef.focus?.();
      }, 300);
    }
  }, []);

  // Validate mandatory attachments before form submission
  const validateMandatoryAttachments = useCallback((values) => {
    const missing = [];
    if (!values.profile?.file) missing.push("Profile Picture");

    if (values.attachments?.mandatory) {
      Object.entries(values.attachments.mandatory).forEach(([key, value]) => {
        if (!value?.file) missing.push(key);
      });
    }
    return missing;
  }, []);

  const handleFormSubmit = useCallback(
    async (values, actions) => {
      try {
        const missingAttachments = validateMandatoryAttachments(values);
        if (missingAttachments.length > 0) {
          message.error(
            `Please upload all mandatory attachments: ${missingAttachments.join(
              ", "
            )}`
          );
          return;
        }

        const formData = new FormData();

        // Basic Candidate Information
        formData.append("firstName", values.candidateInformation.firstName);
        formData.append("lastName", values.candidateInformation.lastName);
        formData.append(
          "email",
          values.candidateInformation.email.toLowerCase()
        );
        formData.append("dateOfBirth", values.candidateInformation.dob);
        formData.append(
          "placeOfBirth",
          values.candidateInformation.placeOfBirth
        );
        formData.append("gender", values.candidateInformation.gender);
        formData.append(
          "contactNumber",
          values.candidateInformation.phoneNumber
        );
        formData.append("religion", values.candidateInformation.religion);
        formData.append("bloodGroup", values.candidateInformation.bloodGroup);
        formData.append(
          "emergencyNumber",
          values.candidateInformation.emergencyNumber
        );
        formData.append("Q_Id", values.candidateInformation.studentId);
        formData.append("nationality", values.candidateInformation.nationality);

        // Academic Information
        formData.append(
          "enrollmentStatus",
          values.academicSession.enrollmentStats
        );
        formData.append("applyingClass", values.academicSession.class);
        formData.append("schoolId", schoolId);
        formData.append("academicYear", values.academicSession.academicYear);

        // Parent/Guardian Information
        formData.append(
          "fatherName",
          `${values.fatherInfo.firstName} ${values.fatherInfo.lastName}`
        );
        formData.append(
          "motherName",
          `${values.motherInfo.firstName} ${values.motherInfo.lastName}`
        );
        formData.append(
          "guardianName",
          values.guardianInformation.guardianName
        );
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

        // Parent photos
        if (values.motherInfo.motherPhoto?.file) {
          formData.append("motherPhoto", values.motherInfo.motherPhoto.file);
        }
        if (values.fatherInfo.fatherPhoto?.file) {
          formData.append("fatherPhoto", values.fatherInfo.fatherPhoto.file);
        }

        // Address Information
        const addressFields = [
          "unitNumber",
          "buildingNumber",
          "streetNumber",
          "streetName",
          "zone",
          "compoundName",
          "city",
          "nearestLandmark",
          "proposedCampus",
          "transportRequired",
          "postalCode",
          "state",
          "country",
        ];

        addressFields.forEach((field) => {
          formData.append(
            `permanentAddress[${field}]`,
            values.addressInformation[field] || ""
          );
          formData.append(
            `residentialAddress[${field}]`,
            values.addressInformation[field] || ""
          );
        });

        // Academic History
        formData.append(
          "previousSchoolName",
          values.academicHistory.previousSchoolName
        );
        formData.append("previousClass", values.academicHistory.previousClass);
        formData.append("curriculum", values.academicHistory.curriculum);
        if (values.academicHistory.lastDayAtSchool) {
          formData.append(
            "lastDayAtSchool",
            values.academicHistory.lastDayAtSchool
          );
        }
        formData.append(
          "sourceOfFee",
          values.academicHistory.sourceOfFee || "Parent"
        );

        // Language Preferences
        formData.append(
          "secondLanguage",
          values.languagePrefs.second?.[0] || ""
        );
        formData.append("thirdLanguage", values.languagePrefs.third?.[0] || "");
        formData.append("valueEducation", values.languagePrefs.valueEd || "");
        formData.append(
          "isLeftHanded",
          values.languagePrefs.leftHanded ? "true" : "false"
        );

        // Medical Information
        if (values.medicalInfo) {
          formData.append("medicalCondition", values.medicalInfo);
        }

        // Profile Pictures (flattened to root)
        if (values.profile?.file) {
          formData.append("profile", values.profile.file);
        }
        if (values.profile?.file) {
          formData.append("studentPicture", values.profile.file);
        }

        // Dynamic Attachments (flattened to root)
        if (values.attachments?.mandatory) {
          Object.entries(values.attachments.mandatory).forEach(
            ([key, value]) => {
              if (value?.file) {
                // Ensure consistent field naming
                const fieldName = key.replace(/\s+/g, "_").toLowerCase();
                formData.append(fieldName, value.file);
              }
            }
          );
        }

        if (values.attachments?.optional) {
          Object.entries(values.attachments.optional).forEach(
            ([key, value]) => {
              if (value?.file) {
                const fieldName = key.replace(/\s+/g, "_").toLowerCase();
                formData.append(fieldName, value.file);
              }
            }
          );
        }

        // Debug form data
        // Debug form data before sending
        console.log("FormData contents:");
        for (let [key, value] of formData.entries()) {
          console.log(
            key,
            value instanceof File
              ? `File: ${value.name} (${value.size} bytes)`
              : value
          );
        }

        const registrationResponse = await dispatch(
          registerStudentDetails(formData)
        );

        if (registrationResponse?.success) {
          message.success("Registration successful!");
        } else {
          message.error(
            registrationResponse?.message ||
              "Registration failed. Please try again."
          );
        }
      } catch (error) {
        console.error("Submission error:", error);
        message.error(
          error.response?.data?.message ||
            "An error occurred during registration. Please try again."
        );
      } finally {
        actions.setSubmitting(false);
      }
    },
    [dispatch, schoolId, validateMandatoryAttachments]
  );

  return (
    <div className="bg-white rounded-md p-4">
      <Formik
        initialValues={mergedInitialValues}
        validationSchema={mergedValidation}
        onSubmit={handleFormSubmit}
        validateOnMount
      >
        {({ errors, touched, handleSubmit, validateForm, isSubmitting }) => (
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
                loading={isSubmitting}
                style={{
                  background: "linear-gradient(to right, #C83B62, #7F35CD)",
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
                Save & Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
});

export default AdminAdmissionForm;
