import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../config/Common";

const useAssignStudentToGroup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const { cid } = useParams(); // Assuming 'cid' is the class ID needed for some operations

  const assignStudentToGroup = async (studentId, groupId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);

      const response = await axios.post(
        `${baseUrl}/admin/assignStudentToGroup`,
        { studentId, groupId },
        {
          headers: { Authentication: token },
        }
      );
      console.log(response.data)

      toast.success("Student assigned to group successfully!");
      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to assign student to group";
      toast.error(errorMessage);
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage); // This ensures that the error can be handled further up if needed
    }
  };

  const assignStudentToSection = async (studentId, sectionId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);

      const response = await axios.post(
        `${baseUrl}/admin/assignStudentToSection`,
        { studentId, sectionId },
        {
          headers: { Authentication: token },
        }
      );
      console.log(response.data)

      toast.success("Student assigned to group successfully!");
      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to assign student to group";
      toast.error(errorMessage);
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage); // This ensures that the error can be handled further up if needed
    }
  }

  return { assignStudentToGroup, assignStudentToSection, loading, error };
};

export default useAssignStudentToGroup;
