import React, { useEffect, useState } from 'react';
import { GoPlus } from 'react-icons/go';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message, Modal, Input, Select, Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  addScoreCard,
  getScoreCard,
  updateScoreCard,
  addCommonDataToScoreCard,
} from '../../../Store/Slices/Admin/scoreCard/scoreCard.thunk';
import useCloudinaryRawUpload from '../../../Hooks/CommonHooks/useCloudinaryRawUpload';
import { useParams } from 'react-router-dom';
import CommonDataTable from './components/CommonDataTable';
import toast from 'react-hot-toast';
import CellDataTable from './components/CellDataTable';
import ScoreCardView from './components/ScoreCardView';
import { FaEye } from "react-icons/fa";
import { fetchSectionsByClass } from '../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks';

const { Option } = Select;
const { TabPane } = Tabs;

const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_PRESET;
const CLOUDINARY_FOLDER = 'ScorecardExcelfile';

const MainSection = () => {
  const dispatch = useDispatch();
  const { loading, success, scoreCardData, error } = useSelector((state) => state.admin.scoreCard);
  const { sectionsList } = useSelector((state) => state?.admin?.group_section);
  const [selectedSection, setSelectedSection] = useState(null);
  const [file, setFile] = useState(null);
  const [fieldModal, setFieldModal] = useState(false);
  const [scoreCardViewModal, setScoreCardViewModal] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [publishStatus, setPublishStatus] = useState("unpublish");
  const [openPublishModal, setOpenPublishModal] = useState(false)
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
    dispatch(fetchSectionsByClass(cid));
    dispatch(getScoreCard({cid,sectionId:selectedSection}));
    if (scoreCardData?.publish) {
      setPublishStatus("publish")
    } else {
      setPublishStatus("unpublish")
    }
  }, [dispatch, cid,selectedSection]);

  useEffect(() => {
    if (sectionsList?.length > 0 && !selectedSection) {
      setSelectedSection(sectionsList[0]._id);
    }
  }, [sectionsList, selectedSection]);


  useEffect(() => {
    if (error) {
      message.error('Failed to fetch scorecard data.');
    }
  }, [error]);

  const sortedSections = sectionsList?.slice().sort((a, b) => {
    return a.sectionName.localeCompare(b.sectionName);
  });

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
      : addScoreCard({ excelFile: result, classId: cid, sectionId: selectedSection });
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
    dispatch(addCommonDataToScoreCard({ ...preparedField, classId: cid, sectionId: selectedSection })).then((res) => {
      setConfirmLoading(false);
      if (res.meta.requestStatus === 'fulfilled') {
        setNewField({
          cellNumber: '',
          fieldName: [],
          separate: '',
        });
        message.success('Field added successfully!');
        dispatch(getScoreCard({cid,sectionId: selectedSection }));
        setFieldModal(false);
      } else {
        message.error('Failed to add field.');
      }
    });
  };

  const handleOpenModal = () => {
    if (scoreCardData?.excelFile) {
      setFieldModal(true);
    } else {
      toast.error('Add Report card excel file first');
    }
  };

  const handleChange = (value) => {
    setPublishStatus(value);
    setOpenPublishModal(true)
  };

  const handlePublishSubmit = async () => {

    await dispatch(updateScoreCard({ publish: publishStatus === 'publish' ? true : false, scoreCardId: scoreCardData._id }))
    setOpenPublishModal(false)
  }

  const studentFields = [
    { label: "Profile Image", value: "profile" },
    { label: "First Name", value: "firstName" },
    { label: "Last Name", value: "lastName" },
    { label: "Email", value: "email" },
    { label: "Date of Birth", value: "dateOfBirth" },
    { label: "Place of Birth", value: "placeOfBirth" },
    { label: "Passport Number", value: "passportNumber" },
    { label: "Age", value: "age" },
    { label: "Nationality", value: "nationality" },
    { label: "Q Id", value: "Q_Id" },
    { label: "Native Language", value: "nativeLanguage" },
    { label: "Blood Group", value: "bloodGroup" },
    { label: "Gender", value: "gender" },
    { label: "Contact Number", value: "contactNumber" },
    { label: "Religion", value: "religion" },
    { label: "Class", value: "class" },
    { label: "Section", value: "section" },
    { label: "Total Present Days", value: "attendance" },

    // Guardian Fields (Father)
    { label: "Father First Name", value: "fatherInfo.firstName" },
    { label: "Father Last Name", value: "fatherInfo.lastName" },
    { label: "Father Email", value: "fatherInfo.email1" },
    { label: "Father Contact", value: "fatherInfo.cell1.value" },

    // Guardian Fields (Mother)
    { label: "Mother First Name", value: "motherInfo.firstName" },
    { label: "Mother Last Name", value: "motherInfo.lastName" },
    { label: "Mother Email", value: "motherInfo.email1" },
    { label: "Mother Contact", value: "motherInfo.cell1.value" },

    // Additional Guardian Fields
    { label: "Guardian Name", value: "guardianName" },
    { label: "Guardian Relation", value: "guardianRelationToStudent" },
    { label: "Guardian Contact", value: "guardianContactNumber" },
    { label: "Guardian Email", value: "guardianEmail" },

    // Address
    { label: "Permanent Address - City", value: "permanentAddress.city" },
    { label: "Permanent Address - Country", value: "permanentAddress.country" },
    { label: "Residential Address - City", value: "residentialAddress.city" },
    { label: "Residential Address - Country", value: "residentialAddress.country" },

    // Academic
    { label: "Admission Number", value: "admissionNumber" },
    { label: "Admission Date", value: "admissionDate" },
    { label: "Enrollment Status", value: "enrollmentStatus" },
    { label: "Batch Start", value: "batchStart" },
    { label: "Batch End", value: "batchEnd" },
    { label: "Is Graduate", value: "isGraduate" },

    // Emergency
    { label: "Emergency Number", value: "emergencyNumber" },
    // Language Preference
    { label: "Second Language", value: "secondLanguage" },
    { label: "Third Language", value: "thirdLanguage" },
    { label: "Value Education", value: "valueEducation" },

    // Preferences
    { label: "Left Handed", value: "isLeftHanded" },
    { label: "Medical Condition", value: "medicalCondition" },
    { label: "Height", value: "height" },
    { label: "Weight", value: "weight" },
    { label: "Transport Required", value: "transportRequirement" },
  ];


  return (
    <div className="p-4">
     
      <div className='flex justify-between items-center my-6'>
         <h1 className="font-semibold">Report Card Management</h1>
        {
          sectionsList?.length >= 1 &&
          <>
            <Select
              style={{ width: 150 }}
              onChange={setSelectedSection}
              placeholder="Select Section"
              value={selectedSection}
              disabled={!sectionsList?.length}
            >
              {sortedSections?.map((sec, index) => (
                <Option key={sec._id || `section-${index}`} value={sec._id}>
                  {sec.sectionName}
                </Option>
              ))}
            </Select>
          </>
        }

      </div>
      <div className="flex justify-between items-center p-2">
        <Button
          type="primary"
          className="rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center p-2 text-sm"
          icon={<GoPlus />}
          onClick={handleOpenModal}
        >
          Add Field
        </Button>
        <div className="flex justify-center items-center gap-5">
          <Button
            type="primary"
            icon={<UploadOutlined />}
            className="rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center p-2 text-sm"
            onClick={() => setUploadModalVisible(true)}
          >
            {scoreCardData ? "Update Excel File" : "Add Excel File"}
          </Button>

          {
            scoreCardData?.pdfFile &&
            <Button
              type="primary"
              icon={<FaEye />}
              className="rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center p-2 text-sm"
              onClick={() => setScoreCardViewModal(true)}
            >
              View File
            </Button>
          }

          {/* Select Publish/Unpublish */}
          {
            scoreCardData && <Select
              value={publishStatus}
              onChange={handleChange}
              className="w-40 rounded-md"
              options={[
                { label: "Publish", value: "publish" },
                { label: "Unpublish", value: "unpublish" },
              ]}
            />
          }


        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        title="Upload Excel File"
        open={uploadModalVisible}
        onOk={handleUploadOk}
        onCancel={() => setUploadModalVisible(false)}
        confirmLoading={loading}
      >
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 bg-gray-100 p-3 rounded-md">
          Note: The <strong>first sheet</strong> of the uploaded Excel file will be used.
          Ensure it contains the required data in the correct format for a seamless upload process.
        </p>

        {/* File Upload */}
        <Upload
          beforeUpload={(file) => setFile(file) && false}
          accept=".xlsx"
          maxCount={1}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Select Excel File</Button>
        </Upload>

        {/* Display selected file */}
        {file && <div className="mt-2 text-gray-700">Selected file: {file.name}</div>}
      </Modal>

      {/* Publish Modal */}
      <Modal
        title={`Confirm ${publishStatus === "publish" ? "Publish" : "Unpublish"}`}
        open={openPublishModal}
        onOk={handlePublishSubmit}
        onCancel={() => setOpenPublishModal(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to {publishStatus === "publish" ? "publish" : "unpublish"} the Report Card?</p>
      </Modal>

      {/* scorecard view modal */}
      <Modal
        open={scoreCardViewModal}
        onCancel={() => setScoreCardViewModal(false)}
        width="80%"
        footer={null}
      >
        <ScoreCardView pdfUrl={scoreCardData?.pdfFile} />

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
          {studentFields.map((field) => (
            <Option key={field.value} value={field.value}>
              {field.label}
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

      {/* Tabs for Fields and Grades */}
      <Tabs defaultActiveKey="1">
        <TabPane tab="Student Info" key="1">
          {<CommonDataTable scoreCardData={scoreCardData} />}
        </TabPane>
        <TabPane tab="Grades Info" key="2">
          <CellDataTable scoreCardData={scoreCardData} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default MainSection;
