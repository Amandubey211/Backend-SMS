import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Select, Button, Row, Col, Card, Spin, Modal, DatePicker, Radio, message, Switch } from "antd";
import { EyeOutlined, CloseOutlined } from "@ant-design/icons";
import { updateStudents } from "../../../../../Store/Slices/Admin/Users/Students/student.action";
import { fetchAdmissionOptionsBySchoolId, fetchSchoolAttachmentsById } from "../../../../../Store/Slices/Admin/Admission/admissionThunk";
import {
  GENDER_OPTIONS,
  COUNTRY_OPTIONS,
  RELIGION_OPTIONS,
  NATIVE_LANGUAGE_OPTIONS,
} from "../../../Addmission/AdminAdmission/Configs/selectOptionsConfig";
import { fetchAcademicYear } from "../../../../../Store/Slices/Common/AcademicYear/academicYear.action";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import toast from "react-hot-toast";
import SingleFileUpload from "../../../Addmission/AdminAdmission/Components/SingleFileUpload";
import EditorComponent from '../../../Subjects/Component/AdminEditor';
dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;
const { TextArea } = Input;

const isHTML = (str) => {
  if (!str || typeof str !== "string") return false;
  const htmlRegex = /<\/?[a-z][\s\S]*>/i;
  return htmlRegex.test(str);
};

// Function to clean editor content for display (only applied to HTML content)
const cleanEditorContent = (content) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  const imageWrappers = doc.querySelectorAll(".uploaded-image-wrapper");
  imageWrappers.forEach((wrapper) => {
    const img = wrapper.querySelector("img");
    if (img) {
      wrapper.parentNode.replaceChild(img, wrapper);
    }
  });

  const fileWrappers = doc.querySelectorAll(".uploaded-file-wrapper");
  fileWrappers.forEach((wrapper) => {
    const link = wrapper.querySelector("a");
    if (link) {
      wrapper.parentNode.replaceChild(link, wrapper);
    }
  });

  const cleanedContent = doc.body.innerHTML;
  const cleanedPlainText = doc.body.textContent.trim();
  if (!cleanedPlainText) {
    return "No Medical Conditions Reported";
  }

  return cleanedContent;
};

// Helper function to determine how to render medicalCondition
const renderMedicalCondition = (medicalCondition) => {
  if (!medicalCondition || medicalCondition.trim() === "") {
    return "No Medical Conditions Reported";
  }

  if (isHTML(medicalCondition)) {
    const cleanedContent = cleanEditorContent(medicalCondition);
    return cleanedContent;
  }

  return `<p>${medicalCondition}</p>`;
};

const ImageUploadCard = ({ name, recommendedSize, width, height, required, form, onChange, initialValue }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Update image and preview when initialValue changes
  useEffect(() => {
    if (initialValue) {
      if (typeof initialValue === 'string' && initialValue.startsWith('http')) {
        setImage(initialValue);
        setPreview(initialValue);
      } else {
        setImage(null);
        setPreview(null);
      }
    } else {
      setImage(null);
      setPreview(null);
    }
  }, [initialValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        message.error('Please upload an image file!');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        message.error('Image size must be less than 5MB!');
        return;
      }

      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      form.setFieldsValue({ [name]: file });
      onChange(file);

      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const handleRemove = () => {
    setImage(null);
    setPreview(null);
    form.setFieldsValue({ [name]: null });
    onChange(null);
  };

  return (
    <div className={`relative ${width} ${height}`}>
      <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-full relative">
        {preview ? (
          <div className="relative w-full h-full">
            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            >
              <CloseOutlined />
            </button>
          </div>
        ) : (
          <>
            <label
              htmlFor={name}
              className="flex flex-col items-center justify-center cursor-pointer h-full"
            >
              <span className="text-gray-500">Upload Image</span>
              <span className="text-gray-400 text-sm">Recommended: {recommendedSize}</span>
            </label>
            <input
              id={name}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute opacity-0 w-0 h-0"
              style={{ display: 'none' }}
            />
          </>
        )}
      </div>
    </div>
  );
};

const UpdateStudent = ({ data, handleUpdateSidebarClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [isSameAddress, setIsSameAddress] = useState(false);
  const dispatch = useDispatch();
  const { admissionOptions = {}, loading: admissionLoading } = useSelector((state) => state.admin?.admissionAttachment || {});
  const raw = useSelector((s) => s.admin.admissionAttachment.attachments || []);
  const attachmentsLoading = useSelector((state) => state.admin?.admissionAttachment?.loading || false);
  const academicYears = useSelector((state) => state.common?.academicYear?.academicYears || []);

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [fatherPhoto, setFatherPhoto] = useState(null);
  const [motherPhoto, setMotherPhoto] = useState(null);
  const [medicalConditionContent, setMedicalConditionContent] = useState("");
  const calculateAge = (dob) => {
    if (!dob || !dayjs.isDayjs(dob) || !dob.isValid()) return "";
    const today = dayjs();
    const age = today.diff(dob, 'year');
    return age.toString();
  };

  const [studentData, setStudentData] = useState({
    id: "",
    profile: null,
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    Q_Id: "",
    age: "",
    idExpiry: null,
    passportNumber: "",
    passportExpiry: null,
    placeOfBirth: "",
    nationality: "",
    gender: "",
    religion: "",
    nativeLanguage: "",
    email: "",
    contactNumber: "",
    emergencyNumber: "",
    secondLanguage: [],
    thirdLanguage: [],
    valueEducation: [],
    leftHanded: false,
    permanentAddress: {
      buildingNumber: "",
      streetName: "",
      city: "",
      transportRequired: false,
      postalCode: "",
      state: "",
      country: "",
    },
    residentialAddress: {
      buildingNumber: "",
      streetName: "",
      city: "",
      transportRequired: false,
      postalCode: "",
      state: "",
      country: "",
    },
    fatherInfo: {
      photo: null,
      firstName: "",
      middleName: "",
      lastName: "",
      idNumber: "",
      idExpiry: null,
      religion: "",
      nationality: "",
      company: "",
      jobTitle: "",
      cell1: { value: "", isWhatsApp: false },
      cell2: { value: "", isWhatsApp: false },
      email1: "",
      email2: "",
    },
    motherInfo: {
      photo: null,
      firstName: "",
      middleName: "",
      lastName: "",
      idNumber: "",
      idExpiry: null,
      religion: "",
      nationality: "",
      company: "",
      jobTitle: "",
      cell1: { value: "", isWhatsApp: false },
      cell2: { value: "", isWhatsApp: false },
      email1: "",
      email2: "",
    },
    attachments: {
      mandatory: {},
      optional: {},
    },
  });

  useEffect(() => {
    dispatch(fetchAdmissionOptionsBySchoolId());
    dispatch(fetchSchoolAttachmentsById());
    dispatch(fetchAcademicYear());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      const mandatoryAttachments = {};
      const optionalAttachments = {};
      const formAttachments = { mandatory: {}, optional: {} };

      if (data.attachments) {
        Object.keys(data.attachments.mandatory || {}).forEach((key) => {
          const url = data.attachments.mandatory?.[key] || null;
          const fileName = url ? url.split('/').pop() : null;
          mandatoryAttachments[key] = {
            file: null,
            url: url,
            fieldName: key,
            fileName: fileName,
            changed: false,
          };
          formAttachments.mandatory[key] = url ? {
            url: url,
            fieldName: key,
            file: null,
            preview: null,
          } : null;
        });

        Object.keys(data.attachments.optional || {}).forEach((key) => {
          const url = data.attachments.optional?.[key] || null;
          const fileName = url ? url.split('/').pop() : null;
          optionalAttachments[key] = {
            file: null,
            url: url,
            fieldName: key,
            fileName: fileName || null,
            changed: false,
          };
          formAttachments.optional[key] = url ? {
            url: url,
            fieldName: key,
            file: null,
            preview: null,
          } : null;
        });
      }

      const dateOfBirth = data.dateOfBirth ? dayjs(data.dateOfBirth) : null;
      let medicalCondition = data.medicalCondition || "";
      const processedMedicalCondition = renderMedicalCondition(medicalCondition);
      setMedicalConditionContent(processedMedicalCondition);
      const updatedStudentData = {
        id: data._id || "",
        profile: data.profile || null,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        Q_Id: data.Q_Id || "",
        dateOfBirth: dateOfBirth,
        age: calculateAge(dateOfBirth),
        idExpiry: data.idExpiry ? dayjs(data.idExpiry) : null,
        passportNumber: data.passportNumber || "",
        passportExpiry: data.passportExpiry ? dayjs(data.passportExpiry) : null,
        placeOfBirth: data.placeOfBirth || "",
        nationality: data.nationality || "",
        gender: data.gender || "",
        religion: data.religion || "",
        nativeLanguage: data.nativeLanguage || "",
        email: data.email || "",
        contactNumber: data.contactNumber || "",
        emergencyNumber: data.emergencyNumber || "",
        secondLanguage: data.secondLanguage || [],
        thirdLanguage: data.thirdLanguage || [],
        valueEducation: data.valueEducation || [],
        leftHanded: data.isLeftHanded || false,
        permanentAddress: {
          buildingNumber: data.permanentAddress?.buildingNumber || "",
          streetName: data.permanentAddress?.streetName || "",
          city: data.permanentAddress?.city || "",
          transportRequired: data.permanentAddress?.transportRequired || false,
          postalCode: data.permanentAddress?.postalCode || "",
          state: data.permanentAddress?.state || "",
          country: data.permanentAddress?.country || "",
        },
        residentialAddress: {
          buildingNumber: data.residentialAddress?.buildingNumber || "",
          streetName: data.residentialAddress?.streetName || "",
          city: data.residentialAddress?.city || "",
          transportRequired: data.residentialAddress?.transportRequired || false,
          postalCode: data.residentialAddress?.postalCode || "",
          state: data.residentialAddress?.state || "",
          country: data.residentialAddress?.country || "",
        },
        fatherInfo: {
          photo: data.fatherInfo?.photo || null,
          firstName: data.fatherInfo?.firstName || data.fatherInfo?.fatherName || "",
          middleName: data.fatherInfo?.middleName || "",
          lastName: data.fatherInfo?.lastName || "",
          idNumber: data.fatherInfo?.idNumber || "",
          idExpiry: data.fatherInfo?.idExpiry ? dayjs(data.fatherInfo.idExpiry) : null,
          religion: data.fatherInfo?.religion || "",
          nationality: data.fatherInfo?.nationality || "",
          company: data.fatherInfo?.company || "",
          jobTitle: data.fatherInfo?.jobTitle || "",
          cell1: {
            value: data.fatherInfo?.cell1?.value || "",
            isWhatsApp: data.fatherInfo?.cell1?.isWhatsApp ?? false
          },
          cell2: {
            value: data.fatherInfo?.cell2?.value || "",
            isWhatsApp: data.fatherInfo?.cell2?.isWhatsApp ?? false
          },
          email1: data.fatherInfo?.email1 || "",
          email2: data.fatherInfo?.email2 || "",
        },
        motherInfo: {
          photo: data.motherInfo?.photo || null,
          firstName: data.motherInfo?.firstName || "",
          middleName: data.motherInfo?.middleName || "",
          lastName: data.motherInfo?.lastName || "",
          idNumber: data.motherInfo?.idNumber || "",
          idExpiry: data.motherInfo?.idExpiry ? dayjs(data.motherInfo.idExpiry) : null,
          religion: data.motherInfo?.religion || "",
          nationality: data.motherInfo?.nationality || "",
          company: data.motherInfo?.company || "",
          jobTitle: data.motherInfo?.jobTitle || "",
          cell1: {
            value: data.motherInfo?.cell1?.value || "",
            isWhatsApp: data.motherInfo?.cell1?.isWhatsApp ?? false
          },
          cell2: {
            value: data.motherInfo?.cell2?.value || "",
            isWhatsApp: data.motherInfo?.cell2?.isWhatsApp ?? false
          },
          email1: data.motherInfo?.email1 || "",
          email2: data.motherInfo?.email2 || "",
        },
        attachments: {
          mandatory: mandatoryAttachments,
          optional: optionalAttachments,
        },
      };

      const areAddressesSame = Object.keys(updatedStudentData.permanentAddress).every(
        (key) => updatedStudentData.permanentAddress[key] === updatedStudentData.residentialAddress[key]
      );
      setIsSameAddress(areAddressesSame);

      setProfilePhoto(data.profile || null);
      setFatherPhoto(data.fatherInfo?.photo || null);
      setMotherPhoto(data.motherInfo?.photo || null);

      setStudentData(updatedStudentData);

      form.setFieldsValue({
        ...updatedStudentData,
        attachments: formAttachments,
        profile: data.profile || null,
        'fatherInfo.photo': data.fatherInfo?.photo || null,
        'motherInfo.photo': data.motherInfo?.photo || null,
      });
    }
  }, [data, form]);

  const handleAttachmentChange = (type, key) => (file) => {
    setStudentData((prev) => {
      const updatedTypeAttachments = { ...prev.attachments[type] };

      if (file) {
        updatedTypeAttachments[key] = {
          file: file,
          fieldName: key,
          url: URL.createObjectURL(file),
          fileName: file.name,
          changed: true,
        };
        message.success(`Attachment "${key}" uploaded successfully!`);
      } else {
        updatedTypeAttachments[key] = {
          file: null,
          url: null,
          fieldName: key,
          fileName: null,
          changed: true,
        };
        message.success(`Attachment "${key}" removed successfully!`);
      }

      const updatedState = {
        ...prev,
        attachments: {
          ...prev.attachments,
          [type]: updatedTypeAttachments,
        },
      };

      form.setFieldsValue({
        attachments: {
          ...form.getFieldValue('attachments'),
          [type]: {
            ...form.getFieldValue(['attachments', type]),
            [key]: file ? {
              file: file,
              preview: URL.createObjectURL(file),
              url: null,
              fieldName: key,
            } : null,
          },
        },
      });

      return updatedState;
    });
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    // Validate mandatory attachments
    const formAttachments = form.getFieldValue('attachments') || { mandatory: {}, optional: {} };
    const mandatoryAttachments = formAttachments.mandatory || {};
    const hasMissingMandatory = Object.entries(mandatoryAttachments).some(([key, attachment]) => {
      return attachment === null || (attachment && !attachment.file && !attachment.url);
    });

    if (hasMissingMandatory) {
      toast.error("Please upload all mandatory documents!");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("isSameAddress", isSameAddress)
    const addressFields = [
      "buildingNumber",
      "streetName",
      "city",
      "transportRequired",
      "postalCode",
      "state",
      "country",
    ];

    const updatedStudentData = {
      ...studentData,
      dateOfBirth: studentData.dateOfBirth ? studentData.dateOfBirth.toISOString() : null,
      idExpiry: studentData.idExpiry ? studentData.idExpiry.toISOString() : null,
      passportExpiry: studentData.passportExpiry ? studentData.passportExpiry.toISOString() : null,
      fatherInfo: {
        ...studentData.fatherInfo,
        idExpiry: studentData.fatherInfo.idExpiry ? studentData.fatherInfo.idExpiry.toISOString() : null,
      },
      motherInfo: {
        ...studentData.motherInfo,
        idExpiry: studentData.motherInfo.idExpiry ? studentData.motherInfo.idExpiry.toISOString() : null,
      },
    };

    const addDynamicAttachments = (type) => {
      const attachments = formAttachments[type] || {};
      Object.entries(attachments).forEach(([key, attachment]) => {
        if (attachment) {
          if (attachment.file) {
            formData.append(`attachments[${type}][${key}]`, attachment.file);
          } else if (attachment.url) {
            formData.append(`attachments[${type}][${key}]`, attachment.url);
          } else {
            formData.append(`attachments[${type}][${key}]`, 'null');
          }
          if (attachment.fieldId) {
            formData.append(`attachments[${type}][${key}_id]`, attachment.fieldId);
          }
        }
      });
    };

    Object.entries(updatedStudentData).forEach(([key, value]) => {
      if (key === "profile") {
        if (profilePhoto) {
          if (profilePhoto instanceof File) {
            formData.append("profile", profilePhoto);
          } else if (typeof profilePhoto === 'string' && profilePhoto.startsWith('http')) {
            formData.append("profile", profilePhoto);
          }
        } else {
          formData.append("profile", 'null');
        }
      } else if (key === "fatherInfo") {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subKey === "photo") {
            if (fatherPhoto) {
              if (fatherPhoto instanceof File) {
                formData.append(`fatherInfo[photo]`, fatherPhoto);
              } else if (typeof fatherPhoto === 'string' && fatherPhoto.startsWith('http')) {
                formData.append(`fatherInfo[photo]`, fatherPhoto);
              }
            } else {
              formData.append(`fatherInfo[photo]`, 'null');
            }
          } else if (subKey === "cell1" || subKey === "cell2") {
            if (subValue.value) {
              formData.append(`${key}[${subKey}][value]`, subValue.value);
              formData.append(`${key}[${subKey}][isWhatsApp]`, subValue.isWhatsApp);
            }
          } else if (subValue !== null && subValue !== undefined) {
            formData.append(`fatherInfo[${subKey}]`, typeof subValue === "object" ? JSON.stringify(subValue) : subValue);
          }
        });
      } else if (key === "motherInfo") {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subKey === "photo") {
            if (motherPhoto) {
              if (motherPhoto instanceof File) {
                formData.append(`motherInfo[photo]`, motherPhoto);
              } else if (typeof motherPhoto === 'string' && fatherPhoto.startsWith('http')) {
                formData.append(`motherInfo[photo]`, motherPhoto);
              }
            } else {
              formData.append(`motherInfo[photo]`, 'null');
            }
          } else if (subKey === "cell1" || subKey === "cell2") {
            if (subValue.value) {
              formData.append(`${key}[${subKey}][value]`, subValue.value);
              formData.append(`${key}[${subKey}][isWhatsApp]`, subValue.isWhatsApp);
            }
          } else if (subValue !== null && subValue !== undefined) {
            formData.append(`motherInfo[${subKey}]`, typeof subValue === "object" ? JSON.stringify(subValue) : subValue);
          }
        });
      } else if (key === "attachments") {
        addDynamicAttachments("mandatory");
        addDynamicAttachments("optional");
      } else if (key === "permanentAddress" || key === "residentialAddress") {
        addressFields.forEach((field) => {
          let fieldValue = value[field];
          if (field === "transportRequired") {
            fieldValue = fieldValue || false;
          } else {
            fieldValue = fieldValue.toString();
          }
          formData.append(`${key}[${field}]`, fieldValue);
        });
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === "object" && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    try {
      await dispatch(updateStudents({ data: formData }));
      form.resetFields();
      setStudentData((prev) => ({
        ...prev,
        attachments: { mandatory: {}, optional: {} },
      }));
      toast.success("Student updated successfully!");
    } catch (error) {
      toast.error("Failed to update student.");
    } finally {
      setLoading(false);
      handleUpdateSidebarClose();
    }
  };

  const secondLanguageOptions = (admissionOptions.languageOptions?.secondLanguages || []).map((lang) => ({
    value: lang,
    label: lang,
  }));
  const thirdLanguageOptions = (admissionOptions.languageOptions?.thirdLanguages || []).map((lang) => ({
    value: lang,
    label: lang,
  }));
  const valueEducationOptions = (admissionOptions.valueEducation || []).map((opt) => ({
    value: opt,
    label: opt,
  }));

  const academicYearLabel = academicYears.find((ay) => ay._id === data?.academicYear)?.year || "";

  const transformAttachments = useCallback(() => {
    const mandatory = raw
      .filter((attachment) => attachment.mandatory)
      .map((attachment) => ({
        name: attachment.name,
        mandatory: true,
        key: attachment.name,
        url: studentData.attachments.mandatory[attachment.name]?.url || null,
        fileName: studentData.attachments.mandatory[attachment.name]?.fileName || null,
      }));
    const optional = raw
      .filter((attachment) => !attachment.mandatory)
      .map((attachment) => ({
        name: attachment.name,
        mandatory: false,
        key: attachment.name,
        url: studentData.attachments.optional[attachment.name]?.url || null,
        fileName: studentData.attachments.optional[attachment.name]?.fileName || null,
      }));
    return { mandatory, optional };
  }, [raw, studentData.attachments]);

  const { mandatory, optional } = transformAttachments();

  const renderAttachmentList = useCallback(
    (list, type) =>
      list.map((a) => {
        const attachment = studentData.attachments[type][a.key];
        const fileName = attachment?.fileName || (attachment?.file && attachment.file.name) || 'No file selected';

        return (
          <Col span={24} key={a.key}>
            <Form.Item
              name={["attachments", type, a.key]}
              label={a.name}
              rules={a.mandatory ? [{ required: true, message: `${a.name} is a mandatory document!` }] : []}
            >
              <SingleFileUpload
                name={["attachments", type, a.key]}
                label={a.name}
                type={type}
                onChange={(file) => handleAttachmentChange(type, a.key)(file)}
                onPreview={(file) => {
                  setPreviewFile(file);
                }}
                fileName={fileName}
                fileUrl={attachment?.url}
              />
            </Form.Item>
          </Col>
        );
      }),
    [handleAttachmentChange, studentData.attachments]
  );

  useEffect(() => {
    return () => {
      if (previewFile?.url) {
        URL.revokeObjectURL(previewFile.url);
      }
    };
  }, [previewFile]);

  const validateDate = (rule, value) => {
    if (!value) {
      return Promise.resolve();
    }
    if (dayjs.isDayjs(value) && value.isValid()) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Please select a valid date!"));
  };

  const handleAddressToggle = (checked) => {
    setIsSameAddress(checked);
    if (checked) {
      const residentialAddress = studentData.residentialAddress;
      setStudentData((prev) => ({
        ...prev,
        permanentAddress: { ...residentialAddress },
      }));
      form.setFieldsValue({
        permanentAddress: { ...residentialAddress },
      });
    }
  };

  return (
    <div style={{ padding: "16px", maxHeight: "90vh", overflowY: "auto" }}>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        onValuesChange={(changedValues, allValues) => {
          const newStudentData = { ...studentData, ...allValues };
          if (changedValues.dateOfBirth) {
            newStudentData.age = calculateAge(changedValues.dateOfBirth);
            form.setFieldsValue({ age: newStudentData.age });
          }
          if (changedValues.residentialAddress?.transportRequired !== undefined) {
            newStudentData.permanentAddress.transportRequired = changedValues.residentialAddress.transportRequired;
            form.setFieldsValue({
              permanentAddress: { ...newStudentData.permanentAddress },
            });
          }
          setStudentData(newStudentData);
          if (isSameAddress && changedValues.residentialAddress) {
            setStudentData((prev) => ({
              ...prev,
              permanentAddress: { ...prev.residentialAddress },
            }));
            form.setFieldsValue({
              permanentAddress: { ...newStudentData.residentialAddress },
            });
          }
        }}
      >
        <Card title="Profile and Candidate Information" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label="Profile Photo"
                name="profile"
                rules={[{ required: true, message: "Please upload the profile photo!" }]}
              >
                <ImageUploadCard
                  name="profile"
                  recommendedSize="300x400"
                  width="w-full"
                  height="h-52"
                  required
                  form={form}
                  onChange={(file) => setProfilePhoto(file)}
                  initialValue={data?.profile || null}
                />
              </Form.Item>
              <Form.Item label="Age" name="age">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={18}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: "Please input the first name!" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: "Please input the last name!" }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Date of Birth"
                    name="dateOfBirth"
                    rules={[
                      { required: true, message: "Please select the date of birth!" },
                      { validator: validateDate },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Gender" name="gender" rules={[{ required: true, message: "Please select the gender!" }]}>
                    <Select>
                      {GENDER_OPTIONS.map((option) => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Student ID" name="Q_Id" rules={[{ required: true, message: "Please input the student ID!" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="ID Expiry"
                    name="idExpiry"
                    rules={[
                      { required: true, message: "Please select the ID expiry date!" },
                      { validator: validateDate },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Passport Number" name="passportNumber">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Passport Expiry"
                    name="passportExpiry"
                    rules={[{ validator: validateDate }]}
                  >
                    <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Place of Birth" name="placeOfBirth">
                    <Select allowClear showSearch>
                      {COUNTRY_OPTIONS.map((option) => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Nationality" name="nationality" rules={[{ required: true, message: "Please select the nationality!" }]}>
                    <Select allowClear showSearch>
                      {COUNTRY_OPTIONS.map((option) => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <div>
                    <label style={{ display: "block", marginBottom: 8 }}>Height (cm)</label>
                    <Input value={data?.height || ""} disabled />
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <label style={{ display: "block", marginBottom: 8 }}>Weight (kg)</label>
                    <Input value={data?.weight || ""} disabled />
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <label style={{ display: "block", marginBottom: 8 }}>Blood Group</label>
                    <Input value={data?.bloodGroup || ""} disabled />
                  </div>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Religion" name="religion">
                    <Select allowClear showSearch>
                      {RELIGION_OPTIONS.map((option) => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Native Language" name="nativeLanguage" rules={[{ required: true, message: "Please select the native language!" }]}>
                    <Select allowClear showSearch>
                      {NATIVE_LANGUAGE_OPTIONS.map((option) => (
                        <Option key={option.value} value={option.label}>{option.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please input the email!" }, { type: "email", message: "Please enter a valid email!" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Mobile Number" name="contactNumber" rules={[{ required: true, message: "Please input the mobile number!" }]}>
                    <PhoneInput country="qa" inputStyle={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Emergency Number" name="emergencyNumber" rules={[{ required: true, message: "Please input the emergency number!" }]}>
                    <PhoneInput country="qa" inputStyle={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        <Card title="Academic Session" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <div>
                <label style={{ display: "block", marginBottom: 8 }}>Class</label>
                <Input value={data?.className || ""} disabled />
              </div>
            </Col>
            <Col span={8}>
              <div>
                <label style={{ display: "block", marginBottom: 8 }}>Academic Year</label>
                <Input value={academicYearLabel} disabled />
              </div>
            </Col>
            <Col span={8}>
              <div>
                <label style={{ display: "block", marginBottom: 8 }}>Enrollment Status</label>
                <Input value={data?.enrollmentStatus || ""} disabled />
              </div>
            </Col>
          </Row>
        </Card>

        <Card title="Academic History" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <div>
                <label style={{ display: "block", marginBottom: 8 }}>Previous School Name</label>
                <Input value={data?.academicHistory?.previousSchoolName || ""} disabled />
              </div>
            </Col>
            <Col span={12}>
              <div>
                <label style={{ display: "block", marginBottom: 8 }}>Previous Class</label>
                <Input value={data?.academicHistory?.previousClass || ""} disabled />
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <div>
                <label style={{ display: "block", marginBottom: 8 }}>Curriculum</label>
                <Input value={data?.academicHistory?.curriculum || ""} disabled />
              </div>
            </Col>
            <Col span={8}>
              <div>
                <label style={{ display: "block", marginBottom: 8 }}>Last Day at School</label>
                <Input value={data?.academicHistory?.lastDayAtSchool ? dayjs(data.academicHistory.lastDayAtSchool).format("YYYY-MM-DD") : ""} disabled />
              </div>
            </Col>
            <Col span={8}>
              <div>
                <label style={{ display: "block", marginBottom: 8 }}>Source of Fee</label>
                <Input value={data?.academicHistory?.sourceOfFee || "Parent"} disabled />
              </div>
            </Col>
          </Row>
        </Card>

        <Card title="Languages & Preferences" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Second Language Preference" name="secondLanguage">
                <Select mode="multiple" disabled={admissionLoading}>
                  {secondLanguageOptions.map((option) => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Third Language Preference (Grade 3+)" name="thirdLanguage">
                <Select mode="multiple" disabled={admissionLoading}>
                  {thirdLanguageOptions.map((option) => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Value Education Preference" name="valueEducation">
                <Select mode="multiple" disabled={admissionLoading}>
                  {valueEducationOptions.map((option) => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Left-handed" name="leftHanded">
                <Select>
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <div>
                <label style={{ display: "block", marginBottom: 8 }}>Health Risk</label>
                <Input value={data?.healthRisk || ""} disabled />
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <div className="jodit-editor-wrapper" style={{ zIndex: 1000 }}>
                <EditorComponent
                  assignmentLabel="Medical Condition"
                  hideInput={true}
                  editorContent={medicalConditionContent}
                  inputPlaceHolder="Enter medical condition details"
                  isCreateQuestion={false}
                  readOnly={true}
                />
              </div>
            </Col>
          </Row>
        </Card>

        <Card title="Father Information" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label="Father's Photo"
                name={["fatherInfo", "photo"]}
              >
                <ImageUploadCard
                  name="fatherInfo.photo"
                  recommendedSize="300x400"
                  width="w-full"
                  height="h-52"
                  required
                  form={form}
                  onChange={(file) => setFatherPhoto(file)}
                  initialValue={data?.fatherInfo?.photo || null}
                />
              </Form.Item>
            </Col>
            <Col span={18}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="First Name" name={["fatherInfo", "firstName"]} rules={[{ required: true, message: "Please input the first name!" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Middle Name" name={["fatherInfo", "middleName"]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Last Name" name={["fatherInfo", "lastName"]} rules={[{ required: true, message: "Please input the last name!" }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="ID Number" name={["fatherInfo", "idNumber"]} rules={[{ required: true, message: "Please input the ID number!" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="ID Expiry"
                    name={["fatherInfo", "idExpiry"]}
                    rules={[
                      { required: true, message: "Please select the ID expiry date!" },
                      { validator: validateDate },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Religion" name={["fatherInfo", "religion"]}>
                    <Select>
                      {RELIGION_OPTIONS.map((option) => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Nationality" name={["fatherInfo", "nationality"]}>
                    <Select>
                      {COUNTRY_OPTIONS.map((option) => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Company" name={["fatherInfo", "company"]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Job Title" name={["fatherInfo", "jobTitle"]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Primary Contact" name={["fatherInfo", "cell1", "value"]} rules={[{ required: true, message: "Please input the primary contact number!" }]}>
                    <PhoneInput country="qa" inputStyle={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Secondary Contact" name={["fatherInfo", "cell2", "value"]}>
                    <PhoneInput country="qa" inputStyle={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Email" name={["fatherInfo", "email1"]} rules={[{ required: true, message: "Please input the email address!" }, { type: "email", message: "Please enter a valid email address!" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Email 2" name={["fatherInfo", "email2"]} rules={[{ type: "email", message: "Please enter a valid email address!" }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        <Card title="Mother Information" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label="Mother's Photo"
                name={["motherInfo", "photo"]}
              >
                <ImageUploadCard
                  name="motherInfo.photo"
                  recommendedSize="300x400"
                  width="w-full"
                  height="h-52"
                  required
                  form={form}
                  onChange={(file) => setMotherPhoto(file)}
                  initialValue={data?.motherInfo?.photo || null}
                />
              </Form.Item>
            </Col>
            <Col span={18}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="First Name" name={["motherInfo", "firstName"]} rules={[{ required: true, message: "Please input the first name!" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Middle Name" name={["motherInfo", "middleName"]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Last Name" name={["motherInfo", "lastName"]} rules={[{ required: true, message: "Please input the last name!" }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="ID Number" name={["motherInfo", "idNumber"]} rules={[{ required: true, message: "Please input the ID number!" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="ID Expiry"
                    name={["motherInfo", "idExpiry"]}
                    rules={[
                      { required: true, message: "Please select the ID expiry date!" },
                      { validator: validateDate },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Religion" name={["motherInfo", "religion"]}>
                    <Select>
                      {RELIGION_OPTIONS.map((option) => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Nationality" name={["motherInfo", "nationality"]}>
                    <Select>
                      {COUNTRY_OPTIONS.map((option) => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Company" name={["motherInfo", "company"]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Job Title" name={["motherInfo", "jobTitle"]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Primary Contact" name={["motherInfo", "cell1", "value"]} rules={[{ required: true, message: "Please input the primary contact!" }]}>
                    <PhoneInput country="qa" inputStyle={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Secondary Contact" name={["motherInfo", "cell2", "value"]}>
                    <PhoneInput country="qa" inputStyle={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Email" name={["motherInfo", "email1"]} rules={[{ required: true, message: "Please input the email!" }, { type: "email", message: "Please enter a valid email!" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Email 2" name={["motherInfo", "email2"]} rules={[{ type: "email", message: "Please enter a valid email!" }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        <Card title="Guardian Information" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <div>
                <label style={{ display: "block", marginBottom: 8 }}>Guardian Name</label>
                <Input value={data?.guardianName || ""} disabled />
              </div>
            </Col>
            <Col span={6}>
              <div>
                <label style={{ display: "block", marginBottom: 8 }}>Relation to Student</label>
                <Input value={data?.guardianRelationToStudent || ""} disabled />
              </div>
            </Col>
            <Col span={6}>
              <div>
                <label style={{ display: "block", marginBottom: 8 }}>Guardian Contact</label>
                <PhoneInput country="qa" value={data?.guardianContactNumber || ""} inputStyle={{ width: "100%" }} disabled />
              </div>
            </Col>
            <Col span={6}>
              <div>
                <label style={{ display: "block", marginBottom: 8 }}>Guardian Email</label>
                <Input value={data?.guardianEmail || ""} disabled />
              </div>
            </Col>
          </Row>
        </Card>

        <Card title="Address Information" style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <span style={{ marginRight: 8 }}>Same as Residential Address:</span>
            <Switch
              checked={isSameAddress}
              onChange={handleAddressToggle}
            />
          </div>

          <h3 style={{ fontWeight: "bold", marginBottom: 16 }}>Residential Address</h3>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Transport Required" name={["residentialAddress", "transportRequired"]}>
                <Radio.Group optionType="button" buttonStyle="solid">
                  <Radio.Button value={true}>Yes</Radio.Button>
                  <Radio.Button value={false}>No</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Building Number" name={["residentialAddress", "buildingNumber"]} rules={[{ required: true, message: "Please input the building number!" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Street Name" name={["residentialAddress", "streetName"]} rules={[{ required: true, message: "Please input the street name!" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="City" name={["residentialAddress", "city"]} rules={[{ required: true, message: "Please input the city!" }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="State" name={["residentialAddress", "state"]} rules={[{ required: true, message: "Please input the state!" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Postal Code" name={["residentialAddress", "postalCode"]} rules={[{ required: true, message: "Please input the postal code!" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Country" name={["residentialAddress", "country"]} rules={[{ required: true, message: "Please input the country!" }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {!isSameAddress && (
            <>
              <h3 style={{ fontWeight: "bold", marginTop: 16, marginBottom: 16 }}>Permanent Address</h3>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Building Number" name={["permanentAddress", "buildingNumber"]} rules={[{ required: true, message: "Please input the building number!" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Street Name" name={["permanentAddress", "streetName"]} rules={[{ required: true, message: "Please input the street name!" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="City" name={["permanentAddress", "city"]} rules={[{ required: true, message: "Please input the city!" }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="State" name={["permanentAddress", "state"]} rules={[{ required: true, message: "Please input the state!" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Postal Code" name={["permanentAddress", "postalCode"]} rules={[{ required: true, message: "Please input the postal code!" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Country" name={["permanentAddress", "country"]} rules={[{ required: true, message: "Please input the country!" }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
        </Card>

        <Card title="Attachments" style={{ marginBottom: 16 }}>
          {attachmentsLoading ? (
            <Spin tip="Loading attachments..." />
          ) : (
            <>
              {mandatory.length > 0 && (
                <>
                  <h3 style={{ fontWeight: "bold", marginBottom: 16 }}>Mandatory</h3>
                  {renderAttachmentList(mandatory, "mandatory")}
                </>
              )}
              {optional.length > 0 && (
                <>
                  <h3 style={{ fontWeight: "bold", marginTop: 16, marginBottom: 16 }}>Optional</h3>
                  {renderAttachmentList(optional, "optional")}
                </>
              )}
            </>
          )}
        </Card>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ width: "100%" }}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </Form.Item>
      </Form>

      <Modal
        visible={!!previewFile}
        footer={null}
        onCancel={() => setPreviewFile(null)}
        width="80%"
        style={{ top: 20 }}
      >
        {previewFile && (
          previewFile.type?.startsWith("image/") || (previewFile.url && previewFile.url.match(/\.(jpeg|jpg|gif|png)$/i)) ? (
            <img src={previewFile.url || previewFile.preview} alt="Preview" style={{ width: "100%", height: "auto" }} />
          ) : (
            <iframe src={previewFile.url || previewFile.preview} title="File Preview" style={{ width: "100%", height: "500px", border: "none" }} />
          )
        )}
      </Modal>
    </div>
  );
};

export default UpdateStudent;