import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Skeleton,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import SingleFileUpload from "../Components/SingleFileUpload";
import DeleteModal from "../../../../../Components/Common/DeleteModal";
import {
  updateSchoolAttachments,
  fetchSchoolAttachmentsById,
} from "../../../../../Store/Slices/Admin/Admission/admissionThunk";

const { Option } = Select;

const GRADIENT = {
  background: "linear-gradient(to right, #C83B62, #7F35CD)",
  border: "none",
  color: "#fff",
};

const makeKey = ({ name = "", _id = "" }) =>
  `${name.trim().toLowerCase().replace(/\s+/g, "_")}_${
    _id?.slice(-4) ?? "tmp"
  }`;

const withKey = (arr) =>
  (Array.isArray(arr) ? arr : []).map((a) => ({
    ...a,
    key: a.key || makeKey(a),
  }));

const group = (arr) =>
  arr.reduce(
    (acc, a) => {
      (acc[a.mandatory ? "mandatory" : "optional"] ??= []).push(a);
      return acc;
    },
    { mandatory: [], optional: [] }
  );

const AttachmentModal = ({ open, initial, onClose, attachments }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();

  const strip = (arr) =>
    arr.map(({ name, mandatory }) => ({ name, mandatory }));

  const onFinish = async ({ label, category }) => {
    setSaving(true);
    try {
      const cur = withKey(attachments);
      const next = cur.map((a) =>
        initial && a.key === initial.key
          ? { ...a, name: label, mandatory: category === "mandatory" }
          : a
      );

      if (!initial) {
        next.push({
          name: label,
          mandatory: category === "mandatory",
          key: makeKey({ name: label }),
        });
      }

      const res = await dispatch(
        updateSchoolAttachments({ attachments: strip(next) })
      );

      if (res?.payload) {
        message.success(initial ? "Attachment updated" : "Attachment added");
        onClose();
      } else {
        throw new Error("Operation failed");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        label: initial?.name ?? "",
        category: initial?.mandatory ? "mandatory" : "optional",
      });
    }
  }, [open, initial, form]);

  return (
    <Modal
      centered
      maskStyle={{ backdropFilter: "blur(4px)" }}
      destroyOnClose
      open={open}
      title={initial ? "Edit Attachment Field" : "Add Attachment Field"}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={initial ? "Update" : "Save"}
      okButtonProps={{ loading: saving, style: GRADIENT }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="label"
          label="Label"
          rules={[{ required: true, message: "Enter label" }]}
        >
          <Input size="large" placeholder="Vaccination Card" />
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true }]}
        >
          <Select size="large">
            <Option value="mandatory">Mandatory</Option>
            <Option value="optional">Optional</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AttachmentsUpload = () => {
  const dispatch = useDispatch();
  const { attachments: raw, loading } = useSelector(
    (s) => s.admin.admissionAttachment
  );

  const [modal, setModal] = useState({ open: false, editItem: null });
  const [del, setDel] = useState({ open: false, item: null });

  useEffect(() => {
    dispatch(fetchSchoolAttachmentsById());
  }, [dispatch]);

  const attachments = useMemo(() => withKey(raw), [raw]);
  const { mandatory, optional } = useMemo(
    () => group(attachments),
    [attachments]
  );

  const strip = useCallback(
    (arr) => arr.map(({ name, mandatory }) => ({ name, mandatory })),
    []
  );

  const confirmDelete = useCallback(async () => {
    try {
      const next = withKey(raw).filter((a) => a.key !== del.item.key);
      const res = await dispatch(
        updateSchoolAttachments({ attachments: strip(next) })
      );

      if (res?.payload) {
        message.success("Attachment removed");
      } else {
        throw new Error();
      }
    } catch (error) {
      message.error("Failed to remove attachment");
    } finally {
      setDel({ open: false, item: null });
    }
  }, [del.item, dispatch, raw, strip]);

  const renderCol = useCallback(
    (list, isMan) =>
      list.map((a) => (
        <Col xs={24} md={12} key={a.key}>
          <SingleFileUpload
            label={`${a.name}${isMan ? " *" : ""}`}
            name={`attachments.${isMan ? "mandatory" : "optional"}.${a.name}`}
            onEdit={() => setModal({ open: true, editItem: a })}
            onDelete={() => setDel({ open: true, item: a })}
          />
        </Col>
      )),
    []
  );

  if (loading) {
    return (
      <div className="p-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} active paragraph={{ rows: 1 }} className="mb-4" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 m-0">
          Attachments
        </h2>
        <Button
          icon={<PlusOutlined />}
          onClick={() => setModal({ open: true, editItem: null })}
          style={GRADIENT}
        >
          Add Attachment
        </Button>
      </div>

      <div className="p-3">
        {!!mandatory.length && (
          <>
            <h3 className="text-base font-bold mb-3">Mandatory</h3>
            <Row gutter={[16, 16]}>{renderCol(mandatory, true)}</Row>
          </>
        )}
        {!!optional.length && (
          <>
            <h3 className="text-base font-bold mt-4 mb-3">Optional</h3>
            <Row gutter={[16, 16]}>{renderCol(optional, false)}</Row>
          </>
        )}
      </div>

      <AttachmentModal
        open={modal.open}
        initial={modal.editItem}
        onClose={() => setModal({ open: false, editItem: null })}
        attachments={raw}
      />

      <DeleteModal
        isOpen={del.open}
        onClose={() => setDel({ open: false, item: null })}
        onConfirm={confirmDelete}
        title={del.item?.name}
      />
    </div>
  );
};

export default AttachmentsUpload;
