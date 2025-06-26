import Sidebar from "../Common/Sidebar";
import { Form, Input, Select, Checkbox, Button, DatePicker, message, Modal } from "antd";
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useEffect, useState } from "react";
import { DeleteOutlined } from '@ant-design/icons';

import CustomUploadCard from "./CustomUploadCard";
import SingleFileUpload from './SingleFileUpload';

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;

const DriverSidebarForm = ({ isOpen, isEditing, driverData, setDriverData, handleChange, handleSubmit, resetForm, vehicles }) => {
    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const [form] = Form.useForm();
    const [documentPreviewFile, setDocumentPreviewFile] = useState(null);
    const [photo, setPhoto] = useState("");
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        if (isOpen && driverData) {
            const initialDocuments = Array.isArray(driverData.documents)
                ? driverData.documents.map((doc, index) => ({
                    name: doc.name || `Document_${index + 1}`,
                    url: doc.url || "",
                    expiryDate: doc.expiryDate ? parseDate(doc.expiryDate) : null,
                }))
                : [];
            setPhoto(driverData.photo || "");
            setDocuments(initialDocuments);
            form.setFieldsValue({
                ...driverData,
                dateOfBirth: driverData?.dateOfBirth ? parseDate(driverData.dateOfBirth) : null,
                licenseExpiryDate: driverData?.licenseExpiryDate ? parseDate(driverData.licenseExpiryDate) : null,
                joiningDate: driverData?.joiningDate ? parseDate(driverData.joiningDate) : null,
                resignationDate: driverData?.resignationDate ? parseDate(driverData.resignationDate) : null,
                documents: initialDocuments,
                photo: driverData?.photo || "",
            });
        }
    }, [isOpen, driverData, form]);

    const onFinish = (values) => {
        const documentsArray = documents.length > 0 ? documents : values.documents || [];
        const processedValues = {
            ...values,
            photo: photo || values?.photo || "",
            documents: documentsArray.map((doc, index) => ({
                name: doc?.name || `Document_${Date.now()}_${index}`,
                url: doc?.url || "",
                expiryDate: doc?.expiryDate || null,
            })),
        };
        handleSubmit(processedValues);
        if (!isEditing) {
            setPhoto("");
            setDocuments([]);
        }
    };

    const onFinishFailed = (errorInfo) => {
        const fieldOrder = [
            "fullName", "driverBadgeNumber", "gender", "religion", "dateOfBirth", "bloodGroup", "email",
            "contactNumber", "emergencyContact", "address", "licenseNumber", "licenseExpiryDate", "national_Id",
            "experienceInYears", "joiningDate", "resignationDate", "policeVerificationDone", "status"
        ];
        for (const fieldName of fieldOrder) {
            if (errorInfo.errorFields.some((field) => field.name[0] === fieldName)) {
                message.error(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1')} is required.`);
                break;
            }
        }
    };

    const handleClose = () => {
        form.resetFields();
        resetForm();
        setDocumentPreviewFile(null);
        setPhoto("");
        setDocuments([]);
    };

    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const d = dayjs(dateStr);
        return d.isValid() ? d : null;
    };

    const handleFileChange = (fieldName, fileData, index = null) => {
        if (fieldName === "photo") {
            // console.log("Photo File Data:", fileData); // Debug log
            setPhoto(fileData?.url || "");
            form.setFieldsValue({ photo: fileData?.url || "" });
        } else if (fieldName === "documents" && index !== null) {
            const newDocuments = [...documents];
            newDocuments[index] = { ...newDocuments[index], ...fileData };
            setDocuments(newDocuments);
            form.setFields([{ name: ["documents", index], value: newDocuments[index] }]);
            // console.log("Updated Documents:", newDocuments); // Debug log
        }
    };

    const handleRemove = (fieldName, index = null) => {
        if (fieldName === "photo") {
            setPhoto("");
            form.setFieldsValue({ photo: "" });
        } else if (fieldName === "documents" && index !== null) {
            const newDocuments = documents.filter((_, i) => i !== index);
            setDocuments(newDocuments);
            form.setFieldsValue({ documents: newDocuments });
            // console.log("Documents after remove:", newDocuments); // Debug log
        }
    };

    const addNewDocument = () => {
        const newDoc = { name: `Document_${documents.length + 1}`, url: "", expiryDate: null };
        const newDocuments = [...documents, newDoc];
        setDocuments(newDocuments);
        form.setFieldsValue({ documents: newDocuments });
        // console.log("Documents after add:", newDocuments); // Debug log
    };

    return (
        <Sidebar
            isOpen={isOpen}
            onClose={handleClose}
            title={isEditing ? "Edit Driver" : "Add Driver"}
            width="50%"
        >
            <div className="p-4 max-h-screen overflow-y-auto">
                <Form
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    className="space-y-6"
                    layout="vertical"
                >
                    <div className="bg-purple-50 p-3 rounded-md mb-4">
                        <h3 className="text-md font-medium text-purple-800 mb-3">
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Full Name</span>}
                                name="fullName"
                                className="mb-4"
                                rules={[{ required: true, message: "Full Name is required." }]}
                            >
                                <Input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Enter full name"
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Badge Number</span>}
                                name="driverBadgeNumber"
                                className="mb-4"
                                rules={[{ required: true, message: "Badge Number is required." }]}
                            >
                                <Input
                                    type="text"
                                    id="driverBadgeNumber"
                                    name="driverBadgeNumber"
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Enter badge number"
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Gender</span>}
                                name="gender"
                                className="mb-4"
                                rules={[{ required: true, message: "Gender is required." }]}
                            >
                                <Select
                                    id="gender"
                                    name="gender"
                                    onChange={(value) => handleChange(value, "gender")}
                                    placeholder="Select gender"
                                    className="w-full h-[40px] border-none rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <Option value="" disabled>Select gender</Option>
                                    <Option value="male">Male</Option>
                                    <Option value="female">Female</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Religion</span>}
                                name="religion"
                                className="mb-4"
                                rules={[{ required: true, message: "Religion is required." }]}
                            >
                                <Input
                                    type="text"
                                    id="religion"
                                    name="religion"
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Enter religion"
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Date of Birth</span>}
                                name="dateOfBirth"
                                className="mb-4"
                                rules={[
                                    { required: true, message: "Date of Birth is required." },
                                    {
                                        validator: (_, value) => {
                                            if (value && dayjs().diff(dayjs(value), 'year') < 18) {
                                                return Promise.reject("Driver must be at least 18 years old.");
                                            }
                                            return Promise.resolve();
                                        },
                                    }
                                ]}
                            >
                                <DatePicker
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    onChange={(date, dateString) => handleChange(dateString, "dateOfBirth")}
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Select date of birth"
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Blood Group</span>}
                                name="bloodGroup"
                                className="mb-4"
                                rules={[{ required: true, message: "Blood Group is required." }]}
                            >
                                <Select
                                    id="bloodGroup"
                                    name="bloodGroup"
                                    onChange={(value) => handleChange(value, "bloodGroup")}
                                    placeholder="Select blood group"
                                    className="w-full h-[40px] border-none rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <Option value="" disabled>Select blood group</Option>
                                    {bloodGroups.map((group) => (
                                        <Option key={group} value={group}>{group}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-md mb-4">
                        <h3 className="text-md font-medium text-blue-800 mb-3">
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Email</span>}
                                name="email"
                                className="mb-4"
                                rules={[{ required: true, message: "Email is required." }]}
                            >
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Enter email address"
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Contact Number</span>}
                                name="contactNumber"
                                className="mb-4"
                                rules={[{ required: true, message: "Contact Number is required." }]}
                            >
                                <Input
                                    type="tel"
                                    id="contactNumber"
                                    name="contactNumber"
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Enter contact number"
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Emergency Contact</span>}
                                name="emergencyContact"
                                className="mb-4"
                                rules={[{ required: true, message: "Emergency Contact is required." }]}
                            >
                                <Input
                                    type="tel"
                                    id="emergencyContact"
                                    name="emergencyContact"
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Enter emergency contact"
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Address</span>}
                                name="address"
                                className="mb-4"
                                rules={[{ required: true, message: "Address is required." }]}
                            >
                                <Input.TextArea
                                    id="address"
                                    name="address"
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Enter address"
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    rows="2"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="bg-green-50 p-3 rounded-md mb-4">
                        <h3 className="text-md font-medium text-green-800 mb-3">
                            Professional Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">License Number</span>}
                                name="licenseNumber"
                                className="mb-4"
                                rules={[{ required: true, message: "License Number is required." }]}
                            >
                                <Input
                                    type="text"
                                    id="licenseNumber"
                                    name="licenseNumber"
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Enter license number"
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">License Expiry Date</span>}
                                name="licenseExpiryDate"
                                className="mb-4"
                                rules={[
                                    { required: true, message: "License Expiry Date is required." },
                                    {
                                        validator: (_, value) => {
                                            const today = dayjs();
                                            if (value && !value.isAfter(today, 'day')) {
                                                return Promise.reject("License expiry date must be greater than today.");
                                            }
                                            return Promise.resolve();
                                        },
                                    }
                                ]}
                            >
                                <DatePicker
                                    id="licenseExpiryDate"
                                    name="licenseExpiryDate"
                                    onChange={(date, dateString) => handleChange(dateString, "licenseExpiryDate")}
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Select license expiry date"
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">National ID</span>}
                                name="national_Id"
                                className="mb-4"
                                rules={[{ required: true, message: "National ID is required." }]}
                            >
                                <Input
                                    type="text"
                                    id="national_Id"
                                    name="national_Id"
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Enter national ID"
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Experience (years)</span>}
                                name="experienceInYears"
                                className="mb-4"
                                rules={[{ required: true, message: "Experience (years) is required." }]}
                            >
                                <Input
                                    type="number"
                                    id="experienceInYears"
                                    name="experienceInYears"
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Enter years of experience"
                                    min="0"
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Joining Date</span>}
                                name="joiningDate"
                                className="mb-4"
                                rules={[{ required: true, message: "Joining Date is required." }]}
                            >
                                <DatePicker
                                    id="joiningDate"
                                    name="joiningDate"
                                    onChange={(date, dateString) => handleChange(dateString, "joiningDate")}
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Select joining date"
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Resignation Date</span>}
                                name="resignationDate"
                                className="mb-4"
                                rules={[{ required: false, message: "Resignation Date is required." }]}
                            >
                                <DatePicker
                                    id="resignationDate"
                                    name="resignationDate"
                                    onChange={(date, dateString) => handleChange(dateString, "resignationDate")}
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Select resignation date"
                                />
                            </Form.Item>
                        </div>
                        <div className="mt-4">
                            <Form.Item
                                name="policeVerificationDone"
                                valuePropName="checked"
                                className="mb-4"
                                rules={[{ required: true, message: "Police Verification Done is required." }]}
                            >
                                <Checkbox
                                    id="policeVerificationDone"
                                    name="policeVerificationDone"
                                    onChange={(e) => handleChange(e)}
                                    className="flex items-center h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                >
                                    <span className="flex text-center text-sm text-gray-700 w-40">Police Verification Done</span>
                                </Checkbox>
                            </Form.Item>
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-md mb-4">
                        <h3 className="text-md font-medium text-yellow-800 mb-3">
                            Assignment Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Status</span>}
                                name="status"
                                className="mb-4"
                                rules={[{ required: true, message: "Status is required." }]}
                            >
                                <Select
                                    id="status"
                                    name="status"
                                    onChange={(value) => handleChange(value, "status")}
                                    placeholder="Select status"
                                    className="w-full border-none rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <Option value="active">Active</Option>
                                    <Option value="inactive">Inactive</Option>
                                </Select>
                            </Form.Item>
                        </div>
                    </div>

                    <div className="bg-red-50 p-3 rounded-md mb-4">
                        <h3 className="text-md font-medium text-red-800 mb-3">
                            Document Upload
                        </h3>
                        <div className="grid grid-cols-1 gap-6">
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Driver Photo</span>}
                                name="photo"
                                rules={[{ required: false, message: "Driver Photo is required." }]}
                            >
                                <CustomUploadCard
                                    name="photo"
                                    form={form}
                                    recommendedSize="300x400"
                                    width="w-[300px]"
                                    height="h-full"
                                    required={false}
                                    profilelink={photo}
                                    onChange={(fileData) => handleFileChange("photo", fileData)}
                                    onRemove={() => handleRemove("photo")}
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Additional Documents (License copy, ID proof, etc.)</span>}
                                name="documents"
                                rules={[{ required: false, message: "At least one document is recommended but optional." }]}
                            >
                                <div className="space-y-4">
                                    {documents.map((doc, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div className="flex-1">
                                                <SingleFileUpload
                                                    name={["documents", index]}
                                                    label={`Document ${index + 1}`}
                                                    type="optional"
                                                    onChange={(fileData) => handleFileChange("documents", fileData, index)}
                                                    onPreview={(file) => setDocumentPreviewFile(file)}
                                                    onRemove={() => handleRemove("documents", index)}
                                                    fileUrl={doc.url}
                                                    fileName={doc.name}
                                                />
                                            </div>
                                            <Button
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleRemove("documents", index)}
                                                className="text-red-500 hover:text-red-700"
                                            />
                                        </div>
                                    ))}
                                    <Button
                                        type="dashed"
                                        onClick={addNewDocument}
                                        className="w-full"
                                    >
                                        Add Another Document
                                    </Button>
                                </div>
                            </Form.Item>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            htmlType="submit"
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        >
                            {isEditing ? "Update Driver" : "Add Driver"}
                        </Button>
                    </div>
                </Form>
            </div>
            <Modal
                title="Document Preview"
                visible={!!documentPreviewFile}
                onCancel={() => setDocumentPreviewFile(null)}
                footer={null}
                width={800}
            >
                {documentPreviewFile && (
                    <img
                        src={documentPreviewFile.preview || documentPreviewFile.url}
                        alt="Document Preview"
                        style={{ maxWidth: "100%", maxHeight: "70vh" }}
                    />
                )}
            </Modal>
        </Sidebar>
    );
};

export default DriverSidebarForm;