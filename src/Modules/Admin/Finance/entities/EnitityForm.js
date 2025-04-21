import React, { useEffect, useState } from "react";
import { Input, Form, Row, Col, Select } from "antd";
import { useDispatch } from "react-redux";
import { createEntity, updateEntity } from "../../../../Store/Slices/Finance/entitie/entity.thunk";

const entityTypes = [
  "Supplier", "Service Provider", "Utility Vendor", "Partner",
  "Maintenance", "Transport", "Contractor", "Other"
];

const paymentTerms = [
  "On Delivery", "Advance Payment", "Net 7", "Net 15",
  "Net 30", "Net 45", "Net 60", "End of Month (EOM)",
  "Monthly Billing Cycle", "Quarterly Billing Cycle", "Custom Terms"
];

const EntityAddForm = ({ onClose, editData }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const viewMode = editData?.mode === "view";
  const [entityType, setEntityType] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("");

  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
      setEntityType(editData.entityType);
      setPaymentTerm(editData.paymentTerms);
    } else {
      form.resetFields();
    }
  }, [editData, form]);

  const handleSubmit = async (values) => {
    if (editData) {
      await dispatch(updateEntity({ id: editData._id, ...values }));
    } else {
      await dispatch(createEntity(values));
    }
    onClose();
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      {/* Section 1: Basic Info */}
      <Row gutter={16}><h1 className="text-gray-500">Basic Info</h1></Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="entityName"
            label="Entity Name"
            rules={[{ required: true, message: "Please enter entity name" }]}
          >
            <Input placeholder="Enter entity name" disabled={viewMode} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="entityType"
            label="Entity Type"
            rules={[{ required: true, message: "Please select entity type" }]}
          >
            <Select
              disabled={viewMode}
              onChange={setEntityType}
              options={entityTypes.map((type) => ({ label: type, value: type }))}
              placeholder="Select or type"
            />
          </Form.Item>
          {entityType === "Other" && (
            <Form.Item   name="entityType"
            label="Enter Entity Type">
              <Input placeholder="Specify other entity type" disabled={viewMode} />
            </Form.Item>
          )}
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="contactNumber" label="Contact Number">
            <Input placeholder="Enter contact number" disabled={viewMode} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="alternativeContact" label="Alternative Contact">
            <Input placeholder="Enter alternative contact" disabled={viewMode} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input type="email" placeholder="Enter email" disabled={viewMode} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="address" label="Address">
            <Input.TextArea placeholder="Enter address" rows={1} disabled={viewMode} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="country" label="Country">
            <Input placeholder="Enter country" disabled={viewMode} />
          </Form.Item>
        </Col>
      </Row>

      {/* Section 2: Banking Details */}
      <Row gutter={16}><h1 className="text-gray-500 mt-6">Banking Details (Optional)</h1></Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name={["bankDetails", "accountHolder"]} label="Account Holder Name">
            <Input placeholder="Enter account holder name" disabled={viewMode} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={["bankDetails", "bankName"]} label="Bank Name">
            <Input placeholder="Enter bank name" disabled={viewMode} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name={["bankDetails", "accountNumber"]} label="Account Number">
            <Input placeholder="Enter account number" disabled={viewMode} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={["bankDetails", "iban"]} label="IBAN">
            <Input placeholder="Enter IBAN" disabled={viewMode} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name={["bankDetails", "swiftCode"]} label="SWIFT/BIC Code">
            <Input placeholder="Enter SWIFT/BIC" disabled={viewMode} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={["bankDetails", "ifscCode"]} label="IFSC Code">
            <Input placeholder="Enter IFSC code" disabled={viewMode} />
          </Form.Item>
        </Col>
      </Row>

      {/* Section 3: Taxation & Terms */}
      <Row gutter={16}><h1 className="text-gray-500 mt-6">Taxation & Terms</h1></Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="vatTaxId" label="VAT / Tax ID">
            <Input placeholder="Enter VAT / Tax ID" disabled={viewMode} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="paymentTerms" label="Payment Terms">
            <Select
              disabled={viewMode}
              onChange={setPaymentTerm}
              placeholder="Select payment term"
              options={paymentTerms.map((term) => ({ label: term, value: term }))}
            />
          </Form.Item>
          {paymentTerm === "Custom Terms" && (
            <Form.Item name="customPaymentTerms" label="Custom Terms">
              <Input placeholder="Enter custom payment terms" disabled={viewMode} />
            </Form.Item>
          )}
        </Col>
      </Row>

      <Form.Item>
        <button
          disabled={viewMode}
          className="bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white w-full py-2"
          htmlType="submit"
        >
          {editData ? "Entity Full Detail" : "Add Entity"}
        </button>
      </Form.Item>
    </Form>
  );
};

export default EntityAddForm;
