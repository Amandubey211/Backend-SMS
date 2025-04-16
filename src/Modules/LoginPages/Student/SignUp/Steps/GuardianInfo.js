// src/pages/StudentSignUp/Steps/GuardianInfo.jsx
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Row,
  Col,
  Divider,
  Segmented,
  Tooltip,
  Space,
  Modal,
} from "antd";
import { UploadOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaWhatsapp } from "react-icons/fa";
import CustomUploadCard from "../Components/CustomUploadCard";

const { Option } = Select;

const religionOptions = [
  { label: "Islam", value: "Islam" },
  { label: "Christianity", value: "Christianity" },
  { label: "Hinduism", value: "Hinduism" },
  { label: "Buddhism", value: "Buddhism" },
  { label: "Judaism", value: "Judaism" },
];

const nationalityOptions = [
  { label: "Qatari", value: "qatari" },
  { label: "Egyptian", value: "egyptian" },
  { label: "Indian", value: "indian" },
];

const GuardianInfo = ({ formData, updateFormData, onBack }) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("father");

  useEffect(() => {
    if (formData) form.setFieldsValue(formData);
  }, [formData, form]);

  const handleTabChange = (val) => {
    setActiveTab(val);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (activeTab === "father") {
      setActiveTab("mother");
    } else if (activeTab === "mother") {
      setActiveTab("guardian");
    } else {
      form.submit();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (activeTab === "guardian") {
      setActiveTab("mother");
    } else if (activeTab === "mother") {
      setActiveTab("father");
    } else if (onBack) {
      onBack();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onFinish = (values) => {
    updateFormData(values);
  };

  const renderPhoneInputWithWhatsapp = (
    phoneField,
    whatsappField,
    label,
    placeholder,
    required = false
  ) => (
    <Form.Item label={label} required={required} className="mb-4">
      <Space.Compact block className="w-full">
        <PhoneInput
          country="qa"
          placeholder={placeholder}
          inputStyle={{
            width: "100%",
            height: "40px",
            fontSize: "16px",
            border: "1px solid #d9d9d9",
            borderRight: "none",
            borderRadius: 0,
          }}
          containerStyle={{ width: "100%" }}
          value={form.getFieldValue(phoneField) || ""}
          onChange={(val) => form.setFieldValue(phoneField, val)}
        />
        <div
          className={`flex items-center border border-l-0 rounded-r px-3 ${
            form.getFieldValue(whatsappField) ? "bg-[#dcf8c6]" : "bg-white"
          }`}
        >
          <Tooltip title="Mark this number as WhatsApp">
            <div
              className="cursor-pointer"
              onClick={() => {
                const current = form.getFieldValue(whatsappField);
                form.setFieldValue(whatsappField, !current);
              }}
            >
              <FaWhatsapp className="text-[#075E54] text-xl" />
            </div>
          </Tooltip>
        </div>
      </Space.Compact>
    </Form.Item>
  );

  const renderNameFields = (prefix) => (
    <>
      {/* First Name Field */}
      <Form.Item
        name={[prefix, "firstName"]}
        // label="First Name"
        rules={[{ required: true, message: "Required" }]}
        className="mb-4"
      >
        <Input size="large" placeholder="First Name" />
      </Form.Item>

      {/* Last Name Field */}
      <Form.Item
        name={[prefix, "lastName"]}
        // label="Last Name"
        rules={[{ required: true, message: "Required" }]}
        className="mb-4"
      >
        <Input size="large" placeholder="Last Name" />
      </Form.Item>

      {/* Middle Name Field */}
      <Form.Item
        name={[prefix, "middleName"]}
        // label="Middle Name"
        className="mb-4"
      >
        <Input size="large" placeholder="Middle Name" />
      </Form.Item>
    </>
  );

  const renderIdAndPersonalInfo = (prefix) => (
    <>
      <Row gutter={16} className="mb-0">
        <Col xs={24} md={12}>
          <Form.Item
            name={[prefix, "idNumber"]}
            label={`${prefix === "fatherInfo" ? "Father" : "Mother"} ID`}
            className="mb-4"
          >
            <Input size="large" placeholder="ID Number" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name={[prefix, "idExpiry"]}
            label="ID Expiry"
            className="mb-4"
          >
            <DatePicker
              size="large"
              className="w-full"
              placeholder="ID Expiry"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16} className="mb-0">
        <Col xs={24} md={12}>
          <Form.Item
            name={[prefix, "religion"]}
            label="Religion"
            className="mb-4"
          >
            <Select size="large" placeholder="Select Religion">
              {religionOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name={[prefix, "nationality"]}
            label="Nationality"
            className="mb-4"
          >
            <Select size="large" placeholder="Select Nationality">
              {nationalityOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </>
  );

  const renderContactInfo = (prefix) => (
    <>
      <Row gutter={16} className="mb-0">
        <Col xs={24} md={12}>
          <Form.Item
            name={[prefix, "company"]}
            label="Company"
            className="mb-4"
          >
            <Input size="large" placeholder="Company Name" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name={[prefix, "jobTitle"]}
            label="Job Title"
            className="mb-4"
          >
            <Input size="large" placeholder="Job Title" />
          </Form.Item>
        </Col>
      </Row>
      {renderPhoneInputWithWhatsapp(
        [prefix, "cell1"],
        [prefix, "cell1IsWhatsapp"],
        "Cell Phone 1",
        "e.g. +974 1234 5678",
        true
      )}
      {renderPhoneInputWithWhatsapp(
        [prefix, "cell2"],
        [prefix, "cell2IsWhatsapp"],
        "Cell Phone 2",
        "e.g. +974 1234 5679"
      )}
      <Row gutter={16} className="mb-0">
        <Col xs={24} md={12}>
          <Form.Item
            name={[prefix, "email1"]}
            label="Email 1"
            rules={[{ type: "email", message: "Enter a valid email" }]}
            className="mb-4"
          >
            <Input size="large" placeholder="primary@email.com" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name={[prefix, "email2"]}
            label="Email 2"
            rules={[{ type: "email", message: "Enter a valid email" }]}
            className="mb-4"
          >
            <Input size="large" placeholder="secondary@email.com" />
          </Form.Item>
        </Col>
      </Row>
    </>
  );

  const renderFatherInfo = () => (
    <>
      <Divider orientation="left" dashed>
        Father Information
      </Divider>
      {/* Updated Layout: Father Photo & Name Fields */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="md:w-[35%] relative">
          <CustomUploadCard
            name="fatherPhoto"
            label="Father Photo"
            form={form}
            recommendedSize="300x400"
            width="w-full"
            height="h-40"
            aspectRatio="aspect-square"
          />
        </div>
        <div className="md:w-[65%]">{renderNameFields("fatherInfo")}</div>
      </div>
      {renderIdAndPersonalInfo("fatherInfo")}
      {renderContactInfo("fatherInfo")}
    </>
  );

  const renderMotherInfo = () => (
    <>
      <Divider orientation="left" dashed>
        Mother Information
      </Divider>
      {/* Updated Layout: Mother Photo & Name Fields */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Left Column: Mother Photo (40% width) */}
        <div className="md:w-[35%] relative">
          <CustomUploadCard
            name="motherPhoto"
            label="Mother Photo"
            form={form}
            recommendedSize="400x500"
            width="w-full"
            height="h-40"
            aspectRatio="aspect-square"
          />
        </div>
        {/* Right Column: Mother Name Fields (60% width) */}
        <div className="md:w-[65%]">{renderNameFields("motherInfo")}</div>
      </div>
      {renderIdAndPersonalInfo("motherInfo")}
      {renderContactInfo("motherInfo")}
    </>
  );

  const renderGuardianInfo = () => (
    <>
      <Divider orientation="left" dashed className="text-purple-500">
        Guardian Information
      </Divider>
      <Row gutter={16} className="mb-4">
        <Col xs={24} md={12}>
          <Form.Item
            name={["guardianInformation", "guardianName"]}
            label="Guardian Name"
            rules={[{ required: true, message: "Required" }]}
            className="mb-4"
          >
            <Input size="large" placeholder="Guardian Name" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name={["guardianInformation", "guardianRelationToStudent"]}
            label="Relation to Student"
            rules={[{ required: true, message: "Required" }]}
            className="mb-4"
          >
            <Input size="large" placeholder="Relation to Student" />
          </Form.Item>
        </Col>
      </Row>
      {renderPhoneInputWithWhatsapp(
        ["guardianInformation", "guardianContactNumber"],
        ["guardianInformation", "guardianContactIsWhatsapp"],
        "Contact Number",
        "e.g. +974 1234 5678",
        true
      )}
      <Form.Item
        name={["guardianInformation", "guardianEmail"]}
        label="Guardian Email"
        rules={[{ type: "email", message: "Enter a valid email" }]}
        className="mb-4"
      >
        <Input size="large" placeholder="Guardian Email" />
      </Form.Item>
    </>
  );

  return (
    <div className="max-w-4xl mx-auto p-3">
      <Segmented
        value={activeTab}
        onChange={handleTabChange}
        options={[
          {
            value: "father",
            label: (
              <span>
                <UserOutlined className="mr-1" /> Father
              </span>
            ),
          },
          {
            value: "mother",
            label: (
              <span>
                <UserOutlined className="mr-1" /> Mother
              </span>
            ),
          },
          {
            value: "guardian",
            label: (
              <span>
                <TeamOutlined className="mr-1" /> Guardian
              </span>
            ),
          },
        ]}
        className="mb-2 w-full"
      />
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4"
      >
        {activeTab === "father" && renderFatherInfo()}
        {activeTab === "mother" && renderMotherInfo()}
        {activeTab === "guardian" && renderGuardianInfo()}
        <Row justify="space-between" className="mt-6">
          <Col>
            <Button size="large" onClick={handleBack}>
              Back
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={handleNext}
              size="large"
              className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white border-none hover:opacity-90"
            >
              {activeTab === "father"
                ? "Mother Info"
                : activeTab === "mother"
                ? "Guardian Info"
                : "Next"}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default GuardianInfo;
