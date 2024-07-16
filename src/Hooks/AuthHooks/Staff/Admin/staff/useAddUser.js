import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const useAddUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const adminRole = useSelector((store) => store.Auth.role);
  const addUser = useCallback(
    
    async (userData) => {
      const {
        firstName, lastName, email, mobileNumber, address, role, position,
        department, subjects, dob, gender, employeeID, emergencyContact,
        dateOfJoining, qualifications, previousExperience, classIds, monthlySalary
      } = userData;
console.log(userData);
      const missingFields = [];

      if (!firstName) missingFields.push("First Name");
      if (!lastName) missingFields.push("Last Name");
      if (!email) missingFields.push("Email");
      if (!mobileNumber) missingFields.push("Mobile Number");
      if (!address) missingFields.push("Address");
      if (!role) missingFields.push("Role");
      if (!dob) missingFields.push("Date of Birth");
      if (!gender) missingFields.push("Gender");
      if (!monthlySalary) missingFields.push("Monthly Salary");

      if (missingFields.length > 0) {
        toast.error(`Please fill out the following fields: ${missingFields.join(", ")}`);
        return { success: false, error: "Validation Error" };
      }

      setLoading(true);
      setError(null);

      try {
        const API_URL = process.env.REACT_APP_API_URL;
        const token = localStorage.getItem(`${adminRole}:token`);

        const response = await axios.post(
          `${API_URL}/admin/staff_register`, // Adjust the API endpoint as needed
          userData,
          {
            headers: {       Authentication: token, },
          }
        );

        const { data } = response.data;

        console.log(data);
        setLoading(false);
        toast.success("User added successfully");
        return { success: true, data };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to add user";
        toast.error(errorMessage);
        setLoading(false);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [adminRole]
  );

  return { addUser, loading, error };
};

export default useAddUser;
