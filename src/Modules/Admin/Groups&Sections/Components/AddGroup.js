import React, { useEffect, useState, useCallback } from "react";
import ImageUpload from "../../Addmission/Components/ImageUpload";
import FormInput from "../../Accounting/subClass/component/FormInput";
import FormSelect from "../../Accounting/subClass/component/FormSelect";
import { FiLoader, FiX } from "react-icons/fi";
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
import { FaChevronDown, FaUserSlash, FaUsersSlash } from "react-icons/fa";

// Example permission mapping. Replace with actual permission data as needed.
const permissionMap = {
  "674dae980b78c61a56287516": "View Users",
  "674ee4cc953b41fb89001506": "Edit Users",
  // Add all permission mappings here
};

const AddUser = ({ role, data }) => {
  const dispatch = useDispatch();
  const { roles } = useSelector((store) => store.admin.rbac);
  const { loading, error } = useSelector((store) => store.admin.all_staff);
  console.log(roles, "Roles Data");

  // States for form data
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
    position: "",
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

  // States for role assignment
  const [selectedRoles, setSelectedRoles] = useState([]);

  // State for permissions related to the selected roles
  const [selectedRolePermissions, setSelectedRolePermissions] = useState([]);

  // Dropdown state for role selection
  const [isRoleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Fetch all roles on component mount
  useEffect(() => {
    dispatch(getAllRolesThunk());
  }, [dispatch]);

  // Populate form data when editing an existing user
  useEffect(() => {
    if (data) {
      setTeacherData({
        firstName: data?.firstName || "",
        lastName: data?.lastName || "",
        dob: data?.dob || "",
        religion: data?.religion || "",
        gender: data?.gender || "",
        position: data?.position || "",
        monthlySalary: data?.monthlySalary || "",
        bloodGroup: data?.bloodGroup || "",
        mobileNumber: data?.mobileNumber || "",
        email: data?.email || "",
        profile: null,
        teacherCV: null,
        employeeID: data?.employeeID || "",
        role: role || "",
        active: true,
      });
      setAddress(data?.address || {});

      // Initialize selectedRoles based on existing data
      const existingRoles = Array.isArray(data.role)
        ? data.role
        : data.role
        ? [data.role]
        : [];

      const initialSelectedRoles = roles
        .flatMap((dept) => dept.roles)
        .filter((r) => existingRoles.includes(r.id))
        .map((role) => ({
          id: role.id,
          name: role.name,
        }));

      setSelectedRoles(initialSelectedRoles);

      // Fetch permissions for the existing role(s)
      const permissions = roles
        .flatMap((dept) => dept.roles)
        .filter((r) => existingRoles.includes(r.id))
        .flatMap((role) => role.permission);

      setSelectedRolePermissions([...new Set(permissions)]);
    }
    return () => {
      resetForm();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, role, roles]);

  // Reset form to initial state
  const resetForm = () => {
    setTeacherData({
      firstName: "",
      lastName: "",
      dob: "",
      religion: "",
      gender: "",
      position: "",
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

  // Options for select fields
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

  // Handle input changes for teacher data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacherData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle input changes for address
  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
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

  // Handle CV upload
  const handleCVUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setTeacherData((prev) => ({
        ...prev,
        teacherCV: file,
      }));
      // Removed validation alerts
    } else {
      alert("Please upload a PDF file.");
    }
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setTeacherData((prev) => ({
      ...prev,
      profile: null,
    }));
  };

  // Handle role selection from dropdown
  const handleRoleSelect = useCallback(
    (role) => {
      // Prevent adding duplicate roles
      if (!selectedRoles.some((r) => r.id === role.id)) {
        const updatedRoles = [
          ...selectedRoles,
          { id: role.id, name: role.name },
        ];
        setSelectedRoles(updatedRoles);

        // Update permissions
        const newPermissions = role.permission;
        setSelectedRolePermissions((prev) => [
          ...new Set([...prev, ...newPermissions]),
        ]);
      }
      setRoleDropdownOpen(false);
    },
    [selectedRoles]
  );

  // Handle role removal
  const handleRoleRemove = useCallback(
    (roleId) => {
      const updatedRoles = selectedRoles.filter((r) => r.id !== roleId);
      setSelectedRoles(updatedRoles);

      // Recalculate permissions
      const remainingPermissions = updatedRoles
        .flatMap((role) => {
          const roleData = roles
            .flatMap((dept) => dept.roles)
            .find((r) => r.id === role.id);
          return roleData ? roleData.permission : [];
        })
        .filter((perm, index, self) => self.indexOf(perm) === index);

      setSelectedRolePermissions(remainingPermissions);
    },
    [selectedRoles, roles]
  );

  // Toggle role dropdown
  const toggleRoleDropdown = () => {
    setRoleDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Ensure at least one role is selected
    if (selectedRoles.length === 0) {
      alert("Please select at least one role.");
      return;
    }

    // Prepare selected role IDs and permissions
    const selectedRoleIds = selectedRoles.map((role) => role.id);
    const permissions = selectedRolePermissions;

    // If adding a new user
    if (!data) {
      try {
        // Dispatch addUser
        const resultAction = await dispatch(
          addUser({ userData: teacherData, address })
        );

        if (addUser.fulfilled.match(resultAction)) {
          const newUser = resultAction.payload; // Assuming the new user data is returned

          // Assign roles to the new user
          if (selectedRoleIds.length > 0) {
            await dispatch(
              assignRoleThunk({
                staffId: newUser._id, // Adjust according to your API response
                roleId: selectedRoleIds,
                permission: permissions,
              })
            ).unwrap();
            alert("User added and roles assigned successfully!");
            resetForm();
          } else {
            alert("User added successfully without role assignment.");
          }
        } else {
          // Handle addUser rejected
          alert("Failed to add user.");
        }
      } catch (error) {
        console.error("Error adding user:", error);
        alert("An error occurred while adding the user.");
      }
    } else {
      // If editing an existing user
      try {
        // Dispatch editUser
        await dispatch(
          editUser({ userData: teacherData, address, id: data?._id })
        ).unwrap();

        // Assign roles to the existing user
        if (selectedRoleIds.length > 0) {
          await dispatch(
            assignRoleThunk({
              staffId: data._id,
              roleId: selectedRoleIds,
              permission: permissions,
            })
          ).unwrap();
          alert("User updated and roles assigned successfully!");
        } else {
          alert("User updated successfully without role assignment.");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        alert("An error occurred while updating the user.");
      }
    }
  };

  // Utility function to get role name by ID
  const getRoleName = (roleId) => {
    const role = roles
      .flatMap((dept) => dept.roles)
      .find((r) => r.id === roleId);
    return role ? role.name : "Unknown Role";
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
        {/* Personal Details Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Image Upload */}
          <div className="col-span-1">
            <ImageUpload
              imagePreview={imagePreview}
              handleImageChange={handleImageChange}
              handleRemoveImage={handleRemoveImage}
            />
          </div>

          {/* First Column */}
          <div className="col-span-1 space-y-4">
            <FormInput
              id="firstName"
              label="First Name"
              name="firstName"
              value={teacherData.firstName}
              onChange={handleInputChange}
              required={true}
            />
            <FormInput
              id="lastName"
              label="Last Name"
              name="lastName"
              value={teacherData.lastName}
              onChange={handleInputChange}
              required={true}
            />
            <FormInput
              id="dob"
              label="Date of Birth"
              type="date"
              name="dob"
              value={teacherData.dob}
              onChange={handleInputChange}
              required={true}
            />
            <FormSelect
              id="religion"
              label="Religion"
              options={religionOptions}
              name="religion"
              value={teacherData.religion}
              onChange={handleInputChange}
              required={true}
            />
            <FormSelect
              id="gender"
              label="Gender"
              options={genderOptions}
              name="gender"
              value={teacherData.gender}
              onChange={handleInputChange}
              required={true}
            />
          </div>

          {/* Second Column */}
          <div className="col-span-1 space-y-4">
            <FormInput
              id="monthlySalary"
              label="Monthly Salary"
              type="number"
              name="monthlySalary"
              value={teacherData.monthlySalary}
              onChange={handleInputChange}
              required={true}
            />
            <FormInput
              id="employeeID"
              label="Employee ID"
              name="employeeID"
              value={teacherData.employeeID}
              onChange={handleInputChange}
              required={true}
            />
            <FormSelect
              id="bloodGroup"
              label="Blood Group"
              options={bloodGroupOptions}
              name="bloodGroup"
              value={teacherData.bloodGroup}
              onChange={handleInputChange}
              required={true}
            />
            <FormInput
              id="position"
              label="Position"
              name="position"
              value={teacherData.position}
              onChange={handleInputChange}
              required={true}
            />
          </div>
        </motion.div>

        {/* Address Section */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold border-b pb-2">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              id="country"
              label="Country"
              name="country"
              value={address.country}
              onChange={handleAddressInputChange}
              required={true}
            />
            <FormInput
              id="state"
              label="State"
              name="state"
              value={address.state}
              onChange={handleAddressInputChange}
              required={true}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              id="city"
              label="City"
              name="city"
              value={address.city}
              onChange={handleAddressInputChange}
              required={true}
            />
            <FormInput
              id="postalCode"
              label="Postal Code"
              name="postalCode"
              value={address.postalCode}
              onChange={handleAddressInputChange}
              required={true}
            />
          </div>
          <FormInput
            id="street"
            label="Street"
            name="street"
            value={address.street}
            onChange={handleAddressInputChange}
            required={true}
          />
          {/* CV Upload */}
          <div className="flex items-center p-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
            <input
              type="file"
              accept=".pdf"
              onChange={handleCVUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-white file:text-gray-700 hover:file:bg-gray-50"
            />
          </div>
        </motion.div>

        {/* Role Assignment Section */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold border-b pb-2">
            Role Assignment
          </h2>
          {/* Instruction Text */}
          <p className="text-sm text-gray-600">
            You can select multiple roles by holding down the{" "}
            <span className="font-medium">Ctrl</span> (Windows) or{" "}
            <span className="font-medium">Command</span> (Mac) key while
            selecting.
          </p>
          <div className="relative">
            <button
              type="button"
              onClick={toggleRoleDropdown}
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-left flex justify-between items-center hover:bg-gray-50"
            >
              <span>Select Roles</span>
              <FaChevronDown />
            </button>
            {isRoleDropdownOpen && (
              <div
                id="role-dropdown"
                className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                {roles.flatMap((dept) => dept.roles).length === 0 ? (
                  <div className="text-center p-4">
                    <FaUsersSlash className="text-2xl text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-500">No roles available.</p>
                  </div>
                ) : (
                  roles
                    .flatMap((dept) => dept.roles)
                    .map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => handleRoleSelect(role)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        {role.name}
                      </button>
                    ))
                )}
              </div>
            )}
          </div>
          {/* Display Selected Roles as Badges */}
          {selectedRoles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedRoles.map((role) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {role.name}
                  <FiX
                    className="ml-2 cursor-pointer"
                    onClick={() => handleRoleRemove(role.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
          {/* Display Permissions */}
          {selectedRolePermissions.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium">Aggregated Permissions:</h3>
              <ul className="list-disc list-inside">
                {selectedRolePermissions.map((permId) => (
                  <li key={permId}>{permissionMap[permId] || permId}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div
          className="flex justify-end"
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
              } text-white py-2 px-10 rounded-md flex items-center justify-center`}
            >
              {loading ? (
                <FiLoader className="animate-spin w-5 h-5" />
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
              } text-white py-2 px-10 rounded-md flex items-center justify-center`}
            >
              {loading ? (
                <FiLoader className="animate-spin w-5 h-5" />
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
