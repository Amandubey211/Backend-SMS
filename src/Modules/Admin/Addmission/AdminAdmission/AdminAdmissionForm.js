import React, { useEffect, useMemo, useCallback, useState, memo } from "react";
import { Form, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AcademicSessionCandidate from "./Sections/AcademicSessionCandidate";
import AcademicHistory from "./Sections/AcademicHistory";
import AddressInformation from "./Sections/AddressInformation";
import ParentGuardianInfo from "./Sections/ParentGuardianInfo";
import AttachmentsUpload from "./Sections/AttachmentsUpload";
import { registerStudentDetails } from "../../../../Store/Slices/Common/Auth/actions/studentActions";
import { fetchAdmissionOptions } from "../../../../Store/Slices/Common/User/actions/userActions";
import { fetchSchoolAttachmentsById } from "../../../../Store/Slices/Admin/Admission/admissionThunk";
import useDynamicAttachments from "../../../../Hooks/Admin/useDynamicAttachments";

const AdminAdmissionForm = memo(({ onFormDataChange }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const schoolId = useSelector(
    (state) => state.common.user.userDetails.schoolId
  );
  const { attachments: attachmentsMeta } = useSelector(
    (state) => state.admin.admissionAttachment
  );
  const { loading: regLoading } = useSelector(
    (state) => state.common.auth.loading
  );
  const { attachmentsInitialValues, attachmentsSchema } =
    useDynamicAttachments(attachmentsMeta);

  // load dynamic attachments meta
  useEffect(() => {
    dispatch(fetchSchoolAttachmentsById());
    dispatch(fetchAdmissionOptions(schoolId));
  }, [dispatch, schoolId]);

  // merge base initial values + dynamic attachments
  const initialValues = useMemo(
    () => ({
      ...attachmentsInitialValues,
      academicSession: { enrollmentStats: "Full Time" },
      languagePrefs: { second: [], third: [], valueEd: [], leftHanded: false },
      medicalInfo: "",
      healthRisk: "Low", // Added default value for healthRisk
      addressInformation: { transportRequired: true },
      fatherInfo: {},
      motherInfo: {},
      guardianInformation: {},
      candidateInformation: {},
      academicHistory: {},
    }),
    [attachmentsInitialValues]
  );

  const [submitting, setSubmitting] = useState(false);

  const validateMandatoryAttachments = useCallback((values) => {
    const missing = [];
    // profile
    if (!values.profile) missing.push("Profile Picture");
    // dynamic mandatory attachments
    console.log(values.attachments, "values.attachmentsvalues.attachments");
    if (values.attachments?.mandatory) {
      Object.entries(values.attachments.mandatory).forEach(([key, val]) => {
        if (!val?.url) missing.push(key);
      });
    }
    return missing;
  }, []);

  const handleFinish = async (values) => {
    setSubmitting(true);
    try {
      // Validate mandatory attachments
      const missing = validateMandatoryAttachments(values);
      if (missing.length) {
        message.error(`Please upload: ${missing.join(", ")}`);
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("profile", values.profile);
      formData.append("firstName", values.candidateInformation.firstName);
      formData.append("lastName", values.candidateInformation.lastName);
      formData.append("email", values.candidateInformation.email.toLowerCase());
      formData.append("dateOfBirth", values.candidateInformation.dob);
      formData.append("placeOfBirth", values.candidateInformation.placeOfBirth);
      formData.append("gender", values.candidateInformation.gender);
      formData.append(
        "contactNumber",
        values.candidateInformation.contactNumber
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

      // Add address information to formData
      const addressFields = [
        // "unitNumber",
        "buildingNumber",
        // "streetNumber",
        "streetName",
        // "zone",
        // "compoundName",
        "city",
        // "nearestLandmark",
        // "proposedCampus",
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

      const fatherInfoFields = [
        "idNumber",
        "idExpiry",
        "firstName",
        "middleName ",
        "lastName",
        "religion",
        "nationality",
        "company",
        "jobTitle ",
        "cell1",
        "cell2",
        "workPhone",
        "homePhone",
        "email1",
        "email2",
      ];

      fatherInfoFields.forEach((field) => {
        if (values.fatherPhoto) {
          formData.append(`fatherInfo[photo]`, values.fatherPhoto || "");
        }
        if (field === "cell1" || field === "cell2") {
          formData.append(
            `fatherInfo[${field}]`,
            values.fatherInfo[field]?.value || ""
          );
        } else {
          formData.append(
            `fatherInfo[${field}]`,
            values.fatherInfo[field] || ""
          );
        }
      });

      const motherInfoFields = [
        "idNumber",
        "idExpiry",
        "firstName",
        "middleName ",
        "lastName",
        "religion",
        "nationality",
        "company",
        "jobTitle ",
        "cell1",
        "cell2",
        "workPhone",
        "homePhone",
        "email1",
        "email2",
      ];

      motherInfoFields.forEach((field) => {
        if (values.motherPhoto) {
          formData.append(`motherInfo[photo]`, values.motherPhoto || "");
        }
        if (field === "cell1" || field === "cell2") {
          formData.append(
            `motherInfo[${field}]`,
            values.motherInfo[field]?.value || ""
          );
        } else {
          formData.append(
            `motherInfo[${field}]`,
            values.motherInfo[field] || ""
          );
        }
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
      // Add health risk to formData
      formData.append("healthRisk", values.healthRisk);
      const addDynamicAttachments = (bucket) => {
        Object.values(bucket || {}).forEach((attachment) => {
          if (attachment?.file) {
            formData.append(attachment.fieldName, attachment.file);
            // Include ID if needed
            if (attachment.fieldId) {
              formData.append(`${attachment.fieldName}_id`, attachment.fieldId);
            }
          }
        });
      };
      // Process both mandatory and optional attachments
      addDynamicAttachments(values.attachments?.mandatory);
      addDynamicAttachments(values.attachments?.optional);
      console.log(formData, "formData");

      // Dispatch the register action
      await dispatch(
        registerStudentDetails({
          formData: formData,
          navigate,
        })
      ).unwrap();
    } catch (err) {
      console.error("Registration error:", err);
      message.error(
        err.message || "Registration failed. Please check all required fields."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-md p-4">
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleFinish}
        onValuesChange={(_, allValues) => onFormDataChange(allValues)}
      >
        <AcademicSessionCandidate form={form} />
        <AcademicHistory form={form} />
        <AddressInformation form={form} />
        <ParentGuardianInfo form={form} />
        <AttachmentsUpload form={form} />

        <Form.Item className="mt-6">
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={submitting || regLoading}
            style={{
              background: "linear-gradient(to right, #C83B62, #7F35CD)",
              border: "none",
              color: "#fff",
            }}
          >
            {submitting ? "Saving..." : "Save & Submit"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});

export default AdminAdmissionForm;
