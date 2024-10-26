import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  registerStudentDetails,
  uploadStudentDocuments,
} from "../../../Store/Slices/Common/Auth/actions/studentActions";
import PersonalInfo from "./Components/PersonalInfo";
import AddressInfo from "./Components/AddressInfo";
import AdmissionInfo from "./Components/AdmissionInfo";
import ParentInfo from "./Components/ParentInfo";
import DocumentUploadForm from "../../LoginPages/Student/SignUp/DocumentUploadForm";
import ImageUpload from "./Components/ImageUpload";
import StudentCard from "./Components/StudentCard";
import validateStudentDetails from "../../../Validataions/Student/validateStudentDetails";

const StudentInfo = () => {
  const dispatch = useDispatch();
  const schoolId = useSelector(
    (store) => store.common.user.userDetails?.schoolId || ""
  );
  const { loading } = useSelector((store) => store.common.auth);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const [studentInfo, setStudentInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    placeOfBirth: "",
    age: "",
    emergencyNumber: "",
    gender: "",
    contactNumber: "",
    bloodGroup: "",
    religion: "",
    motherName: "",
    fatherName: "",
    guardianName: "",
    guardianRelationToStudent: "",
    guardianContactNumber: "",
    guardianEmail: "",
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
    Q_Id: "",
    applyingClass: "",
    enrollmentStatus: "",
    schoolId: schoolId,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [profile, setProfile] = useState(null);
  const [imageError, setImageError] = useState(""); // State for image validation error
  const fileInputRef = useRef(null);

  const [studentDocuments, setStudentDocuments] = useState({
    documentLabels: [""],
    documents: [],
    schoolId: schoolId,
    email: studentInfo.email,
  });
  const [preview, setPreview] = useState([]);

  const inputRefs = {
    firstName: useRef(null),
    lastName: useRef(null),
    email: useRef(null),
    dateOfBirth: useRef(null),
    placeOfBirth: useRef(null),
    emergencyNumber: useRef(null),
    gender: useRef(null),
    contactNumber: useRef(null),
    bloodGroup: useRef(null),
    religion: useRef(null),
    motherName: useRef(null),
    fatherName: useRef(null),
    guardianName: useRef(null),
    guardianRelationToStudent: useRef(null),
    guardianContactNumber: useRef(null),
    guardianEmail: useRef(null),
    applyingClass: useRef(null),
    Q_Id: useRef(null),
    enrollmentStatus: useRef(null),
    transportRequirement: useRef(null),
    permanentAddressStreet: useRef(null),
    permanentAddressCity: useRef(null),
    permanentAddressState: useRef(null),
    permanentAddressPostalCode: useRef(null),
    permanentAddressCountry: useRef(null),
    residentialAddressStreet: useRef(null),
    residentialAddressCity: useRef(null),
    residentialAddressState: useRef(null),
    residentialAddressPostalCode: useRef(null),
    residentialAddressCountry: useRef(null),
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));

    setStudentInfo((prevState) => {
      const keys = name.split(".");
      if (keys.length === 1) {
        return { ...prevState, [name]: value };
      }
      const [parentKey, childKey] = keys;
      return {
        ...prevState,
        [parentKey]: {
          ...prevState[parentKey],
          [childKey]: value,
        },
      };
    });
  };

  const handleClearPhoto = () => {
    setStudentDocuments((prevState) => ({
      ...prevState,
      documents: [],
    }));
    setPreview([]);
    fileInputRef.current.value = "";
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + studentDocuments.documents.length > 3) {
      toast.error("You can upload a maximum of 3 documents.");
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
  };

  const handleValidation = () => {
    const validationErrors = validateStudentDetails(studentInfo);
    setErrors(validationErrors);
    console.log(validationErrors, "pppppp");
    // Check if there is an image error
    if (!profile) {
      setImageError("Profile image is required");
      validationErrors.profile = "Profile image is required";
    } else {
      setImageError("");
    }

    // Identify the first field with an error to scroll into view
    for (const errorKey in validationErrors) {
      const refKey = errorKey.includes(".")
        ? errorKey.split(".").join("")
        : errorKey;

      const ref = inputRefs[refKey]?.current;

      if (ref) {
        ref.scrollIntoView({ behavior: "smooth", block: "center" });
        ref.focus();
        break;
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please correct the errors in the form.");
    }

    return Object.keys(validationErrors).length === 0 && profile;
  };

  const handleDocumentSubmit = async (e) => {
    e.preventDefault();

    if (!handleValidation()) return;

    const formData = new FormData();
    for (const [key, value] of Object.entries(studentInfo)) {
      if (typeof value === "object" && value !== null) {
        for (const [subKey, subValue] of Object.entries(value)) {
          formData.append(`${key}[${subKey}]`, subValue);
        }
      } else {
        formData.append(key, value);
      }
    }
    formData.append("profile", profile);

    try {
      const resultAction = await dispatch(registerStudentDetails(formData));
      if (registerStudentDetails.fulfilled.match(resultAction)) {
        // toast.success("Student registered successfully.");
        if (studentDocuments.documents.length) {
          await dispatch(
            uploadStudentDocuments({
              email: studentInfo.email,
              schoolId,
              studentDocuments,
            })
          );
          // toast.success("Documents uploaded successfully.");
        }
      } else {
        toast.error("Failed to register student.");
      }
    } catch (error) {
      toast.error("An error occurred during submission.");
    }
  };

  return (
    <div className="flex gap-4 h-screen">
      <div className="p-8 max-w-4xl bg-white rounded-lg overflow-y-auto no-scrollbar">
        <h2 className="text-2xl font-semibold mb-6">Student Information</h2>
        <form ref={formRef} onSubmit={handleDocumentSubmit}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <ImageUpload
                imagePreview={imagePreview}
                handleImageChange={(e) => {
                  setProfile(e.target.files[0]);
                  setImageError(""); // Clear the error when image is selected
                  const reader = new FileReader();
                  reader.onload = () => setImagePreview(reader.result);
                  reader.readAsDataURL(e.target.files[0]);
                }}
                handleRemoveImage={() => {
                  setProfile(null);
                  setImagePreview(null);
                  setImageError("Profile image is required"); // Set error if image is removed
                }}
                error={imageError} // Pass error state to ImageUpload component
                inputRef={fileInputRef}
              />
            </div>
            <div className="col-span-8">
              <PersonalInfo
                studentInfo={studentInfo}
                handleInputChange={handleInputChange}
                errors={errors}
                inputRefs={inputRefs}
              />
            </div>
          </div>
          <AddressInfo
            studentInfo={studentInfo}
            handleInputChange={handleInputChange}
            errors={errors}
            inputRefs={inputRefs}
          />
          <AdmissionInfo
            studentInfo={studentInfo}
            handleInputChange={handleInputChange}
            errors={errors}
            inputRefs={inputRefs}
          />
          <ParentInfo
            studentInfo={studentInfo}
            handleInputChange={handleInputChange}
            errors={errors}
            inputRefs={inputRefs}
          />
          <DocumentUploadForm
            type="Admin"
            studentDocuments={studentDocuments}
            handleChange={handleInputChange}
            handleFileUploadIconClick={() => fileInputRef.current.click()}
            handlePhotoChange={handlePhotoChange}
            handleClearPhoto={handleClearPhoto}
            preview={preview}
            setPreview={setPreview}
            setStudentDocuments={setStudentDocuments}
            fileInputRef={fileInputRef}
          />
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 text-center"
              disabled={loading}
            >
              {loading ? "Registering..." : "Add Student"}
            </button>
          </div>
        </form>
      </div>
      <div className="sticky top-4">
        <StudentCard studentInfo={studentInfo} imagePreview={imagePreview} />
      </div>
    </div>
  );
};

export default StudentInfo;
