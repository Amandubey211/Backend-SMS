// src/pages/StudentSignUp/Steps/AddressInfo.jsx
import React from "react";
import { Form, Select, Button, Radio, Switch, Input } from "antd";

const { Option } = Select;

const AddressInfo = () => {
  const [form] = Form.useForm();
  const [residenceType, setResidenceType] = React.useState("flat");

  const onFinish = (values) => {
    console.log("AddressInfo values:", values);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 ">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-6"
      >
        <Form.Item name="residenceType" label="Residence Type">
          <Radio.Group onChange={(e) => setResidenceType(e.target.value)}>
            <Radio value="flat">Flat/Villa</Radio>
            <Radio value="house">House</Radio>
          </Radio.Group>
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="unitNumber"
            label={residenceType === "flat" ? "Unit #" : "House #"}
          >
            <Input
              placeholder={
                residenceType === "flat" ? "Unit Number" : "House Number"
              }
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="buildingNumber"
            label={residenceType === "flat" ? "Building #" : "Street #"}
          >
            <Input
              placeholder={
                residenceType === "flat" ? "Building Number" : "Street Number"
              }
              size="large"
            />
          </Form.Item>
        </div>

        <Form.Item name="streetName" label="Street Name">
          <Input placeholder="Street Name" size="large" />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="zoneNumber" label="Zone #">
            <Select
              placeholder="Select Zone"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
              size="large"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((zone) => (
                <Option key={zone} value={zone}>
                  Zone {zone}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="zoneName" label="Zone Name">
            <Input placeholder="Zone Name" size="large" />
          </Form.Item>
        </div>

        <Form.Item name="compoundType" label="Compound/Stand Alone">
          <Radio.Group>
            <Radio value="compound">Compound</Radio>
            <Radio value="standalone">Stand Alone</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="compoundName" label="Compound Name">
          <Input placeholder="Compound Name (if applicable)" size="large" />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="city" label="City">
            <Select
              placeholder="Select City"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
              size="large"
            >
              {["cities"].map((city) => (
                <Option key={city} value={city}>
                  {city}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="nearestLandmark" label="Nearest Landmark">
            <Input placeholder="Landmark" size="large" />
          </Form.Item>
        </div>

        <Form.Item
          name="proposedCampus"
          label="Proposed Campus (if applicable)"
        >
          <Input placeholder="Proposed Campus" size="large" />
        </Form.Item>

        <Form.Item
          name="transportRequired"
          label="Transport Required"
          valuePropName="checked"
        >
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>

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

export default AddressInfo;
