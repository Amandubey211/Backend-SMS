import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const useEditUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const adminRole = useSelector((store) => store.Auth.role);
  const EditUser = useCallback(
    
    async (userData) => {
      const { firstName, lastName, email, mobileNumber, role, position,
       dob, gender, employeeID, monthlySalary,_id,address,profile} = userData;
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
       if (!address) missingFields.push("address");
       
       if (missingFields.length > 0) {
         toast.error(`Please fill out the following fields: ${missingFields.join(", ")}`);
         return { success: false, error: "Validation Error" };
       }
      setLoading(true);
      setError(null);

      try {
        const API_URL = process.env.REACT_APP_API_URL;
        const token = localStorage.getItem(`${adminRole}:token`);
        const formData = new FormData();
        Object.keys(userData).forEach(key => {
          formData.append(key, userData[key]);
        });
        formData.append('address', JSON.stringify(userData.address)); 
        const response = await axios.put(
          `${API_URL}/admin/update_staff/${_id}`, // Adjust the API endpoint as needed
          formData,
          {
            headers: {       Authentication: token, },
          }
        );

        const { data } = response.data;

        console.log(data);
        setLoading(false);
        toast.success("User Edited successfully");
        return { success: true, data };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to Edit user";
        toast.error(errorMessage);
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
