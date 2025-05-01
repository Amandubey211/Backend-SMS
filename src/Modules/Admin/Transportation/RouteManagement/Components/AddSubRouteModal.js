import React, { useEffect, useMemo, useState, useCallback } from "react";
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
  Spin,
  Skeleton,
} from "antd";
import { Map, Marker, Overlay } from "pigeon-maps";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { distance } from "@turf/turf";

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
function MapSelector({ value, onChange, allStops = [], disabled }) {
  const center = value ? [value?.lat, value?.lng] : DOHA;

  const handleClick = useCallback(
    ({ latLng }) => {
      if (!disabled) {
        onChange({ lat: latLng[0], lng: latLng[1] });
      }
    },
    [disabled, onChange]
  );

  const poly = useMemo(() => {
    if (allStops?.length > 1) {
      return allStops.map((s) => [s?.location?.lat, s?.location?.lng]);
    }
    return [];
  }, [allStops]);

  // Calculate distances between stops
  const distances = useMemo(() => {
    if (allStops?.length < 2) return [];

    const results = [];
    for (let i = 0; i < allStops.length - 1; i++) {
      const from = allStops[i]?.location;
      const to = allStops[i + 1]?.location;
      if (!from || !to) continue;

      const dist = distance([from?.lng, from?.lat], [to?.lng, to?.lat], {
        units: "kilometers",
      });
      results?.push({
        from: i + 1,
        to: i + 2,
        distance: dist?.toFixed(2),
        midpoint: [(from?.lat + to?.lat) / 2, (from?.lng + to?.lng) / 2],
      });
    }
    return results;
  }, [allStops]);

  return (
    <div
      className="h-64 w-full rounded-lg overflow-hidden shadow-md border"
      role="application"
      aria-label="Interactive map"
      aria-disabled={disabled}
    >
      <Map
        height={256}
        defaultCenter={DOHA}
        center={center}
        defaultZoom={13}
        onClick={handleClick}
        aria-label="Route map"
      >
        {value && (
          <Marker
            width={40}
            anchor={center}
            color="#C83B62"
            aria-label={`Selected location at latitude ${value?.lat?.toFixed(
              6
            )}, longitude ${value?.lng?.toFixed(6)}`}
          />
        )}

        {poly?.length > 1 && (
          <Overlay
            anchor={[0, 0]}
            render={() => (
              <svg width="0" height="0">
                <polyline
                  points={poly.map((p) => p?.join(",")).join(" ")}
                  fill="none"
                  stroke="#7F35CD"
                  strokeWidth="4"
                  strokeOpacity="0.6"
                  strokeLinecap="round"
                  aria-label="Route path"
                />
              </svg>
            )}
          />
        )}

        {distances?.map((dist, idx) => (
          <Overlay key={idx} anchor={dist?.midpoint}>
            <div
              className="bg-white px-2 py-1 rounded text-xs shadow-md"
              aria-label={`Distance between stop ${dist?.from} and stop ${dist?.to}: ${dist?.distance} kilometers`}
            >
              {dist?.distance} km
            </div>
          </Overlay>
        ))}
      </Map>
    </div>
  );
}

/* ---------- Modal ---------- */
export default function SubRouteModal({ open, onClose }) {
  const dispatch = useDispatch();
  const { subRoutes = [], loading } = useSelector(
    (s) =>
      s.transportation?.transportSubRoute ?? { subRoutes: [], loading: false }
  );

  const [editingId, setEditingId] = useState(null);
  const [previewMode, setPreview] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({
    open: false,
    id: null,
    name: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const [form] = Form.useForm();

  // Filter stops based on search query
  const filteredStops = useMemo(() => {
    return subRoutes?.filter((stop) =>
      stop?.stopName?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    );
  }, [subRoutes, searchQuery]);

  /* sync form */
  useEffect(() => {
    const stop = subRoutes?.find((s) => s?._id === editingId);
    if (editingId && stop) {
      form.setFieldsValue({
        stopName: stop?.stopName,
        location: stop?.location,
      });
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
    if (editingId) {
      await dispatch(
        updateSubRoute({ subRouteId: editingId, updateData: vals })
      );
    } else {
      await dispatch(createSubRoute(vals));
    }
    // closeAll();
  };

  const previewStop = (item) => {
    form.setFieldsValue({ stopName: item?.stopName, location: item?.location });
    setEditingId(null);
    setPreview(true);
  };

  const confirmDelete = () =>
    dispatch(deleteSubRoute(deleteInfo?.id)).then(() =>
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

  // Reset form touched state when clearing preview
  const handleClearPreview = () => {
    setPreview(false);
    setEditingId(null);
    form.resetFields();
    // Manually reset the touched state
    setTimeout(() => {
      form.setFields([
        { name: "stopName", touched: false },
        { name: "location", touched: false },
      ]);
    }, 0);
  };

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
      aria-labelledby="subRouteModalTitle"
    >
      <DeleteModal
        isOpen={deleteInfo?.open}
        title={deleteInfo?.name}
        onClose={() => setDeleteInfo({ open: false, id: null, name: "" })}
        onConfirm={confirmDelete}
      />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Spin
          spinning={loading}
          indicator={<Skeleton active paragraph={{ rows: 10 }} />}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* left */}
            <div className="lg:col-span-2">
              <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                  name="stopName"
                  label="Stop Name"
                  rules={[{ required: true, message: "Stop name required" }]}
                >
                  <Input
                    placeholder="Enter stop name"
                    disabled={previewMode}
                    aria-label="Stop name input"
                  />
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
                        placeholder="Enter latitude e.g. 25.276987"
                        onChange={(v) => coordChange("lat", v)}
                        aria-label="Latitude input"
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
                        placeholder="Enter longitude e.g. 51.520008"
                        onChange={(v) => coordChange("lng", v)}
                        aria-label="Longitude input"
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

                {!previewMode ? (
                  <Form.Item>
                    <Button
                      block
                      htmlType="submit"
                      icon={editingId ? <EditOutlined /> : <PlusOutlined />}
                      className={`${gradientBtn} h-10 rounded-lg font-medium`}
                      disabled={loading}
                      aria-label={submitLabel}
                    >
                      {submitLabel}
                    </Button>
                  </Form.Item>
                ) : (
                  <Form.Item>
                    <Button
                      block
                      onClick={handleClearPreview}
                      className="h-10 rounded-lg font-medium border border-[#d9d9d9] hover:border-[#7F35CD] hover:text-[#7F35CD]"
                      aria-label="Clear form"
                    >
                      Clear
                    </Button>
                  </Form.Item>
                )}
              </Form>
            </div>

            {/* right list */}
            <div className="max-h-[420px] overflow-auto border-l ps-4">
              <div className="flex justify-between items-center mb-2">
                <Text strong>Existing Stops</Text>
                <Text className="text-gradient">
                  ({subRoutes?.length || 0})
                </Text>
              </div>

              <Input
                placeholder="Search stops..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="mb-3"
                aria-label="Search stops"
              />

              {loading && subRoutes?.length === 0 ? (
                <Skeleton active paragraph={{ rows: 5 }} />
              ) : (
                <List
                  size="small"
                  dataSource={filteredStops}
                  locale={{ emptyText: "No stops found" }}
                  renderItem={(item, idx) => (
                    <List.Item
                      className="cursor-pointer group hover:bg-gray-50"
                      onClick={() => previewStop(item)}
                      aria-label={`Stop ${idx + 1}: ${item?.stopName}`}
                    >
                      <div className="flex items-center gap-2 w-full justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gray-200 px-2 rounded">
                            {idx + 1}
                          </span>
                          <span className="text-gradient capitalize">
                            {item?.stopName}
                          </span>
                        </div>

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                          <Tooltip title="Edit">
                            <Button
                              size="small"
                              type="text"
                              icon={<EditOutlined />}
                              disabled={loading}
                              onClick={(e) => {
                                e?.stopPropagation();
                                setEditingId(item?._id);
                              }}
                              aria-label={`Edit stop ${item?.stopName}`}
                            />
                          </Tooltip>
                          <Tooltip title="Delete">
                            <Button
                              size="small"
                              type="text"
                              icon={<DeleteOutlined />}
                              danger
                              disabled={loading}
                              onClick={(e) => {
                                e?.stopPropagation();
                                setDeleteInfo({
                                  open: true,
                                  id: item?._id,
                                  name: item?.stopName,
                                });
                              }}
                              aria-label={`Delete stop ${item?.stopName}`}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              )}
            </div>
          </div>
        </Spin>
      </motion.div>
    </Modal>
  );
}
