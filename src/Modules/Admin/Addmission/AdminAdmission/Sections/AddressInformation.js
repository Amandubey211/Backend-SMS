import React from "react";
import { Row, Col, Radio, Switch, Form } from "antd";
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
        {/* Row 1: Radio Button Group (Flat/Villa), Unit #, Building # */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
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
            <CompactIconInput
              name="addressInformation.unitNumber"
              icon={<NumberOutlined />}
              tooltip="Enter Unit #"
              placeholder="Unit #"
              type="text"
            />
          </Col>
          <Col xs={24} md={8}>
            <CompactIconInput
              name="addressInformation.buildingNumber"
              icon={<BankOutlined />}
              tooltip="Enter Building #"
              placeholder="Building #"
            />
          </Col>
        </Row>

        {/* Row 2: Street #, Street Name, Zone # */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <CompactIconInput
              name="addressInformation.streetNumber"
              icon={<NumberOutlined />}
              tooltip="Enter Street #"
              placeholder="Street #"
            />
          </Col>
          <Col xs={24} md={8}>
            <CompactIconInput
              name="addressInformation.streetName"
              icon={<EnvironmentOutlined />}
              tooltip="Enter Street Name"
              placeholder="Street Name"
            />
          </Col>
          <Col xs={24} md={8}>
            <CompactIconSelect
              name="addressInformation.zone"
              icon={<EnvironmentOutlined />}
              tooltip="Select Zone"
              placeholder="Select Zone #"
              options={[
                { label: "Zone 1", value: "zone1" },
                { label: "Zone 2", value: "zone2" },
                { label: "Zone 3", value: "zone3" },
              ]}
            />
          </Col>
        </Row>

        {/* Row 3: Radio Button Group (Compound/Stand Alone), Compound Name, City */}
        <Row gutter={[16, 16]}>
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
          </Col>
          <Col xs={24} md={8}>
            <CompactIconInput
              name="addressInformation.compoundName"
              icon={<HomeOutlined />}
              tooltip="Enter Compound Name (if applicable)"
              placeholder="Compound Name"
            />
          </Col>
          <Col xs={24} md={8}>
            <CompactIconSelect
              name="addressInformation.city"
              icon={<EnvironmentOutlined />}
              tooltip="Select City"
              placeholder="Select City"
              options={[
                { label: "Doha", value: "doha" },
                { label: "Al Rayyan", value: "alRayyan" },
                { label: "Al Wakrah", value: "alWakrah" },
              ]}
            />
          </Col>
        </Row>

        {/* Row 4: Nearest Landmark, Proposed Campus, Transport Required (Switch) */}
        <Row gutter={[16, 16]}>
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
          <Col xs={24} md={8}>
            <Form.Item label="Transport Required" className="mb-0">
              <Switch name="addressInformation.transportRequired" />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AddressInformation;
