// Components/Admin/Users/Staff/AddUser.js

import React, { useEffect, useState, useMemo } from "react";
import ImageUpload from "../../Addmission/Components/ImageUpload";
import FormInput from "../../Accounting/subClass/component/FormInput";
import { FiLoader } from "react-icons/fi";
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
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";

// ----- Ant Design imports -----
import { Upload, Button, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";

// ----- Fuzzy Search -----
import Fuse from "fuse.js";
import { fetchAllTeachers } from "../../../../Store/Slices/Admin/Class/Teachers/teacherThunks";

const { Option } = Select;

const AddUser = ({ role, data }) => {
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

  // Role states
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedRolePermissions, setSelectedRolePermissions] = useState([]);

  // For fuzzy search
  const [allRoleItems, setAllRoleItems] = useState([]); // The full list of roles from Redux
  const [filteredRoleItems, setFilteredRoleItems] = useState([]); // The roles to display (after search)

  // 1. Load roles from Redux & handle errors
  useEffect(() => {
    if (error?.message) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    dispatch(getAllRolesThunk());
  }, [dispatch]);

  // 2. Whenever roles update, flatten them & store
  useEffect(() => {
    const flatRoles = roles?.flatMap((dept) => dept.roles) || [];
    setAllRoleItems(flatRoles);
    setFilteredRoleItems(flatRoles);
  }, [roles]);

  // 3. If editing an existing user, populate data
  useEffect(() => {
    if (data) {
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

      setAddress({
        street: data.address?.street || "",
        city: data.address?.city || "",
        state: data.address?.state || "",
        postalCode: data.address?.postalCode || "",
        country: data.address?.country || "",
      });

      // Profile image preview
      setImagePreview(data.profile || null);

      // Convert user’s positions to selectedRoles
      const existingRoleNames = Array.isArray(data.position)
        ? data.position
        : data.position
        ? [data.position]
        : [];
      // Build initial selected roles from store
      const initialSelectedRoles =
        allRoleItems
          ?.filter((roleItem) => existingRoleNames.includes(roleItem.name))
          .map((roleItem) => ({
            id: roleItem.id,
            name: roleItem.name,
            permission: roleItem.permission,
          })) || [];

      setSelectedRoles(initialSelectedRoles);

      // Permissions array
      const permissions = data.permission || [];
      setSelectedRolePermissions([...new Set(permissions)]);
    } else {
      resetForm();
    }
  }, [data, role, allRoleItems]);

  // ---------- Reset Form ----------
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

  // ---------- Options for selects ----------
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

  // ---------- Form input changes ----------
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

  // ---------- Profile image changes ----------
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

  // ---------- PDF Upload logic ----------
  const handleCVBeforeUpload = (file) => {
    // Only accept PDF
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return Upload.LIST_IGNORE;
    }
    setTeacherData((prev) => ({
      ...prev,
      teacherCV: file,
    }));
    return false; // Stop auto-upload
  };

  const handleRemoveFile = () => {
    setTeacherData((prev) => ({ ...prev, teacherCV: null }));
  };

  const handlePreviewFile = (file) => {
    const fileURL = URL.createObjectURL(file.originFileObj);
    window.open(fileURL, "_blank");
  };

  // ---------- Fuzzy search for roles ----------
  // Prepare a Fuse instance with memo to avoid re-creating on each render
  const fuse = useMemo(() => {
    return new Fuse(allRoleItems, {
      keys: ["name"],
      threshold: 0.3, // Adjust for more/less fuzzy matching
      includeMatches: true,
    });
  }, [allRoleItems]);

  // Utility to highlight matched text in the dropdown
  const highlightText = (text, matchedIndicesArray) => {
    if (!matchedIndicesArray || !matchedIndicesArray.length) {
      return text; // no highlights
    }
    let result = [];
    let lastIndex = 0;

    matchedIndicesArray.forEach(([start, end]) => {
      if (start > lastIndex) {
        result.push(text.slice(lastIndex, start));
      }
      result.push(
        <mark key={`${start}-${end}`} className="bg-yellow-200">
          {text.slice(start, end + 1)}
        </mark>
      );
      lastIndex = end + 1;
    });
    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }
    return <>{result}</>;
  };

  // Called whenever user types in the Select's search box
  const handleRoleSearch = (searchValue) => {
    if (!searchValue) {
      // If no input, reset
      setFilteredRoleItems(allRoleItems);
      return;
    }
    // Fuzzy search with fuse
    const results = fuse.search(searchValue);

    // Build new role list with match info
    const newList = results.map((res) => ({
      ...res.item,
      highlightIndices:
        res.matches && res.matches[0]?.indices ? res.matches[0].indices : [],
    }));

    setFilteredRoleItems(newList);
  };

  // Called when the user selects/unselects roles
  const handleRoleChange = (selectedRoleNames) => {
    const matched = allRoleItems
      ?.filter((r) => selectedRoleNames.includes(r.name))
      .map((r) => ({
        id: r.id,
        name: r.name,
        permission: r.permission,
      }));
    setSelectedRoles(matched);

    const newPermissions = matched.flatMap((roleItem) => roleItem.permission);
    setSelectedRolePermissions([...new Set(newPermissions)]);
  };

  // ---------- Form submit ----------
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

    // Prepare data
    const preparedTeacherData = {
      ...teacherData,
    };

    if (data) {
      // Update flow
      try {
        await dispatch(
          editUser({ userData: preparedTeacherData, address, id: data._id })
        ).unwrap();

        await dispatch(
          assignRoleThunk({
            staffId: data._id,
            roleId: selectedRoleIds,
            permission: permissions,
          })
        ).unwrap();
        if (role === "teacher") {
          dispatch(fetchAllTeachers());
        }

        toast.success("User updated and roles assigned successfully!");
      } catch (err) {
        toast.error("An error occurred while updating the user.");
      }
    } else {
      // Add flow
      try {
        const addResult = await dispatch(
          addUser({ userData: preparedTeacherData, address })
        ).unwrap();

        if (addResult) {
          //toast.success("User added successfully!");
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

  // ---------- Render ----------
  return (
    <motion.div
      className="p-6 bg-white shadow-md rounded-lg overflow-auto"
      style={{ maxHeight: "90vh" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* ----- TOP PORTION UNCHANGED ----- */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="col-span-1 flex justify-center mt-5 ">
            <ImageUpload
              imagePreview={imagePreview}
              handleImageChange={handleImageChange}
              handleRemoveImage={() => {
                setImagePreview(null);
                setTeacherData((prev) => ({ ...prev, profile: null }));
              }}
              height="h-80"
              width="w-80"
            />
          </div>

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
        {/* ----- END TOP PORTION UNCHANGED ----- */}

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

          {/* ---------- Enhanced AntD File Upload with Preview ---------- */}
          <div className="space-y-4 mt-6">
            <label className="block text-base font-medium text-gray-700 my-2 ">
              Upload CV (PDF):
            </label>
            <Upload
              accept=".pdf"
              beforeUpload={handleCVBeforeUpload}
              onRemove={handleRemoveFile}
              onPreview={handlePreviewFile}
              showUploadList={
                teacherData.teacherCV
                  ? {
                      showRemoveIcon: true,
                      showPreviewIcon: true, // Eye icon
                    }
                  : false
              }
              fileList={
                teacherData.teacherCV
                  ? [
                      {
                        uid: "-1",
                        name: teacherData.teacherCV.name,
                        status: "done",
                        originFileObj: teacherData.teacherCV,
                      },
                    ]
                  : []
              }
            >
              <Button icon={<UploadOutlined />}>Select PDF</Button>
            </Upload>
          </div>
        </motion.div>

        {/* ---------- Role Assignment Section (Only when editing) ---------- */}
        {data && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <ProtectedSection requiredPermission={PERMISSIONS.ASSIGN_ROLE}>
              <h2 className="text-xl font-semibold">Role Assignment</h2>
              <p className="text-xs text-green-600 mb-2">
                You can select multiple roles below (fuzzy search enabled):
              </p>
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="Search & Select Roles"
                value={selectedRoles.map((r) => r.name)}
                onChange={handleRoleChange}
                // Turn on search
                showSearch
                // We'll do our own filtering with fuse
                filterOption={false}
                onSearch={handleRoleSearch}
              >
                {filteredRoleItems.map((roleItem) => {
                  return (
                    <Option key={roleItem.id} value={roleItem.name}>
                      {/* highlight the matched text */}
                      {highlightText(roleItem.name, roleItem.highlightIndices)}
                    </Option>
                  );
                })}
              </Select>
            </ProtectedSection>
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
