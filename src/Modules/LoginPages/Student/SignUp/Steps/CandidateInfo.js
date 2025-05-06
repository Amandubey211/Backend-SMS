import React, { useEffect } from "react";
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
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  IdcardOutlined,
  GlobalOutlined,
  MailOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaWhatsapp } from "react-icons/fa";
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

const { Option } = Select;
/* ☎️ reusable ------------------------------------------------------ */
const PhoneField = ({
  form,
  name,
  whatsappName,
  label,
  placeholder,
  required,
}) => {
  const value = Form.useWatch(name, form);
  const isWA = Form.useWatch(whatsappName, form);

  // Convert value to string and ensure it's not undefined
  const phoneValue = value ? value.toString() : "";

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
          value={phoneValue}
          onChange={(value, country, e, formattedValue) => {
            // Update the form value directly
            form.setFieldValue(name, value);
          }}
        />
        <div
          className={`flex items-center border border-l-0 rounded-r px-3 ${
            isWA ? "bg-[#dcf8c6]" : "bg-white"
          }`}
        >
          <Tooltip title="Mark this number as WhatsApp">
            <div
              className="cursor-pointer"
              onClick={() =>
                form.setFieldValue(whatsappName, !isWA, false /* no trigger*/)
              }
            >
              <FaWhatsapp className="text-[#075E54] text-xl" />
            </div>
          </Tooltip>
        </div>
      </Space.Compact>
    </Form.Item>
  );
};

/* 📄 main component ------------------------------------------------ */
const CandidateInfo = ({ formData }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  /* hydrate draft (convert dates back to dayjs) */
  useEffect(() => {
    if (!formData) return;
    form.setFieldsValue({
      ...formData,
      dob: formData.dob ? dayjs(formData.dob) : undefined,
      idExpiry: formData.idExpiry ? dayjs(formData.idExpiry) : undefined,
      passportExpiry: formData.passportExpiry
        ? dayjs(formData.passportExpiry)
        : undefined,
    });
  }, [formData]);

  /* auto‑age calc */
  const handleDobChange = (d) => {
    form.setFieldValue("dob", d);
    if (d) {
      const yrs = dayjs().diff(d, "year");
      form.setFieldValue("age", yrs);
    } else {
      form.setFieldValue("age", "");
    }
  };

  /* persist every keystroke */
  const handleValuesChange = () => {
    const raw = form.getFieldsValue(true);
    dispatch(
      updateFormData({
        candidate: {
          ...raw,
          dob: raw.dob ? raw.dob.format("YYYY-MM-DD") : null,
          idExpiry: raw.idExpiry ? raw.idExpiry.format("YYYY-MM-DD") : null,
          passportExpiry: raw.passportExpiry
            ? raw.passportExpiry.format("YYYY-MM-DD")
            : null,
        },
      })
    );
  };

  /* navigation */
  const goNext = async () => {
    try {
      const vals = form.getFieldsValue(true);
      await CandidateSchema.validate(vals, { abortEarly: false });
      handleValuesChange(); // ensure latest snapshot
      dispatch(nextStep());
    } catch (err) {
      setYupErrorsToAnt(form, err);
      const first = err?.inner?.[0]?.path?.split(".");
      if (first)
        form.scrollToField(first, { behavior: "smooth", block: "center" });
    }
  };

  const goBack = () => dispatch(prevStep());

  /* 🖼️ UI ---------------------------------------------------------- */
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        className="space-y-4"
      >
        {/* 📸 + names */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-[40%]">
            <CustomUploadCard
              name="candidatePicture"
              label="Candidate Photo"
              form={form}
              recommendedSize="300x400"
              width="w-full"
              height="h-48"
              aspectRatio="aspect-square"
            />
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
            <Form.Item name="middleName">
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

        {/* dob + age */}
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
            <Form.Item name="age" label="Age">
              <Input size="large" disabled readOnly />
            </Form.Item>
          </Col>
        </Row>

        {/* Student‑ID / expiry */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="studentId" label="Student ID">
              <Input size="large" prefix={<IdcardOutlined />} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="idExpiry" label="ID Expiry">
              <DatePicker
                size="large"
                className="w-full"
                suffixIcon={<CalendarOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Blood + gender */}
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

        {/* Passport */}
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

        {/* place / nationality */}
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

        {/* religion / native‑lang */}
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

        {/* email */}
        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: "email", message: "Invalid email" }]}
        >
          <Input size="large" prefix={<MailOutlined />} />
        </Form.Item>

        {/* phone / emergency */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <PhoneField
              form={form}
              name="phoneNumber"
              whatsappName="phoneNumberIsWhatsapp"
              label="Phone"
              placeholder="e.g. +974 1234 5678"
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="emergencyNumber" label="Emergency Number">
              <Input size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Divider className="my-2" />

        {/* primary contact */}
        <Form.Item
          name="primaryContact"
          label="Primary Contact"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select size="large" placeholder="Select">
            <Option value="father">Father</Option>
            <Option value="mother">Mother</Option>
            <Option value="guardian">Guardian</Option>
          </Select>
        </Form.Item>

        {/* nav buttons */}
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
