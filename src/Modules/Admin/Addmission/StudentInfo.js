import React, { useState, useRef } from "react";
import ImageUpload from "./Components/ImageUpload";
import PersonalInfo from "./Components/PersonalInfo";
import AddressInfo from "./Components/AddressInfo";
import AdmissionInfo from "./Components/AdmissionInfo";
import ParentInfo from "./Components/ParentInfo";
import DocumentUploadForm from "../../LoginPages/Student/SignUp/DocumentUploadForm";
import useAddStudent from "../../../Hooks/AuthHooks/Staff/Admin/Students/useAddStudent";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import validateStudentDetails from "../../../Validataions/Student/validateStudentDetails";
import useSaveDetails from "../../../Hooks/AuthHooks/Student/useSaveDetails";
import useSaveDocument from "../../../Hooks/AuthHooks/Student/useSaveDocuments";
import StudentCard from "./Components/StudentCard";

const StudentInfo = () => {
  const schoolId = useSelector((store) => store.Auth.userDetail.schoolId);
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
    //transportRequirement: "",
    enrollmentStatus: "",
    schoolId: schoolId,
    // fatherImage: null,
    // motherImage: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [fatherImagePreview, setFatherImagePreview] = useState(null);
  const [motherImagePreview, setMotherImagePreview] = useState(null);
  const [sameAddress, setSameAddress] = useState(false);
  const [profile, setProfile] = useState(null);
  const fileInputRef = useRef(null);

  const { loading, error, addStudent } = useAddStudent();
  const { loading: saveLoading, saveDetails } = useSaveDetails();
  const { loading: docLoading, saveDocument } = useSaveDocument();

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
      setProfile(file);
    }
  };

  // const handleFatherImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setFatherImagePreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //     setStudentInfo({ ...studentInfo, fatherImage: file });
  //   }
  // };

  // const handleMotherImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setMotherImagePreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //     setStudentInfo({ ...studentInfo, motherImage: file });
  //   }
  // };

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

    const validationErrors = validateStudentDetails(studentInfo, "Admin");

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

      const response = await saveDetails(formData);

      if (response.success) {
        toast.success("Details Saved Successfully");

        if (studentDocuments?.documents.length !== 0) {
          const documentResponse = await saveDocument(
            studentInfo.email,
            studentInfo.schoolId,
            studentDocuments
          );
          if (documentResponse?.success) {
            toast.success("Documents uploaded successfully!");
            // addStudent(studentInfo);
          } else {
            toast.error("Failed to upload the document");
          }
        }
      } else {
        toast.error("Failed to save student details.");
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
            // dont remove  the below code --------------------
            // fatherImagePreview={fatherImagePreview}
            // motherImagePreview={motherImagePreview}
            // handleFatherImageChange={handleFatherImageChange}
            // handleMotherImageChange={handleMotherImageChange}
            // handleRemoveFatherImage={() => {
            //   setFatherImagePreview(null);
            //   setStudentInfo({ ...studentInfo, fatherImage: null });
            // }}
            // handleRemoveMotherImage={() => {
            //   setMotherImagePreview(null);
            //   setStudentInfo({ ...studentInfo, motherImage: null });
            // }}
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
            handleDocumentSubmit={handleDocumentSubmit}
            docloading={docLoading}
          />
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 text-center"
              disabled={loading || saveLoading || docLoading}
            >
              {loading || saveLoading || docLoading
                ? "Registering..."
                : "Add Student"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
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
