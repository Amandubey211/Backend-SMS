// src/pages/StudentSignUp/Steps/AddressInfo.jsx
import React, { useEffect } from "react";
import { Form, Select, Button, Radio, Switch, Input, Row, Col } from "antd";
import { useDispatch } from "react-redux";
import {
  nextStep,
  prevStep,
  updateFormData,
} from "../../../../../Store/Slices/Common/User/actions/studentSignupSlice";
import { AddressSchema } from "../Utils/validationSchemas";
import { setYupErrorsToAnt } from "../Utils/yupAntdHelpers";

const { Option } = Select;

/* demo data – replace with API lists when available */
const cityList = ["Doha", "Al Wakrah", "Al Khor", "Dukhan"];
const countryList = [
  "Qatar",
  "Saudi Arabia",
  "United Arab Emirates",
  "Bahrain",
];
const stateList = ["Doha Municipality", "Al Rayyan", "Al Daayen", "Umm Salal"];

const AddressInfo = ({ formData }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  /* hydrate on mount */
  useEffect(() => {
    if (formData) form.setFieldsValue(formData);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [formData, form]);

  /* watch residence type */
  const residenceType = Form.useWatch("residenceType", form) || "flat";

  /* keep Redux in sync */
  const handleValuesChange = () =>
    dispatch(updateFormData({ address: form.getFieldsValue(true) }));

  /* nav */
  const handleNext = async () => {
    try {
      const vals = form.getFieldsValue(true);
      await AddressSchema.validate(vals, { abortEarly: false });
      handleValuesChange();
      dispatch(nextStep());
    } catch (err) {
      setYupErrorsToAnt(form, err);
      const first =
        err?.errorFields?.[0]?.name || err?.inner?.[0]?.path?.split(".");
      if (first)
        form.scrollToField(first, { behavior: "smooth", block: "center" });
    }
  };
  const handleBack = () => dispatch(prevStep());

  /* UI */
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        className="space-y-6"
      >
        {/* residence type */}
        <Form.Item
          name="residenceType"
          label="Residence Type"
          rules={[{ required: true, message: "Select residence type" }]}
        >
          <Radio.Group>
            <Radio value="flat">Flat / Villa</Radio>
            <Radio value="house">House</Radio>
          </Radio.Group>
        </Form.Item>

        {/* unit / building OR house / street */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="unitNumber"
              label={residenceType === "flat" ? "Unit #" : "House #"}
              rules={[{ required: true, message: "Required" }]}
            >
              <Input
                size="large"
                placeholder={
                  residenceType === "flat" ? "Unit Number" : "House Number"
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="buildingNumber"
              label={residenceType === "flat" ? "Building #" : "Street #"}
              rules={[{ required: true, message: "Required" }]}
            >
              <Input
                size="large"
                placeholder={
                  residenceType === "flat" ? "Building Number" : "Street Number"
                }
              />
            </Form.Item>
          </Col>
        </Row>

        {/* street */}
        <Form.Item
          name="streetName"
          label="Street Name"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input size="large" placeholder="Street Name" />
        </Form.Item>

        {/* zone */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="zoneNumber"
              label="Zone #"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select size="large" placeholder="Select Zone">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((z) => (
                  <Option key={z} value={z}>
                    Zone {z}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="zoneName" label="Zone Name">
              <Input size="large" placeholder="Zone Name" />
            </Form.Item>
          </Col>
        </Row>

        {/* compound */}
        <Form.Item name="compoundType" label="Compound / Stand‑Alone">
          <Radio.Group>
            <Radio value="compound">Compound</Radio>
            <Radio value="standalone">Stand‑Alone</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="compoundName" label="Compound Name">
          <Input size="large" placeholder="Compound Name (if applicable)" />
        </Form.Item>

        {/* city / landmark */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select size="large" placeholder="City">
                {cityList.map((c) => (
                  <Option key={c}>{c}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="nearestLandmark" label="Nearest Landmark">
              <Input size="large" placeholder="Landmark" />
            </Form.Item>
          </Col>
        </Row>

        {/* NEW: state / country / postal code */}
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item name="state" label="State / Province">
              <Select size="large" placeholder="State / Province">
                {stateList.map((s) => (
                  <Option key={s}>{s}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select size="large" placeholder="Country">
                {countryList.map((cntry) => (
                  <Option key={cntry}>{cntry}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="postalCode" label="Postal Code">
              <Input size="large" placeholder="Postal Code" />
            </Form.Item>
          </Col>
        </Row>

        {/* proposed campus */}
        <Form.Item name="proposedCampus" label="Proposed Campus (optional)">
          <Input size="large" placeholder="Campus" />
        </Form.Item>

        {/* transport */}
        <Form.Item
          name="transportRequired"
          label="Transport Required"
          valuePropName="checked"
        >
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>

        {/* nav buttons */}
        <Row justify="space-between" className="mt-8">
          <Button size="large" onClick={handleBack}>
            Back
          </Button>
          <Button
            size="large"
            type="primary"
            className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD]"
            onClick={handleNext}
          >
            Next
          </Button>
        </Row>
      </Form>
    </div>
  );
};

export default AddressInfo;
