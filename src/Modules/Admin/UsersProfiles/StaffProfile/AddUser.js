// Components/Admin/Users/Staff/AddUser.js

import React, { useEffect, useState } from "react";
import ImageUpload from "../../Addmission/Components/ImageUpload";
import FormInput from "../../Accounting/subClass/component/FormInput";
import { FiLoader, FiX } from "react-icons/fi";
import { FaChevronDown, FaUsersSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  addUser,
  editUser,
} from "../../../../Store/Slices/Admin/Users/Staff/staff.action";
import {
  getAllRolesThunk,
  assignRoleThunk,
} from "../../../../Store/Slices/Common/RBAC/rbacThunks";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const AddUser = ({ role, data }) => {
  console.log(data, "jjjjjjjj");
  const dispatch = useDispatch();
  const { roles } = useSelector((store) => store.admin.rbac);
  const { loading, error } = useSelector((store) => store.admin.all_staff);

  const [imagePreview, setImagePreview] = useState(null);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [teacherData, setTeacherData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    religion: "",
    gender: "",
    monthlySalary: "",
    bloodGroup: "",
    mobileNumber: "",
    email: "",
    profile: null,
    teacherCV: null,
    employeeID: "",
    role: "",
    active: true,
  });

  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedRolePermissions, setSelectedRolePermissions] = useState([]);
  const [isRoleDropdownOpen, setRoleDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllRolesThunk());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      // Populate teacher data
      setTeacherData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
        religion: data.religion || "Islam",
        gender: data.gender || "",
        monthlySalary: data.monthlySalary || "",
        bloodGroup: data.bloodGroup || "",
        mobileNumber: data.mobileNumber || "",
        email: data.email || "",
        profile: null, // Reset profile to allow image removal or update
        teacherCV: null, // Assuming CV is handled separately
        employeeID: data.employeeID || "",
        role: "", // Reset role as it's handled separately
        active: data.active ?? true,
      });

      // Populate address data
      setAddress({
        street: data.address?.street || "",
        city: data.address?.city || "",
        state: data.address?.state || "",
        postalCode: data.address?.postalCode || "",
        country: data.address?.country || "",
      });

      // Set image preview from data.profile
      setImagePreview(data.profile || null);

      // Map data.position (array of role names) to role objects from the store
      const existingRoleNames = Array.isArray(data.position)
        ? data.position
        : data.position
        ? [data.position]
        : [];

      const initialSelectedRoles =
        roles
          ?.flatMap((dept) => dept.roles)
          .filter((roleItem) => existingRoleNames.includes(roleItem.name))
          .map((roleItem) => ({
            id: roleItem.id,
            name: roleItem.name,
            permission: roleItem.permission,
          })) || [];

      setSelectedRoles(initialSelectedRoles);

      // Set selectedRolePermissions based on data.permission array
      const permissions = data.permission || [];
      setSelectedRolePermissions([...new Set(permissions)]);
    } else {
      resetForm();
    }
  }, [data, role, roles]);

  const resetForm = () => {
    setTeacherData({
      firstName: "",
      lastName: "",
      dob: "",
      religion: "",
      gender: "",
      monthlySalary: "",
      bloodGroup: "",
      mobileNumber: "",
      email: "",
      profile: null,
      teacherCV: null,
      employeeID: "",
      role: role || "",
      active: true,
    });
    setAddress({
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    });
    setSelectedRoles([]);
    setSelectedRolePermissions([]);
    setImagePreview(null);
  };

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];
  const religionOptions = [
    { value: "Islam", label: "Islam" },
    { value: "Christianity", label: "Christianity" },
    { value: "Hinduism", label: "Hinduism" },
    { value: "Other", label: "Other" },
  ];

  const bloodGroupOptions = [
    { value: "O+", label: "O+" },
    { value: "A+", label: "A+" },
    { value: "B+", label: "B+" },
    { value: "AB+", label: "AB+" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacherData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setTeacherData((prev) => ({
        ...prev,
        profile: file,
      }));
    }
  };

  const handleCVUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setTeacherData((prev) => ({
        ...prev,
        teacherCV: file,
      }));
    } else {
      toast.error("Please upload a PDF file.");
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setTeacherData((prev) => ({
      ...prev,
      profile: null,
    }));
  };

  const handleRoleSelect = (roleItem) => {
    setSelectedRoles((prevRoles) => {
      if (!prevRoles?.some((r) => r.id === roleItem.id)) {
        const updatedRoles = [
          ...prevRoles,
          {
            id: roleItem.id,
            name: roleItem.name,
            permission: roleItem.permission,
          },
        ];
        const newPermissions = roleItem.permission;
        setSelectedRolePermissions((prevPermissions) => [
          ...new Set([...prevPermissions, ...newPermissions]),
        ]);
        return updatedRoles;
      }
      return prevRoles;
    });
    setRoleDropdownOpen(false);
  };

  const handleRoleRemove = (roleId) => {
    setSelectedRoles((prevRoles) => {
      const updatedRoles = prevRoles?.filter((r) => r.id !== roleId) || [];
      const remainingPermissions =
        updatedRoles
          ?.flatMap((roleItem) => roleItem.permission)
          ?.filter((perm, index, self) => self.indexOf(perm) === index) || [];
      setSelectedRolePermissions(remainingPermissions);
      return updatedRoles;
    });
  };

  const toggleRoleDropdown = () => {
    setRoleDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById("role-dropdown");
      if (dropdown && !dropdown.contains(event.target)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (error?.message) {
      toast.error(error.message);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teacherData.firstName.trim()) {
      toast.error("First name is required.");
      return;
    }
    if (!teacherData.email?.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const selectedRoleIds = selectedRoles?.map((roleItem) => roleItem.id) || [];
    const permissions = selectedRolePermissions || [];

    const preparedTeacherData = {
      ...teacherData,
    };

    if (data) {
      try {
        await dispatch(
          editUser({ userData: preparedTeacherData, address, id: data._id })
        ).unwrap();

        if (selectedRoleIds.length > 0) {
          await dispatch(
            assignRoleThunk({
              staffId: data._id,
              roleId: selectedRoleIds,
              permission: permissions,
            })
          ).unwrap();
          toast.success("User updated and roles assigned successfully!");
        } else {
          toast.success("User updated successfully without role assignment.");
        }
      } catch (err) {
        console.error("Error updating user:", err);
        toast.error("An error occurred while updating the user.");
      }
    } else {
      try {
        const addResult = await dispatch(
          addUser({ userData: preparedTeacherData, address })
        ).unwrap();

        if (addResult) {
          toast.success("User added successfully!");
          resetForm();
        } else {
          toast.error("Failed to add user.");
        }
      } catch (err) {
        console.error("Error adding user:", err);
        toast.error("An error occurred while adding the user.");
      }
    }
  };

  return (
    <motion.div
      className="p-6 bg-white shadow-md rounded-lg overflow-auto"
      style={{ maxHeight: "90vh" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* User Information Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Profile Image */}
          <div className="col-span-1 flex justify-center mt-5 ">
            <ImageUpload
              imagePreview={imagePreview}
              handleImageChange={handleImageChange}
              handleRemoveImage={handleRemoveImage}
              height="h-80"
              width="w-80"
            />
          </div>

          {/* Personal Details */}
          <div className="col-span-1 space-y-6">
            <FormInput
              id="firstName"
              label="First Name"
              name="firstName"
              value={teacherData.firstName}
              onChange={handleInputChange}
              required
            />
            <FormInput
              id="lastName"
              label="Last Name"
              name="lastName"
              value={teacherData.lastName}
              onChange={handleInputChange}
              required
            />
            <FormInput
              id="dob"
              label="Date of Birth"
              type="date"
              name="dob"
              value={teacherData.dob}
              onChange={handleInputChange}
              required
            />
            {/* Religion Select */}
            <div>
              <label className="block text-base font-medium text-gray-700 ">
                Religion
              </label>
              <select
                id="religion"
                name="religion"
                value={teacherData.religion}
                onChange={handleInputChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Select Religion</option>
                {religionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Employment Details */}
          <div className="col-span-1 space-y-6">
            <FormInput
              id="monthlySalary"
              label="Monthly Salary"
              type="number"
              name="monthlySalary"
              value={teacherData.monthlySalary}
              onChange={handleInputChange}
              required
            />
            <FormInput
              id="employeeID"
              label="Employee ID"
              name="employeeID"
              value={teacherData.employeeID}
              onChange={handleInputChange}
              required
            />
            {/* Blood Group Select */}
            <div>
              <label className="block text-base font-medium text-gray-700">
                Blood Group
              </label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={teacherData.bloodGroup}
                onChange={handleInputChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select Blood Group</option>
                {bloodGroupOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Gender Select */}
            <div>
              <label className="block text-base font-medium text-gray-700 ">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={teacherData.gender}
                onChange={handleInputChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Select Gender</option>
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Contact Information Section */}
        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold border-b pb-4">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              id="mobileNumber"
              label="Mobile Number"
              name="mobileNumber"
              value={teacherData.mobileNumber}
              onChange={handleInputChange}
              required
            />
            <FormInput
              id="email"
              label="Email"
              name="email"
              value={teacherData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Address Section */}
          <h2 className="text-xl font-semibold border-b py-4">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              id="country"
              label="Country"
              name="country"
              value={address.country}
              onChange={handleAddressInputChange}
              required
            />
            <FormInput
              id="state"
              label="State"
              name="state"
              value={address.state}
              onChange={handleAddressInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              id="city"
              label="City"
              name="city"
              value={address.city}
              onChange={handleAddressInputChange}
              required
            />
            <FormInput
              id="postalCode"
              label="Postal Code"
              name="postalCode"
              value={address.postalCode}
              onChange={handleAddressInputChange}
              required
            />
          </div>
          <FormInput
            id="street"
            label="Street"
            name="street"
            value={address.street}
            onChange={handleAddressInputChange}
            required
          />
          <div className="w-full flex items-center p-6 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
            <input
              type="file"
              accept=".pdf"
              onChange={handleCVUpload}
              className="block w-full text-base text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-base file:font-semibold file:bg-white file:text-gray-700 hover:file:bg-gray-50"
            />
          </div>
        </motion.div>

        {/* Role Assignment Section (Only when editing) */}
        {data && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold border-b pb-4">
              Role Assignment
            </h2>
            <p className="text-base text-gray-600">
              You can select multiple roles by clicking on them below.
            </p>
            <div className="relative">
              <button
                type="button"
                onClick={toggleRoleDropdown}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-haspopup="listbox"
                aria-expanded={isRoleDropdownOpen}
              >
                <span>Select Roles</span>
                <FaChevronDown />
              </button>
              {isRoleDropdownOpen && (
                <div
                  id="role-dropdown"
                  className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-auto"
                  role="listbox"
                  aria-label="Available Roles"
                >
                  {roles?.flatMap((dept) => dept.roles)?.length === 0 ? (
                    <div className="text-center p-4">
                      <FaUsersSlash className="text-3xl text-gray-400 mx-auto" />
                      <p className="text-base text-gray-500">
                        No roles available.
                      </p>
                    </div>
                  ) : (
                    roles
                      ?.flatMap((dept) => dept.roles)
                      ?.map((roleItem) => (
                        <button
                          key={roleItem.id}
                          type="button"
                          onClick={() => handleRoleSelect(roleItem)}
                          className={`block w-full text-left px-4 py-3 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-base ${
                            selectedRoles.some((r) => r.id === roleItem.id)
                              ? "bg-gray-200"
                              : ""
                          }`}
                          role="option"
                          aria-selected={selectedRoles.some(
                            (r) => r.id === roleItem.id
                          )}
                        >
                          {roleItem.name}
                        </button>
                      ))
                  )}
                </div>
              )}
            </div>
            {/* Display Selected Roles */}
            {selectedRoles?.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {selectedRoles.map((roleItem) => (
                  <motion.div
                    key={roleItem.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-base"
                  >
                    {roleItem.name}
                    <FiX
                      className="ml-3 cursor-pointer hover:text-red-500"
                      onClick={() => handleRoleRemove(roleItem.id)}
                      aria-label={`Remove ${roleItem.name}`}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.div
          className="flex justify-end mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {data ? (
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
              className={`${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              } text-white text-lg py-3 px-8 rounded-md flex items-center justify-center transition-transform duration-200`}
              aria-label="Update User"
            >
              {loading ? (
                <FiLoader className="animate-spin w-6 h-6" />
              ) : (
                "Update User"
              )}
            </motion.button>
          ) : (
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
              className={`${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              } text-white text-lg py-3 px-8 rounded-md flex items-center justify-center transition-transform duration-200`}
              aria-label="Add New User"
            >
              {loading ? (
                <FiLoader className="animate-spin w-6 h-6" />
              ) : (
                "Add New User"
              )}
            </motion.button>
          )}
        </motion.div>
      </form>
    </motion.div>
  );
};

export default AddUser;
