import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import Logo from "../../../../Components/Common/Logo";
import useSaveDetails from "../../../../Hooks/AuthHooks/Student/useSaveDetails";
import useSaveDocument from "../../../../Hooks/AuthHooks/Student/useSaveDocuments";
import PersonalInformationForm from "./PersonalInformationForm";
import AddressForm from "./AddressForm";
import DocumentUploadForm from "./DocumentUploadForm";
import NavigationLink from "./NavigationLink";
import validateStudentDetails from "../../../../Validataions/Student/validateStudentDetails";
import { useSelector, useDispatch } from "react-redux";
import { setStep } from "../../../../Redux/Slices/Auth/AuthSlice";

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
    nationality: "",
    contactNumber: "",
    motherName: "",
    fatherName: "",
    guardianName: "",
    guardianContactNumber: "",
    Q_Id: "",
    permanentAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
    },
    residentialAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
    },
    emergencyNumber: "",
    schoolId: "",
    profile: "",
  });
  const [studentDocuments, setStudentDocuments] = useState({
    documentLabels: [""],
    documents: [],
    schoolId: studentDetails.schoolId,
    email: studentDetails.email,
  });
  const step = useSelector((store) => store.Auth.step);
  const dispatch = useDispatch();
  const [sameAddress, setSameAddress] = useState(false);
  const [preview, setPreview] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [profile, setProfile] = useState(null);
  const { loading, saveDetails } = useSaveDetails();
  const { docloading, saveDocument } = useSaveDocument();
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfile(file);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();

    if (!studentDetails.email) {
      toast.error("Email is required");
      return;
    }

    const validationErrors = validateStudentDetails(studentDetails);

    if (Object.keys(validationErrors).length > 0) {
      toast.error(Object.values(validationErrors)[0]);
      return;
    }

    try {
      dispatch(setStep(2)); // Move to the next step
    } catch (error) {
      console.error("Error in submitting student details:", error);
      toast.error("Please try again");
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
  };

  const handleSameAddressChange = (e) => {
    setSameAddress(e.target.checked);
    if (e.target.checked) {
      setStudentDetails((prev) => ({
        ...prev,
        residentialAddress: { ...prev.permanentAddress },
      }));
    }
  };

  const handleDocumentSubmit = async (e) => {
    e.preventDefault();

    if (!studentDetails.email) {
      toast.error("Email is required");
      return;
    }

    if (!studentDetails.schoolId) {
      toast.error("School ID is required");
      return;
    }

    try {
      const formData = new FormData();
      for (const key in studentDetails) {
        if (studentDetails.hasOwnProperty(key)) {
          if (typeof studentDetails[key] === "object") {
            formData.append(key, JSON.stringify(studentDetails[key]));
          } else {
            formData.append(key, studentDetails[key]);
          }
        }
      }

      if (profile) {
        formData.append("profile", profile);
      }

      const response = await saveDetails(formData);

      if (response.success) {
        toast.success("Details Saved Successfully");
        const documentResponse = await saveDocument(
          studentDetails.email,
          studentDetails.schoolId,
          studentDocuments
        );
        if (documentResponse?.success) {
          toast.success("Documents uploaded successfully!");
          setShowModal(true);
          dispatch(setStep(1));
        } else {
          toast.error("Failed to upload the document");
        }
      } else {
        toast.error("Failed to save student details.");
      }
    } catch (error) {
      console.error("Error in submitting documents:", error);
      toast.error("An error occurred while submitting the documents.");
    }
  };

  const handleFileUploadIconClick = () => {
    fileInputRef.current.click();
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
              />

              <AddressForm
                type="Permanent Address"
                address={studentDetails.permanentAddress}
                handleAddressChange={(e) =>
                  handleAddressChange(e, "permanentAddress")
                }
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
                />
              )}
              <div className="flex items-center justify-center mt-4">
                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 text-center`}
                  disabled={loading || docloading}
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
              docloading={docloading}
            />
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Registration Successful
            </h2>
            <p className="mb-4">
              You will receive your login credentials at your registered email
              address. Please wait for verification.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSignUpForm;
