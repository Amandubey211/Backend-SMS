/* Path: Modules/Admin/Transportation/RouteManagement/Components/SubRouteModal.jsx */
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Row,
  Col,
  InputNumber,
  List,
  Typography,
  Tooltip,
  Spin /* 🔹 */,
} from "antd";
import { Map, Marker, Overlay } from "pigeon-maps";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import {
  createSubRoute,
  updateSubRoute,
  deleteSubRoute,
} from "../../../../../Store/Slices/Transportation/SubRoute/subRoute.action";
import { resetSelectedSubRoute } from "../../../../../Store/Slices/Transportation/SubRoute/subRouteSlice";
import DeleteModal from "../../../../../Components/Common/DeleteModal";

const { Text } = Typography;
const DOHA = [25.2861, 51.5348];

/* ---------- MapSelector ---------- */
function MapSelector({ value, onChange, allStops, disabled }) {
  const center = value ? [value.lat, value.lng] : DOHA;
  const handleClick = ({ latLng }) =>
    !disabled && onChange({ lat: latLng[0], lng: latLng[1] });

  const poly = useMemo(
    () =>
      allStops.length > 1
        ? allStops.map((s) => [s.location.lat, s.location.lng])
        : [],
    [allStops]
  );

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden shadow-md border">
      <Map
        height={256}
        defaultCenter={DOHA}
        center={center}
        defaultZoom={13}
        onClick={handleClick}
      >
        {value && <Marker width={40} anchor={center} color="#C83B62" />}
        {poly.length > 1 && (
          <Overlay
            anchor={[0, 0]}
            render={() => (
              <svg width="0" height="0">
                <polyline
                  points={poly.map((p) => p.join(",")).join(" ")}
                  fill="none"
                  stroke="#7F35CD"
                  strokeWidth="4"
                  strokeOpacity="0.6"
                  strokeLinecap="round"
                />
              </svg>
            )}
          />
        )}
      </Map>
    </div>
  );
}

/* ---------- Modal ---------- */
export default function SubRouteModal({ open, onClose }) {
  const dispatch = useDispatch();
  const { subRoutes = [], loading } = useSelector(
    (s) =>
      s.transportation.transportSubRoute ?? { subRoutes: [], loading: false }
  );

  const [editingId, setEditingId] = useState(null);
  const [previewMode, setPreview] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({
    open: false,
    id: null,
    name: "",
  });

  const [form] = Form.useForm();

  /* sync form */
  useEffect(() => {
    const stop = subRoutes.find((s) => s._id === editingId);
    if (editingId && stop) {
      form.setFieldsValue({ stopName: stop.stopName, location: stop.location });
      setPreview(false);
    } else if (!editingId && !previewMode) {
      form.resetFields();
    }
  }, [editingId, subRoutes, form, previewMode]);

  const title = editingId
    ? "Edit Stop"
    : previewMode
    ? "View Stop"
    : "Create Stop";
  const submitLabel = editingId ? "Update Stop" : "Create Stop";

  const coordChange = (k, v) => {
    if (previewMode) return;
    const loc = form.getFieldValue("location") || {};
    form.setFieldsValue({ location: { ...loc, [k]: v } });
  };

  const locationRule = {
    validator: (_, v) =>
      v?.lat && v?.lng
        ? Promise.resolve()
        : Promise.reject(new Error("Please set coordinates")),
  };

  const handleFinish = async (vals) => {
    if (editingId)
      await dispatch(
        updateSubRoute({ subRouteId: editingId, updateData: vals })
      );
    else await dispatch(createSubRoute(vals));
    closeAll();
  };

  const previewStop = (item) => {
    form.setFieldsValue({ stopName: item.stopName, location: item.location });
    setEditingId(null);
    setPreview(true);
  };

  const confirmDelete = () =>
    dispatch(deleteSubRoute(deleteInfo.id)).then(() =>
      setDeleteInfo({ open: false, id: null, name: "" })
    );

  const closeAll = () => {
    setEditingId(null);
    setPreview(false);
    form.resetFields();
    onClose();
    dispatch(resetSelectedSubRoute());
  };

  const gradientBtn =
    "bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white border-0 hover:opacity-90";

  return (
    <Modal
      open={open}
      title={<span className="text-gradient font-semibold">{title}</span>}
      onCancel={closeAll}
      footer={null}
      destroyOnClose
      width={900}
      centered
      className="[&_.ant-modal-content]:rounded-lg [&_.ant-modal-header]:border-b-4 [&_.ant-modal-header]:border-[#7F35CD]"
    >
      <DeleteModal
        isOpen={deleteInfo.open}
        title={deleteInfo.name}
        onClose={() => setDeleteInfo({ open: false, id: null, name: "" })}
        onConfirm={confirmDelete}
      />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* 🔹 Spin overlay when loading */}
        <Spin spinning={loading}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* left */}
            <div className="lg:col-span-2">
              <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                  name="stopName"
                  label="Stop Name"
                  rules={[{ required: true, message: "Stop name required" }]}
                >
                  <Input placeholder="Enter stop name" disabled={previewMode} />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name={["location", "lat"]}
                      label="Latitude"
                      rules={[
                        { required: true, message: "Latitude required" },
                        { type: "number", min: -90, max: 90 },
                      ]}
                    >
                      <InputNumber
                        className="w-full"
                        step={0.000001}
                        precision={6}
                        disabled={previewMode}
                        onChange={(v) => coordChange("lat", v)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={["location", "lng"]}
                      label="Longitude"
                      rules={[
                        { required: true, message: "Longitude required" },
                        { type: "number", min: -180, max: 180 },
                      ]}
                    >
                      <InputNumber
                        className="w-full"
                        step={0.000001}
                        precision={6}
                        disabled={previewMode}
                        onChange={(v) => coordChange("lng", v)}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="location" rules={[locationRule]}>
                  <MapSelector
                    disabled={previewMode}
                    value={form.getFieldValue("location")}
                    onChange={(v) => form.setFieldsValue({ location: v })}
                    allStops={subRoutes}
                  />
                </Form.Item>

                {!previewMode && (
                  <Form.Item>
                    <Button
                      block
                      htmlType="submit"
                      icon={editingId ? <EditOutlined /> : <PlusOutlined />}
                      className={`${gradientBtn} h-10 rounded-lg font-medium`}
                      disabled={loading || !form.isFieldsTouched(true)} /* 🔹 */
                    >
                      {submitLabel}
                    </Button>
                  </Form.Item>
                )}
              </Form>
            </div>

            {/* right list */}
            <div className="max-h-[420px] overflow-auto border-l ps-4">
              <div className="flex justify-between items-center mb-2">
                <Text strong>Existing Stops</Text>
                <Text className="text-gradient">({subRoutes.length})</Text>
              </div>
              <List
                size="small"
                dataSource={subRoutes}
                locale={{ emptyText: "No stops yet" }}
                renderItem={(item, idx) => (
                  <List.Item
                    className="cursor-pointer group hover:bg-gray-50"
                    onClick={() => previewStop(item)}
                  >
                    <div className="flex items-center gap-2 w-full justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-200 px-2 rounded">
                          {idx + 1}
                        </span>
                        <span className="text-gradient capitalize">
                          {item.stopName}
                        </span>
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                        <Tooltip title="Edit">
                          <Button
                            size="small"
                            type="text"
                            icon={<EditOutlined />}
                            disabled={loading} /* 🔹 */
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(item._id);
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="Delete">
                          <Button
                            size="small"
                            type="text"
                            icon={<DeleteOutlined />}
                            danger
                            disabled={loading} /* 🔹 */
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteInfo({
                                open: true,
                                id: item._id,
                                name: item.stopName,
                              });
                            }}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </Spin>
      </motion.div>
    </Modal>
  );
}
