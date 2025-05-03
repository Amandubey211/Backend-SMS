import React from "react";
import { Button, Form, DatePicker, Select, message, Space } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { createTripLog } from "../../../../../Store/Slices/Transportation/TripExecutionLog/tripExecutionLog.action";

const { Option } = Select;

const CreateTrip = ({ vehicle, route, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    const payload = {
      vehicleId: vehicle.vehicleId,
      routeId: route.routeId, // Assuming vehicle object has routeId
      tripType: values.tripType,
      tripDate: values.date.startOf("day").toISOString(), // Convert date to 00:00:00 time
      stopLogs:
        route?.stops?.map((stop) => ({
          stopId: stop.stopId,
          status: "pending",
          order: stop.order,
          scheduledArrival: null,
          scheduledDeparture: null,
          actualArrival: null,
          actualDeparture: null,
        })) || [],
    };

    dispatch(createTripLog(payload));
    onClose();
  };

  return (
    <div>
      {/* <h3 className="text-lg font-medium mb-4">
        Create Trip for Vehicle: {vehicle.vehicleNumber}
      </h3> */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ tripType: "pickup" }}
      >
        <Form.Item
          name="tripType"
          label="Trip Type"
          rules={[{ required: true, message: "Please select trip type" }]}
        >
          <Select placeholder="Select trip type">
            <Option value="pickup">Pickup</Option>
            <Option value="drop">Drop</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="date"
          label="Trip Date"
          rules={[{ required: true, message: "Please select date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
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
