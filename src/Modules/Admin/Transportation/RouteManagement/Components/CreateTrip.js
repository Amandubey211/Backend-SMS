import React, { useState } from "react";
import {
  Button,
  Form,
  DatePicker,
  Select,
  Radio,
  Checkbox,
  message,
  Card,
  Row,
  Col,
} from "antd";
import {
  PlusCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { createTripLog } from "../../../../../Store/Slices/Transportation/TripExecutionLog/tripExecutionLog.action";
import dayjs from "dayjs";

const { Option } = Select;

const daysOfWeek = [
  { label: "Monday", value: "mon" },
  { label: "Tuesday", value: "tue" },
  { label: "Wednesday", value: "wed" },
  { label: "Thursday", value: "thu" },
  { label: "Friday", value: "fri" },
  { label: "Saturday", value: "sat" },
  { label: "Sunday", value: "sun" },
];

const CreateTrip = ({ vehicle, route, shiftId, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [scheduleType, setScheduleType] = useState("one-time");
  const [selectedDays, setSelectedDays] = useState([
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
  ]);

  const onFinish = async (values) => {
    try {
      let payloads = [];
      const baseDate = values.tripDate.startOf("day");

      if (scheduleType === "one-time") {
        payloads.push({
          vehicleId: vehicle.vehicleId,
          routeId: route.routeId,
          shiftId,
          tripType: values.tripType,
          tripDate: baseDate.toISOString(),
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
        });
      } else {
        selectedDays.forEach((day) => {
          const dayIndex = daysOfWeek.findIndex((d) => d.value === day);
          const tripDate = baseDate.day(dayIndex + 1);

          payloads.push({
            vehicleId: vehicle.vehicleId,
            routeId: route.routeId,
            shiftId,
            tripType: values.tripType,
            tripDate: tripDate.toISOString(),
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
          });
        });
      }

      await Promise.all(
        payloads.map((payload) => dispatch(createTripLog(payload)))
      );
      message.success(
        scheduleType === "one-time"
          ? "Trip created successfully!"
          : `${selectedDays.length} trips scheduled successfully!`
      );
      onClose();
    } catch (error) {
      message.error("Failed to create trip(s). Please try again.");
      console.error("Trip creation error:", error);
    }
  };

  const handleDayChange = (checkedValues) => {
    setSelectedDays(checkedValues);
  };

  return (
    <div className="flex flex-col h-full">
      <Card bordered={false} className="shadow-md flex-grow overflow-auto">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            tripType: "pickup",
            tripDate: dayjs(),
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="tripType"
                label="Trip Type"
                rules={[{ required: true, message: "Please select trip type" }]}
              >
                <Select
                  placeholder="Select trip type"
                  suffixIcon={<ClockCircleOutlined />}
                >
                  <Option value="pickup">Pickup</Option>
                  <Option value="drop">Drop</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Schedule Type">
                <Radio.Group
                  value={scheduleType}
                  onChange={(e) => setScheduleType(e.target.value)}
                  buttonStyle="solid"
                  className="w-full"
                >
                  <Radio.Button value="one-time" className="w-1/2 text-center">
                    One-time Trip
                  </Radio.Button>
                  <Radio.Button value="weekly" className="w-1/2 text-center">
                    Recurring Weekly
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="tripDate"
                label={
                  scheduleType === "one-time" ? "Trip Date" : "Starting Week Of"
                }
                rules={[{ required: true, message: "Please select date" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>

            {scheduleType === "weekly" && (
              <Col span={24}>
                <Form.Item label="Recurring Days">
                  <Checkbox.Group
                    options={daysOfWeek}
                    value={selectedDays}
                    onChange={handleDayChange}
                    className="grid grid-cols-2 gap-2"
                  >
                    {daysOfWeek.map((day) => (
                      <Checkbox
                        key={day.value}
                        value={day.value}
                        className={`rounded-md p-2 ${
                          selectedDays.includes(day.value)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                        }`}
                      >
                        {day.label}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </Card>

      {/* Sticky Footer with Buttons */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-sm">
        <div className="flex justify-between">
          <Button onClick={onClose} className="px-6 flex-1 mr-2">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusCircleOutlined />}
            className="px-6 flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            onClick={() => form.submit()}
          >
            {scheduleType === "one-time" ? "Create Trip" : "Create Schedule"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
