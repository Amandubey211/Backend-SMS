import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../../config/Common";

const useSaveDocument = () => {
  const [docloading, setDocloading] = useState(false);
  const saveDocument = async (email, schoolId, studentDocuments) => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!schoolId) {
      toast.error("School ID is required");
      return;
    }

    try {
      setDocloading(true);

      const formData = new FormData();
      formData.append("email", email);
      formData.append("schoolId", schoolId);
      studentDocuments.documents.forEach(({ file, label }, index) => {
        formData.append(`documents`, file);
        formData.append(`documentLabels`, label);
      });

      const response = await axios.post(
        `${baseUrl}/student/upload_documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        toast.success("Document saved successfully");

        return response.data;
      } else {
        toast.error(response.data.msg || "Failed to save document");
        return response.data;
      }
    } catch (error) {
      toast.error(error.response?.data.msg || "Something went wrong");
      console.error(error);
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
