/* Path unchanged: features/Transportation/RoutesManagment/components/RouteForm.js */
import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Table, Typography, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  createRoute,
  getRoutesBySchool,
  updateRoute,
} from "../../../../../Store/Slices/Transportation/RoutesManagment/routes.action";

const { Option } = Select;
const { Title } = Typography;

export default function RouteForm({ routeData, onSuccess, t }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { subRoutes } = useSelector(
    (state) => state.transportation.transportSubRoute
  );
  const [selectedStops, setSelectedStops] = useState([]);

  /* -------- populate on edit -------- */
  useEffect(() => {
    if (routeData) {
      form.setFieldsValue({
        routeName: routeData.routeName,
        isActive: routeData.isActive,
      });
      setSelectedStops(
        routeData.stops.map((s) => ({
          key: s.stopId,
          stopId: s.stopId,
          order: s.order,
          isStartingPoint: s.isStartingPoint,
          isEndingPoint: s.isEndingPoint,
        }))
      );
    } else {
      form.resetFields();
      setSelectedStops([]);
    }
  }, [routeData, form]);

  /* -------- submit -------- */
  const handleSubmit = async (values) => {
    const stopage = selectedStops.map((s) => ({
      stopId: s.stopId,
      order: s.order,
      isStartingPoint: s.isStartingPoint,
      isEndingPoint: s.isEndingPoint,
      isActive: true,
    }));

    const payload = { ...values, stopage };

    try {
      if (routeData?._id) {
        await dispatch(
          updateRoute({ id: routeData._id, data: payload })
        ).unwrap();
        message.success(t("Route updated successfully"));
      } else {
        await dispatch(createRoute(payload)).unwrap();
        message.success(t("Route created successfully"));
      }

      dispatch(getRoutesBySchool());
      onSuccess();
    } catch (err) {
      message.error(err.message || t("Failed to save route"));
    }
  };

  /* -------- stop helpers -------- */
  const addStop = (stopId) => {
    if (selectedStops.some((s) => s.stopId === stopId)) {
      message.warning(t("This stop is already added"));
      return;
    }
    setSelectedStops((prev) => [
      ...prev,
      {
        key: stopId,
        stopId,
        order: prev.length + 1,
        isStartingPoint: false,
        isEndingPoint: false,
      },
    ]);
  };

  const removeStop = (stopId) =>
    setSelectedStops((prev) => prev.filter((s) => s.stopId !== stopId));

  const setAsStartingPoint = (stopId) =>
    setSelectedStops((prev) =>
      prev.map((s) => ({
        ...s,
        isStartingPoint: s.stopId === stopId,
        isEndingPoint: false,
      }))
    );

  const setAsEndingPoint = (stopId) =>
    setSelectedStops((prev) =>
      prev.map((s) => ({
        ...s,
        isEndingPoint: s.stopId === stopId,
        isStartingPoint: false,
      }))
    );

  /* -------- table columns -------- */
  const columns = [
    { title: t("Order"), dataIndex: "order", key: "order" },
    {
      title: t("Stop Name"),
      render: (_, r) => subRoutes.find((sr) => sr._id === r.stopId)?.stopName,
    },
    {
      title: t("Actions"),
      render: (_, r) => (
        <div className="flex gap-2">
          <Button
            type={r.isStartingPoint ? "primary" : "default"}
            size="small"
            onClick={() => setAsStartingPoint(r.stopId)}
          >
            {t("Start")}
          </Button>
          <Button
            type={r.isEndingPoint ? "primary" : "default"}
            size="small"
            onClick={() => setAsEndingPoint(r.stopId)}
          >
            {t("End")}
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => removeStop(r.stopId)}
          />
        </div>
      ),
    },
  ];

  /* -------- JSX -------- */
  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="routeName"
        label={t("Route Name")}
        rules={[{ required: true, message: t("Please input route name") }]}
      >
        <Input placeholder={t("e.g. Main Campus Route")} />
      </Form.Item>

      <Form.Item name="isActive" label={t("Status")} initialValue={true}>
        <Select>
          <Option value={true}>{t("Active")}</Option>
          <Option value={false}>{t("Inactive")}</Option>
        </Select>
      </Form.Item>

      <Title level={5}>{t("Add Stops")}</Title>
      <div className="flex gap-2 mb-4">
        <Select
          showSearch
          placeholder={t("Select a stop")}
          style={{ width: 300 }}
          onChange={addStop}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {subRoutes
            .filter((sr) => !selectedStops.some((s) => s.stopId === sr._id))
            .map((sr) => (
              <Option key={sr._id} value={sr._id}>
                {sr.stopName}
              </Option>
            ))}
        </Select>
        <Button type="dashed" icon={<PlusOutlined />}>
          {t("Add")}
        </Button>
      </div>

      <Title level={5}>{t("Selected Stops")}</Title>
      <Table
        columns={columns}
        dataSource={selectedStops}
        pagination={false}
        rowKey="key"
      />

      <Form.Item className="mt-4">
        <Button type="primary" htmlType="submit">
          {t("Save Route")}
        </Button>
      </Form.Item>
    </Form>
  );
}