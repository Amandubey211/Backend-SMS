import React, { useState, useCallback, useEffect, useMemo, memo } from "react";
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

const MAX_MB = 5;
const BYTES = MAX_MB * 1024 * 1024;

const SingleFileUpload = memo(({ label, name, onEdit, onDelete, error }) => {
  const [, meta, helpers] = useField(name);
  const [file, setFile] = useState(null);
  const [prev, setPrev] = useState(null);
  const [type, setType] = useState(null);
  const [show, setShow] = useState(false);

  const ok = useCallback((f) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    if (!allowed.includes(f.type)) {
      message.error("Only JPG, PNG, GIF, or PDF files are allowed");
      return false;
    }
    if (f.size > BYTES) {
      message.error(`File too large (max ${MAX_MB} MB)`);
      return false;
    }
    return true;
  }, []);

  const handle = useCallback(
    async (info) => {
      if (info.file.status === "removed") {
        helpers.setValue(null);
        setFile(null);
        setPrev(null);
        return;
      }

      const f = info.file.originFileObj || info.file;
      if (!f || !ok(f)) return Upload.LIST_IGNORE;

      try {
        let pv;
        if (f.type.startsWith("image/")) {
          pv = await new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result);
            r.onerror = rej;
            r.readAsDataURL(f);
          });
        } else {
          pv = URL.createObjectURL(f);
        }

        helpers.setValue({
          file: f,
          preview: pv,
          fieldName: name.split(".").pop(),
        });
        setFile(f);
        setPrev(pv);
        setType(f.type.startsWith("image/") ? "img" : "pdf");
      } catch (err) {
        message.error("Failed to process file");
      }
    },
    [helpers, ok, name]
  );
  const clear = useCallback(() => {
    helpers.setValue(null);
    setFile(null);
    if (prev && type === "pdf") {
      URL.revokeObjectURL(prev);
    }
    setPrev(null);
  }, [helpers, prev, type]);

  const truncateText = useCallback(
    (text, maxLength) =>
      text.length <= maxLength ? text : `${text.slice(0, maxLength - 3)}…`,
    []
  );

  useEffect(() => {
    return () => {
      if (prev && type === "pdf") {
        URL.revokeObjectURL(prev);
      }
    };
  }, [prev, type]);

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

  return (
    <>
      <Form.Item
        validateStatus={error ? "error" : ""}
        help={error}
        className="mb-4"
      >
        <div className="flex items-center w-full border border-gray-300 rounded-md overflow-hidden">
          <Popover content={menu} trigger="click" placement="bottomLeft">
            <Button
              type="text"
              icon={<MoreOutlined />}
              className="flex items-center justify-center h-10"
              style={{ width: 40 }}
            />
          </Popover>

          <Tooltip title={label}>
            <div className="w-[60%] px-3 py-2 bg-gray-50 h-10 flex items-center border-x border-gray-300">
              <span className="truncate">{truncateText(label, 140)}</span>
            </div>
          </Tooltip>

          <div className="flex-1">
            {!file ? (
              <Upload
                name={name}
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handle}
                maxCount={1}
                className="w-full h-full"
                accept="image/*,.pdf"
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
});

export default SingleFileUpload;
