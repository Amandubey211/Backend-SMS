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
import { useNavigate } from "react-router-dom";

import CustomUploadCard from "../Components/CustomUploadCard";
import {
  nextStep,
  prevStep,
  registerStudentDetails,
  updateFormData,
} from "../../../../../Store/Slices/Common/User/actions/studentSignupSlice";
import { setYupErrorsToAnt } from "../Utils/yupAntdHelpers";
import { GuardianSchema } from "../Utils/validationSchemas";

const { Option } = Select;

/* ─────────────────────────────── constants ────────────────────────── */
const religionOptions = [
  { label: "Islam", value: "Islam" },
  { label: "Christianity", value: "Christianity" },
  { label: "Hinduism", value: "Hinduism" },
  { label: "Buddhism", value: "Buddhism" },
  { label: "Judaism", value: "Judaism" },
];

const nationalityOptions = [
  { label: "Qatari", value: "qatari" },
  { label: "Egyptian", value: "egyptian" },
  { label: "Indian", value: "indian" },
];

/* ────────────────── reusable Phone + WhatsApp toggle ──────────────── */
const PhoneField = ({
  form,
  name,
  whatsappName,
  label,
  placeholder,
  required = false,
}) => {
  const isWA = Form.useWatch(whatsappName, form) ?? false;
  const errorList = form.getFieldError(name);
  const hasError = errorList.length > 0;
  const borderColor = hasError ? "#ff4d4f" : "#d9d9d9";

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={hasError ? "error" : ""}
      help={hasError ? errorList[0] : undefined}
      className="mb-4"
    >
      <Space.Compact
        block
        style={{
          border: `1px solid ${borderColor}`,
          borderRadius: 6,
          height: 40,
        }}
      >
        <Form.Item
          name={name}
          noStyle
          valuePropName="value"
          trigger="onChange"
          getValueFromEvent={(val) => val}
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
            className={`flex items-center justify-center w-12 cursor-pointer transition-all ${
              isWA ? "bg-[#25D366]" : "bg-gray-100"
            }`}
            style={{
              borderLeft: `1px solid ${borderColor}`,
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

/* ─────────────────────────── component ────────────────────────────── */
const GuardianInfo = ({ formData }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { isLoading, formData: completeFormData } = useSelector(
    (s) => s.common.studentSignup
  );

  /* refs */
  const containerRef = useRef(null);
  const firstInputRef = useRef(null);
  const motherSectionRef = useRef(null);
  const guardianSectionRef = useRef(null);

  /* state */
  const [activeTab, setActiveTab] = useState("father");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ── hydrate draft data on mount ── */
  useEffect(() => {
    if (!formData) return;

    const sanitized = JSON.parse(JSON.stringify(formData));
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
        if (!curr[parts[i]]) curr[parts[i]] = {};
        curr = curr[parts[i]];
      }
      const leaf = parts.pop();
      if (curr[leaf] !== undefined && curr[leaf] !== null)
        curr[leaf] = curr[leaf].toString();
    });

    form.setFieldsValue(sanitized);
  }, [formData, form]);

  /* ── scroll to appropriate section on tab change ── */
  useEffect(() => {
    if (activeTab === "mother" && motherSectionRef.current) {
      motherSectionRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (activeTab === "guardian" && guardianSectionRef.current) {
      guardianSectionRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      smoothToTop();
    }

    setTimeout(() => {
      firstInputRef.current?.focus({ cursor: "start" });
    }, 300);
  }, [activeTab]);

  /* ── helpers ── */
  const smoothToTop = () =>
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  /* ── keep Redux draft in sync ── */
  const handleValuesChange = () =>
    dispatch(updateFormData({ guardian: form.getFieldsValue(true) }));

  /* ───────────────────── helper render fns ────────────────────────── */
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
              size="large"
              className="w-full"
              placeholder="ID Expiry"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name={[p, "religion"]} label="Religion" className="mb-4">
            <Select size="large" placeholder="Select Religion">
              {religionOptions.map((o) => (
                <Option key={o.value} value={o.value}>
                  {o.label}
                </Option>
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
              {nationalityOptions.map((o) => (
                <Option key={o.value} value={o.value}>
                  {o.label}
                </Option>
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

  /* ───────────────────── specific section UIs ─────────────────────── */
  const renderFatherInfo = () => (
    <>
      <Divider orientation="left" dashed>
        Father Information
      </Divider>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="md:w-[35%]">
          <CustomUploadCard
            name="fatherPhoto"
            label="Father Photo"
            form={form}
            recommendedSize="300x400"
            width="w-full"
            height="h-40"
            aspectRatio="aspect-square"
          />
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
          <CustomUploadCard
            name="motherPhoto"
            label="Mother Photo"
            form={form}
            recommendedSize="400x500"
            width="w-full"
            height="h-40"
            aspectRatio="aspect-square"
          />
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

  /* ───────────────────────── navigation ───────────────────────────── */
  const gradient = "linear-gradient(90deg,#C83B62 0%,#7F35CD 100%)";
  const darkerGradient = "linear-gradient(90deg,#A02D53 0%,#6A28A4 100%)";

  const prepareFormData = () => {
    const formValues = form.getFieldsValue(true);
    const formData = new FormData();

    // Add all form data from all steps (from Redux store)
    Object.entries(completeFormData).forEach(([section, data]) => {
      if (typeof data === "object" && data !== null) {
        formData.append(section, JSON.stringify(data));
      } else {
        formData.append(section, data);
      }
    });

    // Handle file uploads
    if (formValues.fatherPhoto?.file) {
      formData.append("fatherPhoto", formValues.fatherPhoto.file);
    }
    if (formValues.motherPhoto?.file) {
      formData.append("motherPhoto", formValues.motherPhoto.file);
    }

    return formData;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = prepareFormData();

      // Dispatch the registration thunk
      await dispatch(
        registerStudentDetails({
          formData,
          navigate,
        })
      ).unwrap();

      // Only proceed to next step if submission was successful
      dispatch(nextStep());
    } catch (error) {
      message.error("Failed to save guardian information");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    try {
      // Validate current tab fields
      await form.validateFields();

      // Update Redux store with current form data
      const currentFormData = form.getFieldsValue(true);
      dispatch(updateFormData({ guardian: currentFormData }));

      // Determine next action based on current tab
      if (activeTab === "father") {
        setActiveTab("mother");
        return;
      }
      if (activeTab === "mother") {
        setActiveTab("guardian");
        return;
      }

      // On final tab, validate all guardian data
      await GuardianSchema.validate(currentFormData, {
        abortEarly: false,
      });

      // Submit the form when all guardian info is complete
      await handleSubmit();
    } catch (err) {
      setYupErrorsToAnt(form, err);
      const first =
        err?.errorFields?.[0]?.name || err?.inner?.[0]?.path?.split(".");
      if (first)
        form.scrollToField(first, { behavior: "smooth", block: "center" });
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

  /* ───────────────────────────── render ───────────────────────────── */
  return (
    <div className="flex flex-col h-full">
      {/* sticky segmented control */}
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
                  loading={isLoading || isSubmitting}
                  className="!border-none !text-white font-semibold rounded-md px-6 py-2 transition-all duration-200 ease-in-out"
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
