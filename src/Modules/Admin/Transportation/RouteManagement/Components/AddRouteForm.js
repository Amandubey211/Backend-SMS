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
  Spin,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
} from "@ant-design/icons";
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
  const { loading } = useSelector((s) => s.transportation.transportRoute);

  const [selectedStops, setSelectedStops] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  /* dirty */
  useEffect(() => {
    onDirtyChange?.(true);
    return () => onDirtyChange?.(false);
  }, [onDirtyChange]);

  /* preload edit */
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
      : (routeData.stops || []).map((s, i, arr) => ({
          stopId: s.stopId ?? s._id,
          order: i + 1,
          isStartingPoint: i === 0,
          isEndingPoint: i === arr.length - 1,
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
      if (routeData?._id || routeData?.routeId) {
        await dispatch(
          updateRoute({ id: routeData._id ?? routeData.routeId, data: payload })
        ).unwrap();
        message.success(t("Route updated successfully"));
      } else {
        await dispatch(createRoute(payload)).unwrap();
        message.success(t("Route created successfully"));
      }
      dispatch(getRoutesBySchool());
      onDirtyChange?.(false);
      onSuccess(); // close sidebar on success only
    } catch (err) {
      message.error(err.message ?? t("Failed to save route"));
    }
  };

  /* columns */
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

  /* tag */
  const tagRender = ({ label, closable, onClose }) => (
    <Tag closable={closable} onClose={onClose} style={{ marginInlineEnd: 4 }}>
      {label}
    </Tag>
  );

  const submitLabel = routeData ? t("Update Route") : t("Save Route");
  const submitIcon = routeData ? <EditOutlined /> : <CheckOutlined />;

  return (
    <>
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={() => onDirtyChange?.(true)}
          className="relative"
        >
          {/* top */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Form.Item
              name="routeName"
              label={t("Route Name")}
              rules={[
                { required: true, message: t("Please input route name") },
              ]}
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

          {/* select */}
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
                  {/* <div className="flex gap-1 ml-auto">
                    <Tag color="geekblue" className="font-mono text-xs">
                      {sr.location.lat.toFixed(6)}
                    </Tag>
                    <Tag color="volcano" className="font-mono text-xs">
                      {sr.location.lng.toFixed(6)}
                    </Tag>
                  </div> */}
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
              {(prov) => (
                <Table
                  rowKey="key"
                  pagination={false}
                  dataSource={selectedStops}
                  columns={columns}
                  components={{
                    body: {
                      wrapper: (p) => (
                        <tbody
                          {...p}
                          ref={prov.innerRef}
                          {...prov.droppableProps}
                        >
                          {p.children}
                          {prov.placeholder}
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
                            {(dp) => (
                              <tr
                                {...p}
                                ref={dp.innerRef}
                                {...dp.draggableProps}
                                {...dp.dragHandleProps}
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
              disabled={loading}
              icon={submitIcon}
              className="h-10 rounded-lg font-medium bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white border-0 hover:opacity-90"
            >
              {submitLabel}
            </Button>
          </div>
        </Form>
      </Spin>

      <Modal
        open={modalOpen}
        footer={null}
        title={t("Create Stop")}
        centered
        destroyOnClose
        width={700}
        onCancel={() => setModalOpen(false)}
      >
        <SubRouteModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </Modal>
    </>
  );
}
