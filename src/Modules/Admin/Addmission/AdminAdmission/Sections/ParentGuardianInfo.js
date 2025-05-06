import React from "react";
import { Row, Col } from "antd";
import {
  IdcardOutlined,
  CalendarOutlined,
  UserOutlined,
  GlobalOutlined,
  MailOutlined,
  HomeOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import ImageUploader from "../Components/ImageUploader";
import CompactIconInput from "../Components/CompactIconInput";
import CompactIconDatePicker from "../Components/CompactIconDatePicker";
import CompactIconSelect from "../Components/CompactIconSelect";
import CompactPhoneInputWithWhatsApp from "../Components/CompactPhoneInputWithWhatsApp ";

import {
  RELIGION_OPTIONS,
  COUNTRY_OPTIONS,
} from "../Configs/selectOptionsConfig";

const ParentGuardianInfo = () => {
  return (
    <div>
      {/* Father Information */}
      <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mb-4">
        Father Information
      </h2>
      <Row gutter={16}>
        <Col xs={24} md={6}>
          <ImageUploader
            name="fatherInfo.fatherPhoto"
            recommendedSize="300x400px"
            previewTitle="Father Photo Preview"
            height="h-64"
          />
        </Col>
        <Col xs={24} md={18}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <CompactIconInput
                name="fatherInfo.firstName"
                icon={<UserOutlined />}
                tooltip="Father's First Name"
                placeholder="First Name"
              />
            </Col>
            <Col xs={24} md={8}>
              <CompactIconInput
                name="fatherInfo.middleName"
                icon={<UserOutlined />}
                tooltip="Father's Middle Name"
                placeholder="Middle Name"
              />
            </Col>
            <Col xs={24} md={8}>
              <CompactIconInput
                name="fatherInfo.lastName"
                icon={<UserOutlined />}
                tooltip="Father's Last Name"
                placeholder="Last Name"
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <CompactIconInput
                name="fatherInfo.idNumber"
                icon={<IdcardOutlined />}
                tooltip="Father's ID Number"
                placeholder="Father ID"
              />
            </Col>
            <Col xs={24} md={8}>
              <CompactIconDatePicker
                name="fatherInfo.idExpiry"
                icon={<CalendarOutlined />}
                tooltip="Father ID Expiry"
                placeholder="ID Expiry"
              />
            </Col>
            <Col xs={24} md={8}>
              <CompactIconSelect
                name="fatherInfo.religion"
                icon={<GlobalOutlined />}
                tooltip="Father's Religion"
                placeholder="Religion"
                allowCustom
                options={RELIGION_OPTIONS}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <CompactIconSelect
                name="fatherInfo.nationality"
                icon={<GlobalOutlined />}
                tooltip="Father's Nationality"
                placeholder="Nationality"
                allowCustom
                options={COUNTRY_OPTIONS}
              />
            </Col>
            <Col xs={24} md={8}>
              <CompactIconInput
                name="fatherInfo.company"
                icon={<HomeOutlined />}
                tooltip="Father's Workplace or Company"
                placeholder="Company"
              />
            </Col>
            <Col xs={24} md={8}>
              <CompactIconInput
                name="fatherInfo.jobTitle"
                icon={<HomeOutlined />}
                tooltip="Father's Job Title or Position"
                placeholder="Job Title"
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <CompactPhoneInputWithWhatsApp
                phoneName="fatherInfo.cell1"
                whatsappName="fatherInfo.cell1IsWhatsapp"
                tooltip="Father's Primary Contact"
              />
            </Col>
            <Col xs={24} md={12}>
              <CompactPhoneInputWithWhatsApp
                phoneName="fatherInfo.cell2"
                whatsappName="fatherInfo.cell2IsWhatsapp"
                tooltip="Alternate Contact"
              />
            </Col>
          </Row>
          <Row gutter={16} className="mt-4">
            <Col xs={24} md={12}>
              <CompactIconInput
                name="fatherInfo.email1"
                icon={<MailOutlined />}
                tooltip="Father's Primary Email"
                placeholder="Email"
                type="email"
              />
            </Col>
            <Col xs={24} md={12}>
              <CompactIconInput
                name="fatherInfo.email2"
                icon={<MailOutlined />}
                tooltip="Additional Email"
                placeholder="Email 2"
                type="email"
              />
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Mother Information */}
      <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mt-8 mb-4">
        Mother Information
      </h2>
      <Row gutter={16}>
        <Col xs={24} md={6}>
          <ImageUploader
            name="motherInfo.motherPhoto"
            height="h-64"
            recommendedSize="300x400px"
            previewTitle="Mother Photo Preview"
          />
        </Col>
        <Col xs={24} md={18}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <CompactIconInput
                name="motherInfo.idNumber"
                icon={<IdcardOutlined />}
                tooltip="Mother's ID Number"
                placeholder="Mother ID"
              />
            </Col>
            <Col xs={24} md={8}>
              <CompactIconDatePicker
                name="motherInfo.idExpiry"
                icon={<CalendarOutlined />}
                tooltip="Mother ID Expiry"
                placeholder="ID Expiry"
              />
            </Col>
            <Col xs={24} md={8}>
              <CompactIconInput
                name="motherInfo.firstName"
                icon={<UserOutlined />}
                tooltip="Mother's First Name"
                placeholder="First Name"
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <CompactIconInput
                name="motherInfo.middleName"
                icon={<UserOutlined />}
                tooltip="Mother's Middle Name"
                placeholder="Middle Name"
              />
            </Col>
            <Col xs={24} md={8}>
              <CompactIconInput
                name="motherInfo.lastName"
                icon={<UserOutlined />}
                tooltip="Mother's Last Name"
                placeholder="Last Name"
              />
            </Col>
            <Col xs={24} md={8}>
              <CompactIconSelect
                name="motherInfo.religion"
                icon={<GlobalOutlined />}
                tooltip="Mother's Religion"
                placeholder="Religion"
                allowCustom
                options={RELIGION_OPTIONS}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <CompactIconSelect
                name="motherInfo.nationality"
                icon={<GlobalOutlined />}
                tooltip="Mother's Nationality"
                allowCustom
                placeholder="Nationality"
                options={COUNTRY_OPTIONS}
              />
            </Col>
            <Col xs={24} md={8}>
              <CompactIconInput
                name="motherInfo.company"
                icon={<HomeOutlined />}
                tooltip="Mother's Workplace or Company"
                placeholder="Company"
              />
            </Col>
            <Col xs={24} md={8}>
              <CompactIconInput
                name="motherInfo.jobTitle"
                icon={<HomeOutlined />}
                tooltip="Mother's Job Title or Position"
                placeholder="Job Title"
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <CompactPhoneInputWithWhatsApp
                phoneName="motherInfo.cell1"
                whatsappName="motherInfo.cell1IsWhatsapp"
                tooltip="Mother's Primary Contact"
              />
            </Col>
            <Col xs={24} md={12}>
              <CompactPhoneInputWithWhatsApp
                phoneName="motherInfo.cell2"
                whatsappName="motherInfo.cell2IsWhatsapp"
                tooltip="Alternate Contact"
              />
            </Col>
          </Row>
          <Row gutter={16} className="mt-4">
            <Col xs={24} md={12}>
              <CompactIconInput
                name="motherInfo.email1"
                icon={<MailOutlined />}
                tooltip="Mother's Primary Email"
                placeholder="Email"
                type="email"
              />
            </Col>
            {/* <Col xs={24} md={12}>
              <CompactIconInput
                name="motherInfo.email2"
                icon={<MailOutlined />}
                tooltip="Additional Email"
                placeholder="Email 2"
                type="email"
              />
            </Col> */}
          </Row>
        </Col>
      </Row>

      {/* Guardian Information */}
      <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mt-8 mb-4">
        Guardian Information
      </h2>
      <Row gutter={16}>
        {/* <Col xs={24} md={6}>
          <ImageUploader
            name="guardianPhoto"
            height="h-64"
            recommendedSize="300x400px"
            previewTitle="Guardian Photo Preview"
          />
        </Col> */}
        <Col xs={24} md={18}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <CompactIconInput
                name="guardianInformation.guardianName"
                icon={<UserOutlined />}
                tooltip="Guardian's Name"
                placeholder="Guardian Name"
              />
            </Col>
            <Col xs={24} md={12}>
              <CompactIconInput
                name="guardianInformation.guardianRelationToStudent"
                icon={<UserOutlined />}
                tooltip="Guardian's Relation to Student"
                placeholder="Relation to Student"
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <CompactIconInput
                name="guardianInformation.guardianContactNumber"
                icon={<PhoneOutlined />}
                tooltip="Guardian Contact Number"
                placeholder="Contact Number"
              />
            </Col>
            <Col xs={24} md={12}>
              <CompactIconInput
                name="guardianInformation.guardianEmail"
                icon={<MailOutlined />}
                tooltip="Guardian Email"
                placeholder="Guardian Email"
                type="email"
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ParentGuardianInfo;
