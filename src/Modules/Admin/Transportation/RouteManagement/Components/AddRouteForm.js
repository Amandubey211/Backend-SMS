/* Path: Modules/Admin/Transportation/RouteManagement/Components/AddRouteForm.jsx */
import React, { useState, useEffect, useMemo } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Table,
  Typography,
  message,
  Modal,
  Tag,
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Draggable } from "@hello-pangea/dnd";
import { AiOutlineDrag } from "react-icons/ai";

import {
  createRoute,
  getRoutesBySchool,
  updateRoute,
} from "../../../../../Store/Slices/Transportation/RoutesManagment/routes.action";
import SubRouteModal from "./AddSubRouteModal";
import StrictModeDroppable from "./StrictModeDroppable";

const { Option } = Select;
const { Title } = Typography;

export default function RouteForm({ routeData, onSuccess, onDirtyChange, t }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { subRoutes = [] } = useSelector(
    (s) => s.transportation.transportSubRoute ?? { subRoutes: [] }
  );

  const [selectedStops, setSelectedStops] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  /* dirty-state */
  const reportDirty = (d) => onDirtyChange?.(d);
  useEffect(() => {
    reportDirty(true);
    return () => reportDirty(false);
  }, []);

  /* preload edit values – tolerant to .stopage or .stops */
  useEffect(() => {
    if (!routeData) {
      form.resetFields();
      setSelectedStops([]);
      return;
    }
    form.setFieldsValue({
      routeName: routeData.routeName,
      isActive: routeData.isActive,
    });

    const raw = routeData.stopage
      ? routeData.stopage
      : (routeData.stops || []).map((s, idx) => ({
          stopId: s.stopId ?? s._id,
          order: idx + 1,
          isStartingPoint: idx === 0,
          isEndingPoint: idx === routeData.stops.length - 1,
        }));

    setSelectedStops(
      raw.map((s) => ({
        key: s.stopId,
        stopId: s.stopId,
        order: s.order,
        isStartingPoint: s.isStartingPoint,
        isEndingPoint: s.isEndingPoint,
      }))
    );
  }, [routeData, form]);

  const stopIds = useMemo(
    () => selectedStops.map((s) => s.stopId),
    [selectedStops]
  );
  const reorder = (arr) => arr.map((s, i) => ({ ...s, order: i + 1 }));

  /* add/remove */
  const onStopsSelectChange = (ids) => {
    const add = ids.filter((id) => !stopIds.includes(id));
    const drop = stopIds.filter((id) => !ids.includes(id));

    if (add.length)
      setSelectedStops((prev) =>
        reorder([
          ...prev,
          ...add.map((id) => ({
            key: id,
            stopId: id,
            order: prev.length + 1,
            isStartingPoint: false,
            isEndingPoint: false,
          })),
        ])
      );

    if (drop.length)
      setSelectedStops((prev) =>
        reorder(prev.filter((s) => !drop.includes(s.stopId)))
      );
  };

  const removeStop = (id) =>
    onStopsSelectChange(stopIds.filter((x) => x !== id));
  const setAsStart = (id) =>
    setSelectedStops((prev) =>
      prev.map((s) => ({
        ...s,
        isStartingPoint: s.stopId === id,
        isEndingPoint: s.isEndingPoint && s.stopId !== id,
      }))
    );
  const setAsEnd = (id) =>
    setSelectedStops((prev) =>
      prev.map((s) => ({
        ...s,
        isEndingPoint: s.stopId === id,
        isStartingPoint: s.isStartingPoint && s.stopId !== id,
      }))
    );

  /* dnd */
  const onDragEnd = ({ source, destination }) => {
    if (!destination || source.index === destination.index) return;
    const arr = [...selectedStops];
    const [m] = arr.splice(source.index, 1);
    arr.splice(destination.index, 0, m);
    setSelectedStops(reorder(arr));
  };

  /* submit */
  const handleSubmit = async (vals) => {
    const payload = {
      ...vals,
      stopage: selectedStops.map(
        ({ stopId, order, isStartingPoint, isEndingPoint }) => ({
          stopId,
          order,
          isStartingPoint,
          isEndingPoint,
          isActive: true,
        })
      ),
    };
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
      reportDirty(false);
      onSuccess();
    } catch (err) {
      message.error(err.message ?? t("Failed to save route"));
    }
  };

  /* table cols */
  const columns = [
    {
      title: "",
      width: 30,
      render: () => <AiOutlineDrag className="cursor-grab text-gray-400" />,
    },
    {
      title: t("Order"),
      dataIndex: "order",
      width: 60,
      render: (o, r) => (
        <span
          className={
            r.isStartingPoint
              ? "font-bold text-green-600"
              : r.isEndingPoint
              ? "font-bold text-red-600"
              : ""
          }
        >
          {o}
        </span>
      ),
    },
    {
      title: t("Stop"),
      render: (_, r) => subRoutes.find((s) => s._id === r.stopId)?.stopName,
    },
    {
      title: t("Actions"),
      width: 170,
      render: (_, r) => (
        <div className="flex gap-2">
          <Button
            size="small"
            className={
              r.isStartingPoint
                ? "bg-green-600 text-white"
                : "border-green-600 text-green-600"
            }
            onClick={() => setAsStart(r.stopId)}
          >
            {t("Start")}
          </Button>
          <Button
            size="small"
            className={
              r.isEndingPoint
                ? "bg-red-600 text-white"
                : "border-red-600 text-red-600"
            }
            onClick={() => setAsEnd(r.stopId)}
          >
            {t("End")}
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => removeStop(r.stopId)}
          />
        </div>
      ),
    },
  ];

  /* tag chip */
  const tagRender = ({ label, closable, onClose }) => (
    <Tag closable={closable} onClose={onClose} style={{ marginInlineEnd: 4 }}>
      {label}
    </Tag>
  );

  /* UI */
  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={() => reportDirty(true)}
        className="relative"
      >
        {/* top */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
        </div>

        {/* multi-select */}
        <Title level={5}>{t("Add Stops")}</Title>
        <div className="flex gap-2 mb-2">
          <Select
            mode="multiple"
            showSearch
            tagRender={tagRender}
            value={stopIds}
            placeholder={t("Select stops")}
            style={{ flexGrow: 1 }}
            onChange={onStopsSelectChange}
            optionFilterProp="label"
            filterOption={(input, opt) =>
              opt?.label.toLowerCase().includes(input.toLowerCase())
            }
          >
            {subRoutes.map((sr) => (
              <Option
                key={sr._id}
                value={sr._id}
                label={sr.stopName}
                className="flex justify-between items-center"
              >
                <span>{sr.stopName}</span>
                <div className="flex gap-1 ml-auto">
                  <Tag color="geekblue" className="font-mono text-xs">
                    {sr.location.lat.toFixed(6)}
                  </Tag>
                  <Tag color="volcano" className="font-mono text-xs">
                    {sr.location.lng.toFixed(6)}
                  </Tag>
                </div>
              </Option>
            ))}
          </Select>
          <Button
            icon={<PlusOutlined />}
            type="dashed"
            onClick={() => setModalOpen(true)}
          >
            {t("New Stop")}
          </Button>
        </div>

        {/* table */}
        <Title level={5} className="mt-4">
          {t("Selected Stops")}
        </Title>
        <DragDropContext onDragEnd={onDragEnd}>
          <StrictModeDroppable droppableId="table">
            {(provided) => (
              <Table
                dataSource={selectedStops}
                columns={columns}
                rowKey="key"
                pagination={false}
                components={{
                  body: {
                    wrapper: (p) => (
                      <tbody
                        {...p}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {p.children}
                        {provided.placeholder}
                      </tbody>
                    ),
                    row: (p) => {
                      const idx = selectedStops.findIndex(
                        (s) => s.key === p["data-row-key"]
                      );
                      return (
                        <Draggable
                          draggableId={String(p["data-row-key"])}
                          index={idx}
                        >
                          {(dragProvided) => (
                            <tr
                              {...p}
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                            />
                          )}
                        </Draggable>
                      );
                    },
                  },
                }}
              />
            )}
          </StrictModeDroppable>
        </DragDropContext>

        {/* footer */}
        <div className="sticky bottom-0 bg-white py-3 flex justify-end gap-3 border-t">
          <Button
            className="h-10 rounded-lg"
            onClick={() => form.resetFields()}
          >
            {t("Cancel")}
          </Button>
          <Button
            htmlType="submit"
            className="h-10 rounded-lg font-medium bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white border-0 hover:opacity-90"
            icon={routeData ? <EditOutlined /> : null}
          >
            {t("Save Route")}
          </Button>
        </div>
      </Form>

      <Modal
        open={modalOpen}
        footer={null}
        title={t("Create Stop")}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
        width={700}
        centered
      >
        <SubRouteModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </Modal>
    </>
  );
}
