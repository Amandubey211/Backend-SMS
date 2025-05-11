// src/pages/StudentSignUp/Steps/AcademicHistory.jsx
import React, { useEffect } from "react";
import { Form, Select, Button, DatePicker, Input, Row, Col } from "antd";
import { useDispatch } from "react-redux";

import {
  nextStep,
  prevStep,
  updateFormData,
} from "../../../../../Store/Slices/Common/User/actions/studentSignupSlice";
import { AcademicSchema } from "../Utils/validationSchemas";
import { setYupErrorsToAnt } from "../Utils/yupAntdHelpers";

const { Option } = Select;

/* static curriculum list */
const curriculumOptions = [
  { label: "American", value: "american" },
  { label: "British", value: "british" },
  { label: "IB (International Baccalaureate)", value: "ib" },
  { label: "CBSE", value: "cbse" },
  { label: "ICSE", value: "icse" },
  { label: "K-12", value: "k12" },
  { label: "Cambridge", value: "cambridge" },
  { label: "Australian", value: "australian" },
  { label: "Agha Khan", value: "agha_khan" },
  { label: "Lebanese", value: "lebanese" },
  { label: "Jordanian", value: "jordanian" },
  { label: "Qatari", value: "qatari" },
  { label: "Pakistani", value: "pakistani" },
  { label: "Bangladeshi", value: "bangladeshi" },
  { label: "Filipino", value: "filipino" },
  { label: "Malaysian", value: "malaysian" },
  { label: "Srilankan", value: "srilankan" },
  { label: "Egyptian", value: "egyptian" },
  { label: "Palestinian", value: "palestinian" },
  { label: "Other (Please Specify)", value: "other" },
];

const AcademicHistory = ({ formData }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  /* hydrate draft */
  useEffect(() => {
    if (formData) form.setFieldsValue(formData);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [formData, form]);

  /* sync redux on every edit */
  const handleValuesChange = () =>
    dispatch(updateFormData({ academic: form.getFieldsValue(true) }));

  /* nav handlers */
  const handleBack = () => dispatch(prevStep());

  const handleNext = async () => {
    try {
      const vals = form.getFieldsValue(true);
      console.log("Academic History", vals);
      await AcademicSchema.validate(vals, { abortEarly: false });
      dispatch(updateFormData({ academic: vals }));
      dispatch(nextStep());
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setYupErrorsToAnt(form, err);
      const first =
        err?.errorFields?.[0]?.name || err?.inner?.[0]?.path?.split(".");
      if (first)
        form.scrollToField(first, { behavior: "smooth", block: "center" });
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        className="space-y-6"
      >
        <Form.Item
          name="previousSchoolName"
          label="Previous School Name"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input size="large" placeholder="School Name" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="previousClass"
              label="Previous Class"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input size="large" placeholder="Previous Class" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="curriculum"
              label="Curriculum"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select size="large" placeholder="Select Curriculum">
                {curriculumOptions.map((o) => (
                  <Option key={o.value} value={o.value}>
                    {o.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* show “other curriculum” textbox when chosen */}
        <Form.Item
          noStyle
          shouldUpdate={(p, c) => p.curriculum !== c.curriculum}
        >
          {() =>
            form.getFieldValue("curriculum") === "other" && (
              <Form.Item
                name="otherCurriculum"
                label="Please specify"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input size="large" placeholder="Specify curriculum" />
              </Form.Item>
            )
          }
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="sourceOfFee"
              label="Source of Fee"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select size="large" placeholder="Select Source">
                <Option value="parent">Parent</Option>
                <Option value="company">Company</Option>
                {/* <Option value="scholarship">Scholarship</Option> */}
                {/* <Option value="other">Other</Option> */}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* nav buttons */}
        <div className="flex justify-between mt-8">
          <Button size="large" onClick={handleBack}>
            Back
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={handleNext}
            className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white border-none"
          >
            Next
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AcademicHistory;
