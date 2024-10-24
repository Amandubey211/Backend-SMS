import React, { useState, useRef } from "react";
import ImageUpload from "./Components/ImageUpload";
import PersonalInfo from "./Components/PersonalInfo";
import AddressInfo from "./Components/AddressInfo";
import AdmissionInfo from "./Components/AdmissionInfo";
import ParentInfo from "./Components/ParentInfo";
import DocumentUploadForm from "../../LoginPages/Student/SignUp/DocumentUploadForm";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import validateStudentDetails from "../../../Validataions/Student/validateStudentDetails";

import StudentCard from "./Components/StudentCard";
import {
  registerStudentDetails,
  uploadStudentDocuments,
} from "../../../Store/Slices/Common/Auth/actions/studentActions";

const StudentInfo = () => {
  const dispatch = useDispatch();
  const schoolId = useSelector(
    (store) => store.common.user.userDetails.schoolId
  );
  const { loading } = useSelector((store) => store.common.auth);
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
    placeOfBirth: "",
    emergencyNumber: "",
    transportRequirement: false,
    Q_Id: "",
    applyingClass: "",
    enrollmentStatus: "",
    schoolId: schoolId,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [sameAddress, setSameAddress] = useState(false);
  const [profile, setProfile] = useState(null);
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState([]);
  const [studentDocuments, setStudentDocuments] = useState({
    documentLabels: [""],
    documents: [],
    schoolId: schoolId,
    email: studentInfo.email,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "dateOfBirth") {
      const age = calculateAge(new Date(value));
      setStudentInfo({
        ...studentInfo,
        [name]: value,
        age: age,
      });
    } else {
      setStudentInfo({
        ...studentInfo,
        [name]: value,
      });
    }
  };

  // Helper function to calculate age based on DOB
  const calculateAge = (dob) => {
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleAddressChange = (e, type) => {
    const { name, value } = e.target;
    setStudentInfo({
      ...studentInfo,
      [type]: {
        ...studentInfo[type],
        [name]: value,
      },
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Update the studentInfo state with the profile image
      setProfile(file);
      setStudentInfo((prevState) => ({
        ...prevState,
        profile: file, // Add profile to studentInfo state
      }));
    }
  };

  const handleSameAddressChange = (e) => {
    setSameAddress(e.target.checked);
    if (e.target.checked) {
      setStudentInfo((prev) => ({
        ...prev,
        residentialAddress: { ...prev.permanentAddress },
      }));
    }
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

  const handleClearPhoto = () => {
    setStudentDocuments((prevState) => ({
      ...prevState,
      documents: [],
    }));
    setPreview([]);
    fileInputRef.current.value = "";
  };

  const handleDocumentSubmit = async (e) => {
    e.preventDefault();

    if (!studentInfo.email) {
      toast.error("Email is required");
      return;
    }

    // Make sure the profile is included in the validation
    const validationErrors = validateStudentDetails(
      {
        ...studentInfo,
        profile: profile, // Include profile in the validation
      },
      "Admin"
    );

    if (Object.keys(validationErrors).length > 0) {
      toast.error(Object.values(validationErrors)[0]);
      return;
    }

    try {
      const formData = new FormData();
      for (const key in studentInfo) {
        if (studentInfo.hasOwnProperty(key)) {
          if (key === "permanentAddress" || key === "residentialAddress") {
            const address = studentInfo[key];
            for (const field in address) {
              if (address.hasOwnProperty(field)) {
                formData.append(`${key}[${field}]`, address[field]);
              }
            }
          } else {
            formData.append(key, studentInfo[key]);
          }
        }
      }

      if (profile) {
        formData.append("profile", profile);
      } else {
        toast.error("Profile image is required");
        return;
      }

      // Dispatch the thunk for saving student details
      const resultAction = await dispatch(registerStudentDetails(formData));

      if (registerStudentDetails.fulfilled.match(resultAction)) {
        toast.success("Details Saved Successfully");

        if (studentDocuments?.documents.length !== 0) {
          // Dispatch the thunk for saving documents
          const documentResultAction = await dispatch(
            uploadStudentDocuments({
              email: studentInfo.email,
              schoolId: studentInfo.schoolId,
              studentDocuments,
            })
          );
          if (uploadStudentDocuments.fulfilled.match(documentResultAction)) {
            toast.success("Documents uploaded successfully!");
          } else {
            toast.error(
              documentResultAction.payload || "Failed to upload the document"
            );
          }
        }
      } else {
        toast.error(resultAction.payload || "Failed to save student details.");
      }
    } catch (error) {
      console.error("Error in submitting documents:", error);
      toast.error("An error occurred while submitting the documents.");
    }
  };
  return (
    <div className="flex gap-4 h-screen">
      <div className="p-8 max-w-4xl bg-white rounded-lg overflow-y-auto no-scrollbar">
        <h2 className="text-2xl font-semibold mb-6">Student Information</h2>
        <form onSubmit={handleDocumentSubmit}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <ImageUpload
                imagePreview={imagePreview}
                handleBrowseClick={() => fileInputRef.current.click()}
                handleImageChange={handleImageChange}
                handleRemoveImage={() => {
                  setImagePreview(null);
                  setProfile(null);
                }}
              />
            </div>
            <div className="col-span-8">
              <PersonalInfo
                studentInfo={studentInfo}
                handleInputChange={handleInputChange}
              />
            </div>
          </div>
          <AddressInfo
            studentInfo={studentInfo}
            handleInputChange={handleInputChange}
            handleAddressChange={handleAddressChange}
            sameAddress={sameAddress}
            handleSameAddressChange={handleSameAddressChange}
          />
          <AdmissionInfo
            studentInfo={studentInfo}
            handleInputChange={handleInputChange}
          />
          <ParentInfo
            studentInfo={studentInfo}
            handleInputChange={handleInputChange}
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
