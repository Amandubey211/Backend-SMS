import React, { useEffect, useState } from "react";
import {
  Form,
  Select,
  Button,
  Radio,
  Switch,
  Input,
  Row,
  Col,
  Card,
  Tabs,
} from "antd";
import { FaBuilding, FaHome } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  nextStep,
  prevStep,
  updateFormData,
} from "../../../../../Store/Slices/Common/User/actions/studentSignupSlice";
import { AddressSchema } from "../Utils/validationSchemas";
import { setYupErrorsToAnt } from "../Utils/yupAntdHelpers";
import { COUNTRY_OPTIONS } from "../../../../Admin/Addmission/AdminAdmission/Configs/selectOptionsConfig";

const { TabPane } = Tabs;
const { Option } = Select;

const AddressInfo = ({ formData }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [sameAsResidential, setSameAsResidential] = useState(false);
  const [activeTab, setActiveTab] = useState("residential");

  /* Hydrate on mount */
  useEffect(() => {
    if (formData) {
      form.setFieldsValue(formData);
      setSameAsResidential(
        JSON.stringify(formData?.residentialAddress) ===
          JSON.stringify(formData?.permanentAddress)
      );
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [formData, form]);

  /* Watch residence type in both addresses */
  const residentialResidenceType =
    Form.useWatch(["residentialAddress", "residenceType"], form) || "flat";
  const permanentResidenceType =
    Form.useWatch(["permanentAddress", "residenceType"], form) || "flat";

  /* Handle same as residential checkbox */
  const handleSameAsResidentialChange = (checked) => {
    setSameAsResidential(checked);
    if (checked) {
      const residentialValues = form.getFieldValue("residentialAddress");
      form.setFieldsValue({
        permanentAddress: { ...residentialValues },
      });
      setActiveTab("permanent");
    }
  };

  /* Nav */
  const handleNext = async () => {
    try {
      const vals = form.getFieldsValue(true);
      await AddressSchema.validate(vals, { abortEarly: false });
      dispatch(updateFormData({ address: vals }));
      dispatch(nextStep());
    } catch (err) {
      setYupErrorsToAnt(form, err);
      const first =
        err?.errorFields?.[0]?.name || err?.inner?.[0]?.path.split(".");
      if (first) {
        const tabForError =
          first[0] === "permanentAddress" ? "permanent" : "residential";
        setActiveTab(tabForError);
        form.scrollToField(first, { behavior: "smooth", block: "center" });
      }
    }
  };

  const handleBack = () => {
    const vals = form.getFieldsValue(true);
    dispatch(updateFormData({ address: vals }));
    dispatch(prevStep());
  };

  /* Address form section - reusable component */
  const AddressSection = ({ prefix, title, residenceType }) => (
    <Card
      title={
        <div className="flex items-center gap-2">
          {prefix === "residentialAddress" ? (
            <FaHome className="text-xl text-gray-500" />
          ) : (
            <FaBuilding className="text-xl text-gray-500" />
          )}
          <span>{title}</span>
        </div>
      }
      bordered={false}
      className="mb-6 shadow-sm"
      headStyle={{ borderBottom: "1px solid #f0f0f0" }}
    >
      {/* Residence type */}
      <Form.Item name={[prefix, "residenceType"]} label="Residence Type">
        <Radio.Group value="flat">
          <Radio value="flat">Flat / Villa</Radio>
          <Radio value="house">House</Radio>
        </Radio.Group>
      </Form.Item>

      {/* Unit / building OR house / street */}
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name={[prefix, "unitNumber"]}
            label={residenceType === "flat" ? "Unit #" : "House #"}
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
            name={[prefix, "buildingNumber"]}
            label={residenceType === "flat" ? "Building #" : "Street #"}
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

      {/* Street */}
      <Form.Item name={[prefix, "streetName"]} label="Street Name">
        <Input size="large" placeholder="Street Name" />
      </Form.Item>

      {/* Zone */}
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name={[prefix, "zoneNumber"]} label="Zone #">
            <Input size="large" placeholder="Enter Zone Number" allowClear />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name={[prefix, "zoneName"]} label="Zone Name">
            <Input size="large" placeholder="Zone Name" />
          </Form.Item>
        </Col>
      </Row>

      {/* Compound */}
      <Form.Item name={[prefix, "compoundType"]} label="Compound / Stand‑Alone">
        <Radio.Group>
          <Radio value="compound">Compound</Radio>
          <Radio value="standalone">Stand‑Alone</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name={[prefix, "compoundName"]} label="Compound Name">
        <Input size="large" placeholder="Compound Name (if applicable)" />
      </Form.Item>

      {/* City / Landmark */}
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name={[prefix, "city"]} label="City">
            <Input size="large" placeholder="City" allowClear />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name={[prefix, "nearestLandmark"]}
            label="Nearest Landmark"
          >
            <Input size="large" placeholder="Landmark" />
          </Form.Item>
        </Col>
      </Row>

      {/* State / Country / Postal Code */}
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item name={[prefix, "state"]} label="State / Province">
            <Input size="large" placeholder="State / Province" allowClear />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name={[prefix, "country"]} label="Country">
            <Select
              size="large"
              placeholder="Country"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {COUNTRY_OPTIONS.map((n) => (
                <Option key={n.value}>{n.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name={[prefix, "postalCode"]} label="Postal Code">
            <Input size="large" placeholder="Postal Code" />
          </Form.Item>
        </Col>
      </Row>

      {/* Proposed Campus */}
      <Form.Item
        name={[prefix, "proposedCampus"]}
        label="Proposed Campus (optional)"
      >
        <Input size="large" placeholder="Campus" />
      </Form.Item>

      {/* For residential tab only - show same as checkbox */}
      {prefix === "residentialAddress" && (
        <Form.Item>
          <div className="flex justify-end">
            <Switch
              checked={sameAsResidential}
              onChange={handleSameAsResidentialChange}
              checkedChildren="Same as Residential"
              unCheckedChildren="Different from Residential"
            />
          </div>
        </Form.Item>
      )}
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Form form={form} layout="vertical" className="space-y-6">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabPosition="left"
          className="address-tabs"
        >
          {/* Residential Address Tab */}
          <TabPane
            tab={
              <span className="flex items-center gap-2">
                <FaHome />
                Residential
              </span>
            }
            key="residential"
          >
            <AddressSection
              prefix="residentialAddress"
              title="Residential Address"
              residenceType={residentialResidenceType}
            />
          </TabPane>

          {/* Permanent Address Tab */}
          <TabPane
            tab={
              <span className="flex items-center gap-2">
                <FaBuilding />
                Permanent
              </span>
            }
            key="permanent"
            disabled={!form.getFieldValue(["residentialAddress", "streetName"])}
          >
            <AddressSection
              prefix="permanentAddress"
              title="Permanent Address"
              residenceType={permanentResidenceType}
            />
          </TabPane>
        </Tabs>

        {/* Transport Requirement Section */}
        <Card
          title="Transportation Details"
          bordered={false}
          className="mb-6 shadow-sm"
          headStyle={{ borderBottom: "1px solid #f0f0f0" }}
        >
          <Form.Item
            name="transportRequirement"
            label="Do you require school transportation services?"
            valuePropName="checked"
            className="mb-0"
          >
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              style={{ width: 100 }}
            />
          </Form.Item>
          <p className="text-gray-500 text-sm mt-2">
            If yes, our transportation team will contact you with details about
            routes and fees.
          </p>
        </Card>

        {/* Nav buttons */}
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
