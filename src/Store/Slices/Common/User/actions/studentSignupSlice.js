// src/pages/StudentSignUp/StudentSignUp.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaArrowRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";

import SchoolSelection from "./Steps/SchoolSelection";
import GuardianInfo from "./Steps/GuardianInfo";
import CandidateInfo from "./Steps/CandidateInfo";
import AcademicHistory from "./Steps/AcademicHistory";
import AddressInfo from "./Steps/AddressInfo";
import DocumentsUpload from "./Steps/DocumentsUpload";
import ConsentAcknowledgement from "./Steps/ConsentAcknowledgement";

import {
  prevStep,
  nextStep,
  setCurrentStep,
  resetSignup,
  updateFormData,
  saveStudentDraft,
  fetchStudentDraft,
} from "../../../../Store/Slices/Common/User/actions/studentSignupSlice";
import { registerStudentDetails } from "../../../../Store/Slices/Common/User/actions/studentSignupSlice";

import { stepSchemas } from "./Utils/validationSchemas";

/* build an “is‑done” checker for each step with Yup */

/* -------- helpers -------- */
const cacheKey = "signupStep1";
const loadCache = () => JSON.parse(sessionStorage.getItem(cacheKey) || "{}");

/* quick “is‑done” checker array ―― keeps code outside component */
const stepDoneCheckers = stepSchemas.map(
  (schema) => (data) => schema.isValidSync(data, { strict: false })
);

const StudentSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    currentStep,
    formData,
    isRegistering: isLoading,
  } = useSelector((s) => s.common.studentSignup);

  /* auto scroll on step change */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  /* hydrate draft after verified email reload */

  useEffect(() => {
    const { isVerified, email, schoolId } = loadCache();
    if (isVerified && email && schoolId) {
      dispatch(fetchStudentDraft({ email, schoolId }));
    }
  }, [dispatch]);
  /* persist draft when step changes */
  useEffect(() => {
    if (currentStep > 0) dispatch(saveStudentDraft());
  }, [currentStep, dispatch]);

  useEffect(() => {
    const cached = JSON.parse(sessionStorage.getItem("signupStep1") || "{}");
    const emailVerified = cached.isVerified === true;

    if (emailVerified && cached.email && cached.schoolId) {
      dispatch(
        fetchStudentDraft({ email: cached.email, schoolId: cached.schoolId })
      );
    }
  }, [dispatch]);
  /* ----- step meta ----- */
  const steps = [
    {
      title: "School",
      subtitle: "Select your preferred institution",
      component: <SchoolSelection formData={formData.school} />,
    },
    {
      title: "Guardian",
      subtitle: "Parent / guardian information",
      component: <GuardianInfo formData={formData.guardian} />,
    },
    {
      title: "Candidate",
      subtitle: "Student personal details",
      component: <CandidateInfo formData={formData.candidate} />,
    },
    {
      title: "Academic",
      subtitle: "Educational background",
      component: <AcademicHistory formData={formData.academic} />,
    },
    {
      title: "Address",
      subtitle: "Contact information",
      component: <AddressInfo formData={formData.address} />,
    },
    {
      title: "Documents",
      subtitle: "Upload required files",
      component: <DocumentsUpload formData={formData.documents} />,
    },
    {
      title: "Consent",
      subtitle: "Terms and agreements",
      component: <ConsentAcknowledgement formData={formData.consent} />,
    },
  ];

  const stepComplete = stepDoneCheckers[currentStep](formData);

  /* nav */
  const handleBack = () =>
    currentStep === 0 ? navigate(-1) : dispatch(prevStep());

  const handleNext = () => {
    if (stepComplete && currentStep < steps.length - 1) dispatch(nextStep());
  };

  const handleSubmit = async () => {
    try {
      await dispatch(registerStudentDetails()).unwrap();
      dispatch(resetSignup());
      navigate("/studentlogin");
    } catch (e) {
      console.error(e);
    }
  };

  /* illustratives (unchanged) */
  const stepImages = [
    "https://static.vecteezy.com/system/resources/previews/057/454/300/large_2x/beautiful-artistic-modern-university-building-with-clock-tower-transparent-background-professional-png.png",
    "https://static.vecteezy.com/system/resources/thumbnails/057/566/031/small_2x/dramatic-traditional-family-portrait-session-setup-isolated-high-resolution-png.png",
    "https://static.vecteezy.com/system/resources/previews/052/560/690/large_2x/3d-icon-purple-user-profile-with-star-png.png",
    "https://static.vecteezy.com/system/resources/previews/051/222/567/large_2x/3d-checklist-with-icons-task-management-and-organization-png.png",
    "https://static.vecteezy.com/system/resources/previews/057/723/065/large_2x/wonderful-creative-virtual-real-estate-tour-isolated-element-high-resolution-free-png.png",
    "https://static.vecteezy.com/system/resources/previews/045/815/999/large_2x/agreement-contract-document-paperwork-stack-information-note-page-3d-icon-realistic-vector.jpg",
    "https://static.vecteezy.com/system/resources/previews/047/247/933/large_2x/3d-user-account-blue-mark-icon-concept-of-user-verified-icon-illustration-png.png",
  ];

  /* ---------- UI ---------- */
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* top nav bar */}
      <nav className="px-6 py-4 flex items-start justify-between border-b">
        {/* back */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900
                     px-4 py-2 rounded-lg hover:bg-gray-50"
        >
          <FaArrowLeftLong className="w-5 h-5" />
          <span>{currentStep === 0 ? "Login" : "Previous"}</span>
        </button>

        {/* step pills */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => canJumpTo(i) && dispatch(setCurrentStep(i))}
                    disabled={!canJumpTo(i)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center
                                ${
                                  currentStep > i
                                    ? "bg-green-500 text-white"
                                    : currentStep === i
                                    ? "bg-gradient-to-br from-[#C83B62] to-[#7F35CD] text-white"
                                    : "border-2 border-gray-300 text-gray-400"
                                }
                                ${
                                  !canJumpTo(i) &&
                                  "opacity-50 cursor-not-allowed"
                                }`}
                  >
                    {currentStep > i ? "✔" : i + 1}
                  </button>
                  <span
                    className={`text-xs mt-0.5
                        ${
                          currentStep > i
                            ? "text-green-500"
                            : currentStep === i
                            ? "text-purple-600"
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

        {/* next/submit */}
        {currentStep < steps.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={!stepComplete || isLoading}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg shadow
                       ${
                         stepComplete
                           ? "bg-gradient-to-br from-[#C83B62] to-[#7F35CD] text-white"
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
            className={`px-6 py-2 rounded-lg shadow
                       ${
                         stepComplete
                           ? "bg-gradient-to-br from-[#C83B62] to-[#7F35CD] text-white"
                           : "bg-gray-300 text-gray-500 cursor-not-allowed"
                       }`}
          >
            {isLoading ? "Saving…" : "Submit"}
          </button>
        )}
      </nav>

      {/* body */}
      <main
        className={`flex flex-1 overflow-hidden
                       ${currentStep % 2 === 1 ? "flex-row-reverse" : ""}`}
      >
        {/* form column */}
        <motion.div
          key={`form-${currentStep}`}
          className="w-[70%] p-5 overflow-y-auto no-scrollbar"
          initial={{ x: currentStep % 2 === 0 ? -50 : 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-1">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-500 mb-4">{steps[currentStep].subtitle}</p>
            {steps[currentStep].component}
          </div>
        </motion.div>

        {/* image column */}
        <motion.div
          key={`image-${currentStep}`}
          className="w-[30%] flex flex-col items-center justify-center p-4 border-x"
          initial={{ x: currentStep % 2 === 0 ? 50 : -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-full max-w-xs h-64 mb-6">
            <motion.img
              src={stepImages[currentStep]}
              alt={`Illustration ${steps[currentStep].title}`}
              className="absolute inset-0 w-full h-full object-contain p-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          </div>
          {/* caption */}
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

  /* helpers */
  function canJumpTo(idx) {
    if (idx <= currentStep) return true;
    for (let i = 0; i < idx; i++) {
      if (!stepDoneCheckers[i](formData)) return false;
    }
    return true;
  }
};

export default StudentSignUp;
