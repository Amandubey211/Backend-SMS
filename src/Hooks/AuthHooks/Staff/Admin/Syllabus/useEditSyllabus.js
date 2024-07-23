import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import FormData from "form-data";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../config/Common";

const useEditSyllabus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { cid } = useParams();

  
  const { role } = useSelector((store) => store.Auth);

  const editSyllabus = useCallback(
    async (syllabusId, data) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const formData = new FormData();

        for (const key in data) {
          formData.append(key, data[key]);
        }
        const response = await axios.put(
          `${baseUrl}/admin/syllabus/${syllabusId}/class/${cid}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authentication: token,
            },
          }
        );
        console.log(response.data.data);
        if (response.data.status) {
          toast.success("Syllabus updated successfully!");
        } else {
          toast.error("Failed to update syllabus");
        }
        return response.data.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to update syllabus";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, baseUrl, cid]
  );

  return { loading, error, editSyllabus };
};

export default useEditSyllabus;
