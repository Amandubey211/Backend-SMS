import React, { useState, useEffect } from "react";
import {
  Upload,
  Button,
  Form,
  Space,
  message,
  Modal,
  Tooltip,
  Popover,
} from "antd";
import {
  UploadOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useField } from "formik";

/* ---------- helpers ---------- */
const getBase64 = (f) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(f);
  });

const MAX_MB = 5;
const BYTES = MAX_MB * 1024 * 1024;

/* ---------- component ---------- */
const SingleFileUpload = ({ label, name, onEdit, onDelete }) => {
  const [, meta, helpers] = useField(name);
  const [file, setFile] = useState(null);
  const [prev, setPrev] = useState(null);
  const [type, setType] = useState(null);
  const [show, setShow] = useState(false);

  /* revoke object URL */
  useEffect(
    () => () => {
      if (prev && type === "pdf") URL.revokeObjectURL(prev);
    },
    [prev, type]
  );

  const ok = (f) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    if (!allowed.includes(f.type)) {
      message.error("Invalid type");
      return false;
    }
    if (f.size > BYTES) {
      message.error(`Max ${MAX_MB} MB`);
      return false;
    }
    return true;
  };

  const handle = async (info) => {
    if (info.file.status === "removed") {
      helpers.setValue(null);
      setFile(null);
      setPrev(null);
      return;
    }
    const f = info.file.originFileObj || info.file;
    if (!f || !ok(f)) return Upload.LIST_IGNORE;

    const pv = f.type.startsWith("image/")
      ? await getBase64(f)
      : URL.createObjectURL(f);

    helpers.setValue({ file: f, preview: pv });
    setFile(f);
    setPrev(pv);
    setType(f.type.startsWith("image/") ? "img" : "pdf");
  };

  const clear = () => {
    helpers.setValue(null);
    setFile(null);
    setPrev(null);
  };

  const truncateText = (text, maxLength) =>
    text.length <= maxLength ? text : `${text.slice(0, maxLength - 3)}…`;

  const menu = (
    <div className="flex flex-col text-left items-start">
      {onEdit && (
        <Button type="text" icon={<EditOutlined />} onClick={onEdit}>
          Update
        </Button>
      )}
      {onDelete && (
        <Button type="text" danger icon={<DeleteOutlined />} onClick={onDelete}>
          Delete
        </Button>
      )}
    </div>
  );

  /* ---------------- render ---------------- */
  return (
    <>
      <Form.Item
        validateStatus={meta.touched && meta.error ? "error" : ""}
        help={meta.touched && meta.error}
        className="mb-4"
      >
        <div className="flex items-center w-full border border-gray-300 rounded-md overflow-hidden">
          {/* Three dots menu button */}
          <Popover content={menu} trigger="click" placement="bottomLeft">
            <Button
              type="text"
              icon={<MoreOutlined />}
              className="flex items-center justify-center h-10"
              style={{ width: 40 }}
            />
          </Popover>

          {/* Label with tooltip */}
          <Tooltip title={label}>
            <div className="w-1/3 px-3 py-2 bg-gray-50 h-10 flex items-center border-x border-gray-300">
              <span className="truncate">{truncateText(label, 20)}</span>
            </div>
          </Tooltip>

          {/* File upload/display area */}
          <div className="flex-1">
            {!file ? (
              <Upload
                name={name}
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handle}
                maxCount={1}
                className="w-full h-full"
              >
                <Button
                  type="text"
                  icon={<UploadOutlined />}
                  className="w-full h-10 flex items-center justify-center"
                >
                  Choose File
                </Button>
              </Upload>
            ) : (
              <div className="flex items-center justify-between w-full h-10 px-3 bg-blue-50">
                <Tooltip title={file.name}>
                  <span className="flex-1 truncate">
                    {truncateText(file.name, 30)}
                  </span>
                </Tooltip>
                <Space>
                  <Tooltip title="View">
                    <Button
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => setShow(true)}
                    />
                  </Tooltip>
                  <Tooltip title="Clear">
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<CloseCircleOutlined />}
                      onClick={clear}
                    />
                  </Tooltip>
                </Space>
              </div>
            )}
          </div>
        </div>
      </Form.Item>

      {/* preview modal */}
      <Modal
        centered
        open={show}
        onCancel={() => setShow(false)}
        footer={null}
        width={type === "pdf" ? 500 : 400}
        title="File Preview"
      >
        {type === "img" ? (
          <img src={prev} alt="preview" style={{ width: "100%" }} />
        ) : (
          <iframe
            src={prev}
            title="PDF preview"
            style={{ width: "100%", height: 400 }}
          />
        )}
      </Modal>
    </>
  );
};

export default SingleFileUpload;
