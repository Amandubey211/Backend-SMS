import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  setAcademicYear,
  setAuth,
  setRole,
  setUserDetails,
} from "../../../Redux/Slices/Auth/AuthSlice.js";
import { useNavigate } from "react-router-dom";
import { requestPermissionAndGetToken } from "../../NotificationHooks/NotificationHooks.js";
import axios from "axios";
import { baseUrl } from "../../../config/Common.js";
import { setLeftHeading } from "../../../Redux/Slices/Common/CommonSlice.js";

// Helper function to format the date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Helper function to format the academic year
const formatAcademicYear = (academicYear, startDate, endDate) => {
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  return {
    academicYear,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };
};

const useStaffLogin = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const staffLogin = async (staffDetails) => {
    if (!staffDetails) {
      toast.error("Please provide staff details.");
      return;
    }

    const { email, password } = staffDetails;

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const deviceToken = await requestPermissionAndGetToken();
      const userdetail = { email, password, deviceToken };
      const { data } = await axios.post(
        `${baseUrl}/auth/staff/login`,
        userdetail
      );

      if (data.success) {
        // Store token based on user role
        localStorage.setItem(`${data.role}:token`, `Bearer ${data.token}`);
        localStorage.removeItem(process.env.REACT_APP_PARENT_TOKEN_STORAGE_KEY);
        localStorage.removeItem(
          process.env.REACT_APP_STUDENT_TOKEN_STORAGE_KEY
        );

        // Set redux state for authentication and role
        dispatch(setAuth(true));
        dispatch(setRole(data.role));

        dispatch(setLeftHeading(data.role));
        console.log(data);

        const user = {
          schoolId: data?.schoolId,
          userId: data?.userId,
          profile: data?.profile,
          fullName: data?.fullName,
        };
        dispatch(setUserDetails(user));

        // Check if the user is an admin and if the academic year is active
        if (data.role === "admin" && data.isAcademicYearActive === false) {
          // Redirect to create academic year page
          toast.success("Please create an academic year");
          localStorage.setItem(
            `isAcademicYearActive`,
            data.isAcademicYearActive
          );
          navigate("/create_academicYear");
        } else {
          // Format the academic year details
          const formattedAcademicYear = formatAcademicYear(
            data.academicYear.year,
            data.academicYear.startDate,
            data.academicYear.endDate
          );
          console.log("Formatted Academic Year:", formattedAcademicYear);

          // Store the formatted academic year in Redux
          dispatch(
            setAcademicYear([
              {
                ...formattedAcademicYear, // Store the formatted string
                isActive: data.isAcademicYearActive,
              },
            ])
          );

          navigate("/dashboard");
        }

        toast.success("Logged in successfully", {
          position: "bottom-left",
        });
      } else {
        toast.error(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.error("Error during staff login:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    staffLogin,
  };
};

export default useStaffLogin;
