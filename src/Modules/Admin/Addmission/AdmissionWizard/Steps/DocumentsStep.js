import React, { useRef } from "react";
import { Upload, Button, Select } from "antd";
import { useFormikContext } from "formik";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;
const { Option } = Select;

/**
 * If you want an inline image crop, use antd-img-crop.
 * Or you can do a simpler approach with a custom file input + previews.
 */
const DocumentsStep = ({ stepRef, previewURLs, setPreviewURLs }) => {
  const { values, setFieldValue, errors, touched } = useFormikContext();
  const profileRef = useRef(null);

  // Profile image changes
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFieldValue("profile", file);
  };

  // Dragger props for multiple docs
  const draggerProps = {
    multiple: true,
    maxCount: 3, // e.g. only allow up to 3 docs
    beforeUpload: (file) => {
      // For immediate preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewURLs((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);

      // Store the file in formik "documents"
      setFieldValue("documents", [...values.documents, file]);
      // By returning false, we prevent the antd from auto-uploading
      return false;
    },
    onRemove: (file) => {
      const newDocs = values.documents.filter(
        (f) => f.uid !== file.uid && f.name !== file.name
      );
      setFieldValue("documents", newDocs);

      // Remove from preview as well
      // This is naive; in real code compare file name or unique ID
      const newPreviews = [...previewURLs];
      newPreviews.splice(
        newPreviews.findIndex((url) => url.name === file.name),
        1
      );
      setPreviewURLs(newPreviews);
    },
  };

  return (
    <div ref={stepRef}>
      <h3 className="text-xl font-semibold mb-4">Documents</h3>

      {/* Profile Image */}
      <div className="my-2">
        <label className="block mb-1">Profile Image</label>
        <input
          type="file"
          ref={profileRef}
          onChange={handleProfileChange}
          accept="image/*"
        />
        {touched.profile && errors.profile && (
          <div className="text-red-500 text-sm">{errors.profile}</div>
        )}
      </div>

      {/* Document Dragger */}
      <div className="my-4">
        <Dragger {...draggerProps} fileList={[]}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag files to this area</p>
          <p className="ant-upload-hint">Maximum 3 documents (PDF/JPG/PNG)</p>
        </Dragger>
      </div>

      {values.documents && values.documents.length > 0 && (
        <div className="mt-2">
          <h4 className="font-semibold">Document Labels</h4>
          {values.documents.map((doc, index) => (
            <div key={index} className="flex items-center gap-2 my-2">
              <Select
                style={{ width: 200 }}
                placeholder="Select Label"
                onChange={(val) => {
                  const updatedLabels = [...(values.documentLabels || [])];
                  updatedLabels[index] = val;
                  setFieldValue("documentLabels", updatedLabels);
                }}
              >
                <Option value="Passport">Passport</Option>
                <Option value="Birth Certificate">Birth Certificate</Option>
                <Option value="Other">Other</Option>
              </Select>
              <span>{doc.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsStep;
