import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";
import useGetAllStaff from "./useGetAllStaff";
const useEditUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const adminRole = useSelector((store) => store.common.auth.role);
  const { fetchStaff } = useGetAllStaff();
  const EditUser = useCallback(
    async (userData, address, id) => {
      const {
        firstName,
        lastName,
        email,
        mobileNumber,
        role,
        position,
        dob,
        gender,
        employeeID,
        monthlySalary,
        profile,
        active,
      } = userData;

      const missingFields = [];

      if (!firstName) missingFields.push("First Name");
      if (!lastName) missingFields.push("Last Name");
      if (!email) missingFields.push("Email");
      if (!mobileNumber) missingFields.push("Mobile Number");
      if (!role) missingFields.push("Role");
      if (!position) missingFields.push("Position");
      if (!dob) missingFields.push("Date of Birth");
      if (!gender) missingFields.push("Gender");
      if (!employeeID) missingFields.push("Employee ID");
      if (!monthlySalary) missingFields.push("Monthly Salary");
      if (!address) missingFields.push("Address");

      if (missingFields.length > 0) {
        toast.error(
          `Please fill out the following fields: ${missingFields.join(", ")}`
        );
        return { success: false, error: "Validation Error" };
      }
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${adminRole}:token`);
        const formData = new FormData();
        Object.keys(userData).forEach((key) => {
          console.log(`Appending ${key}: ${userData[key]}`);
          formData.append(key, userData[key]);
        });
        console.log(userData);
        formData.append("address", JSON.stringify(address));
        console.log(address);
        const response = await axios.put(
          `${baseUrl}/admin/update_staff/${id}`,
          formData,
          {
            headers: {
              Authentication: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const { data } = response.data;

        console.log(data);
        setLoading(false);
        toast.success("User Edited successfully");
        fetchStaff();
        return { success: true, data };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to Edit user";
        toast.error("Failed to Edit users");
        console.log(err);
        setLoading(false);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [adminRole]
  );

  return { EditUser, loading, error };
};

export default useEditUser;
