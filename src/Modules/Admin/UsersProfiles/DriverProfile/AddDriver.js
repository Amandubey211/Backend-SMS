import React, { useEffect, useState, useMemo } from "react";
import FormInput from "../../Accounting/subClass/component/FormInput";
import { FiLoader } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllRolesThunk,
    assignRoleThunk,
} from "../../../../Store/Slices/Common/RBAC/rbacThunks";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import { RELIGION_OPTIONS } from '../../Addmission/AdminAdmission/Configs/selectOptionsConfig';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Upload, Button, Switch, Select, Modal } from "antd";
import { UploadOutlined, EyeOutlined, CloseOutlined } from "@ant-design/icons";
import Fuse from "fuse.js";
import { addDriver, updateDriver } from "../../../../Store/Slices/Transportation/Driver/driver.action";
import CustomUploadCard from "../../../LoginPages/Student/SignUp/Components/CustomUploadCard";

const { Option } = Select;

const CustomPhoneInput = ({ label, value, onChange, required }) => {
    return (
        <div className="mb-4">
            <label className="block text-base font-medium text-gray-700 mt-[16.8px]">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <PhoneInput
                international
                defaultCountry="qa"
                placeholder="Enter phone number"
                value={value}
                onChange={onChange}
                inputStyle={{
                    width: "100%",
                    height: 37,
                    fontSize: 16,
                    border: "1px solid #d9d9d9",
                    borderRadius: "6px",
                }}
                containerStyle={{ width: "100%" }}
                buttonStyle={{
                    border: "1px solid #d9d9d9",
                    borderRadius: "0",
                    background: "transparent",
                    padding: "0 10px",
                    width: "50px",
                }}
                enableSearch={true}
                countryCodeEditable={false}
            />
        </div>
    );
};

const AddDriver = ({ role, data }) => {
    const dispatch = useDispatch();
    const { roles } = useSelector((store) => store.admin.rbac);
    const { loading, error } = useSelector((store) => store.admin.all_staff);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);

    const initialDriverData = {
        fullName: "",
        driverBadgeNumber: "",
        joiningDate: "",
        resignationDate: "",
        dateOfBirth: "",
        religion: "",
        gender: "",
        address: "",
        bloodGroup: "",
        contactNumber: "+974",
        email: "",
        photo: null,
        teacherCV: null,
        policeVerificationDone: false,
        national_Id: "",
        licenseNumber: "",
        licenseExpiryDate: "",
        role: "staff",
        active: true,
    };

    const [teacherData, setTeacherData] = useState(() => {
        // Only use localStorage for new driver forms, not when editing
        if (!data) {
            const savedData = localStorage.getItem('driverFormData');
            return savedData ? JSON.parse(savedData) : initialDriverData;
        }
        return initialDriverData;
    });

    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedRolePermissions, setSelectedRolePermissions] = useState([]);
    const [allRoleItems, setAllRoleItems] = useState([]);
    const [filteredRoleItems, setFilteredRoleItems] = useState([]);

    // Simulate a form object for CustomUploadCard
    const [formValues, setFormValues] = useState({ photo: null });
    const form = {
        getFieldValue: (name) => formValues[name],
        setFieldValue: (name, value) => {
            setFormValues((prev) => ({ ...prev, [name]: value }));
            setTeacherData((prev) => ({
                ...prev,
                photo: value ? value.url : null,
            }));
        },
    };

    useEffect(() => {
        // Only save to localStorage when adding a new driver, not when editing
        if (!data) {
            localStorage.setItem('driverFormData', JSON.stringify(teacherData));
        }
    }, [teacherData, data]);

    useEffect(() => {
        if (error?.message) {
            toast.error(error.message);
        }
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
            // When editing a driver, explicitly set the photo to null if not present in data
            const photoUrl = data.photo || null;
            setTeacherData({
                fullName: data.fullName || "",
                driverBadgeNumber: data.driverBadgeNumber || "",
                joiningDate: data.joiningDate ? new Date(data.joiningDate).toISOString().split("T")[0] : "",
                resignationDate: data.resignationDate ? new Date(data.resignationDate).toISOString().split("T")[0] : "",
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split("T")[0] : "",
                religion: data.religion || "",
                gender: data.gender || "",
                address: data.address || "",
                bloodGroup: data.bloodGroup || "",
                contactNumber: data.contactNumber || "",
                email: data.email || "",
                photo: photoUrl,
                teacherCV: null,
                national_Id: data.national_Id || "",
                role: data.role || "staff",
                policeVerificationDone: data.policeVerificationDone || false,
                licenseNumber: data.licenseNumber || "",
                licenseExpiryDate: data.licenseExpiryDate ? new Date(data.licenseExpiryDate).toISOString().split("T")[0] : "",
                active: data.active ?? true,
            });
            setFormValues({ photo: photoUrl ? { url: photoUrl } : null });
            const existingRoleNames = Array.isArray(data.position)
                ? data.position
                : data.position
                    ? [data.position]
                    : [];
            const initialSelectedRoles =
                allRoleItems
                    ?.filter((roleItem) => existingRoleNames.includes(roleItem.name))
                    .map((roleItem) => ({
                        id: roleItem.id,
                        name: roleItem.name,
                        permission: roleItem.permission,
                    })) || [];
            setSelectedRoles(initialSelectedRoles);
            const permissions = data.permission || [];
            setSelectedRolePermissions([...new Set(permissions)]);
            // Clear localStorage when editing to avoid stale data
            localStorage.removeItem('driverFormData');
        } else {
            resetForm();
        }
    }, [data, role, allRoleItems]);

    const resetForm = () => {
        setTeacherData(initialDriverData);
        setSelectedRoles([]);
        setSelectedRolePermissions([]);
        setFormValues({ photo: null });
        localStorage.removeItem('driverFormData');
    };

    const handleRemoveImage = () => {
        setTeacherData((prev) => ({ ...prev, photo: null }));
        setFormValues({ photo: null });
        toast.success("Image removed successfully!");
    };

    const genderOptions = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "trans", label: "Trans" },
    ];
    const bloodGroupOptions = [
        { value: "O+", label: "O+" },
        { value: "A+", label: "A+" },
        { value: "B+", label: "B+" },
        { value: "AB+", label: "AB+" },
        { value: "O-", label: "O-" },
        { value: "A-", label: "A-" },
        { value: "B-", label: "B-" },
        { value: "AB-", label: "AB-" },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTeacherData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCVBeforeUpload = (file) => {
        if (file.type !== "application/pdf") {
            toast.error("Please upload a PDF file for the additional document.");
            return Upload.LIST_IGNORE;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("PDF document size should be less than 5MB.");
            return Upload.LIST_IGNORE;
        }
        setTeacherData((prev) => ({
            ...prev,
            teacherCV: file,
        }));
        return false;
    };

    const handleRemoveFile = () => {
        setTeacherData((prev) => ({ ...prev, teacherCV: null }));
        setPdfUrl(null);
    };

    const handlePreviewFile = () => {
        if (teacherData.teacherCV) {
            if (teacherData.teacherCV instanceof File) {
                const fileURL = URL.createObjectURL(teacherData.teacherCV);
                setPdfUrl(fileURL);
                setIsModalVisible(true);
            } else if (typeof teacherData.teacherCV === 'string') {
                setPdfUrl(teacherData.teacherCV);
                setIsModalVisible(true);
            } else {
                // console.error("teacherCV is neither a File nor a string URL:", teacherData.teacherCV);
                toast.error("Cannot preview the PDF file.");
            }
        } else {
            // console.error("No teacherCV found in teacherData:", teacherData);
            toast.error("No PDF file available to preview.");
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setPdfUrl(null);
    };

    const customItemRender = (originNode, file, fileList, actions) => {
        return (
            <div className="flex items-center justify-between">
                <span>{file.name}</span>
                <div className="flex items-center space-x-2">
                    <EyeOutlined
                        onClick={handlePreviewFile}
                        className="text-blue-500 hover:text-blue-700"
                        title="View PDF"
                    />
                    {actions.remove && (
                        <CloseOutlined
                            onClick={() => actions.remove(file)}
                            className="text-red-500 hover:text-red-700"
                            title="Remove PDF"
                        />
                    )}
                </div>
            </div>
        );
    };

    const fuse = useMemo(() => {
        return new Fuse(allRoleItems, {
            keys: ["name"],
            threshold: 0.3,
            includeMatches: true,
        });
    }, [allRoleItems]);

    const highlightText = (text, matchedIndicesArray) => {
        if (!matchedIndicesArray || !matchedIndicesArray.length) return text;
        let result = [];
        let lastIndex = 0;
        matchedIndicesArray.forEach(([start, end]) => {
            if (start > lastIndex) result.push(text.slice(lastIndex, start));
            result.push(<mark key={`${start}-${end}`} className="bg-yellow-200">{text.slice(start, end + 1)}</mark>);
            lastIndex = end + 1;
        });
        if (lastIndex < text.length) result.push(text.slice(lastIndex));
        return <>{result}</>;
    };

    const handleRoleSearch = (searchValue) => {
        if (!searchValue) {
            setFilteredRoleItems(allRoleItems);
            return;
        }
        const results = fuse.search(searchValue);
        const newList = results.map((res) => ({
            ...res.item,
            highlightIndices: res.matches && res.matches[0]?.indices ? res.matches[0].indices : [],
        }));
        setFilteredRoleItems(newList);
    };

    const handleRoleChange = (selectedRoleNames) => {
        const matched = allRoleItems
            ?.filter((r) => selectedRoleNames.includes(r.name))
            .map((r) => ({ id: r.id, name: r.name, permission: r.permission }));
        setSelectedRoles(matched);
        const newPermissions = matched.flatMap((roleItem) => roleItem.permission);
        setSelectedRolePermissions([...new Set(newPermissions)]);
    };

    const validateForm = () => {
        const {
            fullName, joiningDate, dateOfBirth, religion, gender, address,
            contactNumber, email, national_Id, licenseNumber, licenseExpiryDate,
            driverBadgeNumber, bloodGroup, photo
        } = teacherData;

        if (!fullName.trim()) {
            toast.error("Full Name is required.");
            return false;
        }
        if (fullName.trim().length < 3) {
            toast.error("Full Name must be at least 3 characters long.");
            return false;
        }
        if (!/^[a-zA-Z\s.-]+$/.test(fullName)) {
            toast.error("Full Name can only contain letters, spaces, dots, and hyphens.");
            return false;
        }

        if (!dateOfBirth) {
            toast.error("Date of Birth is required.");
            return false;
        } else {
            const dob = new Date(dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            if (age < 18) {
                toast.error("Driver must be at least 18 years old.");
                return false;
            }
            if (dob > today) {
                toast.error("Date of Birth cannot be in the future.");
                return false;
            }
        }

        if (!joiningDate) {
            toast.error("Joining Date is required.");
            return false;
        } else {
            const joinDate = new Date(joiningDate);
            const dob = new Date(dateOfBirth);
            if (dateOfBirth && joinDate < dob) {
                toast.error("Joining Date cannot be before Date of Birth.");
                return false;
            }
        }

        if (data && teacherData.resignationDate) {
            const resignDate = new Date(teacherData.resignationDate);
            const joinDate = new Date(joiningDate);
            if (resignDate < joinDate) {
                toast.error("Resignation Date cannot be before Joining Date.");
                return false;
            }
        }

        if (!religion) {
            toast.error("Religion is required.");
            return false;
        }
        if (!gender) {
            toast.error("Gender is required.");
            return false;
        }

        if (!driverBadgeNumber.trim()) {
            toast.error("Driver Badge Number is required.");
            return false;
        }
        if (!/^\d+$/.test(driverBadgeNumber)) {
            toast.error("Driver Badge Number must be a valid number.");
            return false;
        }

        if (!bloodGroup) {
            toast.error("Blood Group is required.");
            return false;
        }

        if (!contactNumber.trim()) {
            toast.error("Contact Number is required.");
            return false;
        }
        if (!/^\+?[0-9\s-()]{7,15}$/.test(contactNumber)) {
            toast.error("Please enter a valid contact number (7-15 digits, can include +, spaces, -, ()).");
            return false;
        }

        if (!email.trim()) {
            toast.error("Email is required.");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error("Please enter a valid email address.");
            return false;
        }

        if (!address.trim()) {
            toast.error("Address is required.");
            return false;
        }
        if (address.trim().length < 5) {
            toast.error("Address must be at least 5 characters long.");
            return false;
        }

        if (!national_Id.trim()) {
            toast.error("National ID is required.");
            return false;
        }
        if (!/^[a-zA-Z0-9-]{5,20}$/.test(national_Id)) {
            toast.error("Please enter a valid National ID (5-20 alphanumeric characters or hyphens).");
            return false;
        }

        if (!licenseNumber.trim()) {
            toast.error("License Number is required.");
            return false;
        }
        if (licenseNumber.trim().length < 5) {
            toast.error("License Number seems too short.");
            return false;
        }

        if (!licenseExpiryDate) {
            toast.error("License Expiry Date is required.");
            return false;
        } else {
            const expiry = new Date(licenseExpiryDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (expiry < today) {
                toast.error("License Expiry Date cannot be in the past.");
                return false;
            }
        }

        if (!photo) {
            toast.error("Driver photo is required.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (!validateForm()) {
            setIsSubmitting(false);
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
                    updateDriver({ id: data._id, data: preparedTeacherData })
                ).unwrap();

                await dispatch(
                    assignRoleThunk({
                        staffId: data._id,
                        roleId: selectedRoleIds,
                        permission: permissions,
                    })
                ).unwrap();

                toast.success("Driver updated and roles assigned successfully!");
            } catch (err) {
                toast.error("An error occurred while updating the Driver.");
            } finally {
                setIsSubmitting(false);
            }
        } else {
            try {
                const addResult = await dispatch(addDriver({ data: preparedTeacherData })).unwrap();
                if (addResult && addResult.success) {
                    toast.success("Driver added successfully!");
                    resetForm();
                    if (selectedRoleIds.length > 0 && addResult._id) {
                        await dispatch(
                            assignRoleThunk({
                                staffId: addResult._id,
                                roleId: selectedRoleIds,
                                permission: permissions,
                            })
                        ).unwrap();
                        toast.success("Roles assigned to new driver!");
                    } else if (selectedRoleIds.length > 0 && !addResult._id) {
                        toast.warn("Driver added, but could not assign roles due to missing ID from add response.");
                    }
                } else {
                    toast.error(addResult?.error || "Failed to add driver.");
                }
            } catch (err) {
                // console.error("Error adding driver:", err);
                toast.error(err?.message || "An error occurred while adding the driver.");
            } finally {
                setIsSubmitting(false);
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
            <form className="space-y-8" onSubmit={handleSubmit} noValidate>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className="col-span-1 flex justify-center mt-5">
                        <CustomUploadCard
                            name="photo"
                            form={form}
                            recommendedSize="300x400"
                            width="w-80"
                            height="h-80"
                            required={true}
                            profilelink={teacherData.photo || null}
                            onRemove={handleRemoveImage}
                        />
                    </div>

                    <div className="col-span-1 space-y-6">
                        <FormInput
                            id="fullName"
                            label="Full Name"
                            name="fullName"
                            value={teacherData.fullName}
                            onChange={handleInputChange}
                            required
                        />
                        <FormInput
                            id="dateOfBirth"
                            label="Date of Birth"
                            type="date"
                            name="dateOfBirth"
                            value={teacherData.dateOfBirth}
                            onChange={handleInputChange}
                            required
                        />
                        <FormInput
                            id="joiningDate"
                            label="Joining Date"
                            type="date"
                            name="joiningDate"
                            value={teacherData.joiningDate}
                            onChange={handleInputChange}
                            required
                        />
                        <div>
                            <label htmlFor="religion" className="block text-base font-medium text-gray-700">
                                Religion <span className="text-red-500">*</span>
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
                                {RELIGION_OPTIONS && RELIGION_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col-span-1 space-y-6">
                        <div>
                            <FormInput
                                id="driverBadgeNumber"
                                type="text"
                                label={"Driver Badge Number"}
                                name="driverBadgeNumber"
                                value={teacherData.driverBadgeNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="bloodGroup" className="block text-base font-medium text-gray-700">
                                Blood Group <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="bloodGroup"
                                name="bloodGroup"
                                value={teacherData.bloodGroup}
                                onChange={handleInputChange}
                                className="block w-full px-4 py-[9.5px] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                required
                            >
                                <option value="">Select Blood Group</option>
                                {bloodGroupOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {data && (
                            <FormInput
                                id="resignationDate"
                                label="Resignation Date"
                                type="date"
                                name="resignationDate"
                                value={teacherData.resignationDate}
                                onChange={handleInputChange}
                            />
                        )}

                        <div>
                            <label htmlFor="gender" className="block text-base font-medium text-gray-700">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={teacherData.gender}
                                onChange={handleInputChange}
                                className="block w-full px-4 py-[9.5px] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
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

                <motion.div
                    className="space-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <h2 className="text-xl font-semibold border-b pb-4">
                        Contact Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <CustomPhoneInput
                            label="Contact Number"
                            value={teacherData.contactNumber}
                            onChange={(value) => handleInputChange({ target: { name: 'contactNumber', value } })}
                            required
                        />
                        <FormInput
                            id="email"
                            label="Email"
                            type="email"
                            name="email"
                            value={teacherData.email}
                            onChange={handleInputChange}
                            required
                        />
                        <FormInput
                            id="address"
                            label="Address"
                            name="address"
                            value={teacherData.address}
                            onChange={handleInputChange}
                            required
                            className="md:col-span-2"
                        />
                    </div>

                    <h2 className="text-xl font-semibold border-b py-4">Professional Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <FormInput
                            id="licenseNumber"
                            label="License Number"
                            name="licenseNumber"
                            value={teacherData.licenseNumber}
                            onChange={handleInputChange}
                            required
                        />
                        <FormInput
                            id="licenseExpiryDate"
                            label="License Expiry Date"
                            name="licenseExpiryDate"
                            type="date"
                            value={teacherData.licenseExpiryDate}
                            onChange={handleInputChange}
                            required
                        />
                        <FormInput
                            id="national_Id"
                            label="National ID"
                            name="national_Id"
                            value={teacherData.national_Id}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="flex flex-col justify-center">
                            <label className="block text-base font-medium text-gray-700" htmlFor="policeVerificationDone">
                                Police Verification Done
                            </label>
                            <div className="transform scale-80 origin-left mt-1">
                                <Switch
                                    id="policeVerificationDone"
                                    checked={teacherData.policeVerificationDone}
                                    onChange={(checked) =>
                                        setTeacherData((prev) => ({ ...prev, policeVerificationDone: checked }))
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mt-6">
                        <label className="block text-base font-medium text-gray-700 my-2">
                            Additional Document (PDF only, max 5MB):
                        </label>
                        <Upload
                            accept=".pdf"
                            beforeUpload={handleCVBeforeUpload}
                            onRemove={handleRemoveFile}
                            showUploadList={
                                teacherData.teacherCV
                                    ? {
                                        showRemoveIcon: true,
                                        showPreviewIcon: false,
                                        showDownloadIcon: false,
                                    }
                                    : false
                            }
                            itemRender={customItemRender}
                            fileList={
                                teacherData.teacherCV
                                    ? [
                                        {
                                            uid: "-1",
                                            name: typeof teacherData.teacherCV === 'string' ? teacherData.teacherCV.split('/').pop() : teacherData.teacherCV.name,
                                            status: "done",
                                            originFileObj: teacherData.teacherCV instanceof File ? teacherData.teacherCV : undefined,
                                            url: typeof teacherData.teacherCV === 'string' ? teacherData.teacherCV : undefined,
                                        },
                                    ]
                                    : []
                            }
                        >
                            <Button icon={<UploadOutlined />}>Select PDF</Button>
                        </Upload>

                        <Modal
                            title="View PDF"
                            visible={isModalVisible}
                            onCancel={handleModalClose}
                            footer={[
                                <Button key="close" onClick={handleModalClose}>
                                    Close
                                </Button>,
                            ]}
                            width={800}
                            bodyStyle={{ height: '70vh', padding: 0 }}
                            centered
                        >
                            {pdfUrl ? (
                                <embed
                                    src={pdfUrl}
                                    type="application/pdf"
                                    width="100%"
                                    height="100%"
                                    style={{ border: "none" }}
                                />
                            ) : (
                                <p className="text-center text-gray-500">No PDF available to display.</p>
                            )}
                        </Modal>
                    </div>
                </motion.div>

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
                                showSearch
                                filterOption={false}
                                onSearch={handleRoleSearch}
                                notFoundContent={filteredRoleItems.length === 0 && allRoleItems.length > 0 ? "No roles match your search" : "No roles available"}
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

                <motion.div
                    className="flex justify-end mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={!loading ? { scale: 1.05 } : {}}
                        whileTap={!loading ? { scale: 0.95 } : {}}
                        className={`${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                            } text-white text-lg py-3 px-8 rounded-md flex items-center justify-center transition-transform duration-200`}
                        aria-label={data ? "Update Driver" : "Add New Driver"}
                    >
                        {isSubmitting ? (
                            <FiLoader className="animate-spin w-6 h-6" />
                        ) : (
                            data ? "Update Driver" : "Add New Driver"
                        )}
                    </motion.button>
                </motion.div>
            </form>
        </motion.div>
    );
};

export default AddDriver;