// src/pages/StudentSignUp/Steps/AddressInfo.jsx
import React, { useEffect, useState, useRef } from "react";
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
  const formRef = useRef(null);

  // Track mounted state to prevent memory leaks
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* hydrate on mount */
  useEffect(() => {
    if (formData && mountedRef.current) {
      form.setFieldsValue(formData);
      setSameAsResidential(
        JSON.stringify(formData?.residentialAddress) ===
          JSON.stringify(formData?.permanentAddress)
      );
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [formData, form]);

  /* watch residence type in both addresses */
  const residentialResidenceType =
    Form.useWatch(["residentialAddress", "residenceType"], form) || "flat";
  const permanentResidenceType =
    Form.useWatch(["permanentAddress", "residenceType"], form) || "flat";

  /* keep Redux in sync */
  const handleValuesChange = (changedValues, allValues) => {
    if (mountedRef.current) {
      dispatch(updateFormData({ address: allValues }));
    }
  };

  /* handle same as residential checkbox */
  const handleSameAsResidentialChange = (checked) => {
    setSameAsResidential(checked);
    if (checked) {
      const residentialValues = form.getFieldValue("residentialAddress");
      form.setFieldsValue({
        permanentAddress: { ...residentialValues },
      });
      // Switch to permanent tab to show the copied values
      setActiveTab("permanent");
    }
  };

  /* nav */
  const handleNext = async () => {
    try {
      const vals = form.getFieldsValue(true);
      await AddressSchema.validate(vals, { abortEarly: false });
      dispatch(nextStep());
    } catch (err) {
      setYupErrorsToAnt(form, err);
      const first =
        err?.errorFields?.[0]?.name || err?.inner?.[0]?.path?.split(".");
      if (first) {
        // Determine which tab contains the error
        const tabForError =
          first[0] === "permanentAddress" ? "permanent" : "residential";
        setActiveTab(tabForError);
      }
    }
  };

  const handleBack = () => dispatch(prevStep());

  /* Address form section - reusable component */
  const AddressSection = React.memo(({ prefix, title, residenceType }) => {
    return (
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
        {/* residence type */}
        <Form.Item
          name={[prefix, "residenceType"]}
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
              name={[prefix, "unitNumber"]}
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
              name={[prefix, "buildingNumber"]}
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
          name={[prefix, "streetName"]}
          label="Street Name"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input size="large" placeholder="Street Name" />
        </Form.Item>

        {/* zone */}
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

        {/* compound */}
        <Form.Item
          name={[prefix, "compoundType"]}
          label="Compound / Stand‑Alone"
        >
          <Radio.Group>
            <Radio value="compound">Compound</Radio>
            <Radio value="standalone">Stand‑Alone</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name={[prefix, "compoundName"]} label="Compound Name">
          <Input size="large" placeholder="Compound Name (if applicable)" />
        </Form.Item>

        {/* city / landmark */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name={[prefix, "city"]}
              label="City"
              rules={[{ required: true, message: "Required" }]}
            >
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

        {/* state / country / postal code */}
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item name={[prefix, "state"]} label="State / Province">
              <Input size="large" placeholder="State / Province" allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name={[prefix, "country"]}
              label="Country"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                size="large"
                placeholder="Country"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
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

        {/* proposed campus */}
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
  });

  /* UI */
  return (
    <div className="max-w-6xl mx-auto p-4">
      <Form
        form={form}
        ref={formRef}
        layout="vertical"
        onValuesChange={handleValuesChange}
        className="space-y-6"
        initialValues={formData}
      >
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

export default React.memo(AddressInfo);
