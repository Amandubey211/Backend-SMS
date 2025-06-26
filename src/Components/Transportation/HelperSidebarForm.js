import Sidebar from "../Common/Sidebar";
import { Form, Input, Select, Checkbox, Button, message, Modal } from "antd";
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useEffect, useState, useRef } from "react";
import SingleFileUpload from "./SingleFileUpload";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;

const HelperSidebarForm = ({ isOpen, isEditing, helperData, setHelperData, handleChange, handleSubmit, resetForm, vehicles }) => {
    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const [form] = Form.useForm();
    const [photoPreviewFile, setPhotoPreviewFile] = useState(null);
    const [documentPreviewFile, setDocumentPreviewFile] = useState(null);
    const photoInputRef = useRef(null);
    const documentInputRef = useRef(null);

    const onFinish = (values) => {
        const processedValues = {
            ...values,
            photo: helperData.photo || "",
            documents: helperData.documents || [],
        };
        handleSubmit(processedValues);
    };

    const onFinishFailed = (errorInfo) => {
        const fieldOrder = [
            "fullName", "helperBadgeNumber", "gender", "religion", "dateOfBirth", "bloodGroup", "email",
            "contactNumber", "emergencyContact", "address", "national_Id", "joiningDate", "resignationDate",
            "policeVerificationDone", "status"
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
        setPhotoPreviewFile(null);
        setDocumentPreviewFile(null);
        if (photoInputRef.current) photoInputRef.current.value = "";
        if (documentInputRef.current) documentInputRef.current.value = "";
    };

    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const d = dayjs(dateStr);
        return d.isValid() ? d : null;
    };

    useEffect(() => {
        form.setFieldsValue({
            fullName: helperData?.fullName || "",
            helperBadgeNumber: helperData?.helperBadgeNumber || "",
            gender: helperData?.gender || "",
            religion: helperData?.religion || "",
            dateOfBirth: parseDate(helperData?.dateOfBirth),
            bloodGroup: helperData?.bloodGroup || "",
            email: helperData?.email || "",
            contactNumber: helperData?.contactNumber || "",
            emergencyContact: helperData?.emergencyContact || "",
            address: helperData?.address || "",
            national_Id: helperData?.national_Id || "",
            joiningDate: parseDate(helperData?.joiningDate),
            resignationDate: parseDate(helperData?.resignationDate),
            policeVerificationDone: helperData?.policeVerificationDone || false,
            status: helperData?.status || "",
        });
        if (helperData?.photo) {
            setHelperData((prev) => ({
                ...prev,
                photo: helperData.photo,
            }));
        }
        if (helperData?.documents) {
            setHelperData((prev) => ({
                ...prev,
                documents: helperData.documents,
            }));
        }
    }, [helperData, form]);

    const handleFileChange = (fieldName, fileData) => {
        if (fieldName === "photo") {
            setHelperData((prev) => ({
                ...prev,
                photo: fileData.url,
            }));
        } else if (fieldName === "documents") {
            setHelperData((prev) => ({
                ...prev,
                documents: [...(prev.documents || []), fileData],
            }));
        }
    };

    const handleRemove = (fieldName, index) => {
        if (fieldName === "photo") {
            setHelperData((prev) => ({
                ...prev,
                photo: "",
            }));
        } else if (fieldName === "documents") {
            setHelperData((prev) => ({
                ...prev,
                documents: prev.documents.filter((_, i) => i !== index),
            }));
        }
    };

    return (
        <Sidebar
            isOpen={isOpen}
            onClose={handleClose}
            title={isEditing ? "Edit Helper" : "Add Helper"}
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
                                    value={helperData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Badge Number</span>}
                                name="helperBadgeNumber"
                                className="mb-4"
                            >
                                <Input
                                    type="text"
                                    id="helperBadgeNumber"
                                    name="helperBadgeNumber"
                                    value={helperData.helperBadgeNumber}
                                    onChange={handleChange}
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
                                    value={helperData.gender}
                                    onChange={(value) => handleChange({ target: { name: "gender", value } })}
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
                            >
                                <Input
                                    type="text"
                                    id="religion"
                                    name="religion"
                                    value={helperData.religion}
                                    onChange={handleChange}
                                    placeholder="Enter religion"
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Date of Birth</span>}
                                name="dateOfBirth"
                                className="mb-4"
                            >
                                <Input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={helperData.dateOfBirth}
                                    onChange={handleChange}
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Blood Group</span>}
                                name="bloodGroup"
                                className="mb-4"
                            >
                                <Select
                                    id="bloodGroup"
                                    name="bloodGroup"
                                    value={helperData.bloodGroup}
                                    onChange={(value) => handleChange({ target: { name: "bloodGroup", value } })}
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
                            >
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={helperData.email}
                                    onChange={handleChange}
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
                                    value={helperData.contactNumber}
                                    onChange={handleChange}
                                    placeholder="Enter contact number"
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Emergency Contact</span>}
                                name="emergencyContact"
                                className="mb-4"
                            >
                                <Input
                                    type="tel"
                                    id="emergencyContact"
                                    name="emergencyContact"
                                    value={helperData.emergencyContact}
                                    onChange={handleChange}
                                    placeholder="Enter emergency contact"
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Address</span>}
                                name="address"
                                className="mb-4"
                            >
                                <Input.TextArea
                                    id="address"
                                    name="address"
                                    value={helperData.address}
                                    onChange={handleChange}
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
                                label={<span className="block text-sm font-medium text-gray-700">National ID</span>}
                                name="national_Id"
                                className="mb-4"
                            >
                                <Input
                                    type="text"
                                    id="national_Id"
                                    name="national_Id"
                                    value={helperData.national_Id}
                                    onChange={handleChange}
                                    placeholder="Enter national ID"
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Joining Date</span>}
                                name="joiningDate"
                                className="mb-4"
                            >
                                <Input
                                    type="date"
                                    id="joiningDate"
                                    name="joiningDate"
                                    value={helperData.joiningDate}
                                    onChange={handleChange}
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Resignation Date</span>}
                                name="resignationDate"
                                className="mb-4"
                            >
                                <Input
                                    type="date"
                                    id="resignationDate"
                                    name="resignationDate"
                                    value={helperData.resignationDate}
                                    onChange={handleChange}
                                    className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </Form.Item>
                        </div>
                        <div className="mt-4">
                            <Form.Item
                                name="policeVerificationDone"
                                valuePropName="checked"
                                className="mb-4"
                            >
                                <Checkbox
                                    id="policeVerificationDone"
                                    name="policeVerificationDone"
                                    checked={helperData.policeVerificationDone}
                                    onChange={handleChange}
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
                                    value={helperData.status}
                                    onChange={(value) => handleChange({ target: { name: "status", value } })}
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
                                label={<span className="block text-sm font-medium text-gray-700">Helper Photo</span>}
                                name="photo"
                            >
                                <SingleFileUpload
                                    name="photo"
                                    label="Helper Photo"
                                    type="mandatory"
                                    onChange={(fileData) => handleFileChange("photo", fileData)}
                                    onPreview={(file) => setPhotoPreviewFile(file)}
                                    fileUrl={helperData.photo}
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="block text-sm font-medium text-gray-700">Additional Documents (License copy, ID proof, etc.)</span>}
                                name="documents"
                            >
                                {Array.isArray(helperData.documents) ? (
                                    helperData.documents.map((doc, index) => (
                                        <SingleFileUpload
                                            key={index}
                                            name={["documents", index]}
                                            label={`Document ${index + 1}`}
                                            type="optional"
                                            onChange={(fileData) => handleFileChange("documents", fileData)}
                                            onPreview={(file) => setDocumentPreviewFile(file)}
                                            fileUrl={doc.url}
                                            fileName={doc.name}
                                        />
                                    ))
                                ) : (
                                    <SingleFileUpload
                                        name="documents"
                                        label="Additional Documents"
                                        type="optional"
                                        onChange={(fileData) => handleFileChange("documents", fileData)}
                                        onPreview={(file) => setDocumentPreviewFile(file)}
                                        fileUrl={helperData.documents?.url}
                                        fileName={helperData.documents?.name}
                                    />
                                )}
                                <Button
                                    type="dashed"
                                    onClick={() => {
                                        setHelperData((prev) => ({
                                            ...prev,
                                            documents: [...(prev.documents || []), {}],
                                        }));
                                    }}
                                    style={{ marginTop: 8 }}
                                >
                                    Add Another Document
                                </Button>
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
                            {isEditing ? "Update Helper" : "Add Helper"}
                        </Button>
                    </div>
                </Form>
            </div>

            <Modal
                title="Photo Preview"
                visible={!!photoPreviewFile}
                onCancel={() => setPhotoPreviewFile(null)}
                footer={null}
                width={800}
            >
                {photoPreviewFile && (
                    <img
                        src={photoPreviewFile.preview || photoPreviewFile.url}
                        alt="Photo Preview"
                        style={{ maxWidth: "100%", maxHeight: "70vh" }}
                    />
                )}
            </Modal>

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

export default HelperSidebarForm;