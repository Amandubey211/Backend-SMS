import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStudents } from "../../../Store/Slices/Admin/Users/Students/student.action";
import { Form, Input, Button, Row, Col, Divider, Select } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import toast from "react-hot-toast";
const { Option } = Select;

const EditHealthModal = ({ isOpen, onClose, studentData }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        console.log(studentData, "studentData in EditHealthModal");
        if (studentData) {
            setImagePreview(studentData.profile || null);
            form.setFieldsValue({
                id: studentData._id,
                firstName: studentData.firstName || "",
                lastName: studentData.lastName || "",
                contactNumber: studentData.contactNumber || "",
                email: studentData.email || "",
                dateOfBirth: studentData.dateOfBirth ? studentData.dateOfBirth.slice(0, 10) : "",
                admissionNumber: studentData.admissionNumber || "",
                Q_Id: studentData.Q_Id || "",
                transportRequirement: studentData.transportRequirement || false,
                className: studentData?.className || "",
                sectionName: studentData?.sectionName || "",
                bloodGroup: studentData?.bloodGroup || "",
                residentialAddress: {
                    street: studentData.residentialAddress?.street || "",
                    city: studentData.residentialAddress?.city || "",
                    state: studentData.residentialAddress?.state || "",
                    postalCode: studentData.residentialAddress?.postalCode || "",
                    country: studentData.residentialAddress?.country || "",
                },
                active: true,
                medicalCondition: studentData?.medicalCondition || "",
                healthRisk: studentData?.healthRisk || "Low",
                height: studentData?.height || "",
                weight: studentData?.weight || "",
                emergencyContacts: [
                    {
                        contactNumber: studentData?.emergencyNumber || "",
                    },
                    {
                        name: studentData?.fatherName || "",
                        relation: "Father",
                        contactNumber: studentData?.fatherInfo?.cell1.value || "",
                    },
                    {
                        name: studentData?.guardianName || "",
                        relation: studentData?.guardianRelationToStudent || "",
                        contactNumber: studentData?.guardianContactNumber || "",
                    },
                ],
            });
        }
    }, [studentData, form]);

    const onFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();

        // Explicitly append the student ID
        if (studentData?._id) {
            formData.append("id", studentData._id);
        }
        formData.append("medicalCondition", values?.medicalCondition || "");
        formData.append("healthRisk", values.healthRisk || "Low");
        formData.append("height", values.height || "");
        formData.append("weight", values.weight || "");
        formData.append("bloodGroup", values.bloodGroup || "");
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        try {
            const response = await dispatch(updateStudents({ data: formData })).unwrap();
            if (response.success) {
                toast.success("Student information updated successfully");
            } else {
                toast.error(response.message || "Failed to update student information");
            }
        } catch (error) {
            toast.error(error.message || "Failed to update student information");
        } finally {
            setLoading(false);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-screen h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Update Student Information</h2>
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={onClose}
                        aria-label="Close modal"
                    />
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                            <Form.Item label="Profile Image">
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Profile"
                                        style={{ width: '100%', height: 'auto' }}
                                        className="rounded-md mb-4"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={16}>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={12}>
                                    <Form.Item label="First Name" name="firstName">
                                        <Input size="large" placeholder="First Name" disabled />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Last Name" name="lastName">
                                        <Input size="large" placeholder="Last Name" disabled />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Mobile Number" name="contactNumber">
                                        <Input size="large" placeholder="Mobile Number" disabled />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Email" name="email">
                                        <Input size="large" placeholder="Email" disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                            <Form.Item label="Date of Birth" name="dateOfBirth">
                                <Input type="date" size="large" disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item label="Admission Number" name="admissionNumber">
                                <Input size="large" placeholder="Admission Number" disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item label="QID" name="Q_Id">
                                <Input size="large" placeholder="QID" disabled />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                            <Form.Item label="Transport Requirement" name="transportRequirement">
                                <Select size="large" placeholder="Select Transport Requirement" disabled>
                                    <Option value={true}>Yes</Option>
                                    <Option value={false}>No</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item label="Class" name="className">
                                <Input size="large" placeholder="Class" disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item label="Section Name" name="sectionName">
                                <Input size="large" placeholder="Section Name" disabled />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left" orientationMargin={0}>
                        <span className="text-gray-600 font-medium">Medical Details</span>
                    </Divider>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Health Risk"
                                name="healthRisk"
                                rules={[{ required: true, message: "Health risk is required" }]}
                            >
                                <Select size="large" placeholder="Select Health Risk">
                                    <Option value="Low">Low</Option>
                                    <Option value="Medium">Medium</Option>
                                    <Option value="High">High</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Height (cm)"
                                name="height"
                                rules={[{ required: true, message: "Height is required" }]}
                            >
                                <Input size="large" placeholder="Enter height in cm" type="number" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Weight (kg)"
                                name="weight"
                                rules={[{ required: true, message: "Weight is required" }]}
                            >
                                <Input size="large" placeholder="Enter weight in kg" type="number" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Blood Group"
                                name="bloodGroup"
                                rules={[{ required: true, message: "Blood group is required" }]}
                            >
                                <Select size="large" placeholder="Select Blood Group">
                                    <Option value="A+">A+</Option>
                                    <Option value="A-">A-</Option>
                                    <Option value="B+">B+</Option>
                                    <Option value="B-">B-</Option>
                                    <Option value="AB+">AB+</Option>
                                    <Option value="AB-">AB-</Option>
                                    <Option value="O+">O+</Option>
                                    <Option value="O-">O-</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item label="Medical Condition" name="medicalCondition">
                                <TextArea
                                    rows={4}
                                    placeholder="Enter medical condition details"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left" orientationMargin={0}>
                        <span className="text-gray-600 font-medium">Emergency Contacts</span>
                    </Divider>
                    <Form.List name="emergencyContacts">
                        {(fields) => (
                            <>
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <div key={key} className="mb-4">
                                        <Row gutter={[16, 16]} align="middle">
                                            <Col xs={24} md={7}>
                                                <Form.Item
                                                    {...restField}
                                                    label={
                                                        index === 0
                                                            ? "Emergency Contact"
                                                            : index === 1
                                                                ? "Father Name"
                                                                : "Guardian Name"
                                                    }
                                                    name={[name, index === 0 ? "contactNumber" : "name"]}
                                                >
                                                    <Input
                                                        size="large"
                                                        placeholder={index === 0 ? "Enter emergency number" : "Enter name"}
                                                        disabled
                                                    />
                                                </Form.Item>
                                            </Col>
                                            {index > 0 && (
                                                <Col xs={24} md={7}>
                                                    <Form.Item
                                                        {...restField}
                                                        label="Relation to Student"
                                                        name={[name, "relation"]}
                                                    >
                                                        <Input
                                                            size="large"
                                                            placeholder="Enter relation"
                                                            disabled
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            )}
                                            {index > 0 && (
                                                <Col xs={24} md={7}>
                                                    <Form.Item
                                                        {...restField}
                                                        label="Contact Number"
                                                        name={[name, "contactNumber"]}
                                                    >
                                                        <Input
                                                            size="large"
                                                            placeholder="Enter contact number"
                                                            disabled
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            )}
                                        </Row>
                                    </div>
                                ))}
                            </>
                        )}
                    </Form.List>

                    <Divider orientation="left" orientationMargin={0}>
                        <span className="text-gray-600 font-medium">Residential Address</span>
                    </Divider>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                            <Form.Item label="Street" name={["residentialAddress", "street"]}>
                                <Input size="large" placeholder="Street" disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item label="City" name={["residentialAddress", "city"]}>
                                <Input size="large" placeholder="City" disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item label="State" name={["residentialAddress", "state"]}>
                                <Input size="large" placeholder="State" disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item label="Postal Code" name={["residentialAddress", "postalCode"]}>
                                <Input size="large" placeholder="Postal Code" disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item label="Country" name={["residentialAddress", "country"]}>
                                <Input size="large" placeholder="Country" disabled />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div className="bg-pink-50 py-2 border-t sticky -bottom-2 rounded-md z-10 mt-4">
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 px-6">
                            <Button
                                onClick={onClose}
                                className="w-full sm:w-auto"
                                aria-label="Cancel"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full sm:w-auto"
                                aria-label="Save"
                                loading={loading}
                            >
                                {loading ? "Updating..." : "Update"}
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default EditHealthModal;