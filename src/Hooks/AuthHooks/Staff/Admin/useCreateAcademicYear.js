import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../..//config/Common";
import { useDispatch, useSelector } from "react-redux";
import { setAcademicYear } from "../../../../Redux/Slices/Auth/AuthSlice";

const useCreateAcademicYear = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const role = useSelector((store) => store.Auth.role);
  const token = localStorage.getItem(`${role}:token`);
  const dispatch = useDispatch();
  const createYear = async (yearData) => {
    try {
      setLoading(true);

      // API call to create academic year
      const { data } = await axios.post(
        `${baseUrl}/admin/createAcademicYear`,
        yearData,
        {
          headers: { Authentication: token },
        }
      );

      if (data.success) {
        toast.success("Academic Year created successfully");
        // localStorage.removeItem(`isAcademicYearActive`);
        localStorage.setItem(`isAcademicYearActive`, true);

        navigate("/dashboard");

        if (yearData.isActive) {
          dispatch(setAcademicYear([yearData]));
        }
      } else {
        toast.error(data.message || "Failed to create Academic Year");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createYear,
  };
};

export default useCreateAcademicYear;
