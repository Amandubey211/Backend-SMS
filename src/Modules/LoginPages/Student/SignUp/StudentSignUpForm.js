// StudentSignUpForm.js

import React, { useRef, useState } from "react";
import Logo from "../../../../Components/Common/Logo";
import PersonalInformationForm from "./PersonalInformationForm";
import AddressForm from "./AddressForm";
import DocumentUploadForm from "./DocumentUploadForm";
import NavigationLink from "./NavigationLink";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  registerStudentDetails,
  uploadStudentDocuments,
} from "../../../../Store/Slices/Common/Auth/actions/studentActions";
import { setStep } from "../../../../Store/Slices/Common/User/reducers/userSlice";
import validateStudentDetails from "../../../../Validataions/Student/validateStudentDetails";
import { toast } from "react-hot-toast";

const StudentSignUpForm = () => {
  const fileInputRef = useRef(null);
  const [studentDetails, setStudentDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    placeOfBirth: "",
    age: "",
    gender: "",
    religion: "",
    contactNumber: "",
    motherName: "",
    fatherName: "",
    guardianName: "",
    guardianRelationToStudent: "",
    guardianEmail: "",
    guardianContactNumber: "",
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
    emergencyNumber: "",
    schoolId: "",
    profile: "", // Ensure this is present
    enrollmentStatus: "",
    transportRequirement: "",
    applyingClass: "",
  });

  const [studentDocuments, setStudentDocuments] = useState({
    documentLabels: [""],
    documents: [],
    schoolId: studentDetails.schoolId,
    email: studentDetails.email,
  });

  const step = useSelector((store) => store.common.user.step);
  const dispatch = useDispatch();
  const [sameAddress, setSameAddress] = useState(false);
  const [preview, setPreview] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.common.auth);
  const [validationErrors, setValidationErrors] = useState({});

  // Refs for input fields
  const inputRefs = useRef({});

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setStudentDetails((prev) => {
      let updatedDetails = { ...prev, [name]: value };

      if (name === "dateOfBirth") {
        const age = calculateAge(value);
        updatedDetails.age = age;
      }

      return updatedDetails;
    });

    // Remove the validation error if this field is corrected
    if (validationErrors[name]) {
      setValidationErrors({});
    }
  };

  const handleAddressChange = (e, type) => {
    const { name, value } = e.target;

    setStudentDetails((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [name]: value,
      },
    }));

    // Remove the validation error if this address field is corrected
    if (validationErrors[type] && validationErrors[type][name]) {
      setValidationErrors({});
    }
  };

  const handleSameAddressChange = (e) => {
    setSameAddress(e.target.checked);
    if (e.target.checked) {
      setStudentDetails((prev) => ({
        ...prev,
        residentialAddress: { ...prev.permanentAddress },
      }));
      // Remove validation errors for residentialAddress
      if (validationErrors.residentialAddress) {
        setValidationErrors({});
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // Update studentDetails.profile
        setStudentDetails((prev) => ({
          ...prev,
          profile: file,
        }));
        // Remove validation error for profile
        if (validationErrors.profile) {
          setValidationErrors({});
        }
      };
      reader.readAsDataURL(file);
    } else {
      setValidationErrors({
        profile: "Please upload a valid image file.",
      });
    }
  };

  // Helper function to get the first error field
  function getFirstErrorField(errors) {
    for (const key in errors) {
      if (typeof errors[key] === "object" && errors[key] !== null) {
        const nestedKey = getFirstErrorField(errors[key]);
        return `${key}_${nestedKey}`;
      } else {
        return key;
      }
    }
  }

  // Helper function to set only the first error in validationErrors
  function setFirstError(obj, errors, pathArray) {
    const key = pathArray[0];
    if (pathArray.length === 1) {
      obj[key] = errors[key];
    } else {
      obj[key] = {};
      setFirstError(obj[key], errors[key], pathArray.slice(1));
    }
  }

  const handleNext = async (e) => {
    e.preventDefault();
    console.log("hdh");
    const errors = validateStudentDetails(studentDetails);

    if (Object.keys(errors).length > 0) {
      // Get the first error field, including nested fields
      const firstErrorField = getFirstErrorField(errors);

      // Construct validationErrors object with only the first error
      let firstError = {};
      setFirstError(firstError, errors, firstErrorField.split("_"));
      console.log(firstErrorField, firstError, "lll");
      setValidationErrors(firstError);

      // Focus on the first invalid input
      if (inputRefs.current[firstErrorField]) {
        inputRefs.current[firstErrorField].focus();
      }

      return;
    } else {
      setValidationErrors({});
    }

    dispatch(setStep(2));
  };

  const handleDocumentSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Exclude the age field before appending other fields
      const { age, ...detailsWithoutAge } = studentDetails;

      for (const key in detailsWithoutAge) {
        if (detailsWithoutAge.hasOwnProperty(key)) {
          if (key === "permanentAddress" || key === "residentialAddress") {
            const address = detailsWithoutAge[key];
            for (const field in address) {
              if (address.hasOwnProperty(field)) {
                formData.append(`${key}.${field}`, address[field]);
              }
            }
          } else if (key === "profile") {
            formData.append("profile", detailsWithoutAge.profile);
          } else {
            formData.append(key, detailsWithoutAge[key]);
          }
        }
      }
      console.log(formData, "oooooooooooo");

      // Dispatch the registerStudentDetails Thunk
      const resultAction = await dispatch(registerStudentDetails(formData));

      if (registerStudentDetails.fulfilled.match(resultAction)) {
        // Student details saved successfully, now upload documents
        const docUploadData = {
          email: studentDetails.email,
          schoolId: studentDetails.schoolId,
          studentDocuments,
        };

        const docResultAction = await dispatch(
          uploadStudentDocuments(docUploadData)
        );

        if (uploadStudentDocuments.fulfilled.match(docResultAction)) {
          // Documents uploaded successfully
          toast.success(
            "Registration Successful! Please wait for verification."
          );

          // Optionally navigate or reset form
          dispatch(setStep(1));
          navigate("/studentlogin");
        } else {
          // Handle document upload error
          const errorMessage =
            docResultAction.payload ||
            "Document upload failed. Please try again.";
          toast.error(errorMessage);
        }
      } else {
        // Handle student details save error
        const errorMessage =
          resultAction.payload || "Registration failed. Please try again.";
        toast.error(errorMessage);
      }
    } catch (error) {
      // Network error or unexpected error
      console.error("Error in submitting documents:", error);
      toast.error(
        "Network error occurred. Please check your connection and try again."
      );
    }
  };

  const handleFileUploadIconClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + studentDocuments.documents.length > 3) {
      setValidationErrors({
        documents: "You can upload a maximum of 3 documents.",
      });
      return;
    }

    const updatedDocuments = [...studentDocuments.documents];
    const updatedPreviews = [...preview];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedDocuments.push({ file, label: "" });
        updatedPreviews.push(reader.result);
        setStudentDocuments((prevState) => ({
          ...prevState,
          documents: updatedDocuments,
        }));
        setPreview(updatedPreviews);
      };
      reader.readAsDataURL(file);
    });

    // Remove validation error for documents if any
    if (validationErrors.documents) {
      setValidationErrors({});
    }
  };

  const handleClearPhoto = () => {
    setStudentDocuments((prevState) => ({
      ...prevState,
      documents: [],
    }));
    setPreview([]);
    fileInputRef.current.value = "";
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 right-0 p-6">
        <Logo />
      </div>
      <div className="flex justify-center w-full h-full">
        <div className="bg-white p-8 rounded-lg w-full max-w-3xl">
          <NavigationLink />
          {step === 1 && (
            <form onSubmit={handleNext}>
              <PersonalInformationForm
                studentDetails={studentDetails}
                handleChange={handleChange}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                handleImageChange={handleImageChange}
                validationErrors={validationErrors}
                inputRefs={inputRefs}
              />

              <AddressForm
                type="Permanent Address"
                address={studentDetails.permanentAddress}
                handleAddressChange={(e) =>
                  handleAddressChange(e, "permanentAddress")
                }
                validationErrors={validationErrors.permanentAddress || {}}
                inputRefs={inputRefs}
                prefix="permanentAddress_"
              />

              <div className="mb-4 mt-2">
                <input
                  type="checkbox"
                  checked={sameAddress}
                  onChange={handleSameAddressChange}
                  className="mr-2"
                />
                <label className="text-sm">
                  Residential Address is the same as Permanent Address
                </label>
              </div>
              {!sameAddress && (
                <AddressForm
                  type="Residential Address"
                  address={studentDetails.residentialAddress}
                  handleAddressChange={(e) =>
                    handleAddressChange(e, "residentialAddress")
                  }
                  validationErrors={validationErrors.residentialAddress || {}}
                  inputRefs={inputRefs}
                  prefix="residentialAddress_"
                />
              )}
              {validationErrors.form && (
                <div className="text-red-500 text-center mb-4">
                  {validationErrors.form}
                </div>
              )}
              <div className="flex items-center justify-center mt-4">
                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 text-center`}
                  disabled={loading}
                >
                  {loading ? "Saving Please Wait..." : "Next"}
                </button>
              </div>
            </form>
          )}
          {step === 2 && (
            <DocumentUploadForm
              studentDocuments={studentDocuments}
              handleChange={handleChange}
              handleFileUploadIconClick={handleFileUploadIconClick}
              handlePhotoChange={handlePhotoChange}
              handleClearPhoto={handleClearPhoto}
              preview={preview}
              setPreview={setPreview}
              setStudentDocuments={setStudentDocuments}
              fileInputRef={fileInputRef}
              handleDocumentSubmit={handleDocumentSubmit}
              loading={loading}
              validationErrors={validationErrors}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentSignUpForm;
