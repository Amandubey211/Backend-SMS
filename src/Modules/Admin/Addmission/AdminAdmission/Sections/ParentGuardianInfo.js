import React from "react";
import { Form, Row, Col, Input, DatePicker, Select } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  UserOutlined,
  IdcardOutlined,
  CalendarOutlined,
  GlobalOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import CustomUploadCard from "../../../../LoginPages/Student/SignUp/Components/CustomUploadCard";

const { Option } = Select;

const ParentGuardianInfo = ({ form }) => {
  return (
    <>
      {/* Father Information */}
      <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mb-4">
        Father Information
      </h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Form.Item
            name={["fatherInfo", "fatherPhoto"]}
            label="Father Photo"
          // rules={[{ required: true, message: "Father photo is required" }]}
          >
            <CustomUploadCard
              name="fatherPhoto"
              form={form}
              recommendedSize="300x400"
              width="w-full"
              height="h-52"
            // required
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={18}>
          {/* Name Fields */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item
                name={["fatherInfo", "firstName"]}
                label="First Name"
                rules={[{ required: true, message: "First name is required" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="First Name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={["fatherInfo", "middleName"]}
                label="Middle Name"
              >
                <Input prefix={<UserOutlined />} placeholder="Middle Name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={["fatherInfo", "lastName"]}
                label="Last Name"
                rules={[{ required: true, message: "Last name is required" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Last Name" />
              </Form.Item>
            </Col>
          </Row>

          {/* ID & Religion */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item
                name={["fatherInfo", "idNumber"]}
                label="ID Number"
                rules={[{ required: true, message: "ID number is required" }]}
              >
                <Input prefix={<IdcardOutlined />} placeholder="ID Number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={["fatherInfo", "idExpiry"]}
                label="ID Expiry"
                rules={[{ required: true, message: "Expiry date is required" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name={["fatherInfo", "religion"]} label="Religion">
                <Select placeholder="Religion" suffixIcon={<GlobalOutlined />}>
                  <Option value="christianity">Christianity</Option>
                  <Option value="islam">Islam</Option>
                  <Option value="hinduism">Hinduism</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Nationality & Job */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item
                name={["fatherInfo", "nationality"]}
                label="Nationality"
              >
                <Select
                  placeholder="Nationality"
                  suffixIcon={<GlobalOutlined />}
                >
                  <Option value="albania">Albania</Option>
                  <Option value="india">India</Option>
                  <Option value="qatari">Qatar</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name={["fatherInfo", "company"]} label="Company">
                <Input prefix={<HomeOutlined />} placeholder="Company" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name={["fatherInfo", "jobTitle"]} label="Job Title">
                <Input prefix={<HomeOutlined />} placeholder="Job Title" />
              </Form.Item>
            </Col>
          </Row>

          {/* Contacts & Email */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name={["fatherInfo", "cell1"]}
                label="Primary Contact"
                rules={[
                  { required: true, message: "Primary contact is required" },
                ]}
              >
                <PhoneInput
                  country="qa"
                  inputStyle={{ width: "100%" }}
                  onChange={(value) =>
                    form.setFieldsValue({
                      fatherInfo: { cell1: value },
                    })
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name={["fatherInfo", "cell2"]}
                label="Secondary Contact"
              >
                <PhoneInput
                  country="qa"
                  inputStyle={{ width: "100%" }}
                  onChange={(value) =>
                    form.setFieldsValue({
                      fatherInfo: { cell2: value },
                    })
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name={["fatherInfo", "email1"]}
                label="Email"
                rules={[
                  { type: "email", message: "Invalid email" },
                  { required: true, message: "Email is required" },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name={["fatherInfo", "email2"]} label="Email 2">
                <Input prefix={<MailOutlined />} placeholder="Email 2" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Mother Information */}
      <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mt-8 mb-4">
        Mother Information
      </h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Form.Item
            name={["motherInfo", "motherPhoto"]}
            label="Mother Photo"
          // rules={[{ required: true, message: "Mother photo is required" }]}
          >
            <CustomUploadCard
              name="motherPhoto"
              form={form}
              recommendedSize="300x400"
              width="w-full"
              height="h-52"
            // required
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={18}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item
                name={["motherInfo", "firstName"]}
                label="First Name"
                rules={[{ required: true, message: "First name is required" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="First Name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={["motherInfo", "middleName"]}
                label="Middle Name"
              >
                <Input prefix={<UserOutlined />} placeholder="Middle Name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={["motherInfo", "lastName"]}
                label="Last Name"
                rules={[{ required: true, message: "Last name is required" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Last Name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item
                name={["motherInfo", "idNumber"]}
                label="ID Number"
                rules={[{ required: true, message: "ID number is required" }]}
              >
                <Input prefix={<IdcardOutlined />} placeholder="ID Number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={["motherInfo", "idExpiry"]}
                label="ID Expiry"
                rules={[{ required: true, message: "Expiry date is required" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name={["motherInfo", "religion"]} label="Religion">
                <Select placeholder="Religion" suffixIcon={<GlobalOutlined />}>
                  <Option value="christianity">Christianity</Option>
                  <Option value="islam">Islam</Option>
                  <Option value="hinduism">Hinduism</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item
                name={["motherInfo", "nationality"]}
                label="Nationality"
              >
                <Select
                  placeholder="Nationality"
                  suffixIcon={<GlobalOutlined />}
                >
                  <Option value="albania">Albania</Option>
                  <Option value="india">India</Option>
                  <Option value="qatari">Qatar</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name={["motherInfo", "company"]} label="Company">
                <Input prefix={<HomeOutlined />} placeholder="Company" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name={["motherInfo", "jobTitle"]} label="Job Title">
                <Input prefix={<HomeOutlined />} placeholder="Job Title" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name={["motherInfo", "cell1"]}
                label="Primary Contact"
                rules={[
                  { required: true, message: "Primary contact is required" },
                ]}
              >
                <PhoneInput
                  country="qa"
                  inputStyle={{ width: "100%" }}
                  onChange={(value) =>
                    form.setFieldsValue({
                      motherInfo: { cell1: value },
                    })
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name={["motherInfo", "cell2"]}
                label="Secondary Contact"
              >
                <PhoneInput
                  country="qa"
                  inputStyle={{ width: "100%" }}
                  onChange={(value) =>
                    form.setFieldsValue({
                      motherInfo: { cell2: value },
                    })
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name={["motherInfo", "email1"]}
                label="Email"
                rules={[
                  { type: "email", message: "Invalid email" },
                  { required: true, message: "Email is required" },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name={["motherInfo", "email2"]} label="Email 2">
                <Input prefix={<MailOutlined />} placeholder="Email 2" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Guardian Information */}
      <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mt-8 mb-4">
        Guardian Information
      </h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            name={["guardianInformation", "guardianName"]}
            label="Guardian Name"
            rules={[{ required: true, message: "Guardian name is required" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Guardian Name" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name={["guardianInformation", "guardianRelationToStudent"]}
            label="Relation to Student"
            rules={[{ required: true, message: "Relation is required" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Relation" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            name={["guardianInformation", "guardianContactNumber"]}
            label="Guardian Contact"
            rules={[{ required: true, message: "Contact number is required" }]}
          >
            <PhoneInput country="qa" inputStyle={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name={["guardianInformation", "guardianEmail"]}
            label="Guardian Email"
            rules={[
              { type: "email", message: "Invalid email" },
              { required: true, message: "Email is required" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Guardian Email" />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default ParentGuardianInfo;
