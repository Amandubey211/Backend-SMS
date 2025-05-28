import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Space,
  Tooltip,
  Row,
  Col,
  Divider,
  InputNumber,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  IdcardOutlined,
  GlobalOutlined,
  MailOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";

import CustomUploadCard from "../Components/CustomUploadCard";
import {
  nextStep,
  prevStep,
  updateFormData,
} from "../../../../../Store/Slices/Common/User/actions/studentSignupSlice";
import { CandidateSchema } from "../Utils/validationSchemas";
import { setYupErrorsToAnt } from "../Utils/yupAntdHelpers";
import {
  COUNTRY_OPTIONS,
  NATIVE_LANGUAGE_OPTIONS,
  RELIGION_OPTIONS,
} from "../../../../Admin/Addmission/AdminAdmission/Configs/selectOptionsConfig";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaWhatsapp } from "react-icons/fa";

const { Option } = Select;

const PhoneField = ({
  form,
  name,
  whatsappName,
  label,
  placeholder,
  required,
}) => {
  const value = Form.useWatch(name, form);
  const [isWA, setIsWA] = React.useState(
    form.getFieldValue(whatsappName) || false
  );

  const handleWhatsappToggle = () => {
    const currentIsWA = form.getFieldValue(whatsappName) || false;
    const newValue = !currentIsWA;
    // console.log('Before toggle:', { whatsappName, currentIsWA, newValue });

    form.setFieldsValue({
      [whatsappName]: newValue,
    });

    setIsWA(newValue);

    // console.log('After toggle:', { whatsappName, updatedIsWA: form.getFieldValue(whatsappName) });
  };

  return (
    <Form.Item
      name={name}
      label={label}
      rules={required ? [{ required: true, message: "Required" }] : []}
      className="mb-4"
    >
      <Space.Compact block>
        <PhoneInput
          country="qa"
          placeholder={placeholder}
          inputStyle={{
            width: "100%",
            height: 40,
            fontSize: 16,
            border: "1px solid #d9d9d9",
            borderRight: "none",
            borderRadius: 0,
          }}
          containerStyle={{ width: "100%" }}
          value={value || ""}
          onChange={(value) => {
            form.setFieldsValue({ [name]: value });
          }}
          buttonStyle={{
            border: "1px solid #d9d9d9",
            borderRadius: "0",
            background: "transparent",
            padding: "0 10px",
            width: "50px",
          }}
          enableSearch={true}
          countryCodeEditable={false}
        />
        <div
          className={`flex items-center border border-l-0 rounded-r px-3 ${
            isWA ? "bg-[#dcf8c6]" : "bg-white"
          }`}
        >
          <Tooltip title="Mark this number as WhatsApp">
            <div className="cursor-pointer" onClick={handleWhatsappToggle}>
              <FaWhatsapp className="text-[#075E54] text-xl" />
            </div>
          </Tooltip>
        </div>
      </Space.Compact>
    </Form.Item>
  );
};

const CandidateInfo = ({ formData }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [profileImage, setProfileImage] = useState(formData?.profile || null);

  // console.log("formData.profile:", formData?.profile);
  // console.log("profileImage:", profileImage);

  useEffect(() => {
    if (!formData) return;

    const initialValues = {
      ...formData,
      dob: formData.dob ? dayjs(formData.dob) : undefined,
      idExpiry: formData.idExpiry ? dayjs(formData.idExpiry) : undefined,
      passportExpiry: formData.passportExpiry
        ? dayjs(formData.passportExpiry)
        : undefined,
      phoneNumberIsWhatsapp: formData.phoneNumberIsWhatsapp || false,
      emergencyNumberIsWhatsapp: formData.emergencyNumberIsWhatsapp || false,
      profile: formData.profile || undefined,
    };

    if (formData.dob) {
      initialValues.age = dayjs().diff(dayjs(formData.dob), "year");
    }

    // Sync profileImage with formData.profile
    setProfileImage(formData.profile || null);

    // console.log("Setting initial values:", initialValues);
    form.setFieldsValue(initialValues);
  }, [formData, form]);

  const handleDobChange = (d) => {
    form.setFieldValue("dob", d);
    if (d && d.isValid()) {
      const today = dayjs();
      const birthDate = dayjs(d);
      let age = today.year() - birthDate.year();
      const m = today.month() - birthDate.month();
      if (m < 0 || (m === 0 && today.date() < birthDate.date())) {
        age--;
      }
      form.setFieldValue("age", age);
    } else {
      form.setFieldValue("age", "");
    }
  };

  const handleValuesChange = () => {
    const raw = form.getFieldsValue(true);
    setProfileImage(raw.profile || null);
    dispatch(
      updateFormData({
        candidate: {
          ...raw,
          profile: raw.profile,
          dob: raw.dob ? raw.dob.format("YYYY-MM-DD") : null,
          idExpiry: raw.idExpiry ? raw.idExpiry.format("YYYY-MM-DD") : null,
          passportExpiry: raw.passportExpiry
            ? raw.passportExpiry.format("YYYY-MM-DD")
            : null,
        },
      })
    );
  };

  const validateAge = (_, value) => {
    if (value < 3) return Promise.reject("Age must be at least 3");
    if (value > 100) return Promise.reject("Age must be less than 100");
    return Promise.resolve();
  };

  const goNext = async () => {
    try {
      const vals = form.getFieldsValue(true);
      await CandidateSchema.validate(vals, { abortEarly: false });

      const formDataToSubmit = new FormData();
      if (vals.profile instanceof File) {
        formDataToSubmit.append("profile", vals.profile);
      } else if (typeof vals.profile === "string") {
        formDataToSubmit.append("profile", vals.profile);
      }

      Object.entries(vals).forEach(([key, value]) => {
        if (key !== "profile" && value !== null && value !== undefined) {
          formDataToSubmit.append(
            key,
            typeof value === "object" ? JSON.stringify(value) : value
          );
        }
      });

      await CandidateSchema.validate(vals, { abortEarly: false });
      handleValuesChange();
      dispatch(nextStep());
    } catch (err) {
      setYupErrorsToAnt(form, err);
      const firstErrorField = err?.inner?.[0]?.path;

      if (firstErrorField) {
        if (firstErrorField === "profile") {
          document.querySelector(".upload-card-container")?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        } else {
          form.scrollToField(firstErrorField, {
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }
  };

  const goBack = () => dispatch(prevStep());

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        className="space-y-4"
      >
        <div className="flex flex-col md:flex-row gap-4 upload-card-container">
          <div className="md:w-[40%]">
            <Form.Item
              name="profile"
              rules={[
                { required: true, message: "Candidate photo is required" },
              ]}
              valuePropName="file"
            >
              <CustomUploadCard
                name="profile"
                label="Candidate Photo"
                form={form}
                recommendedSize="300x400"
                width="w-full"
                height="h-48"
                aspectRatio={1}
                required
                profilelink={profileImage}
                onRemove={() => {
                  form.setFieldsValue({ profile: undefined });
                  setProfileImage(null);
                  handleValuesChange();
                }}
              />
            </Form.Item>
          </div>
          <div className="md:w-[60%] grid gap-3">
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input
                size="large"
                placeholder="First Name"
                prefix={<UserOutlined />}
              />
            </Form.Item>
            <Form.Item
              name="middleName"
              // rules={[{ required: true, message: "Required" }]}
            >
              <Input
                size="large"
                placeholder="Middle Name"
                prefix={<UserOutlined />}
              />
            </Form.Item>
            <Form.Item
              name="lastName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input
                size="large"
                placeholder="Last Name"
                prefix={<UserOutlined />}
              />
            </Form.Item>
          </div>
        </div>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="dob"
              label="Date of Birth"
              rules={[
                {
                  required: true,
                  message: "Date of birth is required",
                  type: "object",
                },
              ]}
            >
              <DatePicker
                size="large"
                className="w-full"
                suffixIcon={<CalendarOutlined />}
                onChange={handleDobChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="age"
              label="Age"
              rules={[{ validator: validateAge }]}
            >
              <Input size="large" disabled readOnly suffix="years" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="Q_Id"
              label="Student QID"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input size="large" prefix={<IdcardOutlined />} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="idExpiry" label="QID Expiry">
              <DatePicker
                size="large"
                className="w-full"
                suffixIcon={<CalendarOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="bloodGroup" label="Blood Group">
              <Select size="large" placeholder="Blood Group">
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
                  <Option key={b}>{b}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select size="large" placeholder="Gender">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="height" label="Height (cm)">
              <InputNumber
                size="large"
                className="w-full"
                min={50}
                max={250}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="weight" label="Weight (kg)">
              <InputNumber
                size="large"
                className="w-full"
                min={5}
                max={200}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="passportNumber" label="Passport #">
              <Input size="large" prefix={<IdcardOutlined />} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="passportExpiry" label="Passport Expiry">
              <DatePicker
                size="large"
                className="w-full"
                suffixIcon={<CalendarOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="placeOfBirth"
              label="Place of Birth"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input size="large" prefix={<GlobalOutlined />} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="nationality"
              label="Nationality"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                size="large"
                placeholder="Nationality"
                allowClear
                showSearch
              >
                {COUNTRY_OPTIONS.map((n) => (
                  <Option key={n.value}>{n.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="religion"
              label="Religion"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select size="large" placeholder="Religion" allowClear showSearch>
                {RELIGION_OPTIONS.map((r) => (
                  <Option key={r.value}>{r.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="nativeLanguage"
              label="Native Language"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                size="large"
                placeholder="Native Language"
                allowClear
                showSearch
              >
                {NATIVE_LANGUAGE_OPTIONS.map((nl) => (
                  <Option key={nl.value}>{nl.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: "email", required: true, message: "Invalid email" }]}
        >
          <Input
            size="large"
            prefix={<MailOutlined />}
            placeholder="student@studentdiwan.com"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <PhoneField
              form={form}
              name="contactNumber"
              whatsappName="phoneNumberIsWhatsapp"
              label="Phone"
              placeholder="e.g. +974 1234 5678"
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <PhoneField
              form={form}
              name="emergencyNumber"
              whatsappName="emergencyNumberIsWhatsapp"
              label="Emergency Number"
              placeholder="e.g. +974 1234 5678"
              required
            />
          </Col>
        </Row>

        <Divider className="my-2" />

        {/* <Form.Item
          name="primaryContact"
          label="Primary Contact"
          // rules={[{ required: true, message: "Required" }]}
        >
          <Select size="large" placeholder="Select">
            <Option value="father">Father</Option>
            <Option value="mother">Mother</Option>
            <Option value="guardian">Guardian</Option>
          </Select>
        </Form.Item> */}

        <Row justify="space-between" className="mt-8">
          <Button icon={<ArrowLeftOutlined />} onClick={goBack}>
            Back
          </Button>
          <Button
            type="primary"
            className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD]"
            onClick={goNext}
          >
            Next
          </Button>
        </Row>
      </Form>
    </div>
  );
};

export default CandidateInfo;