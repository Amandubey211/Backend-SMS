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

/* quick demo list – replace with API list if you have one */
const cityList = ["Doha", "Al Wakrah", "Al Khor", "Dukhan"];

const AddressInfo = ({ formData }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  /* ────── hydrate local‑storage draft ────── */
  useEffect(() => {
    if (formData) form.setFieldsValue(formData);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [formData]);

  /* watch residence type for dynamic labels */
  const residenceType = Form.useWatch("residenceType", form) || "flat";

  /* persist every change */
  const handleValuesChange = () =>
    dispatch(updateFormData({ address: form.getFieldsValue(true) }));

  /* navigation */
  const handleNext = async () => {
    try {
      const vals = form.getFieldsValue(true);
      await AddressSchema.validate(vals, { abortEarly: false });
      handleValuesChange(); // ensure latest snapshot
      dispatch(nextStep());
    } catch (err) {
      setYupErrorsToAnt(form, err);
      const first =
        err?.errorFields?.[0]?.name || err?.inner?.[0]?.path?.split(".");
      if (first)
        form.scrollToField(first, {
          behavior: "smooth",
          block: "center",
        });
    }
  };

  const handleBack = () => dispatch(prevStep());

  /* ────── UI ────── */
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
                placeholder={
                  residenceType === "flat" ? "Unit Number" : "House Number"
                }
                size="large"
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
                placeholder={
                  residenceType === "flat" ? "Building Number" : "Street Number"
                }
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="streetName"
          label="Street Name"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="Street Name" size="large" />
        </Form.Item>

        {/* zone */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="zoneNumber"
              label="Zone #"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select placeholder="Select Zone" size="large">
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
              <Input placeholder="Zone Name" size="large" />
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
          <Input placeholder="Compound Name (if applicable)" size="large" />
        </Form.Item>

        {/* city / landmark */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select placeholder="City" size="large">
                {cityList.map((c) => (
                  <Option key={c}>{c}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="nearestLandmark" label="Nearest Landmark">
              <Input placeholder="Landmark" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="proposedCampus" label="Proposed Campus (optional)">
          <Input placeholder="Campus" size="large" />
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
          <Button onClick={handleBack} size="large">
            Back
          </Button>
          <Button
            type="primary"
            className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD]"
            onClick={handleNext}
            size="large"
          >
            Next
          </Button>
        </Row>
      </Form>
    </div>
  );
};

export default AddressInfo;
