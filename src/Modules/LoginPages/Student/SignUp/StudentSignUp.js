import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaArrowRight } from "react-icons/fa6";
import { Tooltip } from "antd";
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
  updateFormData,
  resetSignup,
  nextStep,
  setCurrentStep,
} from "../../../../Store/Slices/Common/User/actions/studentSignupSlice";

const StudentSignUp = () => {
  const dispatch = useDispatch();
  const { currentStep, formData } = useSelector(
    (state) => state.common.studentSignup
  );
  const navigate = useNavigate();

  const steps = [
    {
      title: "School",
      subtitle: "Select your preferred institution",
      component: (
        <SchoolSelection
          formData={formData.school}
          updateFormData={(data) => dispatch(updateFormData({ school: data }))}
        />
      ),
      tooltip: "Choose the school you want to enroll in",
    },
    {
      title: "Guardian",
      subtitle: "Parent/guardian information",
      component: (
        <GuardianInfo
          formData={formData.guardian}
          updateFormData={(data) =>
            dispatch(updateFormData({ guardian: data }))
          }
        />
      ),
      tooltip: "Provide the parent or guardian details",
    },
    {
      title: "Candidate",
      subtitle: "Student personal details",
      component: (
        <CandidateInfo
          formData={formData.candidate}
          updateFormData={(data) =>
            dispatch(updateFormData({ candidate: data }))
          }
        />
      ),
      tooltip: "Fill in the student's personal information",
    },
    {
      title: "Academic",
      subtitle: "Educational background",
      component: (
        <AcademicHistory
          formData={formData.academic}
          updateFormData={(data) =>
            dispatch(updateFormData({ academic: data }))
          }
        />
      ),
      tooltip: "Provide previous academic details",
    },
    {
      title: "Address",
      subtitle: "Contact information",
      component: (
        <AddressInfo
          formData={formData.address}
          updateFormData={(data) => dispatch(updateFormData({ address: data }))}
        />
      ),
      tooltip: "Add your contact details",
    },
    {
      title: "Documents",
      subtitle: "Upload required files",
      component: (
        <DocumentsUpload
          formData={formData.documents}
          updateFormData={(data) =>
            dispatch(updateFormData({ documents: data }))
          }
        />
      ),
      tooltip: "Upload necessary documents for verification",
    },
    {
      title: "Consent",
      subtitle: "Terms and agreements",
      component: (
        <ConsentAcknowledgement
          formData={formData.consent}
          updateFormData={(data) => dispatch(updateFormData({ consent: data }))}
        />
      ),
      tooltip: "Agree to the terms and conditions",
    },
  ];

  const stepImages = [
    "https://static.vecteezy.com/system/resources/previews/057/454/300/large_2x/beautiful-artistic-modern-university-building-with-clock-tower-transparent-background-professional-png.png",
    "https://static.vecteezy.com/system/resources/thumbnails/057/566/031/small_2x/dramatic-traditional-family-portrait-session-setup-isolated-high-resolution-png.png",
    "https://static.vecteezy.com/system/resources/previews/052/560/690/large_2x/3d-icon-purple-user-profile-with-star-png.png",
    "https://static.vecteezy.com/system/resources/previews/051/222/567/large_2x/3d-checklist-with-icons-task-management-and-organization-png.png",
    "https://static.vecteezy.com/system/resources/previews/057/723/065/large_2x/wonderful-creative-virtual-real-estate-tour-isolated-element-high-resolution-free-png.png",
    "https://static.vecteezy.com/system/resources/previews/045/815/999/large_2x/agreement-contract-document-paperwork-stack-information-note-page-3d-icon-realistic-vector.jpg",
    "https://static.vecteezy.com/system/resources/previews/047/247/933/large_2x/3d-user-account-blue-mark-icon-concept-of-user-verified-icon-illustration-png.png",
  ];

  const handleBack = () => {
    if (currentStep === 0) {
      navigate(-1);
    } else {
      dispatch(prevStep());
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      dispatch(nextStep());
    }
  };

  const handleSubmit = () => {
    console.log("Form Data to Submit:", formData);
    // Here you would typically dispatch an action to submit the form data
    // dispatch(submitStudentApplication(formData));

    // For now, we'll just log it and reset the form
    dispatch(resetSignup());
    navigate("/success"); // Or wherever you want to redirect after submission
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="px-6 py-4 flex items-start justify-between border-b border-gray-200">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
          aria-label={currentStep === 0 ? "Go back" : "Previous step"}
        >
          <FaArrowLeftLong className="w-5 h-5" />
          <span>{currentStep === 0 ? "" : "Previous"}</span>
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            {steps.map((stepItem, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  {/* <Tooltip title={stepItem.tooltip}> */}
                  <button
                    onClick={() => dispatch(setCurrentStep(index))}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
                          ${
                            currentStep > index
                              ? "bg-green-500 text-white"
                              : currentStep === index
                              ? "bg-gradient-to-br from-[#C83B62] to-[#7F35CD] text-white"
                              : "border-2 border-gray-300 text-gray-400"
                          }
                          focus:outline-none focus:ring-2 focus:ring-pink-300`}
                    aria-label={`Go to ${stepItem.title} step`}
                  >
                    {currentStep > index ? (
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
                      index + 1
                    )}
                  </button>
                  {/* </Tooltip> */}
                  <span
                    className={`text-xs mt-0.5 ${
                      currentStep > index
                        ? "text-green-500"
                        : currentStep === index
                        ? "text-gradient-to-br from-[#C83B62] to-[#7F35CD]"
                        : " text-gray-400"
                    }`}
                  >
                    {stepItem.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 ${
                      currentStep > index ? "bg-green-500" : "bg-gray-200"
                    }`}
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {currentStep < steps.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-gradient-to-br from-[#C83B62] to-[#7F35CD] text-white px-6 py-2 rounded-lg shadow hover:from-[#C83B62] hover:to-[#7F35CD] transition-all focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
            aria-label="Next step"
          >
            <span>Next</span>
            <FaArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-br from-[#C83B62] to-[#7F35CD] text-white px-6 py-2 rounded-lg shadow hover:from-[#C83B62] hover:to-[#7F35CD] transition-all focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
            aria-label="Submit application"
          >
            Submit
          </button>
        )}
      </nav>

      {/* Main Content */}
      <main
        className={`flex flex-1 overflow-hidden ${
          // Swap the order of the columns when the current step is odd
          currentStep % 2 === 1 ? "flex-row-reverse" : ""
        }`}
      >
        {/* Form Column */}
        <motion.div
          key={`form-${currentStep}`}
          className="w-[70%] p-5 overflow-y-auto no-scrollbar"
          initial={{ x: currentStep % 2 === 0 ? -50 : 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-2xl mx-auto">
            {/* The header (step title/subtitle) is now removed from here */}
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
              // className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
            >
              {steps[currentStep].component}
            </motion.div>
          </div>
        </motion.div>

        {/* Image Column */}
        <motion.div
          key={`image-${currentStep}`}
          className="w-[30%] flex flex-col items-center justify-center p-4 border-x  border-gray-200"
          initial={{ x: currentStep % 2 === 0 ? 50 : -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            {/* Moved header (step title and subtitle) to the image side */}
            {/* <motion.div
              key={`header-${currentStep}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className=" flex-col flex items-start justify-start"
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {steps[currentStep].title}
              </h1>
              <p className="text-gray-500 text-sm">
                {steps[currentStep].subtitle}
              </p>
            </motion.div> */}

            <div className="relative w-full max-w-xs h-64 rounded-lg flex items-center justify-center mb-6 overflow-hidden">
              <motion.img
                key={currentStep}
                src={stepImages[currentStep]}
                alt={`Illustration for ${steps[currentStep].title} step`}
                className="absolute inset-0 w-full h-full object-contain p-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "flex";
                }}
              />
            </div>
            <div className="flex flex-col justify-start items-start ">
              <h3 className="text-lg font-medium mb-1">
                {currentStep === 0 && "Find the perfect school"}
                {currentStep === 1 && "Guardian details"}
                {currentStep === 2 && "About the student"}
                {currentStep === 3 && "Education history"}
                {currentStep === 4 && "Contact information"}
                {currentStep === 5 && "Required documents"}
                {currentStep === 6 && "Final review"}
              </h3>
              <p className="text-sm">
                {currentStep === 0 &&
                  "Browse our network of accredited institutions"}
                {currentStep === 1 &&
                  "We need contact information for emergencies"}
                {currentStep === 2 && "Tell us about the applicant"}
                {currentStep === 3 && "Previous schools and achievements"}
                {currentStep === 4 && "Where we can reach you"}
                {currentStep === 5 && "Upload scans or photos of documents"}
                {currentStep === 6 &&
                  "Review your information before submitting"}
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default StudentSignUp;
