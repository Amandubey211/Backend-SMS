// src/pages/StudentSignUp/StudentSignUp.jsx
import React, { useEffect, useMemo } from "react";
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
import LanguageAndPreference from "./Steps/LanguageAndPreference";

import {
  prevStep,
  nextStep,
  setCurrentStep,
  resetSignup,
  saveStudentDraft,
  fetchStudentDraft,
} from "../../../../Store/Slices/Common/User/actions/studentSignupSlice";
import { registerStudentDetails } from "../../../../Store/Slices/Common/User/actions/studentSignupSlice";

import { stepSchemas } from "./Utils/validationSchemas";
import { message } from "antd";
import { stepMeta } from "./Configs/studentSignup.config";
import useGetAllSchools from "../../../../Hooks/CommonHooks/useGetAllSchool";

/* -------- helpers -------- */
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
    const cached = JSON.parse(sessionStorage.getItem("signupStep1") || "{}");
    const { isVerified, email, schoolId } = cached;
    if (isVerified && email && schoolId) {
      dispatch(fetchStudentDraft({ email, schoolId }))
        .unwrap()
        .then(
          (res) => res?.exists && message.success("Resuming your application…")
        );
    }
  }, [dispatch]);

  /* persist draft on step change */
  useEffect(() => {
    if (currentStep > 0) dispatch(saveStudentDraft());
  }, [currentStep, dispatch]);

  /* ---------- step map ---------- */
  const steps = useMemo(
    () => [
      {
        ...stepMeta[0],
        component: <SchoolSelection formData={formData.school} />,
      },
      {
        ...stepMeta[1],
        component: <CandidateInfo formData={formData.candidate} />,
      },
      {
        ...stepMeta[2],
        component: <GuardianInfo formData={formData.guardian} />,
      },
      {
        ...stepMeta[3],
        component: (
          <LanguageAndPreference formData={formData.languagePreference} />
        ),
      },
      {
        ...stepMeta[4],
        component: <AcademicHistory formData={formData.academic} />,
      },
      {
        ...stepMeta[5],
        component: <AddressInfo formData={formData.address} />,
      },
      {
        ...stepMeta[6],
        component: <DocumentsUpload formData={formData.documents} />,
      },
      {
        ...stepMeta[7],
        component: <ConsentAcknowledgement formData={formData.consent} />,
      },
    ],
    [formData]
  );

  const stepComplete = stepDoneCheckers[currentStep](formData);

  /* ---------- nav handlers ---------- */
  const handleBack = () =>
    currentStep === 0 ? navigate(-1) : dispatch(prevStep());

  const handleNext = () => {
    if (stepComplete && currentStep < steps.length - 1) dispatch(nextStep());
  };

  const handleSubmit = async () => {
    try {
      await dispatch(registerStudentDetails()).unwrap();
      sessionStorage.removeItem("signupStep1");
      dispatch(resetSignup());
      navigate("/studentlogin");
    } catch (e) {
      console.error(e);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* top nav */}
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
              <React.Fragment key={s.key}>
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
                    className={`w-11 h-0.5 ${
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
        className={`flex flex-1 overflow-hidden ${
          currentStep % 2 === 1 ? "flex-row-reverse" : ""
        }`}
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
              src={steps[currentStep].image}
              alt={`Illustration ${steps[currentStep].title}`}
              className="absolute inset-0 w-full h-full object-contain p-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          </div>
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-medium mb-1">
              {steps[currentStep].captionTitle}
            </h3>
            <p className="text-sm">{steps[currentStep].captionText}</p>
          </div>
        </motion.div>
      </main>
    </div>
  );

  /* ---------- helpers ---------- */
  function canJumpTo(idx) {
    if (idx === 0) return true;
    const cached = JSON.parse(sessionStorage.getItem("signupStep1") || "{}");
    if (!cached.isVerified && idx > 0) return false;
    for (let i = 0; i < idx; i++)
      if (!stepDoneCheckers[i](formData)) return false;
    return true;
  }
};

export default StudentSignUp;
