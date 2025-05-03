// src/pages/StudentSignUp/StudentSignUp.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaArrowRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";

import SchoolSelection from "./Steps/SchoolSelection";
import GuardianInfo from "./Steps/GuardianInfo";
import AcademicHistory from "./Steps/AcademicHistory";
import AddressInfo from "./Steps/AddressInfo";
import DocumentsUpload from "./Steps/DocumentsUpload";
import ConsentAcknowledgement from "./Steps/ConsentAcknowledgement";
import CandidateInfo from "./Steps/CandidateInfo";

import {
  prevStep,
  nextStep,
  setCurrentStep,
  resetSignup,
  updateFormData,
} from "../../../../Store/Slices/Common/User/actions/studentSignupSlice";

import { clearDraft } from "../../../../Utils/signupDraft";

import { registerStudentDetails } from "../../../../Store/Slices/Common/Auth/actions/studentActions";
import { stepSchemas } from "./Utils/validationSchemas";

/* Derive completion checker directly from Yup schemas */
const stepDoneCheckers = stepSchemas.map(
  (schema) => (data) => schema.isValidSync(data, { strict: false })
);

const StudentSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentStep, formData, isLoading } = useSelector(
    (s) => s.common.studentSignup
  );

  /* Smooth scroll when step changes */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  /* Step definitions */
  const steps = [
    {
      title: "School",
      subtitle: "Select your preferred institution",
      component: (
        <SchoolSelection
          formData={formData.school}
          updateFormData={(d) => dispatch(updateFormData({ school: d }))}
        />
      ),
    },
    {
      title: "Guardian",
      subtitle: "Parent/guardian information",
      component: (
        <GuardianInfo
          formData={formData.guardian}
          updateFormData={(d) => dispatch(updateFormData({ guardian: d }))}
        />
      ),
    },
    {
      title: "Candidate",
      subtitle: "Student personal details",
      component: (
        <CandidateInfo
          formData={formData.candidate}
          updateFormData={(d) => dispatch(updateFormData({ candidate: d }))}
        />
      ),
    },
    {
      title: "Academic",
      subtitle: "Educational background",
      component: (
        <AcademicHistory
          formData={formData.academic}
          updateFormData={(d) => dispatch(updateFormData({ academic: d }))}
        />
      ),
    },
    {
      title: "Address",
      subtitle: "Contact information",
      component: (
        <AddressInfo
          formData={formData.address}
          updateFormData={(d) => dispatch(updateFormData({ address: d }))}
        />
      ),
    },
    {
      title: "Documents",
      subtitle: "Upload required files",
      component: (
        <DocumentsUpload
          formData={formData.documents}
          updateFormData={(d) => dispatch(updateFormData({ documents: d }))}
        />
      ),
    },
    {
      title: "Consent",
      subtitle: "Terms and agreements",
      component: (
        <ConsentAcknowledgement
          formData={formData.consent}
          updateFormData={(d) => dispatch(updateFormData({ consent: d }))}
        />
      ),
    },
  ];

  /* Step completion flag */
  const stepComplete = stepDoneCheckers[currentStep](formData);

  /* Navigation handlers */
  const handleBack = () =>
    currentStep === 0 ? navigate(-1) : dispatch(prevStep());

  const handleNext = () => {
    if (stepComplete && currentStep < steps.length - 1) dispatch(nextStep());
  };

  /* Allow jumping only to completed or current steps */
  const canJumpTo = (idx) => {
    if (idx <= currentStep) return true;
    for (let i = 0; i < idx; i++) {
      if (!stepDoneCheckers[i](formData)) return false;
    }
    return true;
  };

  /* Final Submit */
  const handleSubmit = async () => {
    try {
      const { documents, ...details } = formData;

      await dispatch(registerStudentDetails(details)).unwrap();

      dispatch(resetSignup());
      clearDraft();
      navigate("/studentlogin");
    } catch (err) {
      console.error(err);
    }
  };

  /* Static illustration URLs */
  const stepImages = [
    "https://static.vecteezy.com/system/resources/previews/057/454/300/large_2x/beautiful-artistic-modern-university-building-with-clock-tower-transparent-background-professional-png.png",
    "https://static.vecteezy.com/system/resources/thumbnails/057/566/031/small_2x/dramatic-traditional-family-portrait-session-setup-isolated-high-resolution-png.png",
    "https://static.vecteezy.com/system/resources/previews/052/560/690/large_2x/3d-icon-purple-user-profile-with-star-png.png",
    "https://static.vecteezy.com/system/resources/previews/051/222/567/large_2x/3d-checklist-with-icons-task-management-and-organization-png.png",
    "https://static.vecteezy.com/system/resources/previews/057/723/065/large_2x/wonderful-creative-virtual-real-estate-tour-isolated-element-high-resolution-free-png.png",
    "https://static.vecteezy.com/system/resources/previews/045/815/999/large_2x/agreement-contract-document-paperwork-stack-information-note-page-3d-icon-realistic-vector.jpg",
    "https://static.vecteezy.com/system/resources/previews/047/247/933/large_2x/3d-user-account-blue-mark-icon-concept-of-user-verified-icon-illustration-png.png",
  ];

  /* ------------ UI (unchanged styling) ------------ */
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Navigation bar */}
      <nav className="px-6 py-4 flex items-start justify-between border-b border-gray-200">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
        >
          <FaArrowLeftLong className="w-5 h-5" />
          <span>{currentStep === 0 ? "" : "Previous"}</span>
        </button>

        {/* Step header pills */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => canJumpTo(i) && dispatch(setCurrentStep(i))}
                    disabled={!canJumpTo(i)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      currentStep > i
                        ? "bg-green-500 text-white"
                        : currentStep === i
                        ? "bg-gradient-to-br from-[#C83B62] to-[#7F35CD] text-white"
                        : "border-2 border-gray-300 text-gray-400"
                    } ${!canJumpTo(i) && "opacity-50 cursor-not-allowed"}`}
                  >
                    {currentStep > i ? (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </button>
                  <span
                    className={`text-xs mt-0.5 ${
                      currentStep > i
                        ? "text-green-500"
                        : currentStep === i
                        ? "text-gradient-to-br from-[#C83B62] to-[#7F35CD]"
                        : "text-gray-400"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 ${
                      currentStep > i ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Next / Submit */}
        {currentStep < steps.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={!stepComplete || isLoading}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 ${
              stepComplete
                ? "bg-gradient-to-br from-[#C83B62] to-[#7F35CD] text-white hover:opacity-90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <span>Next</span>
            <FaArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!stepComplete || isLoading}
            className={`px-6 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 ${
              stepComplete
                ? "bg-gradient-to-br from-[#C83B62] to-[#7F35CD] text-white hover:opacity-90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Saving…" : "Submit"}
          </button>
        )}
      </nav>

      {/* Main content */}
      <main
        className={`flex flex-1 overflow-hidden ${
          currentStep % 2 === 1 ? "flex-row-reverse" : ""
        }`}
      >
        {/* Form column */}
        <motion.div
          key={`form-${currentStep}`}
          className="w-[70%] p-5 overflow-y-auto no-scrollbar"
          initial={{ x: currentStep % 2 === 0 ? -50 : 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-2xl mx-auto">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {steps[currentStep].title}
              </h1>
              <p className="text-gray-500">{steps[currentStep].subtitle}</p>
            </div>

            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {steps[currentStep].component}
            </motion.div>
          </div>
        </motion.div>

        {/* Illustration column */}
        <motion.div
          key={`image-${currentStep}`}
          className="w-[30%] flex flex-col items-center justify-center p-4 border-x border-gray-200"
          initial={{ x: currentStep % 2 === 0 ? 50 : -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-full max-w-xs h-64 rounded-lg flex items-center justify-center mb-6 overflow-hidden">
            <motion.img
              key={currentStep}
              src={stepImages[currentStep]}
              alt={`Illustration for ${steps[currentStep].title} step`}
              className="absolute inset-0 w-full h-full object-contain p-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>

          <div className="flex flex-col items-start">
            <h3 className="text-lg font-medium mb-1">
              {
                [
                  "Find the perfect school",
                  "Guardian details",
                  "About the student",
                  "Education history",
                  "Contact information",
                  "Required documents",
                  "Final review",
                ][currentStep]
              }
            </h3>
            <p className="text-sm">
              {
                [
                  "Browse our network of accredited institutions",
                  "We need contact information for emergencies",
                  "Tell us about the applicant",
                  "Previous schools and achievements",
                  "Where we can reach you",
                  "Upload scans or photos of documents",
                  "Review your information before submitting",
                ][currentStep]
              }
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default StudentSignUp;
