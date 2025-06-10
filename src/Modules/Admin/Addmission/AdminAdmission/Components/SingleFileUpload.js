import React, { useState, useCallback, useEffect, memo } from "react";
import {
  Upload,
  Button,
  Popover,
  Tooltip,
  Form,
  Space,
  Progress,
  message,
} from "antd";
import {
  UploadOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import useCloudinaryUpload from "../../../../../Hooks/CommonHooks/useCloudinaryUpload";
import useCloudinaryDeleteByPublicId from "../../../../../Hooks/CommonHooks/useCloudinaryDeleteByPublicId";

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const VALID_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
];

const SingleFileUpload = memo(
  ({ name, label, displayKey, type, onEdit, onDelete, onPreview }) => {
    const form = Form.useFormInstance();
    const fileObj = Form.useWatch(name, form);
    const namePath = Array.isArray(name) ? name : [name];

    const { uploadFile, uploading, progress, error, resetUpload } =
      useCloudinaryUpload(
        process.env.REACT_APP_CLOUDINARY_PRESET,
        "student_attachments"
      );
    const { deleteMediaByPublicId } = useCloudinaryDeleteByPublicId();

    const [publicId, setPublicId] = useState(null);
    const [localFile, setLocalFile] = useState(null);
    const [localURL, setLocalURL] = useState(null);
    const [sizeError, setSizeError] = useState(false);

    const extractPublicId = useCallback((url = "") => {
      if (typeof url !== "string") return null;
      const parts = url.split("/");
      const idx = parts.findIndex((p) => p === "upload");
      return idx === -1
        ? null
        : parts
          .slice(idx + 2)
          .join("/")
          .split(".")[0];
    }, []);

    useEffect(() => {
      if (fileObj?.url) {
        setPublicId(extractPublicId(fileObj.url));
      }
      resetUpload();
    }, [fileObj, extractPublicId, resetUpload]);

    useEffect(() => {
      return () => {
        if (localURL) URL.revokeObjectURL(localURL);
      };
    }, [localURL]);

    const validateFile = useCallback((file) => {
      setSizeError(false);

      if (!VALID_FILE_TYPES.includes(file.type)) {
        message.error("Only JPG, PNG, GIF, or PDF files are allowed");
        return false;
      }

      if (file.size > MAX_SIZE_BYTES) {
        setSizeError(true);
        message.error(`File size must be less than ${MAX_SIZE_MB}MB`);
        return false;
      }

      return true;
    }, []);

    const setNested = useCallback(
      (value) => {
        const out = {};
        let cur = out;
        namePath.forEach((seg, i) => {
          if (i === namePath.length - 1) {
            cur[seg] = value;
          } else {
            cur[seg] = cur[seg] || {};
            cur = cur[seg];
          }
        });
        form.setFieldsValue(out);
      },
      [form, namePath]
    );

    const handleChange = useCallback(
      (info) => {
        const file = info.fileList[0]?.originFileObj;
        if (!file || !validateFile(file)) return;

        setLocalFile(file);

        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = () => setLocalURL(reader.result);
          reader.readAsDataURL(file);
        } else {
          setLocalURL(null);
        }
      },
      [validateFile]
    );

    const handleUpload = useCallback(async () => {
      if (!localFile) return;

      try {
        if (publicId) await deleteMediaByPublicId(publicId);

        const url = await uploadFile(localFile);
        if (url) {
          const id = extractPublicId(url);
          setPublicId(id);

          const fileData = {
            file: localFile,
            preview: localFile.type.startsWith("image/") ? localURL : null,
            url,
            fieldName: namePath[namePath.length - 1],
          };

          setNested(fileData);
          message.success("File uploaded successfully");
          setLocalFile(null);
          setLocalURL(null);
          setSizeError(false);
        }
      } catch (err) {
        message.error("Upload failed");
        console.error(err);
      }
    }, [
      localFile,
      localURL,
      publicId,
      uploadFile,
      deleteMediaByPublicId,
      extractPublicId,
      setNested,
      namePath,
    ]);

    const handleRemove = useCallback(async () => {
      try {
        if (publicId) await deleteMediaByPublicId(publicId);
        setPublicId(null);
        setNested(null);
        message.success("File removed");
      } catch (err) {
        message.error("Failed to remove file");
        console.error(err);
      }
    }, [publicId, deleteMediaByPublicId, setNested]);

    const cancelUpload = useCallback(() => {
      setLocalFile(null);
      setLocalURL(null);
      setSizeError(false);
      resetUpload();
    }, [resetUpload]);

    const handlePreview = useCallback(() => {
      if (fileObj?.url || fileObj?.preview) {
        onPreview({
          url: fileObj.url,
          preview: fileObj.preview,
          type:
            fileObj.file?.type ||
            (fileObj.url?.endsWith(".pdf") ? "application/pdf" : "image/jpeg"),
        });
      } else if (localFile) {
        onPreview({
          url: null,
          preview: localURL,
          type: localFile.type,
        });
      }
    }, [fileObj, localFile, localURL, onPreview]);

    const menu = (
      <div>
        {onEdit && (
          <Button type="text" icon={<EditOutlined />} onClick={onEdit}>
            Update
          </Button>
        )}
        {onDelete && (
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
      </div>
    );

    return (
      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
        <Popover content={menu} trigger="click" placement="bottomLeft">
          <Button type="text" icon={<MoreOutlined />} style={{ width: 40 }} />
        </Popover>

        <Tooltip title={displayKey || label}>
          <div className="px-3 w-1/2 bg-gray-50 truncate">
            {`${displayKey || label}${type === "mandatory" ? " *" : ""}`}
          </div>
        </Tooltip>

        {uploading ? (
          <div className="flex-1 px-3 bg-blue-50">
            <Progress
              percent={progress}
              status={error ? "exception" : "active"}
              strokeColor={error ? "#ff4d4f" : "#1890ff"}
              showInfo={false}
            />
          </div>
        ) : fileObj?.url ? (
          <div className="flex items-center justify-between flex-1 px-3 bg-blue-50">
            <Tooltip title={fileObj.fieldName || fileObj.url.split("/").pop()}>
              <span className="truncate">
                {fileObj.fieldName || fileObj.url.split("/").pop()}
              </span>
            </Tooltip>
            <Space>
              <Tooltip title="Preview">
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={handlePreview}
                />
              </Tooltip>
              <Tooltip title="Remove">
                <Button
                  type="text"
                  danger
                  icon={<CloseOutlined />}
                  onClick={handleRemove}
                />
              </Tooltip>
            </Space>
          </div>
        ) : localFile ? (
          <div className="flex items-center justify-between flex-1 px-3 bg-blue-50">
            <Tooltip title={localFile.name}>
              <span className="truncate">{localFile.name}</span>
            </Tooltip>
            <Space>
              <Tooltip title="Preview">
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={handlePreview}
                />
              </Tooltip>
              <Tooltip title="Cancel">
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={cancelUpload}
                />
              </Tooltip>
              <Tooltip title="Upload">
                <Button
                  type="text"
                  icon={<CheckOutlined />}
                  onClick={handleUpload}
                />
              </Tooltip>
            </Space>
          </div>
        ) : (
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleChange}
            accept="image/*,.pdf"
            className="flex-1"
          >
            <Button type="text" icon={<UploadOutlined />} block>
              Choose File
            </Button>
          </Upload>
        )}
      </div>
    );
  }
);

export default SingleFileUpload;