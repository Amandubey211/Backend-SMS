// src/pages/StudentSignUp/Steps/GuardianInfo.jsx
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Row,
  Col,
  Divider,
  Segmented,
  Tooltip,
  Space,
  message,
} from "antd";
import { TeamOutlined } from "@ant-design/icons";
import { LiaMaleSolid, LiaFemaleSolid } from "react-icons/lia";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CustomUploadCard from "../Components/CustomUploadCard";
import {
  nextStep,
  prevStep,
  updateFormData,
} from "../../../../../Store/Slices/Common/User/actions/studentSignupSlice";
import { setYupErrorsToAnt } from "../Utils/yupAntdHelpers";
import { GuardianSchema } from "../Utils/validationSchemas";
import {
  COUNTRY_OPTIONS,
  LANGUAGE_OPTIONS,
  RELIGION_OPTIONS,
} from "../../../../Admin/Addmission/AdminAdmission/Configs/selectOptionsConfig";

const { Option } = Select;

/* ─── static options ─── */

/* ─── phone + WhatsApp toggle ─── */
const PhoneField = ({
  form,
  name,
  whatsappName,
  label,
  placeholder,
  required,
}) => {
  const isWA = Form.useWatch(whatsappName, form) ?? false;
  const hasError = form.getFieldError(name).length > 0;
  const borderCol = hasError ? "#ff4d4f" : "#d9d9d9";

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={hasError ? "error" : ""}
      help={hasError ? form.getFieldError(name)[0] : undefined}
      className="mb-4"
    >
      <Space.Compact
        block
        style={{
          border: `1px solid ${borderCol}`,
          borderRadius: 6,
          height: 40,
        }}
      >
        <Form.Item
          name={name}
          noStyle
          valuePropName="value"
          trigger="onChange"
          rules={
            required
              ? [{ required: true, message: "Phone number is required" }]
              : []
          }
        >
          <PhoneInput
            country="qa"
            placeholder={placeholder}
            inputStyle={{
              width: "100%",
              height: "100%",
              fontSize: 16,
              border: "none",
              borderRadius: "6px 0 0 6px",
            }}
            containerStyle={{ width: "100%" }}
          />
        </Form.Item>
        <Tooltip title={isWA ? "WhatsApp enabled" : "Click to enable WhatsApp"}>
          <div
            onClick={() => form.setFieldValue(whatsappName, !isWA)}
            className={`flex items-center justify-center w-12 cursor-pointer
                        ${isWA ? "bg-[#25D366]" : "bg-gray-100"}`}
            style={{
              borderLeft: `1px solid ${borderCol}`,
              borderRadius: "0 6px 6px 0",
              height: "100%",
            }}
          >
            <FaWhatsapp
              className={`text-xl ${isWA ? "text-white" : "text-[#075E54]"}`}
            />
          </div>
        </Tooltip>
      </Space.Compact>
    </Form.Item>
  );
};

/* ─── main component ─── */
const GuardianInfo = ({ formData }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { isCheckingStudent } = useSelector((s) => s.common.studentSignup);

  const containerRef = useRef(null);
  const firstInputRef = useRef(null);
  const motherSectionRef = useRef(null);
  const guardianSectionRef = useRef(null);

  const [activeTab, setActiveTab] = useState("father");

  /* Hydrate form with initial data */
  useEffect(() => {
    if (!formData) return;

    // Create a deep copy and handle file objects properly
    const sanitized = JSON.parse(JSON.stringify(formData));

    // Convert phone numbers to strings
    [
      "fatherInfo.cell1",
      "fatherInfo.cell2",
      "motherInfo.cell1",
      "motherInfo.cell2",
      "guardianInformation.guardianContactNumber",
    ].forEach((path) => {
      const parts = path.split(".");
      let curr = sanitized;
      for (let i = 0; i < parts.length - 1; i++) {
        curr = curr[parts[i]] ||= {};
      }
      const leaf = parts.pop();
      if (curr[leaf] !== undefined && curr[leaf] !== null) {
        curr[leaf] = curr[leaf].toString();
      }
    });

    form.setFieldsValue(sanitized);
  }, [formData, form]);
  /* auto scroll on tab change */
  useEffect(() => {
    if (activeTab === "mother")
      motherSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    else if (activeTab === "guardian")
      guardianSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    else smoothToTop();

    setTimeout(() => firstInputRef.current?.focus({ cursor: "start" }), 300);
  }, [activeTab]);

  const smoothToTop = () =>
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  const handleValuesChange = () =>
    dispatch(updateFormData({ guardian: form.getFieldsValue(true) }));

  /* ------------- reusable render helpers ------------- */
  const renderNameFields = (p) => (
    <>
      <Form.Item
        name={[p, "firstName"]}
        rules={[{ required: true, message: "Required" }]}
        className="mb-4"
      >
        <Input
          size="large"
          placeholder="First Name"
          ref={
            p === "fatherInfo" && activeTab === "father" ? firstInputRef : null
          }
        />
      </Form.Item>
      <Form.Item
        name={[p, "lastName"]}
        rules={[{ required: true, message: "Required" }]}
        className="mb-4"
      >
        <Input size="large" placeholder="Last Name" />
      </Form.Item>
      <Form.Item name={[p, "middleName"]} className="mb-4">
        <Input size="large" placeholder="Middle Name" />
      </Form.Item>
    </>
  );

  const renderIdAndPersonalInfo = (p) => (
    <>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name={[p, "idNumber"]} label="ID #" className="mb-4">
            <Input size="large" placeholder="ID Number" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name={[p, "idExpiry"]} label="ID Expiry" className="mb-4">
            <DatePicker
              disabled
              size="large"
              className="w-full"
              placeholder="ID Expiry"
              format="DD/MM/YYYY"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name={[p, "religion"]} label="Religion" className="mb-4">
            <Select size="large" placeholder="Select Religion">
              {RELIGION_OPTIONS.map((o) => (
                <Option key={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name={[p, "nationality"]}
            label="Nationality"
            className="mb-4"
          >
            <Select size="large" placeholder="Select Nationality">
              {COUNTRY_OPTIONS.map((o) => (
                <Option key={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </>
  );

  const renderContactInfo = (p) => (
    <>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name={[p, "company"]} label="Company" className="mb-4">
            <Input size="large" placeholder="Company Name" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name={[p, "jobTitle"]} label="Job Title" className="mb-4">
            <Input size="large" placeholder="Job Title" />
          </Form.Item>
        </Col>
      </Row>

      <PhoneField
        form={form}
        name={[p, "cell1"]}
        whatsappName={[p, "cell1IsWhatsapp"]}
        label="Cell Phone 1"
        placeholder="e.g. +974 1234 5678"
        required
      />
      <PhoneField
        form={form}
        name={[p, "cell2"]}
        whatsappName={[p, "cell2IsWhatsapp"]}
        label="Cell Phone 2"
        placeholder="e.g. +974 1234 5679"
      />

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name={[p, "email1"]}
            label="Email 1"
            rules={[{ type: "email", message: "Invalid email" }]}
            className="mb-4"
          >
            <Input size="large" placeholder="primary@email.com" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name={[p, "email2"]}
            label="Email 2"
            rules={[{ type: "email", message: "Invalid email" }]}
            className="mb-4"
          >
            <Input size="large" placeholder="secondary@email.com" />
          </Form.Item>
        </Col>
      </Row>
    </>
  );

  /* ------------- section renderers ------------- */
  const renderFatherInfo = () => (
    <>
      <Divider orientation="left" dashed>
        Father Information
      </Divider>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="md:w-[35%]">
          <Form.Item name={["fatherInfo", "photo"]} noStyle>
            <CustomUploadCard
              name={["fatherInfo", "photo"]}
              label="Father Photo"
              form={form}
              recommendedSize="300x400"
              width="w-full"
              height="h-40"
              aspectRatio="aspect-square"
              enableCrop={false}
            />
          </Form.Item>
        </div>
        <div className="md:w-[65%]">{renderNameFields("fatherInfo")}</div>
      </div>
      {renderIdAndPersonalInfo("fatherInfo")}
      {renderContactInfo("fatherInfo")}
    </>
  );

  const renderMotherInfo = () => (
    <div ref={motherSectionRef}>
      <Divider orientation="left" dashed>
        Mother Information
      </Divider>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="md:w-[35%]">
          <Form.Item name={["motherInfo", "photo"]} noStyle>
            <CustomUploadCard
              name={["motherInfo", "photo"]}
              label="Mother Photo"
              form={form}
              recommendedSize="400x500"
              width="w-full"
              height="h-40"
              aspectRatio="aspect-square"
              enableCrop={false}
            />
          </Form.Item>
        </div>
        <div className="md:w-[65%]">{renderNameFields("motherInfo")}</div>
      </div>
      {renderIdAndPersonalInfo("motherInfo")}
      {renderContactInfo("motherInfo")}
    </div>
  );

  const renderGuardianInfo = () => (
    <div ref={guardianSectionRef}>
      <Divider orientation="left" dashed>
        Guardian Information
      </Divider>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name={["guardianInformation", "guardianName"]}
            label="Guardian Name"
            rules={[{ required: true, message: "Required" }]}
            className="mb-4"
          >
            <Input
              size="large"
              placeholder="Guardian Name"
              ref={activeTab === "guardian" ? firstInputRef : null}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name={["guardianInformation", "guardianRelationToStudent"]}
            label="Relation to Student"
            rules={[{ required: true, message: "Required" }]}
            className="mb-4"
          >
            <Input size="large" placeholder="Relation to Student" />
          </Form.Item>
        </Col>
      </Row>

      <PhoneField
        form={form}
        name={["guardianInformation", "guardianContactNumber"]}
        whatsappName={["guardianInformation", "guardianContactIsWhatsapp"]}
        label="Contact Number"
        placeholder="e.g. +974 1234 5678"
        required
      />

      <Form.Item
        name={["guardianInformation", "guardianEmail"]}
        label="Guardian Email"
        rules={[{ type: "email", message: "Invalid email" }]}
        className="mb-4"
      >
        <Input size="large" placeholder="Guardian Email" />
      </Form.Item>
    </div>
  );

  /* ------------- navigation handlers ------------- */
  const gradient = "linear-gradient(90deg,#C83B62 0%,#7F35CD 100%)";
  const darkerGradient = "linear-gradient(90deg,#A02D53 0%,#6A28A4 100%)";

  const handleNext = async () => {
    try {
      // First validate all fields
      await form.validateFields();

      // Get current form values including files
      const formValues = form.getFieldsValue(true);

      // Update Redux store with current data
      dispatch(updateFormData({ guardian: formValues }));

      // Handle tab navigation
      if (activeTab === "father") {
        setActiveTab("mother");
        return;
      }
      if (activeTab === "mother") {
        setActiveTab("guardian");
        return;
      }

      // Final validation before submission
      await GuardianSchema.validate(formValues, { abortEarly: false });

      // Proceed to next step
      dispatch(nextStep());
    } catch (err) {
      setYupErrorsToAnt(form, err);
      const firstError =
        err?.errorFields?.[0]?.name || err?.inner?.[0]?.path?.split(".");
      if (firstError) {
        form.scrollToField(firstError, { behavior: "smooth", block: "center" });
      }
    } finally {
      smoothToTop();
    }
  };

  const handleBack = () => {
    if (activeTab === "guardian") setActiveTab("mother");
    else if (activeTab === "mother") setActiveTab("father");
    else dispatch(prevStep());
    smoothToTop();
  };

  /* ------------- render ------------- */
  return (
    <div className="flex flex-col h-full">
      {/* segmented control */}
      <div className="sticky top-0 z-20 pt-1 pb-2 bg-white shadow-sm">
        <Segmented
          size="large"
          value={activeTab}
          onChange={(val) => {
            setActiveTab(val);
            smoothToTop();
          }}
          options={[
            {
              value: "father",
              label: (
                <span className="flex items-center">
                  <LiaMaleSolid className="mr-2" /> Father
                </span>
              ),
            },
            {
              value: "mother",
              label: (
                <span className="flex items-center">
                  <LiaFemaleSolid className="mr-2" /> Mother
                </span>
              ),
            },
            {
              value: "guardian",
              label: (
                <span className="flex items-center">
                  <TeamOutlined className="mr-2" /> Guardian
                </span>
              ),
            },
          ]}
          style={{ width: "100%" }}
        />
      </div>

      {/* form body */}
      <div ref={containerRef} className="flex-1 overflow-y-auto px-4">
        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleValuesChange}
          className="max-w-4xl mx-auto py-2"
        >
          {activeTab === "father" && renderFatherInfo()}
          {activeTab === "mother" && renderMotherInfo()}
          {activeTab === "guardian" && renderGuardianInfo()}

          <Row justify="space-between" className="mt-6 pb-4">
            {/* Back */}
            <Col>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="large"
                  onClick={handleBack}
                  style={{
                    border: "2px solid transparent",
                    backgroundOrigin: "border-box",
                    backgroundImage: `${gradient},padding-box`,
                    color: "#C83B62",
                  }}
                  className="font-semibold bg-white"
                >
                  Back
                </Button>
              </motion.div>
            </Col>

            {/* Next / Submit */}
            <Col>
              <motion.div
                initial={{ scale: 1, y: 0 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Button
                  htmlType="button"
                  onClick={handleNext}
                  type="primary"
                  size="large"
                  loading={isCheckingStudent}
                  className="!border-none !text-white font-semibold rounded-md px-6 py-2
                             transition-all duration-200 ease-in-out"
                  style={{ backgroundImage: gradient }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundImage = darkerGradient)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundImage = gradient)
                  }
                >
                  {activeTab === "father"
                    ? "Mother Info"
                    : activeTab === "mother"
                    ? "Guardian Info"
                    : "Save & Continue"}
                </Button>
              </motion.div>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default GuardianInfo;
