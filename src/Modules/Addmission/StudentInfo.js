import React, { useState } from "react";
import ImageUpload from "./Components/ImageUpload";
import PersonalInfo from "./Components/PersonalInfo";
import AddressInfo from "./Components/AddressInfo";
import AdmissionInfo from "./Components/AdmissionInfo";
import ParentInfo from "./Components/ParentInfo";
import TransferCertificateUpload from "./Components/TransferCertificateUpload";
import StudentCard from "./Components/StudentCard";

const StudentInfo = () => {
  const [studentInfo, setStudentInfo] = useState({
    name: "Akkas Ali",
    studentId: "001",
    dateOfBirth: "2003-08-15",
    gender: "Male",
    religion: "Islam",
    bloodGroup: "0+",
    phone: "Abbas Mia",
    email: "Rohima Begum",
    address: "Qatar Doha Hamad Medical City (2)",
    class: "Class - 1",
    section: "A",
    session: "2024",
    admissionFee: "500 QR",
    status: "Paid",
    fatherName: "Abbas Mia",
    motherName: "Rohima Begum",
    parentEmail: "hello@154gmail.com",
    parentPhone: "+990",
    transferCertificate: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo({
      ...studentInfo,
      [name]: value,
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
    }
  };

  const handleTcChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPdfPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setStudentInfo({ ...studentInfo, transferCertificate: file });
    } else {
      setPdfPreview(null);
      setStudentInfo({ ...studentInfo, transferCertificate: null });
    }
  };

  const clearPdfPreview = (fileInputRef) => {
    setPdfPreview(null);
    setStudentInfo({ ...studentInfo, transferCertificate: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(studentInfo);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  return (
    <div className="flex gap-4">
      <div className="p-8 max-w-4xl bg-white rounded-lg ">
        <h2 className="text-2xl font-semibold mb-6">Student Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <ImageUpload
                imagePreview={imagePreview}
                handleBrowseClick={() => {}}
                handleImageChange={handleImageChange}
                handleRemoveImage={handleRemoveImage}
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
          />
          <AdmissionInfo
            studentInfo={studentInfo}
            handleInputChange={handleInputChange}
          />
          <ParentInfo
            studentInfo={studentInfo}
            handleInputChange={handleInputChange}
          />
          <TransferCertificateUpload
            pdfPreview={pdfPreview}
            handleTcBrowseClick={() => {}}
            handleTcChange={handleTcChange}
            clearPdfPreview={clearPdfPreview}
          />
          {/* <div className="mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div> */}
        </form>
      </div>
      <div>
        <StudentCard studentInfo={studentInfo} imagePreview={imagePreview} />
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 text-center  "
          >
            Addmission Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentInfo;
