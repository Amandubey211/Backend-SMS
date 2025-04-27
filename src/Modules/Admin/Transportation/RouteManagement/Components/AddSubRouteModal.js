/* Ant-Design + pigeon-maps modal  (path unchanged)
   features/transportation/SubRoute/components/SubRouteModal.js */
import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
// import { Map, Marker } from "pigeon-maps";
import { useDispatch, useSelector } from "react-redux";
import { resetSelectedSubRoute } from "../../../../../Store/Slices/Transportation/SubRoute/subRouteSlice";
import {
  createSubRoute,
  updateSubRoute,
} from "../../../../../Store/Slices/Transportation/SubRoute/subRoute.action";

/* ---------- helpers ---------- */
const defaultCenter = [25.2861, 51.5348]; // Doha [lat, lng]

function MapSelector({ value, onChange }) {
  const center = value ? [value.lat, value.lng] : defaultCenter;

  const handleClick = ({ latLng }) =>
    onChange({ lat: latLng[0], lng: latLng[1] });

  return (
    <div style={{ height: 280, width: "100%" }}>
      {/* <Map
        height={280}
        defaultCenter={defaultCenter}
        center={center}
        defaultZoom={13}
        onClick={handleClick}
      >
        {value && <Marker width={40} anchor={center} />}
      </Map> */}
    </div>
  );
}

/* ---------- modal ---------- */
export default function SubRouteModal({ open, onClose, editing }) {
  const dispatch = useDispatch();
  const { selectedSubRoute } = useSelector(
    (s) => s.transportation.transportSubRoute
  );
  const [form] = Form.useForm();

  /* populate on edit */
  useEffect(() => {
    if (editing && selectedSubRoute?._id === editing) {
      form.setFieldsValue({
        stopName: selectedSubRoute.stopName,
        location: selectedSubRoute.location,
      });
    } else {
      form.resetFields();
    }
  }, [editing, selectedSubRoute, form]);

  /* submit */
  const handleFinish = (values) => {
    if (editing) {
      dispatch(updateSubRoute({ subRouteId: editing, updateData: values }));
    } else {
      dispatch(createSubRoute(values));
    }
    onClose();
    dispatch(resetSelectedSubRoute());
  };

  const title = editing ? "Edit Stop" : "Create Stop";

  /* custom validator for location */
  const locationRule = {
    validator: (_, val) =>
      val && val.lat && val.lng
        ? Promise.resolve()
        : Promise.reject(new Error("Pick a point on the map")),
  };

  return (
    <Modal
      open={open}
      title={title}
      onCancel={() => {
        onClose();
        dispatch(resetSelectedSubRoute());
      }}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ stopName: "", location: null }}
      >
        <Form.Item
          label="Stop Name"
          name="stopName"
          rules={[{ required: true, message: "Stop name required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Location (click on map)"
          name="location"
          rules={[locationRule]}
          getValueProps={(v) => ({ value: v })}
        >
          <MapSelector
            value={form.getFieldValue("location")}
            onChange={(val) => form.setFieldsValue({ location: val })}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          disabled={!form.isFieldsTouched(true)}
        >
          {title}
        </Button>
      </Form>
    </Modal>
  );
}
