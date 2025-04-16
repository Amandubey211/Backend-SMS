// src/pages/StudentSignUp/Steps/AcademicHistory.jsx
import React from "react";
import { Form, Select, Button, DatePicker, Input } from "antd";

const { Option } = Select;

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

const AcademicHistory = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("AcademicHistory values:", values);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-6"
      >
        <Form.Item name="previousSchool" label="Previous School Name">
          <Input
            size="large"
            placeholder="School Name"
            className="w-full rounded-lg focus:border-pink-500 transition-colors"
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="previousClass" label="Previous Class">
            <Input
              size="large"
              placeholder="Previous Class"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
            />
          </Form.Item>
          <Form.Item name="curriculum" label="Curriculum">
            <Select
              size="large"
              placeholder="Select Curriculum"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
            >
              {curriculumOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* Conditional Input for 'Other' Curriculum */}
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.curriculum !== currentValues.curriculum
          }
        >
          {({ getFieldValue }) =>
            getFieldValue("curriculum") === "other" && (
              <Form.Item
                name="otherCurriculum"
                label="Please specify"
                rules={[
                  { required: true, message: "Please specify your curriculum" },
                ]}
                className="mb-4"
              >
                <Input
                  placeholder="Please specify"
                  size="large"
                  className="w-full rounded-lg focus:border-pink-500 transition-colors"
                />
              </Form.Item>
            )
          }
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="lastDayAtSchool" label="Last Day at School">
            <DatePicker
              size="large"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
            />
          </Form.Item>

          <Form.Item name="sourceOfFee" label="Source of Fee">
            <Select
              size="large"
              placeholder="Select Source"
              className="w-full rounded-lg focus:border-pink-500 transition-colors"
            >
              <Option value="parent">Parent</Option>
              <Option value="company">Company</Option>
              <Option value="scholarship">Scholarship</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
        </div>

        {/* <Form.Item name="academicNotes" label="Additional Notes">
          <textarea
            rows={4}
            placeholder="Any additional academic information..."
            className="w-full rounded-lg focus:border-pink-500 transition-colors p-2"
          />
        </Form.Item> */}

        <div className="flex justify-between mt-8">
          <Button size="large">Back</Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white border-none hover:opacity-90 focus:opacity-90 transition-opacity"
          >
            Next
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AcademicHistory;
