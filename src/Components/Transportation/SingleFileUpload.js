import React, { useState, useCallback, useEffect, memo } from "react";
import {
  Upload,
  Button,
  Tooltip,
  Form,
  Space,
  Progress,
  Input,
  message,
} from "antd";
import {
  UploadOutlined,
  EyeOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import useCloudinaryUpload from "../../Hooks/CommonHooks/useCloudinaryUpload";
import useCloudinaryDeleteByPublicId from "../../Hooks/CommonHooks/useCloudinaryDeleteByPublicId";

const MAX_SIZE_MB = 5;
const VALID_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
];

const SingleFileUpload = memo(({
  name,
  label: initialLabel,
  type,
  onChange,
  onPreview,
  onRemove,
  fileUrl,
  fileName,
}) => {
  const form = Form.useFormInstance();
  const fileObj = Form.useWatch(name, form);
  const namePath = Array.isArray(name) ? name : [name];

  const extractPublicId = useCallback((url = "") => {
    const parts = url.split("/");
    const idx = parts.findIndex((p) => p === "upload");
    return idx === -1
      ? null
      : parts.slice(idx + 2).join("/").split(".")[0];
  }, []);

  const { uploadFile, uploading, progress, error, resetUpload } =
    useCloudinaryUpload(
      process.env.REACT_APP_CLOUDINARY_PRESET,
      "student_attachments"
    );
  const { deleteMediaByPublicId } = useCloudinaryDeleteByPublicId();

  const fallbackName = useCallback(() => {
    const url = fileObj?.url || fileUrl;
    return url ? url.split("/").pop().split(".")[0] : "";
  }, [fileObj, fileUrl]);

  const [labelValue, setLabelValue] = useState(initialLabel || fallbackName());
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  useEffect(() => {
    setLabelValue(initialLabel || fallbackName());
  }, [initialLabel]);

  const emitChange = useCallback(
    (fileData) => {
      form.setFields([{ name: namePath, value: fileData }]);
      onChange?.(fileData);
    },
    [form, namePath, onChange]
  );

  const validateFile = useCallback((file) => {
    if (!VALID_FILE_TYPES.includes(file.type)) {
      message.error("Only JPG, PNG, GIF, or PDF files are allowed");
      return false;
    }
    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > MAX_SIZE_MB) {
      message.error(
        `File is too large (${fileSizeMB.toFixed(2)}MB). Maximum allowed is ${MAX_SIZE_MB}MB.`
      );
      return false;
    }
    return true;
  }, []);

  const [localFile, setLocalFile] = useState(null);
  const [localURL, setLocalURL] = useState(null);
  useEffect(() => () => localURL && URL.revokeObjectURL(localURL), [localURL]);

  const handleLocalChange = useCallback(
    (info) => {
      const file = info.fileList[0]?.originFileObj;
      if (!file || !validateFile(file)) return;
      setLocalFile(file);
      setIsInputDisabled(false);
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
      const oldId = extractPublicId(fileObj?.url || fileUrl);
      if (oldId) await deleteMediaByPublicId(oldId);

      const url = await uploadFile(localFile);
      if (!url) throw new Error("No URL returned");

      const nameLabel = labelValue.trim() || localFile.name;
      const fileData = {
        file: localFile,
        preview: localFile.type.startsWith("image/") ? localURL : null,
        url,
        name: nameLabel,
      };
      emitChange(fileData);
      setLocalFile(null);
      setLocalURL(null);
      setIsInputDisabled(true);
      resetUpload();
    } catch (err) {
      console.error(err);
      message.error("Upload failed");
    }
  }, [
    localFile,
    localURL,
    uploadFile,
    deleteMediaByPublicId,
    extractPublicId,
    fileObj,
    fileUrl,
    labelValue,
    emitChange,
    resetUpload,
  ]);

  const handleInternalRemove = useCallback(async () => {
    const oldId = extractPublicId(fileObj?.url || fileUrl);
    if (oldId) await deleteMediaByPublicId(oldId);
    emitChange(null);
    setIsInputDisabled(false);
  }, [fileObj, fileUrl, deleteMediaByPublicId, extractPublicId, emitChange]);

  const cancelUpload = useCallback(() => {
    setLocalFile(null);
    setLocalURL(null);
    resetUpload();
  }, [resetUpload]);

  const handlePreview = useCallback(() => {
    let previewData = null;
    if (fileObj?.url || fileUrl) {
      previewData = {
        url: fileObj?.url || fileUrl,
        preview: fileObj?.preview,
        type:
          fileObj?.file?.type ||
          ((fileObj?.url || fileUrl).endsWith(".pdf")
            ? "application/pdf"
            : "image/jpeg"),
      };
    } else if (localFile) {
      previewData = { url: null, preview: localURL, type: localFile.type };
    }
    onPreview?.(previewData);
  }, [fileObj, fileUrl, localFile, localURL, onPreview]);

  return (
    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
      <Input
        className="px-3 py-1 w-1/2 bg-gray-50 truncate"
        value={labelValue}
        disabled={isInputDisabled}
        placeholder="Enter label"
        onChange={(e) => {
          const newLabel = e.target.value;
          setLabelValue(newLabel);
        }}
      />

      {uploading ? (
        <div className="flex-1 px-3 bg-blue-50">
          <Progress
            percent={progress}
            status={error ? "exception" : "active"}
            showInfo={false}
          />
        </div>
      ) : fileObj?.url || fileUrl ? (
        <div className="flex items-center justify-between flex-1 px-3 bg-blue-50">
          <Tooltip title={labelValue || fileObj?.file?.name || fileName}>
            <span className="truncate">{labelValue || fileObj?.file?.name || fileName}</span>
          </Tooltip>
          <Space>
            <Button type="text" icon={<EyeOutlined />} onClick={handlePreview} />
            <Button
              type="text"
              danger
              icon={<CloseOutlined />}
              onClick={() => (onRemove ? onRemove() : handleInternalRemove())}
            />
          </Space>
        </div>
      ) : localFile ? (
        <div className="flex items-center justify-between flex-1 px-3 bg-blue-50">
          <Tooltip title={localFile.name}>
            <span className="truncate">{localFile.name}</span>
          </Tooltip>
          <Space>
            <Button type="text" icon={<EyeOutlined />} onClick={handlePreview} />
            <Button type="text" icon={<CloseOutlined />} onClick={cancelUpload} />
            <Button type="text" icon={<CheckOutlined />} onClick={handleUpload} />
          </Space>
        </div>
      ) : (
        <Upload
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleLocalChange}
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
});

export default SingleFileUpload;
