import React, { useEffect } from "react";
import { Form, Select, Button, Row, Col, Radio, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  nextStep,
  prevStep,
  updateFormData,
} from "../../../../../Store/Slices/Common/User/actions/studentSignupSlice";
import { LanguagePreferenceSchema } from "../Utils/validationSchemas";
import { setYupErrorsToAnt } from "../Utils/yupAntdHelpers";
import useGetAllSchools from "../../../../../Hooks/CommonHooks/useGetAllSchool";

const { Option } = Select;

const LanguageAndPreference = ({ formData }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { schoolList } = useGetAllSchools();
  const { schoolId } = useSelector(
    (s) => s.common.studentSignup.formData.school
  );

  // Get the selected school's admission options
  const selectedSchool = schoolList?.find((school) => school._id === schoolId);
  const admissionOptions = selectedSchool?.admissionOptions || {};

  /* hydrate draft */
  useEffect(() => {
    if (formData) {
      form.setFieldsValue({
        ...formData,
        isLeftHanded: formData.isLeftHanded || false, // Default to false (right-handed)
      });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [formData, form]);

  /* sync redux on every edit */
  const handleValuesChange = () =>
    dispatch(updateFormData({ languagePreference: form.getFieldsValue(true) }));

  /* nav handlers */
  const handleBack = () => dispatch(prevStep());

  const handleNext = async () => {
    try {
      const vals = form.getFieldsValue(true);
      await LanguagePreferenceSchema.validate(vals, { abortEarly: false });
      dispatch(updateFormData({ languagePreference: vals }));
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
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="secondLanguage"
              label="Second Language Preference"
              rules={[{ required: true, message: "Please select a language" }]}
            >
              <Select
                size="large"
                placeholder="Select Second Language"
                mode="multiple"
                maxTagCount="responsive"
              >
                {admissionOptions?.languageOptions?.secondLanguages?.map(
                  (lang) => (
                    <Option key={lang} value={lang}>
                      {lang}
                    </Option>
                  )
                )}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="thirdLanguage"
              label="Third Language Preference"
              rules={[{ required: true, message: "Please select a language" }]}
            >
              <Select
                size="large"
                placeholder="Select Third Language"
                mode="multiple"
                maxTagCount="responsive"
              >
                {admissionOptions?.languageOptions?.thirdLanguages?.map(
                  (lang) => (
                    <Option key={lang} value={lang}>
                      {lang}
                    </Option>
                  )
                )}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="valueEducation"
          label="Value Education Preference"
          rules={[
            { required: true, message: "Please select at least one option" },
          ]}
        >
          <Select
            size="large"
            placeholder="Select Value Education"
            mode="multiple"
            maxTagCount="responsive"
          >
            {admissionOptions?.valueEducation?.map((value) => (
              <Option key={value} value={value}>
                {value}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="isLeftHanded"
          label="Hand Preference"
          initialValue={false}
        >
          <Radio.Group>
            <Radio.Button value={false}>Right-handed</Radio.Button>
            <Radio.Button value={true}>Left-handed</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="medicalCondition"
          label="Medical Conditions/Allergies (if any)"
        >
          <Input.TextArea
            rows={4}
            placeholder="Please mention any medical conditions or allergies we should be aware of"
          />
        </Form.Item>

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

export default LanguageAndPreference;
