import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllClasses } from "../../../Store/Slices/Admin/Class/actions/classThunk";
import { fetchSectionsNamesByClass } from "../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { updateStudents } from "../../../Store/Slices/Admin/Users/Students/student.action";
import { Form, Select, Input, Button, Row, Col, Divider } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

const EditHealthModal = ({ isOpen, onClose, studentData }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const classes = useSelector((state) => state.admin.class?.classes || []);
    const sections = useSelector((state) => state.admin.group_section?.sectionsList || []);

    const classesLoading = useSelector((state) => state.class?.loading || false);
    const sectionsLoading = useSelector((state) => state.group?.loading || false);

    const memoizedClassOptions = useMemo(
        () =>
            classes?.map((cls) => (
                <Option key={cls._id} value={cls._id}>
                    {cls.className || cls.name}
                </Option>
            )),
        [classes]
    );

    const memoizedSectionOptions = useMemo(
        () =>
            sections?.map((sec) => (
                <Option key={sec._id} value={sec._id}>
                    {sec.sectionName || sec.name}
                </Option>
            )),
        [sections]
    );

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchAllClasses());
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        const classId = form.getFieldValue("classId");
        if (classId) {
            dispatch(fetchSectionsNamesByClass(classId));
        }
    }, [form.getFieldValue("classId"), dispatch]);

    useEffect(() => {
        if (studentData) {
            setImagePreview(studentData.profile || null);
            form.setFieldsValue({
                id: studentData._id,
                firstName: studentData.firstName || "",
                lastName: studentData.lastName || "",
                contactNumber: studentData.contactNumber || "",
                email: studentData.email || "",
                profile: studentData.profile || null,
                dateOfBirth: studentData.dateOfBirth ? studentData.dateOfBirth.slice(0, 10) : "",
                admissionNumber: studentData.admissionNumber || "",
                Q_Id: studentData.Q_Id || "",
                transportRequirement: studentData.transportRequirement || "",
                classId: studentData?.classId || "",
                sectionId: studentData?.sectionId || "",
                bloodGroup: studentData?.bloodGroup || "",
                residentialAddress: {
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
                        name: studentData?.fatherName || "",
                        relation: "Father",
                        contactNumber: studentData?.fatherInfo?.cell1 || "",
                    },
                    {
                        name: studentData?.guardianName || "",
                        relation: studentData?.guardianRelationToStudent || "",
                        contactNumber: studentData?.guardianContactNumber || "",
                    },
                    {
                        name: studentData?.firstName && studentData?.lastName
                            ? `${studentData.firstName} ${studentData.lastName}`
                            : "",
                        contactNumber: studentData?.emergencyNumber || "",
                    },
                ],
            });
        }
    }, [studentData, form]);

    const handleClassChange = (value) => {
        const selectedClass = classes.find((cls) => cls._id === value);
        form.setFieldsValue({
            classId: value,
            className: selectedClass?.name || "",
            sectionId: "",
            sectionName: "",
        });
        if (value) {
            dispatch(fetchSectionsNamesByClass(value));
        }
    };

    const handleSectionChange = (value) => {
        const selectedSection = sections.find((sec) => sec._id === value);
        form.setFieldsValue({
            sectionId: value,
            sectionName: selectedSection?.name || "",
        });
    };

    const onFinish = async (values) => {
        setLoading(true);
        const data = new FormData();

        Object.keys(values).forEach((key) => {
            if (key === "emergencyContacts" || key === "residentialAddress") {
                data.append(key, JSON.stringify(values[key]));
            } else if (key === "profile" && values[key]) {
                data.append(key, values[key]);
            } else {
                data.append(key, values[key] || "");
            }
        });
        console.log("Form Data:", data);
        await dispatch(updateStudents(data));
        setLoading(false);
        onClose();
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
                                        className="rounded-md"
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
                            <Form.Item label="Applying Class" name="classId">
                                <Select
                                    size="large"
                                    placeholder="Select Class"
                                    allowClear
                                    onChange={handleClassChange}
                                    aria-label="Class selection"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                    loading={classesLoading}
                                    disabled
                                >
                                    {memoizedClassOptions}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item label="Section Name" name="sectionId">
                                <Select
                                    size="large"
                                    placeholder="Select Section"
                                    allowClear
                                    onChange={handleSectionChange}
                                    aria-label="Section selection"
                                    disabled
                                    loading={sectionsLoading}
                                >
                                    {memoizedSectionOptions}
                                </Select>
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
                                            <Col xs={24} md={index === 2 ? 10 : 7}>
                                                <Form.Item
                                                    {...restField}
                                                    label={
                                                        index === 0
                                                            ? "Father Name"
                                                            : index === 1
                                                            ? "Guardian Name"
                                                            : "Student Name"
                                                    }
                                                    name={[name, "name"]}
                                                    rules={[{ required: true, message: "Name is required" }]}
                                                >
                                                    <Input
                                                        size="large"
                                                        placeholder="Enter name"
                                                        disabled={index !== 2}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            {index !== 2 && (
                                                <Col xs={24} md={7}>
                                                    <Form.Item
                                                        {...restField}
                                                        label="Relation to Student"
                                                        name={[name, "relation"]}
                                                        rules={[{ required: true, message: "Relation is required" }]}
                                                    >
                                                        <Input
                                                            size="large"
                                                            placeholder="Enter relation"
                                                            disabled
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            )}
                                            <Col xs={24} md={index === 2 ? 10 : 7}>
                                                <Form.Item
                                                    {...restField}
                                                    label={
                                                        index === 2 ? "Emergency Number" : "Contact Number"
                                                    }
                                                    name={[name, "contactNumber"]}
                                                    rules={[{ required: true, message: "Contact number is required" }]}
                                                >
                                                    <Input
                                                        size="large"
                                                        placeholder={
                                                            index === 2
                                                                ? "Enter emergency number"
                                                                : "Enter contact number"
                                                        }
                                                        disabled={index !== 2}
                                                    />
                                                </Form.Item>
                                            </Col>
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