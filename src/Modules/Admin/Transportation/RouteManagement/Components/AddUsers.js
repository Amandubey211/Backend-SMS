// AddUsers.jsx
import React from "react";
import { Button, Form, Input, Select, Space, message } from "antd";
import { UserAddOutlined } from "@ant-design/icons";

const AddUsers = ({ vehicle, onClose }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Add users:", values, "for vehicle:", vehicle);
    message.success("Users added successfully");
    onClose();
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">
        Add Users to Vehicle: {vehicle.vehicleNumber}
      </h3>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ users: [] }}
      >
        <Form.Item
          name="users"
          label="Select Users"
          rules={[
            { required: true, message: "Please select at least one user" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select users"
            options={[
              { value: "user1", label: "User One" },
              { value: "user2", label: "User Two" },
              { value: "user3", label: "User Three" },
            ]}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<UserAddOutlined />}>
              Add Users
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddUsers;
