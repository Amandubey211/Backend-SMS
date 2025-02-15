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

    // Remove the validation error for this field if it exists
    if (validationErrors[name]) {
      setValidationErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
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

    // Remove the validation error for this address field if it exists
    if (validationErrors[type] && validationErrors[type][name]) {
      setValidationErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        if (newErrors[type]) {
          const addressErrors = { ...newErrors[type] };
          delete addressErrors[name];
          if (Object.keys(addressErrors)?.length === 0) {
            delete newErrors[type];
          } else {
            newErrors[type] = addressErrors;
          }
        }
        return newErrors;
      });
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

  // Recursive helper to build the ref key for the first error field.
  const getFirstErrorField = (errors, prefix = "") => {
    for (const key in errors) {
      if (typeof errors[key] === "object" && errors[key] !== null) {
        const nestedField = getFirstErrorField(errors[key], `${prefix}${key}_`);
        if (nestedField) return nestedField;
      } else {
        return `${prefix}${key}`;
      }
    }
    return "";
  };

  const handleNext = async (e) => {
    e.preventDefault();

    const errors = validateStudentDetails(studentDetails, "student");

    if (Object.keys(errors)?.length > 0) {
      setValidationErrors(errors);

      const firstErrorField = getFirstErrorField(errors);

      // Delay to allow the error state to update and then scroll smoothly into view
      setTimeout(() => {
        if (firstErrorField && inputRefs.current[firstErrorField]) {
          inputRefs.current[firstErrorField].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          inputRefs.current[firstErrorField].focus();
        }
      }, 0);
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

      // Remove age from details before adding to formData, as it's calculated
      const { age, ...detailsWithoutAge } = studentDetails;

      // Append student details with bracket notation for nested fields
      for (const [key, value] of Object.entries(detailsWithoutAge)) {
        if (typeof value === "object" && value !== null) {
          for (const [subKey, subValue] of Object.entries(value)) {
            formData.append(`${key}[${subKey}]`, subValue);
          }
        } else {
          formData.append(key, value);
        }
      }

      // Append profile image if it exists
      if (detailsWithoutAge.profile) {
        formData.append("profile", detailsWithoutAge.profile);
      }

      // Dispatch the registerStudentDetails Thunk
      const resultAction = await dispatch(registerStudentDetails(formData));

      if (registerStudentDetails.fulfilled.match(resultAction)) {
        // If there are no documents, skip document upload
        if (studentDocuments.documents?.length === 0) {
          toast.success(
            "Registration Successful! Please wait for verification."
          );
          dispatch(setStep(1));
          navigate("/studentlogin");
          return;
        }

        // If there are documents, proceed with uploading them
        const docUploadData = {
          email: studentDetails.email,
          schoolId: studentDetails.schoolId,
          studentDocuments,
        };

        const docResultAction = await dispatch(
          uploadStudentDocuments(docUploadData)
        );

        if (uploadStudentDocuments.fulfilled.match(docResultAction)) {
          toast.success(
            "Registration Successful! Please wait for verification."
          );
          dispatch(setStep(1));
          navigate("/studentlogin");
        } else {
          const errorMessage =
            docResultAction.payload ||
            "Document upload failed. Please try again.";
          toast.error(errorMessage);
        }
      } else {
        const errorMessage =
          resultAction.payload || "Registration failed. Please try again.";
        toast.error(errorMessage);
      }
    } catch (error) {
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
    if (files?.length + studentDocuments.documents?.length > 3) {
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
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 text-center"
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
