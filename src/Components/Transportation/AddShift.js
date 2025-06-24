import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Form,
  Input,
  Select,
  TimePicker,
  Switch,
  Button,
  Typography,
  Space,
  message,
} from "antd";
import { createShift, updateShift } from "../../Store/Slices/Transportation/Shift/shift.action";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

const AddShift = ({ onSave, onClose, initialData, selectedShift }) => {
  const dispatch = useDispatch();

  // Form Data State
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedShift) {
      form.setFieldsValue({
        shiftName: selectedShift.shiftName,
        fromTime: selectedShift.fromTime ? dayjs(selectedShift.fromTime, "HH:mm") : null,
        toTime: selectedShift.toTime ? dayjs(selectedShift.toTime, "HH:mm") : null,
        shift: selectedShift.shift,
        deactivateShift: selectedShift.deactivateShift,
      });
    } else {
      form.resetFields();
    }
  }, [selectedShift, form]);

  const handleClose = ()=>{
    form.resetFields();
    onClose();
  }

  const handleSubmit = async (values) => {
    const dataToSubmit = {
      ...values,
      fromTime: values.fromTime ? values.fromTime.format("HH:mm") : "",
      toTime: values.toTime ? values.toTime.format("HH:mm") : "",
    };

    if (selectedShift) {
      await dispatch(updateShift({ id: selectedShift._id, updatedData: dataToSubmit }));
    } else {
      await dispatch(createShift(dataToSubmit));
    }

    message.success(selectedShift ? "Shift updated successfully!" : "Shift added successfully!");
    form.resetFields(); // Clear the form after successful submission
    if (onSave) onSave();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Title level={3} className="mb-4">
        {selectedShift ? "Edit Shift" : "Add Shift"}
      </Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
      >
        {/* Shift Name */}
        <Form.Item
          label="Shift Name"
          name="shiftName"
          rules={[{ required: true, message: "Please enter a shift name." }]}
        >
          <Input placeholder="Enter shift name" />
        </Form.Item>

        {/* Shift Type */}
        <Form.Item
          label="Shift Type"
          name="shift"
          rules={[{ required: true, message: "Please select a shift type." }]}
        >
          <Select placeholder="Select a shift type">
            <Option value="morning">Morning</Option>
            <Option value="afternoon">Afternoon</Option>
            <Option value="evening">Evening</Option>
            <Option value="night">Night</Option>
          </Select>
        </Form.Item>

        {/* From Time */}
        <Form.Item
          label="From Time"
          name="fromTime"
          rules={[{ required: true, message: "Please select a from time." }]}
        >
          <TimePicker format="HH:mm" style={{ borderColor: "pink" }} />
        </Form.Item>

        {/* To Time */}
        <Form.Item
          label="To Time"
          name="toTime"
          rules={[
            { required: true, message: "Please select a to time." },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const fromTime = getFieldValue("fromTime");
                if (!value || !fromTime || value.isAfter(fromTime)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("To Time must be after From Time.")
                );
              },
            }),
          ]}
        >
          <TimePicker format="HH:mm" style={{ borderColor: "pink" }} />
        </Form.Item>

        {/* Deactivate Shift */}
        {selectedShift && (
          <Form.Item
            label="Deactivate Shift"
            name="deactivateShift"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        )}

        {/* Buttons */}
        <Form.Item>
          <Space>
            <Button
              onClick={handleClose}
              style={{
                backgroundColor: "#ff85c0",
                borderColor: "#ff69b4",
                color: "white",
              }}
              className="hover:bg-pink-400 hover:border-pink-300"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#ff85c0",
                borderColor: "#ff69b4",
                color: "white",
              }}
              className="hover:bg-pink-400 hover:border-pink-300"
            >
              {selectedShift ? "Update Shift" : "Save Shift"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddShift;
