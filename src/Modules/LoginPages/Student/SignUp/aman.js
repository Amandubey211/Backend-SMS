import React, { useRef, useState } from "react";
import Logo from "../../../../Components/Logo";
import { NavLink } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { MdOutlineDocumentScanner } from "react-icons/md";
import useSaveDetails from "../../../../Hooks/AuthHooks/Student/useSaveDetails";
import useSaveDocument from "../../../../Hooks/AuthHooks/Student/useSaveDocuments";
import { LuLoader } from "react-icons/lu";

const StudentSignUpForm = () => {
  const fileInputRef = useRef(null);
  // first page deatils by student
  const [studentDetails, setStudentDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
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
  const [step, setStep] = useState(1); // Track the current step (1 for form, 2 for document submission)
  const [acknowledged, setAcknowledged] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);
  const [preview, setPreview] = useState("");
  const { loading, saveDetails } = useSaveDetails();
  const { docloading, saveDocument } = useSaveDocument();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!acknowledged) {
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

  // Student Details Upload ----------------------------------
  const handleSave = async (e) => {
    e.preventDefault();

    if (acknowledged) {
      console.log(studentDetails);
      await saveDetails(studentDetails);
      setStep(2);
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

  //File Upload ---------------------------------------------------
  const handleDocumentSubmit = (e) => {
    e.preventDefault();
    console.log(studentDocuments);
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
        <div className="bg-white  p-8 rounded-lg w-full max-w-3xl">
          <div className="flex justify-between items-center px-1">
            {step === 1 && (
              <NavLink
                to="/"
                className="text-sm text-gray-500 hover:text-gray-700 mb-4 items-center flex gap-2"
              >
                <div className="rounded-full border text-xl w-6 h-6 flex justify-center items-center">
                  &larr;
                </div>
                <span>LMS Home</span>
              </NavLink>
            )}

            {step === 2 && (
              <NavLink
                // to="/"
                onClick={() => setStep(1)}
                className="text-sm text-gray-500 hover:text-gray-700 mb-4 items-center flex gap-2"
              >
                <div className="rounded-full border text-xl w-6 h-6 flex justify-center items-center">
                  &larr;
                </div>
                <span>Back</span>
              </NavLink>
            )}
            <span className="opacity-75 text-xs">( * ) indicates Required</span>
          </div>

          {step === 1 && (
            <form onSubmit={handleSave}>
              <h3 className="text-lg font-semibold mb-2">
                Personal Information
              </h3>
              {/* Name Section */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="firstName"
                  value={studentDetails.firstName}
                  onChange={handleChange}
                  placeholder="First Name*"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={studentDetails.lastName}
                  onChange={handleChange}
                  placeholder="Last Name*"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  value={studentDetails.email}
                  onChange={handleChange}
                  placeholder="Email*"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={studentDetails.password}
                    onChange={handleChange}
                    placeholder="Password*"
                    className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>
              {/* Personal Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="date"
                  name="dateOfBirth"
                  value={studentDetails.dateOfBirth}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
                <input
                  type="text"
                  name="placeOfBirth"
                  value={studentDetails.placeOfBirth}
                  onChange={handleChange}
                  placeholder="Place of Birth*"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="number"
                  name="age"
                  value={studentDetails.age}
                  onChange={handleChange}
                  placeholder="Age*"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
                <select
                  name="gender"
                  value={studentDetails.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select Gender*</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="trans">Trans</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <input
                  type="number"
                  name="contactNumber"
                  value={studentDetails.contactNumber}
                  onChange={handleChange}
                  placeholder="Contact Number*"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Identity Information
              </h3>
              <div className="mb-4">
                <input
                  type="text"
                  name="Q_Id"
                  value={studentDetails.Q_Id}
                  onChange={handleChange}
                  placeholder="QID*"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              {/* Family Info */}
              <h3 className="text-lg font-semibold mb-2">Family Information</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="motherName"
                  value={studentDetails.motherName}
                  onChange={handleChange}
                  placeholder="Mother's Name*"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
                <input
                  type="text"
                  name="fatherName"
                  value={studentDetails.fatherName}
                  onChange={handleChange}
                  placeholder="Father's Name*"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="guardianName"
                  value={studentDetails.guardianName}
                  onChange={handleChange}
                  placeholder="Guardian's Name*"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
                <input
                  type="number"
                  name="guardianContactNumber"
                  value={studentDetails.guardianContactNumber}
                  onChange={handleChange}
                  placeholder="Guardian's Contact Number*"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              {/* Address Info */}
              <h3 className="text-lg font-semibold mb-2">Permanent Address</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="street"
                  value={studentDetails.permanentAddress.street}
                  onChange={(e) => handleAddressChange(e, "permanentAddress")}
                  placeholder="Street*"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
                <input
                  type="text"
                  name="city"
                  value={studentDetails.permanentAddress.city}
                  onChange={(e) => handleAddressChange(e, "permanentAddress")}
                  placeholder="City*"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="state"
                  value={studentDetails.permanentAddress.state}
                  onChange={(e) => handleAddressChange(e, "permanentAddress")}
                  placeholder="State*"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
                <input
                  type="text"
                  name="postalCode"
                  value={studentDetails.permanentAddress.postalCode}
                  onChange={(e) => handleAddressChange(e, "permanentAddress")}
                  placeholder="Postal Code*"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
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
                <>
                  <h3 className="text-lg font-semibold mb-2">
                    Residential Address
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      name="street"
                      value={studentDetails.residentialAddress.street}
                      onChange={(e) =>
                        handleAddressChange(e, "residentialAddress")
                      }
                      placeholder="Street*"
                      className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                    <input
                      type="text"
                      name="city"
                      value={studentDetails.residentialAddress.city}
                      onChange={(e) =>
                        handleAddressChange(e, "residentialAddress")
                      }
                      placeholder="City*"
                      className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      name="state"
                      value={studentDetails.residentialAddress.state}
                      onChange={(e) =>
                        handleAddressChange(e, "residentialAddress")
                      }
                      placeholder="State*"
                      className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                    <input
                      type="text"
                      name="postalCode"
                      value={studentDetails.residentialAddress.postalCode}
                      onChange={(e) =>
                        handleAddressChange(e, "residentialAddress")
                      }
                      placeholder="Postal Code*"
                      className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                </>
              )}
              <div className="mb-4">
                <input
                  type="text"
                  name="emergencyNumber"
                  value={studentDetails.emergencyNumber}
                  onChange={handleChange}
                  placeholder="Emergency Contact Number*"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
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
                  className={`  w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 text-center  `}
                  disabled={loading}
                >
                  {loading ? "Saving Please Wait..." : "Save"}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleDocumentSubmit}>
              <h3 className="text-lg font-semibold mb-2">
                Document Submission
              </h3>

              <div className="mb-4">
                <input
                  type="text"
                  name="documentLabels"
                  value={studentDocuments.documentLabels}
                  onChange={handleChange}
                  placeholder="Document Label*"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="fileInput" className="block mb-2">
                  Choose File
                </label>
                <div className="flex items-center w-full justify-between">
                  <input
                    type="file"
                    ref={fileInputRef}
                    id="fileInput"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  <div className="border-2 min-w-full border-opacity-70 border-dashed border-gray-500 rounded-xl  h-56 relative">
                    {!preview && (
                      <div onClick={handleFileUploadIconClick}>
                        <MdOutlineDocumentScanner
                          className="text-6xl  opacity-75 hover:opacity-100  transition-transform duration-300 transform hover:scale-125  "
                          style={{
                            cursor: "pointer",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      </div>
                    )}

                    <input
                      type="file"
                      accept=".pdf, .jpg, .jpeg, .doc"
                      onChange={handlePhotoChange}
                      style={{ display: "none" }}
                    />
                    {preview && (
                      <div className="relative">
                        <div className="flex justify-center h-full p-2  ">
                          <img
                            src={preview}
                            alt="Preview"
                            title="project image"
                            className="rounded-sm h-52"
                          />
                        </div>

                        <button
                          title="Clear Photo"
                          style={{
                            background:
                              "linear-gradient(to right, #fce7f3, #e9d5ff)",
                            transition: "background-color 0.3s ease",
                            transform: "scale(1)",
                          }}
                          className="absolute top-2 right-2 hover:border-purple-500 shadow-2xl opacity-85 hover:opacity-100 hover:shadow-2xl hover:border hover rounded-full p-1"
                          onClick={handleClearPhoto}
                        >
                          <span
                            className="p-1"
                            style={{
                              background:
                                "linear-gradient(to right, #f43f5e, #8b5cf6)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              transition: "transform 0.3s ease-in",
                              transform: "scale(1)",
                            }}
                          >
                            &#10005;
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className={`w-full ${
                    docloading ? "cursor-wait" : ""
                  } bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 text-center`}
                  disabled={docloading}
                >
                  {docloading ? (
                    <div className="flex justify-center gap-1  ">
                      <LuLoader className="animate-spin text-2xl" />
                      <span>"Submitting..." </span>
                    </div>
                  ) : (
                    "Submit Document"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentSignUpForm;
