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
    console.log(values.attachments,"values.attachmentsvalues.attachments")
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

      // Prepare the data object to send
      const payload = {
        ...values,
        // Ensure we only send URLs, not file objects
        profile: values.profile?.url,
        attachments: {
          mandatory: Object.fromEntries(
            Object.entries(values.attachments?.mandatory || {}).map(
              ([key, val]) => [key, val?.url]
            )
          ),
          optional: Object.fromEntries(
            Object.entries(values.attachments?.optional || {}).map(
              ([key, val]) => [key, val?.url]
            )
          ),
        },
        schoolId, // Add schoolId from Redux
      };

      console.log("Sending payload:", payload);

      // Dispatch the register action
      await dispatch(
        registerStudentDetails({
          formData: payload,
          navigate,
        })
      ).unwrap();

      toast.success("Registration successful");
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
