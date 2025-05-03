// CreateTrip.jsx
import React from "react";
import {
  Button,
  Form,
  Input,
  DatePicker,
  TimePicker,
  message,
  Space,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

const CreateTrip = ({ vehicle, onClose }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Create trip:", values, "for vehicle:", vehicle);
    message.success("Trip created successfully");
    onClose();
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">
        Create Trip for Vehicle: {vehicle.vehicleNumber}
      </h3>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ tripName: "" }}
      >
        <Form.Item
          name="tripName"
          label="Trip Name"
          rules={[{ required: true, message: "Please enter trip name" }]}
        >
          <Input placeholder="Enter trip name" />
        </Form.Item>

        <Form.Item
          name="date"
          label="Trip Date"
          rules={[{ required: true, message: "Please select date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="time"
          label="Trip Time"
          rules={[{ required: true, message: "Please select time" }]}
        >
          <TimePicker style={{ width: "100%" }} format="HH:mm" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusCircleOutlined />}
            >
              Create Trip
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateTrip;
