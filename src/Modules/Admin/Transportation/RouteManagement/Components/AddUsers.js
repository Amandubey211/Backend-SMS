import React, { useEffect, useState } from "react";
import { Button, Form, Select, Space, message, Spin, DatePicker } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  assignPersonToVehicle,
  fetchPersonsAssignedStatus
} from "../../../../../Store/Slices/Transportation/VehiclePersonAssignment/vehiclePersonAssignmnet.action";
import dayjs from "dayjs";

const { Option } = Select;

const AddUsers = ({ vehicle, route, academicYearId, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [personType, setPersonType] = useState("student"); // Default is 'student'

  const { assignedUsers, loading } = useSelector(
    (state) => state.transportation.vehicleUserAssignment
  );

  useEffect(() => {
    if (route?.routeId && personType) {
      dispatch(
        fetchPersonsAssignedStatus({
          routeId: route.routeId,
          personType
        })
      );
    }
  }, [dispatch, route.routeId, personType]);

  const onFinish = (values) => {
    const payload = {
      vehicleId: vehicle.vehicleId || null,
      shiftId: vehicle.shiftId || null,
      persons: values.users?.map((id) => ({
        personId: id,
        person_type: personType,
      })),
      valid_from: values.valid_from?.toDate() || new Date(),
      valid_to: values.valid_to ? values.valid_to.toDate() : null,
    };

    dispatch(assignPersonToVehicle(payload));

  };

  console.log("assigned user",assignedUsers)
  const userOptions = assignedUsers?.map((person) => ({
    value: person._id,
    label: `${person.name} ${person.busAssigned ? ` (Assigned to ${person.busNumber})` : ""}`,
    disabled: person.busAssigned,
  }));

  return (
    <div>
      {loading ? (
        <Spin />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            users: [],
            valid_from: dayjs(),
            valid_to: null,
          }}
        >
          <Form.Item
            label="Select Person Type"
            name="personType"
            initialValue="student"
          >
            <Select onChange={(value) => setPersonType(value)}>
              <Option value="student">Student</Option>
              <Option value="staff">Staff</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="users"
            label="Select Users"
            rules={[
              {
                required: true,
                message: "Please select at least one user",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select users"
              options={userOptions}
            />
          </Form.Item>

          <Form.Item
            name="valid_from"
            label="Valid From"
            rules={[{ required: true, message: "Please select valid from date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="valid_to" label="Valid To (optional)">
            <DatePicker style={{ width: "100%" }} />
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
      )}
    </div>
  );
};

export default AddUsers;
