import React, { useEffect, useState } from 'react';
import { GoPlus } from 'react-icons/go';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message, Modal, Input, Select, Progress } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addScoreCard, getScoreCard, updateScoreCard, addCommonDataToScoreCard } from '../../../Store/Slices/Admin/scoreCard/scoreCard.thunk';
import useCloudinaryRawUpload from '../../../Hooks/CommonHooks/useCloudinaryRawUpload';
import { useParams } from 'react-router-dom';
import CommonDataTable from './components/CommonDataTable';
import toast from 'react-hot-toast';

const { Option } = Select;

const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_PRESET;
const CLOUDINARY_FOLDER = 'ScorecardExcelfile';

const MainSection = () => {
  const dispatch = useDispatch();
  const { loading, success, scoreCardData, error } = useSelector((state) => state.admin.scoreCard);
  const [file, setFile] = useState(null);
  const [fieldModal, setFieldModal] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { cid } = useParams();
  const [newField, setNewField] = useState({
    cellNumber: '',
    fieldName: [],
    separate: '',
  });
    const [cellNumberError, setCellNumberError] = useState('');

  const { uploadFile, uploading, uploadProgress, resetUpload, error: uploadError } = useCloudinaryRawUpload(
    CLOUDINARY_UPLOAD_PRESET,
    CLOUDINARY_FOLDER
  );

  const validateCellNumber = (cell) => /^[A-Z]+[1-9][0-9]*$/i.test(cell);

  useEffect(() => {
    dispatch(getScoreCard(cid))
  }, [dispatch, cid]);

  useEffect(() => {
    if (error) {
      message.error('Failed to fetch scorecard data.');
    }
  }, [error]);

  const handleUploadOk = async () => {
    if (!file) {
      message.error('Please select an Excel file!');
      return;
    }

    const result = await uploadFile(file);
    if (!result) {
      message.error(`File upload failed: ${uploadError}`);
      return;
    }

    const action = scoreCardData
      ? updateScoreCard({ excelFile: result, scoreCardId: scoreCardData._id })
      : addScoreCard({ excelFile: result, classId: cid });

    dispatch(action).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        message.success('Operation successful!');
        setUploadModalVisible(false);
        resetUpload();
        setFile(null);
      } else {
        message.error('Operation failed.');
      }
    });
  };

  const handleFieldModalSubmit = () => {
    const preparedField = {
      cellNumber: newField.cellNumber,
      fieldName: newField.fieldName,
      separate: newField.separate === 'custom' ? newField.customSeparator : newField.separate,
    };

    if (!validateCellNumber(newField.cellNumber)) {
      setCellNumberError('Invalid cell number format. Example: A1, B2, AA10');
      return;
    }
    setCellNumberError('');


    setConfirmLoading(true);
    dispatch(addCommonDataToScoreCard({ ...preparedField, classId: cid })).then((res) => {
      setConfirmLoading(false);
      if (res.meta.requestStatus === 'fulfilled') {
        setNewField({
          cellNumber: '',
          fieldName: [],
          separate: '',
        })
        message.success('Field added successfully!');
        dispatch(getScoreCard(cid)).then((action) => {
          if (!action.payload?.success) {
            message.error('Failed to fetch scorecard data.');
          }
        });
        setFieldModal(false);
      } else {
        message.error('Failed to add field.');
      }
    });
  };

  const handleOpenModal = ()=>{
    if(scoreCardData?.excelFile){
      setFieldModal(true)
    }
    else{
      toast.error("Add Report card excel file first");
    }
  }

  return (
    <div className="p-4">
      <h1 className="font-semibold">Report card Management</h1>
      <div className="flex justify-between items-center p-2">
        <Button
          type="primary"
          className="rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center p-2 text-sm"
          icon={<GoPlus />}
          onClick={handleOpenModal}
        >
          Add Field
        </Button>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          className="rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center p-2 text-sm"
          onClick={() => setUploadModalVisible(true)}
        >
          {scoreCardData ? 'Update' : 'Upload'}
        </Button>
      </div>

      {/* Upload Modal */}
      <Modal
        title="Upload Excel File"
        open={uploadModalVisible}
        onOk={handleUploadOk}
        onCancel={() => setUploadModalVisible(false)}
        confirmLoading={loading}
      >
        <Upload beforeUpload={(file) => setFile(file) && false} accept=".xlsx" maxCount={1} showUploadList={false}>
          <Button icon={<UploadOutlined />}>Select Excel File</Button>
        </Upload>
        {file && <div className="mt-2">Selected file: {file.name}</div>}
      </Modal>

      {/* Field Modal */}
      <Modal
        title="Add Fields"
        open={fieldModal}
        onOk={handleFieldModalSubmit}
        onCancel={() => setFieldModal(false)}
        confirmLoading={confirmLoading}
        okText="Submit"
      >
        <Select
          mode="multiple"
          placeholder="Select Field Names"
          value={newField.fieldName}
          onChange={(value) => setNewField({ ...newField, fieldName: value })}
          className="mb-2 w-full"
        >
          {/* Field Options */}
          {[
            'firstName',
            'lastName',
            'email',
            'dateOfBirth',
            'placeOfBirth',
            'age',
            'nationality',
            'nativeLanguag',
            'passportNumber',
            'bloodGroup',
            'gender',
            'contactNumber',
            'religion',
            'currentStep',
            'fatherName',
            'motherName',
            'guardianName',
            'guardianRelationToStudent',
            'guardianContactNumber',
            'guardianEmail',
          ].map((field) => (
            <Option key={field} value={field}>
              {field}
            </Option>
          ))}
        </Select>
        <Input
          placeholder="Cell Number"
          value={newField.cellNumber}
          onChange={(e) => setNewField({ ...newField, cellNumber: e.target.value.toUpperCase() })}
          className="mb-2"
        />
         {cellNumberError && <div className="text-red-500">{cellNumberError}</div>}
        <Select
          placeholder="Separator"
          value={newField.separate}
          onChange={(value) =>
            setNewField({ ...newField, separate: value === 'custom' ? '' : value })
          }
          className="mb-2 min-w-[40%]"
        >
          <Option >Select Separator</Option>
          <Option value=",">,</Option>
          <Option value="-">-</Option>
          <Option value="/">/</Option>
          <Option value="_">_</Option>
          <Option value="custom">Custom</Option>
        </Select>
        {newField.separate === '' && (
          <Input
            placeholder="Custom Separator"
            value={newField.customSeparator || ''}
            onChange={(e) => setNewField({ ...newField, customSeparator: e.target.value })}
            className="mb-2"
          />
        )}
      </Modal>

      {/* Common Data Table */}
      {scoreCardData && <CommonDataTable />}
    </div>
  );
};

export default MainSection;
