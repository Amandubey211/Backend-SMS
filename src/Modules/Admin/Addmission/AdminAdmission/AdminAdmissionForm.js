import React, { useRef, useEffect, useMemo, useCallback, memo } from "react";
import { Formik, Form, useFormikContext } from "formik";
import { Button, message } from "antd";
import * as Yup from "yup";
import AcademicSessionCandidate from "./Sections/AcademicSessionCandidate";
import AcademicHistory from "./Sections/AcademicHistory";
import AddressInformation from "./Sections/AddressInformation";
import ParentGuardianInfo from "./Sections/ParentGuardianInfo";
import AttachmentsUpload from "./Sections/AttachmentsUpload";
import { useNavigate } from "react-router-dom";
import {
  initialValues as baseInitialValues,
  baseAdminAdmissionSchema,
} from "./validations";
import { registerStudentDetails } from "../../../../Store/Slices/Common/Auth/actions/studentActions";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchoolAttachmentsById } from "../../../../Store/Slices/Admin/Admission/admissionThunk";
import useDynamicAttachments from "../../../../Hooks/Admin/useDynamicAttachments";

const FormDataWatcher = memo(({ onChange }) => {
  const { values } = useFormikContext();
  const prevValuesRef = useRef(values);

  useEffect(() => {
    if (JSON.stringify(values) !== JSON.stringify(prevValuesRef.current)) {
      prevValuesRef.current = values;
      onChange(values);
    }
  }, [values, onChange]);

  return null;
});

const AdminAdmissionForm = memo(({ onFormDataChange }) => {
  const formRefs = useRef({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const schoolId = useSelector(
    (state) => state.common.user.userDetails.schoolId
  );
  const { attachments: attachmentsMeta, loading } = useSelector(
    (state) => state.admin.admissionAttachment
  );
  console.log(attachmentsMeta, "attachmentsMeta");
  useEffect(() => {
    dispatch(fetchSchoolAttachmentsById());
  }, [dispatch]);

  const { attachmentsInitialValues, attachmentsSchema } =
    useDynamicAttachments(attachmentsMeta);

  const mergedInitialValues = useMemo(
    () => ({
      ...baseInitialValues,
      attachments: attachmentsInitialValues.attachments,
    }),
    [attachmentsInitialValues]
  );

  const mergedValidation = useMemo(() => {
    const s = baseAdminAdmissionSchema.concat(attachmentsSchema);
    delete s.fields.studentPicture; //  ⬅️  force-remove
    return s;
  }, [attachmentsSchema]);

  const handleFormikErrorScroll = (errors) => {
    console.log(errors, "errorserrors");
    const errorKeys = Object.keys(errors);
    if (!errorKeys.length) return;
    const firstErrorKey = errorKeys[0];
    const fieldRef = formRefs.current[firstErrorKey];
    if (fieldRef?.scrollIntoView) {
      fieldRef.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => fieldRef.focus?.(), 300);
    }
  };

  const validateMandatoryAttachments = useCallback((values) => {
    const missing = [];
    if (!values.profile?.file) missing.push("Profile Picture");

    // Check dynamic mandatory attachments
    if (values.attachments?.mandatory) {
      Object.entries(values.attachments.mandatory).forEach(([key, value]) => {
        if (!value?.file) {
          missing.push(key);
        }
      });
    }
    return missing;
  }, []);

  const handleFormSubmit = useCallback(
    async (values, actions) => {
      try {
        // Validate mandatory attachments and check for any missing files
        const missingAttachments = validateMandatoryAttachments(values);
        if (missingAttachments.length > 0) {
          message.error(`Please upload: ${missingAttachments.join(", ")}`);
          return;
        }

        const formData = new FormData();

        // Add student basic information to formData
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

        // Add academic information to formData
        formData.append(
          "enrollmentStatus",
          values.academicSession.enrollmentStats
        );
        formData.append("applyingClass", values.academicSession.class);
        formData.append("schoolId", schoolId);
        formData.append("academicYear", values.academicSession.academicYear);

        // Add parent/guardian information to formData
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

        // Add address information to formData
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

        // Add academic history information to formData
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

        // Add language preferences to formData
        formData.append("secondLanguage", values.languagePrefs.second || []);
        formData.append("thirdLanguage", values.languagePrefs.third || []);
        formData.append("valueEducation", values.languagePrefs.valueEd || []);
        formData.append(
          "isLeftHanded",
          values.languagePrefs.leftHanded ? "true" : "false"
        );

        // Add medical condition information to formData
        if (values.medicalInfo) {
          formData.append("medicalCondition", values.medicalInfo);
        }

        // Add profile picture if available
        if (values.profile?.file) {
          formData.append("profile", values.profile.file);
        }
        const addDynamicAttachments = (bucket) => {
          Object.values(bucket || {}).forEach((attachment) => {
            if (attachment?.file) {
              formData.append(attachment.fieldName, attachment.file);
              // Include ID if needed
              if (attachment.fieldId) {
                formData.append(
                  `${attachment.fieldName}_id`,
                  attachment.fieldId
                );
              }
            }
          });
        };
        // Process both mandatory and optional attachments
        addDynamicAttachments(values.attachments?.mandatory);
        addDynamicAttachments(values.attachments?.optional);

        // Handle submission of the form data to the backend
        dispatch(registerStudentDetails({ formData, navigate }));

        // if (registrationResponse?.success) {
        //   message.success("Registration successful!");
        // } else {
        //   message.error(registrationResponse?.message || "Registration failed");
        // }
      } catch (error) {
        message.error(error.response?.data?.message || "Registration failed");
      } finally {
        actions.setSubmitting(false); // Ensure form submission state is reset
      }
    },
    [dispatch, schoolId, validateMandatoryAttachments]
  );

  return (
    <div className="bg-white rounded-md p-4">
      <Formik
        initialValues={mergedInitialValues}
        // validationSchema={mergedValidation}
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
                  console.log(formErrors, "formErrorsformErrors");
                  if (Object.keys(formErrors).length > 0) {
                    handleFormikErrorScroll(formErrors);
                    message.error("Please correct the form errors");
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
