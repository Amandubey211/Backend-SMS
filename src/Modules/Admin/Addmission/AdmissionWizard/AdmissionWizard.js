import React, { useState, useRef } from "react";
import { Formik, Form } from "formik";
import { Steps, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { studentAdmissionValidationSchema } from "./validationSchemas"; // Yup schemas
import PersonalInfoStep from "./Steps/PersonalInfoStep";
import AddressInfoStep from "./Steps/AddressInfoStep";
import AdmissionInfoStep from "./Steps/AdmissionInfoStep";
import ParentInfoStep from "./Steps/ParentInfoStep";
import DocumentsStep from "./Steps/DocumentsStep";
import ConfirmStep from "./Steps/ConfirmStep";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  registerStudentDetails,
  uploadStudentDocuments,
} from "../../../../Store/Slices/Common/Auth/actions/studentActions";

const { Step } = Steps;

const STEP_TITLES = [
  "Personal Info",
  "Address Info",
  "Admission Info",
  "Parent Info",
  "Documents",
  "Confirm",
];

const AdmissionWizard = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("admAdmission");
  const { loading } = useSelector((store) => store.common.auth);
  const schoolId = useSelector(
    (store) => store.common.user.userDetails?.schoolId
  );

  // Steps control
  const [currentStep, setCurrentStep] = useState(0);

  // We store a ref for each step container for potential error scrolling
  const stepRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Initial form values
  const initialValues = {
    // Personal Info
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    religion: "",
    bloodGroup: "",
    age: "",
    placeOfBirth: "",

    // Address Info
    contactNumber: "",
    emergencyNumber: "",
    email: "",
    Q_Id: "",
    permanentAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    residentialAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    transportRequirement: false,

    // Admission Info
    applyingClass: "",
    enrollmentStatus: "",

    // Parent Info
    fatherName: "",
    motherName: "",
    guardianName: "",
    guardianRelationToStudent: "",
    guardianContactNumber: "",
    guardianEmail: "",

    // Documents
    documents: [], // For uploading
    documentLabels: [],
    profile: null, // Profile Image
    // ...any additional fields
  };

  // For multi-file document preview
  const [previewURLs, setPreviewURLs] = useState([]);

  // onSubmit: calls your Redux thunks
  const handleSubmitAll = async (values, actions) => {
    // Final full form submission
    // 1) Build formData for register
    const formData = new FormData();

    // Flatten fields:
    Object.entries(values).forEach(([key, val]) => {
      // For nested objects, do a nested approach
      if (typeof val === "object" && val !== null && !Array.isArray(val)) {
        // e.g. permanentAddress or residentialAddress
        Object.entries(val).forEach(([subKey, subVal]) => {
          formData.append(`${key}[${subKey}]`, subVal);
        });
      } else if (key === "profile" && val) {
        // profile image
        formData.append("profile", val);
      } else if (Array.isArray(val)) {
        // in case of array fields
        // do nothing here; we'll handle documents array separately
      } else {
        formData.append(key, val);
      }
    });
    formData.append("schoolId", schoolId);

    try {
      // Dispatch register student details
      const registerAction = await dispatch(registerStudentDetails(formData));
      if (registerStudentDetails.fulfilled.match(registerAction)) {
        // If success, then dispatch documents if any
        if (values.documents.length > 0) {
          const docPayload = {
            email: values.email,
            schoolId: schoolId,
            studentDocuments: {
              documents: values.documents.map((file, idx) => ({
                file,
                label: values.documentLabels[idx] || "",
              })),
            },
          };
          await dispatch(uploadStudentDocuments(docPayload));
        }
        toast.success(t("Student Registered Successfully!"));
        actions.resetForm();
        setCurrentStep(0);
      } else {
        toast.error(t("Failed to register student."));
      }
    } catch (error) {
      toast.error(t("An error occurred during submission."));
    }
  };

  // Handler for next step
  const handleNext = async (values, actions) => {
    // We validate current step only
    const currentStepValidation = await actions.validateForm();
    const stepErrors = Object.keys(currentStepValidation);

    if (stepErrors.length === 0) {
      // Move to next step
      setCurrentStep((prev) => prev + 1);
    } else {
      // Scroll to the first error in the current step
      if (stepRefs[currentStep].current) {
        stepRefs[currentStep].current.scrollIntoView({ behavior: "smooth" });
      }
      toast.error(t("Please correct the errors in this step first."));
    }
  };

  // Handler for previous step
  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const steps = [
    {
      title: t(STEP_TITLES[0]),
      content: <PersonalInfoStep stepRef={stepRefs[0]} />,
    },
    {
      title: t(STEP_TITLES[1]),
      content: <AddressInfoStep stepRef={stepRefs[1]} />,
    },
    {
      title: t(STEP_TITLES[2]),
      content: <AdmissionInfoStep stepRef={stepRefs[2]} />,
    },
    {
      title: t(STEP_TITLES[3]),
      content: <ParentInfoStep stepRef={stepRefs[3]} />,
    },
    {
      title: t(STEP_TITLES[4]),
      content: (
        <DocumentsStep
          stepRef={stepRefs[4]}
          previewURLs={previewURLs}
          setPreviewURLs={setPreviewURLs}
        />
      ),
    },
    {
      title: t(STEP_TITLES[5]),
      content: <ConfirmStep stepRef={stepRefs[5]} />,
    },
  ];

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <Formik
        initialValues={initialValues}
        validationSchema={studentAdmissionValidationSchema(currentStep)}
        onSubmit={handleSubmitAll}
        validateOnMount
      >
        {(formikProps) => {
          const { handleSubmit } = formikProps;

          return (
            <Form>
              <div className="mb-4">
                <Steps current={currentStep}>
                  {steps.map((item) => (
                    <Step key={item.title} title={item.title} />
                  ))}
                </Steps>
              </div>

              <div className="mt-4">{steps[currentStep].content}</div>

              <div className="flex justify-end gap-2 mt-6">
                {currentStep > 0 && (
                  <Button onClick={handlePrev}>{t("Previous")}</Button>
                )}

                {currentStep < steps.length - 1 && (
                  <Button
                    type="primary"
                    onClick={() => handleNext(formikProps.values, formikProps)}
                  >
                    {t("Next")}
                  </Button>
                )}

                {currentStep === steps.length - 1 && (
                  <Button
                    loading={loading}
                    type="primary"
                    onClick={() => handleSubmit()}
                  >
                    {t("Submit All")}
                  </Button>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AdmissionWizard;
