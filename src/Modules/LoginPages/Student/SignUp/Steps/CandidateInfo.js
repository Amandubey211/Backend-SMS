// src/pages/StudentSignUp/Steps/CandidateInfo.jsx
import React from "react";
import { Form, Input, Button, DatePicker, Select, Tooltip, Space } from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  IdcardOutlined,
  GlobalOutlined,
  MailOutlined,
} from "@ant-design/icons";
import CustomUploadCard from "../Components/CustomUploadCard";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaWhatsapp } from "react-icons/fa";

const { Option } = Select;

const CandidateInfo = () => {
  const [form] = Form.useForm();

  // Helper function to render the phone input with a WhatsApp toggle.
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

  const onFinish = (values) => {
    console.log("Candidate Information:", values);
    // Process form values or dispatch them to your store / next step as needed.
  };

  return (
    <div className="max-w-4xl mx-auto  ">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4"
      >
        {/* Section 1: Photo & Name */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Column: Photo Upload (40% width) */}
          <div className="md:w-[40%]">
            <CustomUploadCard
              name="candidatePicture"
              label="Candidate Photo"
              form={form}
              recommendedSize="300x400px"
              width="w-full"
              height="h-48"
              aspectRatio="aspect-square"
            />
          </div>
          {/* Right Column: Name Fields (60% width) */}
          <div className="md:w-[60%]">
            <div className="grid grid-cols-1 gap-3">
              <Form.Item
                name="firstName"
                // label="First Name"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input
                  size="large"
                  placeholder="First Name"
                  className="w-full rounded-lg focus:border-pink-500 transition-colors"
                  prefix={<UserOutlined />}
                />
              </Form.Item>

              <Form.Item name="middleName">
                <Input
                  size="large"
                  placeholder="Middle Name"
                  className="w-full rounded-lg focus:border-pink-500 transition-colors"
                  prefix={<UserOutlined />}
                />
              </Form.Item>
              <Form.Item
                name="lastName"
                // label="Last Name"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input
                  size="large"
                  placeholder="Last Name"
                  className="w-full rounded-lg focus:border-pink-500 transition-colors"
                  prefix={<UserOutlined />}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* Section 2: Date of Birth (New Row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="dob"
            label="Date of Birth"
            rules={[{ required: true, message: "Required" }]}
          >
            <DatePicker
              size="large"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
              placeholder="DOB"
              suffixIcon={<CalendarOutlined />}
            />
          </Form.Item>
          <Form.Item name="age" label="Age">
            <Input
              size="large"
              placeholder="Age"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
              disabled
              readOnly
            />
          </Form.Item>
        </div>

        {/* Section 3: Additional Candidate Information */}
        {/* Row: Student ID & ID Expiry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="studentId" label="Student ID">
            <Input
              size="large"
              placeholder="Student ID"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
              prefix={<IdcardOutlined />}
            />
          </Form.Item>
          <Form.Item name="idExpiry" label="ID Expiry">
            <DatePicker
              size="large"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
              placeholder="ID Expiry"
              suffixIcon={<CalendarOutlined />}
            />
          </Form.Item>
        </div>

        {/* Row: Blood Group & Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="bloodGroup" label="Blood Group">
            <Select
              size="large"
              placeholder="Select Blood Group"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
            >
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
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select
              size="large"
              placeholder="Select Gender"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
            >
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Row: Passport Number & Passport Expiry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="passportNumber" label="Passport Number">
            <Input
              size="large"
              placeholder="Passport Number"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
              prefix={<IdcardOutlined />}
            />
          </Form.Item>
          <Form.Item name="passportExpiry" label="Passport Expiry">
            <DatePicker
              size="large"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
              placeholder="Passport Expiry"
              suffixIcon={<CalendarOutlined />}
            />
          </Form.Item>
        </div>

        {/* Row: Place of Birth & Nationality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="placeOfBirth"
            label="Place of Birth"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input
              size="large"
              placeholder="Place of Birth"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
              prefix={<GlobalOutlined />}
            />
          </Form.Item>
          <Form.Item
            name="nationality"
            label="Nationality"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select
              size="large"
              placeholder="Select Nationality"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
            >
              <Option value="qatari">Qatari</Option>
              <Option value="egyptian">Egyptian</Option>
              <Option value="indian">Indian</Option>
              <Option value="pakistani">Pakistani</Option>
              <Option value="bangladeshi">Bangladeshi</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Row: Religion & Phone with WhatsApp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="religion"
            label="Religion"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select
              size="large"
              placeholder="Select Religion"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
            >
              <Option value="Islam">Islam</Option>
              <Option value="Christianity">Christianity</Option>
              <Option value="Hinduism">Hinduism</Option>
              <Option value="Buddhism">Buddhism</Option>
              <Option value="Judaism">Judaism</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="nativeLanguage"
            label="Native Language"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select
              size="large"
              placeholder="Select Native Language"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
            >
              <Option value="arabic">Arabic</Option>
              <Option value="english">English</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Row: Email & Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Invalid email" }]}
          >
            <Input
              size="large"
              placeholder="Email"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
              prefix={<MailOutlined />}
            />
          </Form.Item>
        </div>

        {/* Row: Emergency Number & Native Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            {renderPhoneInputWithWhatsapp(
              "phoneNumber",
              "phoneNumberIsWhatsapp",
              "Phone",
              "e.g. +974 1234 5678",
              true
            )}
          </div>
          <Form.Item name="emergencyNumber" label="Emergency Number">
            <Input
              size="large"
              placeholder="Emergency Number"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
            />
          </Form.Item>
        </div>

        {/* Row: Primary Contact (Full Width) */}
        <div className="grid grid-cols-1">
          <Form.Item
            name="primaryContact"
            label="Primary Contact"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select
              size="large"
              placeholder="Select Primary Contact"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
            >
              <Option value="father">Father</Option>
              <Option value="mother">Mother</Option>
              <Option value="guardian">Guardian</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button size="large">Back</Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white border-none hover:opacity-90 focus:opacity-90 transition-opacity"
          >
            Next
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CandidateInfo;
