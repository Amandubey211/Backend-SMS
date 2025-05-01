import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Avatar, Divider, Card, Tag } from "antd";
import { UserOutlined, TeamOutlined, SearchOutlined } from "@ant-design/icons";

export default function UserAssignmentModal({
  visible,
  onCancel,
  onOk,
  stopId,
  allUsers,
  assignedUsers,
}) {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  // Filter users based on search and role
  const filteredUsers =
    allUsers?.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.role.toLowerCase().includes(searchText.toLowerCase())
    ) || [];

  const students = filteredUsers.filter((u) => u.role === "student");
  const staff = filteredUsers.filter((u) => u.role !== "student");

  return (
    <Modal
      title={`Assign Users to Stop`}
      visible={visible}
      onOk={() => form.submit()}
      onCancel={onCancel}
      width={800}
    >
      <Card>
        <Form form={form} onFinish={onOk}>
          <Input
            placeholder="Search users..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <Divider orientation="left">
            <TeamOutlined /> Students
          </Divider>
          <Form.Item name="students">
            <Select mode="multiple" optionLabelProp="label">
              {students.map((user) => (
                <Select.Option
                  key={user.userId}
                  value={user.userId}
                  label={user.name}
                >
                  <UserItem user={user} />
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Divider orientation="left">
            <UserOutlined /> Staff
          </Divider>
          <Form.Item name="staff">
            <Select mode="multiple" optionLabelProp="label">
              {staff.map((user) => (
                <Select.Option
                  key={user.userId}
                  value={user.userId}
                  label={user.name}
                >
                  <UserItem user={user} />
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
}

const UserItem = ({ user }) => (
  <div className="flex items-center gap-2">
    <Avatar src={user.profile} icon={<UserOutlined />} />
    <span>{user.name}</span>
    <Tag color="blue">{user.role}</Tag>
  </div>
);
