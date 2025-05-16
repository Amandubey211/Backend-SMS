import React from "react";
import { Row, Col, Radio, Form } from "antd";
import {
  HomeOutlined,
  NumberOutlined,
  BankOutlined,
  EnvironmentOutlined,
  PushpinOutlined,
  BankFilled,
} from "@ant-design/icons";
import { useField } from "formik";

import CompactIconInput from "../Components/CompactIconInput";
import CompactIconSelect from "../Components/CompactIconSelect";

const AddressInformation = () => {
  return (
    <div>
      {/* Section Header */}
      <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mb-0">
        Address Information
      </h2>

      {/* Content Wrapper with background */}
      <div className="p-3">
        {/* First Row: Residence Type, Dwelling Type, Transport Required */}
        <Row gutter={[16, 16]} className="mb-4">
          {/* <Col xs={24} md={8}>
            <Form.Item label="Residence Type" className="mb-2">
              <Radio.Group
                name="addressInformation.residenceType"
                optionType="button"
                buttonStyle="solid"
              >
                <Radio.Button value="flat">Flat</Radio.Button>
                <Radio.Button value="villa">Villa</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Dwelling Type" className="mb-2">
              <Radio.Group
                name="addressInformation.dwellingType"
                optionType="button"
                buttonStyle="solid"
              >
                <Radio.Button value="compound">Compound</Radio.Button>
                <Radio.Button value="standAlone">Stand Alone</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col> */}
          <Col xs={24} md={8}>
            <Form.Item label="Transport Required" className="mb-2">
              <Radio.Group
                name="addressInformation.transportRequired"
                optionType="button"
                buttonStyle="solid"
              >
                <Radio.Button value={true}>Yes</Radio.Button>
                <Radio.Button value={false}>No</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        {/* Second Row: Unit #, Building #, Street # */}
        <Row gutter={[16, 16]} className="mb-4">
          {/* <Col xs={24} md={8}>
            <CompactIconInput
              name="addressInformation.unitNumber"
              icon={<NumberOutlined />}
              tooltip="Enter Unit #"
              placeholder="Unit #"
              type="text"
            />
          </Col> */}
          <Col xs={24} md={8}>
            <CompactIconInput
              name="addressInformation.buildingNumber"
              icon={<BankOutlined />}
              tooltip="Enter Building #"
              placeholder="Building No./House No."
            />
          </Col>
          {/* <Col xs={24} md={8}>
            <CompactIconInput
              name="addressInformation.streetNumber"
              icon={<NumberOutlined />}
              tooltip="Enter Street #"
              placeholder="Street #"
            />
          </Col> */}
          <Col xs={24} md={8}>
            <CompactIconInput
              name="addressInformation.streetName"
              icon={<EnvironmentOutlined />}
              tooltip="Enter Street Name"
              placeholder="Street Address"
            />
          </Col>
          <Col xs={24} md={8}>
            <CompactIconInput
              name="addressInformation.city"
              icon={<EnvironmentOutlined />}
              tooltip="Enter City"
              placeholder="City"
            />
          </Col>
        </Row>

        {/* Third Row: Street Name, Zone #, Compound Name */}
        {/* <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} md={8}>
            <CompactIconInput
              name="addressInformation.zone"
              icon={<EnvironmentOutlined />}
              tooltip="Enter Zone"
              placeholder="Zone #"
            />
          </Col>
          <Col xs={24} md={8}>
            <CompactIconInput
              name="addressInformation.compoundName"
              icon={<HomeOutlined />}
              tooltip="Enter Compound Name (if applicable)"
              placeholder="Compound Name"
            />
          </Col>
        </Row> */}

        {/* Fourth Row: City, Nearest Landmark, Proposed Campus */}
        {/* <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <CompactIconInput
              name="addressInformation.nearestLandmark"
              icon={<PushpinOutlined />}
              tooltip="Enter Nearest Landmark"
              placeholder="Nearest Landmark"
            />
          </Col>
          <Col xs={24} md={8}>
            <CompactIconInput
              name="addressInformation.proposedCampus"
              icon={<BankFilled />}
              tooltip="Enter Proposed Campus"
              placeholder="Proposed Campus"
            />
          </Col>   
        </Row> */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <CompactIconInput
              name="addressInformation.postalCode"
              icon={<BankFilled />}
              tooltip="Enter postal Code/Zip Code"
              placeholder="Enter postal Code/Zip Code"
            />
          </Col>
          <Col xs={24} md={8}>
            <CompactIconInput
              name="addressInformation.state"
              icon={<BankFilled />}
              tooltip="Enter State/region"
              placeholder="Enter State/region"
            />
          </Col>
          <Col xs={24} md={8}>
            <CompactIconInput
              name="addressInformation.country"
              icon={<PushpinOutlined />}
              tooltip="Enter country"
              placeholder="country"
            />
          </Col>


        </Row>
      </div>
    </div>
  );
};

export default AddressInformation;
