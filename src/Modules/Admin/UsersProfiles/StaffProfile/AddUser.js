// Components/Admin/Users/Staff/AddUser.js
import React, { useEffect, useState, useMemo } from "react";
import ImageUpload from "../../Addmission/Components/ImageUpload";
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

// ----- Ant Design -----
import { Upload, Button, Select, Input, InputNumber } from "antd";
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
  const [allRoleItems, setAllRoleItems] = useState([]); // Full list of roles
  const [filteredRoleItems, setFilteredRoleItems] = useState([]); // Search-filtered roles

  /* ------------------------------------------------------------------
     Effects – load roles & pre-populate data when editing
  ------------------------------------------------------------------*/
  useEffect(() => {
    if (error?.message) toast.error(error.message);
  }, [error]);

  useEffect(() => {
    dispatch(getAllRolesThunk());
  }, [dispatch]);

  useEffect(() => {
    const flatRoles = roles?.flatMap((dept) => dept.roles) || [];
    setAllRoleItems(flatRoles);
    setFilteredRoleItems(flatRoles);
  }, [roles]);

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
        profile: null,
        teacherCV: null,
        employeeID: data.employeeID || "",
        role: "",
        active: data.active ?? true,
      });

      setAddress({
        street: data.address?.street || "",
        city: data.address?.city || "",
        state: data.address?.state || "",
        postalCode: data.address?.postalCode || "",
        country: data.address?.country || "",
      });

      setImagePreview(data.profile || null);

      // Pre-select existing roles
      const existingRoleNames = Array.isArray(data.position)
        ? data.position
        : data.position
        ? [data.position]
        : [];
      const initialSelectedRoles =
        allRoleItems
          ?.filter((r) => existingRoleNames.includes(r.name))
          .map((r) => ({ id: r.id, name: r.name, permission: r.permission })) ||
        [];
      setSelectedRoles(initialSelectedRoles);
      setSelectedRolePermissions([...new Set(data.permission || [])]);
    } else {
      resetForm();
    }
  }, [data, role, allRoleItems]);

  /* ------------------------------------------------------------------
     Helpers
  ------------------------------------------------------------------*/
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

  // Generic input handler (works for Ant Input + native inputs)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacherData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  /* ------------------------- Profile Image ------------------------- */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setTeacherData((prev) => ({ ...prev, profile: file }));
    }
  };

  /* ---------------------------- CV Upload --------------------------- */
  const handleCVBeforeUpload = (file) => {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return Upload.LIST_IGNORE;
    }
    setTeacherData((prev) => ({ ...prev, teacherCV: file }));
    return false; // stop auto-upload
  };

  const handleRemoveFile = () =>
    setTeacherData((prev) => ({ ...prev, teacherCV: null }));

  const handlePreviewFile = (file) => {
    const fileURL = URL.createObjectURL(file.originFileObj);
    window.open(fileURL, "_blank");
  };

  /* ------------------------- Fuzzy-Search Roles ---------------------- */
  const fuse = useMemo(
    () =>
      new Fuse(allRoleItems, {
        keys: ["name"],
        threshold: 0.3,
        includeMatches: true,
      }),
    [allRoleItems]
  );

  const highlightText = (text, matchedIndices) => {
    if (!matchedIndices?.length) return text;
    const res = [];
    let last = 0;
    matchedIndices.forEach(([start, end]) => {
      if (start > last) res.push(text.slice(last, start));
      res.push(
        <mark key={`${start}-${end}`} className="bg-yellow-200">
          {text.slice(start, end + 1)}
        </mark>
      );
      last = end + 1;
    });
    if (last < text.length) res.push(text.slice(last));
    return <>{res}</>;
  };

  const handleRoleSearch = (value) => {
    if (!value) return setFilteredRoleItems(allRoleItems);
    const results = fuse.search(value).map((r) => ({
      ...r.item,
      highlightIndices: r.matches?.[0]?.indices || [],
    }));
    setFilteredRoleItems(results);
  };

  const handleRoleChange = (selectedNames) => {
    const matched = allRoleItems
      .filter((r) => selectedNames.includes(r.name))
      .map((r) => ({ id: r.id, name: r.name, permission: r.permission }));
    setSelectedRoles(matched);
    setSelectedRolePermissions([
      ...new Set(matched.flatMap((r) => r.permission)),
    ]);
  };

  /* ---------------------------- Submit ------------------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teacherData.firstName.trim())
      return toast.error("First name is required.");
    if (!teacherData.email?.includes("@"))
      return toast.error("Please enter a valid email address.");

    const selectedRoleIds = selectedRoles.map((r) => r.id);
    const permissions = selectedRolePermissions;

    const payload = { ...teacherData };

    try {
      if (data) {
        // Update
        await dispatch(
          editUser({ userData: payload, address, id: data._id })
        ).unwrap();
        await dispatch(
          assignRoleThunk({
            staffId: data._id,
            roleId: selectedRoleIds,
            permission: permissions,
          })
        ).unwrap();
        if (role === "teacher") dispatch(fetchAllTeachers());
        toast.success("User updated and roles assigned successfully!");
      } else {
        // Create
        const res = await dispatch(
          addUser({ userData: payload, address })
        ).unwrap();
        if (res) resetForm();
        else toast.error("Failed to add user.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  /* ========================== RENDER ========================== */
  return (
    <motion.div
      className="p-6 bg-white shadow-md rounded-lg overflow-auto"
      style={{ maxHeight: "90vh" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* ───── Top Section ───── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Avatar */}
          <div className="col-span-1 flex justify-center mt-5">
            <ImageUpload
              imagePreview={imagePreview}
              handleImageChange={handleImageChange}
              handleRemoveImage={() => {
                setImagePreview(null);
                setTeacherData((p) => ({ ...p, profile: null }));
              }}
              height="h-80"
              width="w-80"
            />
          </div>

          {/* Left column */}
          <div className="col-span-1 space-y-6">
            <div>
              <label className="block text-base font-medium text-gray-700">
                First Name
              </label>
              <Input
                name="firstName"
                value={teacherData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700">
                Last Name
              </label>
              <Input
                name="lastName"
                value={teacherData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700">
                Date of Birth
              </label>
              <Input
                type="date"
                name="dob"
                value={teacherData.dob}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700">
                Religion
              </label>
              <Select
                value={teacherData.religion}
                onChange={(value) =>
                  setTeacherData((p) => ({ ...p, religion: value }))
                }
                placeholder="Select Religion"
                style={{ width: "100%" }}
              >
                {religionOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          {/* Right column */}
          <div className="col-span-1 space-y-6">
            <div>
              <label className="block text-base font-medium text-gray-700">
                Monthly Salary
              </label>
              <InputNumber
                name="monthlySalary"
                value={teacherData.monthlySalary}
                onChange={(value) =>
                  setTeacherData((p) => ({ ...p, monthlySalary: value }))
                }
                className="w-full"
                min={0}
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700">
                Employee ID
              </label>
              <Input
                name="employeeID"
                value={teacherData.employeeID}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700">
                Blood Group
              </label>
              <Select
                value={teacherData.bloodGroup}
                onChange={(value) =>
                  setTeacherData((p) => ({ ...p, bloodGroup: value }))
                }
                placeholder="Select Blood Group"
                style={{ width: "100%" }}
              >
                {bloodGroupOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700">
                Gender
              </label>
              <Select
                value={teacherData.gender}
                onChange={(value) =>
                  setTeacherData((p) => ({ ...p, gender: value }))
                }
                placeholder="Select Gender"
                style={{ width: "100%" }}
                required
              >
                {genderOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </motion.div>

        {/* ───── Contact Information ───── */}
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
            <div>
              <label className="block text-base font-medium text-gray-700">
                Mobile Number
              </label>
              <Input
                name="mobileNumber"
                value={teacherData.mobileNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700">
                Email
              </label>
              <Input
                name="email"
                value={teacherData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* ───── Address ───── */}
          <h2 className="text-xl font-semibold border-b py-4">Address</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-medium text-gray-700">
                Country
              </label>
              <Input
                name="country"
                value={address.country}
                onChange={handleAddressInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700">
                State
              </label>
              <Input
                name="state"
                value={address.state}
                onChange={handleAddressInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-medium text-gray-700">
                City
              </label>
              <Input
                name="city"
                value={address.city}
                onChange={handleAddressInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700">
                Postal Code
              </label>
              <Input
                name="postalCode"
                value={address.postalCode}
                onChange={handleAddressInputChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700">
              Street
            </label>
            <Input
              name="street"
              value={address.street}
              onChange={handleAddressInputChange}
              required
            />
          </div>

          {/* ───── CV Upload ───── */}
          <div className="space-y-4 mt-6">
            <label className="block text-base font-medium text-gray-700 my-2">
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
                      showPreviewIcon: true,
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

        {/* ───── Role Assignment (edit only) ───── */}
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
                filterOption={false}
                onSearch={handleRoleSearch}
              >
                {filteredRoleItems.map((roleItem) => (
                  <Option key={roleItem.id} value={roleItem.name}>
                    {highlightText(roleItem.name, roleItem.highlightIndices)}
                  </Option>
                ))}
              </Select>
            </ProtectedSection>
          </motion.div>
        )}

        {/* ───── Submit Button ───── */}
        <motion.div
          className="flex justify-end mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
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
            aria-label={data ? "Update User" : "Add New User"}
          >
            {loading ? (
              <FiLoader className="animate-spin w-6 h-6" />
            ) : data ? (
              "Update User"
            ) : (
              "Add New User"
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default AddUser;
