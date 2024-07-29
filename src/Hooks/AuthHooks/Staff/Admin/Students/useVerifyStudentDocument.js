import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import useAssignClassToStudent from "../../useAssignClassToStudent";
import { baseUrl } from "../../../../../config/Common";
import useSendLoginCredentials from "./useSendLoginCredentials";

const useVerifyStudentDocument = () => {
  const [loading, setLoading] = useState(false);
  const { assignClass } = useAssignClassToStudent();
  const { sendCredentials } = useSendLoginCredentials();
  const validateDetails = (details) => {
    console.log(details, "verification details");
    if (!details || typeof details !== "object") {
      return "Invalid details object.";
    }

    const requiredFields = ["email", "studentId", "isVerifiedDocuments"];
    for (let field of requiredFields) {
      if (!details[field] && details[field] !== false) {
        return `Field ${field} is required.`;
      }
    }

    if (
      details.isVerifiedDocuments === "verified" &&
      !details.addmissionNumber
    ) {
      return "Field admissionNumber is required when documents are verified.";
    }

    return null;
  };

  const verifyDocument = async (verificationDetails) => {
    const validationError = validateDetails(verificationDetails);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem(
        process.env.REACT_APP_ADMIN_TOKEN_STORAGE_KEY
      );
      console.log(token);
      const { data } = await axios.put(
        `${baseUrl}/admin/verify_student_info`,
        verificationDetails,
        { headers: { Authentication: token } }
      );
      console.log(data);
      if (data.success) {
        toast.success(data.msg || "Document verified successfully");

        let assignedDetails = {
          email: verificationDetails.email,
          presentClassId: verificationDetails.presentClassId,
          studentId: verificationDetails.studentId,
        };
        let mailConfiguration = {
          studentId: verificationDetails.studentId,
          descriptionOnReject: verificationDetails?.rejectionReason,
        };
        console.log(verificationDetails.isVerifiedDocuments);
        if (verificationDetails.isVerifiedDocuments === "verified") {
          await assignClass(assignedDetails);
        }
        await sendCredentials(mailConfiguration);
      } else {
        toast.error(data.msg || "Document verification failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    verifyDocument,
  };
};

export default useVerifyStudentDocument;
