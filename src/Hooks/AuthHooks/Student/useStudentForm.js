import { useState } from "react";
import toast from "react-hot-toast";
import useSaveDetails from "./useSaveDetails";
import useSaveDocument from "./useSaveDocuments";


const useStudentForm = () => {
  const { loading: saveLoading, saveDetails } = useSaveDetails();
  const { loading: docLoading, saveDocument } = useSaveDocument();
  const [preview, setPreview] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [studentDocuments, setStudentDocuments] = useState({
    documentLabels: [""],
    documents: [],
    schoolId: "",
    email: "",
  });

  const handleDocumentSubmit = async (studentDetails, profile) => {
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
          if (key === 'permanentAddress' || key === 'residentialAddress') {
            const address = studentDetails[key];
            for (const field in address) {
              if (address.hasOwnProperty(field)) {
                formData.append(`${key}.${field}`, address[field]);
              }
            }
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
          // Optionally reset form or handle next steps
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

  const handlePhotoChange = (e, setStudentDocuments) => {
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

  const handleClearPhoto = (fileInputRef, setStudentDocuments) => {
    setStudentDocuments((prevState) => ({
      ...prevState,
      documents: [],
    }));
    setPreview([]);
    fileInputRef.current.value = "";
  };

  return {
    saveLoading,
    docLoading,
    handleDocumentSubmit,
    handlePhotoChange,
    handleClearPhoto,
    showModal,
    setShowModal,
    preview,
    setPreview,
    studentDocuments,
    setStudentDocuments,
  };
};

export default useStudentForm;
