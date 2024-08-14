import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../config/Common";

const useUploadChapterFiles = (fetchModules) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const role = useSelector((store) => store.Auth.role);
  const { sid } = useParams(); // Assuming subjectId (sid) is in the URL params

  const uploadChapterFiles = useCallback(
    async (chapterId, documents, documentLabels = []) => {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const formData = new FormData();
        formData.append("chapterId", chapterId);
        formData.append("subjectId", sid);

        documents.forEach((document, index) => {
          formData.append("documents", document);
          formData.append("documentLabels", documentLabels[index] || "");
        });

        const response = await axios.put(
          `${baseUrl}/admin/uploadChapterFiles`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authentication: token,
            },
          }
        );

        if (response.data && response.data.uploadedFiles) {
          setSuccess("Documents uploaded successfully.");
          toast.success("Documents uploaded successfully.");
          fetchModules(); // Refetch modules after uploading documents
        } else {
          toast.error(response.data.message || "Failed to upload documents.");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error in uploading documents";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, sid, fetchModules]
  );

  return { loading, error, success, uploadChapterFiles };
};

export default useUploadChapterFiles;
