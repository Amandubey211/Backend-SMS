import React, { useState } from 'react';
import { GoPlus } from 'react-icons/go';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message, Modal, Input, Select, Table, Switch, Progress } from 'antd';
import useCloudinaryRawUpload from '../../../Hooks/CommonHooks/useCloudinaryRawUpload';

const { Option } = Select;

const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_PRESET;
const CLOUDINARY_FOLDER = 'ScorecardExcelfile';

const MainSection = () => {
  const [file, setFile] = useState(null);
  const [fieldModal, setFieldModal] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({
    cellNumbers: '',
    fieldName: [],
    separator: '',
    customSeparator: '',
  });

  const {
    uploadFile,
    uploading,
    uploadProgress,
    uploadedUrl,
    error,
    resetUpload,
  } = useCloudinaryRawUpload(CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_FOLDER);

  const handleSubmit = () => {
    if (!file) {
      message.error('Please upload an Excel file first!');
      return;
    }

    const formData = new FormData();
    formData.append('excelFile', uploadedUrl);
    formData.append('configuration', JSON.stringify(fields));

    console.log('Form Data:', {
      file: file,
      configuration: fields,
    });

    message.success('Data prepared for submission!');
    setFields([]);
    setFile(null);
  };

  const handleUploadOk = async () => {
    if (!file) {
      message.error('Please select an Excel file!');
      return;
    }

    const result = await uploadFile(file);

    if (result) {
      setUploadModalVisible(false);
      message.success('File uploaded successfully!');
    } else {
      message.error(`File upload failed: ${error}`);
    }
  };

  const handleFileUpload = (file) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isExcel) {
      message.error('Only Excel files are allowed!');
      return false;
    }
    setFile(file);
    return false;
  };

  const handleFieldModalSubmit = () => {
    setFields([...fields, { ...newField, separator: newField.customSeparator || newField.separator }]);
    setNewField({
      cellNumbers: '',
      fieldName: [],
      separator: '',
      customSeparator: '',
    });
    setConfirmLoading(true);
    setTimeout(() => {
      setFieldModal(false);
      setConfirmLoading(false);
    }, 1000);
  };

  const handleFieldChange = (key, value) => {
    setNewField((prev) => ({ ...prev, [key]: value }));
  };

  const togglePublish = (index, value) => {
    const updatedFields = [...fields];
    updatedFields[index].publish = value;
    setFields(updatedFields);
  };

  const columns = [
    {
      title: 'Cell Numbers',
      dataIndex: 'cellNumbers',
      key: 'cellNumbers',
    },
    {
      title: 'Field Name',
      dataIndex: 'fieldName',
      key: 'fieldName',
      render: (fieldName) => fieldName.join(', '),
    },
    {
      title: 'Separator',
      dataIndex: 'separator',
      key: 'separator',
    }
  ];

  return (
    <div className="p-4">
      <h1 className="font-semibold">Scorecard Management</h1>
      <div className="flex justify-between items-center p-2">
        <button
          onClick={() => setFieldModal(true)}
          className="rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center p-2 text-sm"
        >
          <GoPlus /> Add Field
        </button>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          className="rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center p-2 text-sm"
          onClick={() => setUploadModalVisible(true)}
        >
          Upload
        </Button>
      </div>

      {/* Upload Modal */}
      <Modal
        title="Upload Excel File"
        open={uploadModalVisible}
        onOk={handleUploadOk}
        onCancel={() => setUploadModalVisible(false)}
        okText={uploading ? <Progress percent={uploadProgress} /> : 'Confirm'}
      >
        <Upload
          beforeUpload={handleFileUpload}
          accept=".xlsx"
          maxCount={1}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Select Excel File</Button>
        </Upload>
        {file && <div className="mt-2">Selected file: {file.name}</div>}
      </Modal>

      {/* Field Configuration Modal */}
      <Modal
        title="Add Fields"
        open={fieldModal}
        onOk={handleFieldModalSubmit}
        confirmLoading={confirmLoading}
        onCancel={() => setFieldModal(false)}
        okText="Submit"
        width='70%'
      >
        <Select
          mode="multiple"
          placeholder="Select Field Names"
          value={newField.fieldName}
          onChange={(value) => handleFieldChange('fieldName', value)}
          className="mb-2 w-[60%]"
        >
          <Option value="Name">Name</Option>
          <Option value="Age">Age</Option>
          <Option value="Email">Email</Option>
        </Select>

        <div className='flex justify-between items-center gap-6 '>
          <Input
            placeholder="Cell Numbers"
            value={newField.cellNumbers}
            onChange={(e) => handleFieldChange('cellNumbers', e.target.value)}
            className="mb-2 w-[35%]"
          />

          <Select
            placeholder=" Separator"
            value={newField.separator}
            onChange={(value) => handleFieldChange('separator', value)}
            className="mb-2 "
          >
            <Option value="-">-</Option>
            <Option value="/">/</Option>
            <Option value="_">_</Option>
            <Option value="custom">Custom</Option>
          </Select>
          {newField.separator === 'custom' && (
            <Input
              placeholder="Custom Separator"
              value={newField.customSeparator}
              onChange={(e) => handleFieldChange('customSeparator', e.target.value)}
              className="mb-2 "
            />
          )}

        </div>

      </Modal>

      {fields.length > 0 && (
        <>
          <Table dataSource={fields} columns={columns} rowKey={(record, index) => index} className="mt-4" />
          <div className="flex justify-end gap-4 mt-4">
            <Button type="primary" className="bg-green-500 text-white" onClick={handleSubmit}>
              Submit
            </Button>
            <Button type="default" className="bg-gray-500 text-white" onClick={() => setFields([])}>
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MainSection;
