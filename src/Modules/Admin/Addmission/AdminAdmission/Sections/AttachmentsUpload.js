import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  Skeleton,
  message,
  Select,
  Modal,
  Input,
} from "antd";

import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import SingleFileUpload from "../Components/SingleFileUpload";
import {
  updateSchoolAttachments,
  fetchSchoolAttachmentsById,
} from "../../../../../Store/Slices/Admin/Admission/admissionThunk";
import DeleteModal from "../../../../../Components/Common/DeleteModal";

const GRADIENT = {
  background: "linear-gradient(to right, #C83B62, #7F35CD)",
  border: "none",
  color: "#fff",
};
const { Option } = Select; // not used, but kept for symmetry

const makeKey = ({ name = "", _id = "" }) => name; // Just return the original name

const withKey = (arr) =>
  (Array.isArray(arr) ? arr : []).map((a) => ({
    ...a,
    key: makeKey(a), // Now uses the original name as key
  }));
const group = (arr) =>
  arr.reduce(
    (acc, a) => {
      (acc[a.mandatory ? "mandatory" : "optional"] ??= []).push(a);
      return acc;
    },
    { mandatory: [], optional: [] }
  );

const AttachmentsUpload = ({ form }) => {
  const dispatch = useDispatch();
  const raw = useSelector((s) => s.admin.admissionAttachment.attachments);
  const loading = useSelector((s) => s.admin.admissionAttachment.loading);

  const [modal, setModal] = useState({ open: false, editItem: null });
  const [del, setDel] = useState({ open: false, item: null });
  const [previewFile, setPreviewFile] = useState(null);

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
      if (res.payload) message.success("Attachment removed");
      else throw new Error();
    } catch {
      message.error("Failed to remove attachment");
    } finally {
      setDel({ open: false, item: null });
    }
  }, [del.item, dispatch, raw, strip]);

  const onSaveMeta = async ({ key, name, mandatory }) => {
    try {
      const cur = withKey(raw);
      const next = modal.editItem
        ? cur.map((a) =>
            a.key === modal.editItem.key ? { ...a, name, mandatory } : a
          )
        : [...cur, { name, mandatory, key: makeKey({ name }) }];
      const res = await dispatch(
        updateSchoolAttachments({ attachments: strip(next) })
      );
      if (res.payload) {
        message.success(
          modal.editItem ? "Attachment updated" : "Attachment added"
        );
        setModal({ open: false, editItem: null });
      } else throw new Error();
    } catch (err) {
      message.error(err.message || "Operation failed");
    }
  };

  const renderList = (list, type) =>
    list.map((a) => (
      <Col span={24} key={a.key}>
        <Form.Item name={["attachments", type, a.key]}>
          <SingleFileUpload
            name={["attachments", type, a.key]}
            label={a.name}
            displayKey={a.displayKey}
            type={type}
            onEdit={() => setModal({ open: true, editItem: a })}
            onDelete={() => setDel({ open: true, item: a })}
            onPreview={(file) => setPreviewFile(file)}
          />
        </Form.Item>
      </Col>
    ));
  if (loading) return <Skeleton active paragraph={{ rows: 4 }} />;

  return (
    <>
      <div className="mb-3 flex items-center justify-between bg-purple-100 rounded-md py-2 px-3">
        <h2 className="text-purple-500 m-0">Attachments</h2>
        <Button
          icon={<PlusOutlined />}
          style={GRADIENT}
          onClick={() => setModal({ open: true, editItem: null })}
        >
          Add Field
        </Button>
      </div>
      <div className="p-3">
        {mandatory.length > 0 && (
          <>
            <h3 className="text-base font-bold mb-3">Mandatory</h3>
            <Row gutter={[0, 16]}>{renderList(mandatory, "mandatory")}</Row>
          </>
        )}
        {optional.length > 0 && (
          <>
            <h3 className="text-base font-bold mt-4 mb-3">Optional</h3>
            <Row gutter={[0, 16]}>{renderList(optional, "optional")}</Row>
          </>
        )}
      </div>

      <MetaModal
        open={modal.open}
        initial={modal.editItem}
        onClose={() => setModal({ open: false, editItem: null })}
        onSave={onSaveMeta}
      />
      <DeleteModal
        isOpen={del.open}
        onClose={() => setDel({ open: false, item: null })}
        onConfirm={confirmDelete}
        title={del.item?.name}
      />
      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </>
  );
};

const FilePreviewModal = ({ file, onClose }) => {
  if (!file) return null;

  const isImage =
    file.type?.startsWith("image/") ||
    (file.url && file.url.match(/\.(jpeg|jpg|gif|png)$/i));

  return (
    <Modal
      open={!!file}
      onCancel={onClose}
      footer={null}
      width="80%"
      style={{ top: 20 }}
      bodyStyle={{ padding: 0, height: "80vh" }}
    >
      {isImage ? (
        <img
          src={file.url || file.preview}
          alt="Preview"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ) : (
        <iframe
          src={file.url || file.preview}
          title="File Preview"
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      )}
    </Modal>
  );
};

const MetaModal = ({ open, initial, onClose, onSave }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        name: initial?.name || "",
        mandatory: initial?.mandatory ? "mandatory" : "optional",
      });
    }
  }, [open, initial, form]);

  const handleOk = () => {
    form.validateFields().then(({ name, mandatory }) => {
      onSave({
        key: initial?.key,
        name,
        mandatory: mandatory === "mandatory",
      });
    });
  };

  return (
    <Modal
      centered
      maskStyle={{ backdropFilter: "blur(4px)" }}
      destroyOnClose
      open={open}
      title={initial ? "Edit Field" : "Add Field"}
      onCancel={onClose}
      onOk={handleOk}
      okText={initial ? "Update" : "Save"}
      okButtonProps={{ style: GRADIENT }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Label"
          rules={[{ required: true, message: "Enter label" }]}
        >
          <Input placeholder="Vaccination Card" />
        </Form.Item>
        <Form.Item
          name="mandatory"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
          initialValue="optional" // Set default value
        >
          <Select placeholder="Select category">
            <Option value="mandatory">Mandatory</Option>
            <Option value="optional">Optional</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(AttachmentsUpload);
