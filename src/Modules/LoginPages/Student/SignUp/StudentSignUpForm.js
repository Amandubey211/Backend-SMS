import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import Logo from "../../../../Components/Common/Logo";
import useSaveDetails from "../../../../Hooks/AuthHooks/Student/useSaveDetails";
import useSaveDocument from "../../../../Hooks/AuthHooks/Student/useSaveDocuments";
import PersonalInformationForm from "./PersonalInformationForm";
import FamilyInformationForm from "./FamilyInformationForm";
import AddressForm from "./AddressForm";
import DocumentUploadForm from "./DocumentUploadForm";
import NavigationLink from "./NavigationLink";
import validateStudentDetails from "../../../../Validataions/Student/validateStudentDetails";
import { useSelector } from "react-redux";

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
  });
  const [studentDocuments, setStudentDocuments] = useState({
    documentLabels: [""],
    documents: [null],
  });
  const [showPassword, setShowPassword] = useState(false);
  const step = useSelector((store) => store.Auth.step);
  const [acknowledged, setAcknowledged] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);
  const [preview, setPreview] = useState("");
  const { loading, saveDetails } = useSaveDetails();
  const { docloading, saveDocument } = useSaveDocument();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (step === 1) {
      setStudentDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setStudentDocuments((prev) => ({
        ...prev,
        [name]: [value],
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationErrors = validateStudentDetails(studentDetails);
    if (Object.keys(validationErrors).length > 0) {
      toast.error(Object.values(validationErrors)[0]);
      return;
    }
    if (acknowledged) {
      await saveDetails(studentDetails);
      console.log(studentDetails);
    } else {
      toast.error("Please acknowledge all the details.");
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

  const handleDocumentSubmit = (e) => {
    e.preventDefault();
    saveDocument(studentDocuments);
  };

  const handleFileUploadIconClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudentDocuments((prevState) => ({
          ...prevState,
          documents: [file],
        }));
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearPhoto = () => {
    setStudentDocuments((prevState) => ({
      ...prevState,
      documents: null,
    }));
    setPreview("");
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
            <form onSubmit={handleSave}>
              <PersonalInformationForm
                studentDetails={studentDetails}
                handleChange={handleChange}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
              <FamilyInformationForm
                studentDetails={studentDetails}
                handleChange={handleChange}
              />
              <AddressForm
                type="Permanent Address"
                address={studentDetails.permanentAddress}
                handleAddressChange={(e) =>
                  handleAddressChange(e, "permanentAddress")
                }
              />
              <div className="mb-4">
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

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={() => setAcknowledged(!acknowledged)}
                  className="mr-2"
                  required
                />
                <label className="text-sm">
                  I acknowledge that the above information is correct.
                </label>
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  onClick={handleSave}
                  className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 text-center`}
                  disabled={loading}
                >
                  {loading ? "Saving Please Wait..." : "Save"}
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
              fileInputRef={fileInputRef}
              handleDocumentSubmit={handleDocumentSubmit}
              docloading={docloading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentSignUpForm;
