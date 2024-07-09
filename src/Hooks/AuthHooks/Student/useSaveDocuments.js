import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useSaveDocument = () => {
  const [docloading, setDocloading] = useState(false);
  const navigate = useNavigate();
  const saveDocument = async (studentDocument) => {
    try {
      const email = localStorage.getItem("email");
      if (!email) {
        toast.error("Email is not available");
        return;
      }

      setDocloading(true);

      const formData = new FormData();
      formData.append("email", email);
      console.log(
        Array.isArray(studentDocument.documents),
        typeof studentDocument.documents
      );
      studentDocument.documents.forEach((file, index) => {
        formData.append(`documents`, file);
        formData.append(
          `documentLabels`,
          studentDocument.documentLabels[index]
        );
      });

      const response = await axios.post(
        `http://localhost:8080/student/upload_documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Document saved successfully");
        navigate("/studentlogin");
      } else {
        toast.error("Failed to save document");
      }

      console.log(response.data);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setDocloading(false);
    }
  };

  return {
    docloading,
    saveDocument,
  };
};

export default useSaveDocument;
