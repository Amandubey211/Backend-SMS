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
  Alert,
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
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

const { Option } = Select;
/* ---- helper so nested paths aren’t clobbered ---- */
const setNested = (form, pathArr, value) => {
  if (!Array.isArray(pathArr)) {
    form.setFieldsValue({ [pathArr]: value });
    return;
  }
  const [parent, child] = pathArr; // 2-level deep only
  form.setFieldsValue({
    [parent]: { ...form.getFieldValue(parent), [child]: value },
  });
};

/* ---- reusable phone field (fixed) ---- */
const PhoneField = ({
  form,
  name, // ➜ e.g. ['fatherInfo','cell1']
  whatsappName, // ➜ e.g. ['fatherInfo','cell1IsWhatsapp']
  label,
  placeholder,
  required = false,
}) => {
  const hasError = form.getFieldError(name).length > 0;
  const borderCol = hasError ? "#ff4d4f" : "#d9d9d9";

  /* sync local ↔ form every time form resets */
  const [value, setValue] = useState(form.getFieldValue(name) || "");
  const [isWA, setIsWA] = useState(!!form.getFieldValue(whatsappName));

  useEffect(() => {
    setValue(form.getFieldValue(name) || "");
    setIsWA(!!form.getFieldValue(whatsappName));
  }, [form, name, whatsappName]);

  const normalize = (v) => {
    const raw = v.replace(/[^+\d]/g, "");
    return raw.startsWith("+") ? raw : `+974${raw}`; // always E.164
  };

  /* phone number typed */
  const handleChange = (v) => {
    const full = normalize(v);
    setValue(full);
    setNested(form, name, full); // safe nested update
    form.validateFields([name]);
  };

  /* toggle WhatsApp flag */
  const toggleWA = () => {
    const nv = !isWA;
    setIsWA(nv);
    setNested(form, whatsappName, nv);
  };

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
        {/* ---- PHONE INPUT ---- */}
        <Form.Item
          name={name}
          noStyle
          rules={[{ required, message: "Phone number is required" }]}
        >
          <PhoneInput
            country="qa"
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            enableSearch
            countryCodeEditable={false}
            inputStyle={{
              width: "100%",
              height: "100%",
              fontSize: 16,
              border: "none",
              borderRadius: "6px 0 0 6px",
            }}
            containerStyle={{ width: "100%" }}
            buttonStyle={{
              border: "none",
              borderRadius: "6px 0 0 6px",
              background: "transparent",
              padding: "0 10px",
              width: "50px",
            }}
          />
        </Form.Item>

        {/* ---- WHATSAPP TOGGLE ---- */}
        <Tooltip title={isWA ? "WhatsApp enabled" : "Click to enable WhatsApp"}>
          <div
            onClick={toggleWA}
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

const GuardianInfo = ({ formData }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [completedSections, setCompletedSections] = useState({
    father: false,
    mother: false,
  });
  const { isCheckingStudent } = useSelector((s) => s.common.studentSignup);

  const containerRef = useRef(null);
  const firstInputRef = useRef(null);
  const motherSectionRef = useRef(null);
  const guardianSectionRef = useRef(null);

  const [activeTab, setActiveTab] = useState("father");

  /* Hydrate form with initial data */
  useEffect(() => {
    if (!formData) return;
    const sanitized = JSON.parse(JSON.stringify(formData));

    // Convert string dates to dayjs objects
    ["fatherInfo.idExpiry", "motherInfo.idExpiry"].forEach((path) => {
      const parts = path.split(".");
      let curr = sanitized;
      for (let i = 0; i < parts.length - 1; i++) {
        curr = curr[parts[i]] ||= {};
      }
      const leaf = parts.pop();
      if (curr[leaf]) {
        curr[leaf] = dayjs(curr[leaf]);
      }
    });

    form.setFieldsValue(sanitized);
  }, [formData, form]);

  /* Auto-scroll on tab change */
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

  const handleValuesChange = () => {
    const raw = form.getFieldsValue(true);

    // Ensure photos are always plain strings
    ["fatherInfo.photo", "motherInfo.photo"].forEach((p) => {
      const [parent, key] = p.split(".");
      if (raw[parent]?.[key]?.url) raw[parent][key] = raw[parent][key].url;
    });

    dispatch(updateFormData({ guardian: raw }));
  };

  /* ------------- Reusable render helpers ------------- */
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
      <Form.Item name={[p, "middleName"]} className="mb-4">
        <Input size="large" placeholder="Middle Name" />
      </Form.Item>
      <Form.Item
        name={[p, "lastName"]}
        rules={[{ required: true, message: "Required" }]}
        className="mb-4"
      >
        <Input size="large" placeholder="Last Name" />
      </Form.Item>
    </>
  );

  const renderIdAndPersonalInfo = (p) => (
    <>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name={[p, "idNumber"]} label="QID" className="mb-4">
            <Input size="large" placeholder="ID Number" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name={[p, "idExpiry"]}
            label="QID Expiry"
            className="mb-4"
            rules={[
              {
                validator: (_, value) => {
                  // Accept empty values
                  if (!value) return Promise.resolve();

                  // Check if it's a Dayjs object and valid
                  if (dayjs.isDayjs(value) && value.isValid()) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Please select a valid date");
                },
              },
            ]}
          >
            <DatePicker
              size="large"
              className="w-full"
              placeholder="ID Expiry"
              format="DD/MM/YYYY"
              disabledDate={(current) => {
                return current && current < dayjs().startOf("day");
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name={[p, "religion"]} label="Religion" className="mb-4">
            <Select size="large" placeholder="Select Religion" showSearch>
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
            <Select size="large" placeholder="Select Nationality" showSearch>
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
        label="Primary Contact:"
        placeholder="e.g. +974 1234 5678"
        required
      />
      <PhoneField
        form={form}
        name={[p, "cell2"]}
        whatsappName={[p, "cell2IsWhatsapp"]}
        label="Secondary Contact:"
        placeholder="e.g. +974 1234 5679"
      />

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name={[p, "email1"]}
            label="Email 1"
            rules={[
              { type: "email", required: true, message: "Invalid email" },
            ]}
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
  // console.log("Photo", formData?.fatherInfo?.photo);
  /* ------------- Section renderers ------------- */
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
              profilelink={formData?.fatherInfo?.photo || ""} // Pass profileLink for father
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
              profilelink={formData?.motherInfo?.photo || ""} // Pass profileLink for mother
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
      <Alert
        showIcon
        type="info"
        className="mb-4"
        message="Why we need this"
        description="The e-mail you provide will receive a Parent-Portal login so your guardian
                  can track your progress and receive important updates."
      />
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
        rules={[{ type: "email", required: true, message: "Invalid email" }]}
        className="mb-4"
        extra="Login credentials for the Parent-Portal will be sent here."
      >
        <Input size="large" placeholder="Guardian Email" />
      </Form.Item>
    </div>
  );

  /* ------------- Navigation handlers ------------- */
  const gradient = "linear-gradient(90deg,#C83B62 0%,#7F35CD 100%)";
  const darkerGradient = "linear-gradient(90deg,#A02D53 0%,#6A28A4 100%)";

  const handleNext = async () => {
    try {
      await form.validateFields();
      const formValues = form.getFieldsValue(true);
      console.log(formValues, "formValues");

      const processedValues = {
        ...formValues,
        fatherInfo: {
          ...formValues.fatherInfo,
          idExpiry:
            formValues.fatherInfo?.idExpiry?.format("YYYY-MM-DD") || null,
        },
        motherInfo: {
          ...formValues.motherInfo,
          idExpiry:
            formValues.motherInfo?.idExpiry?.format("YYYY-MM-DD") || null,
        },
      };

      dispatch(updateFormData({ guardian: processedValues }));

      if (activeTab === "father") setActiveTab("mother");
      else if (activeTab === "mother") setActiveTab("guardian");
      else {
        await GuardianSchema.validate(processedValues, { abortEarly: false });
        dispatch(nextStep());
      }
    } catch (err) {
      setYupErrorsToAnt(form, err);
      const firstError =
        err?.errorFields?.[0]?.name || err?.inner?.[0]?.path?.split(".");
      if (firstError) {
        form.scrollToField(firstError, {
          behavior: "smooth",
          block: "center",
          scrollMode: "if-needed",
        });
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

  /* ------------- Render ------------- */
  return (
    <div className="flex flex-col h-full">
      {/* Segmented control */}
      <div className="sticky top-0 z-20 pt-1 pb-2 bg-white shadow-sm">
        <Segmented
          size="large"
          value={activeTab}
          onChange={(val) => {
            if (
              (val === "mother" && !completedSections.father) ||
              (val === "guardian" && !completedSections.mother)
            ) {
              message.warning("Please complete the current section first");
              return;
            }
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
              disabled: !completedSections.father,
            },
            {
              value: "guardian",
              label: (
                <span className="flex items-center">
                  <TeamOutlined className="mr-2" /> Guardian
                </span>
              ),
              disabled: !completedSections.mother,
            },
          ]}
          style={{ width: "100%" }}
        />
      </div>

      {/* Form body */}
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
