import React, { useEffect } from "react";
import { Input, Form, Row, Col } from "antd";
import { useDispatch } from "react-redux";
import { createEntity, updateEntity } from "../../../../Store/Slices/Finance/entitie/entity.thunk";

const EntityAddForm = ({ onClose, editData }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  let viewMode = editData?.mode === "view";

  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
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
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="entityName"
            label="Entity Name"
            rules={[
              { required: true, message: "Please enter entity name" },
              { min: 3, message: "Entity name must be at least 3 characters" },
              { max: 24, message: "Entity name cannot exceed 24 characters" },
            ]}
          >
            <Input placeholder="Enter entity name" disabled={viewMode} />
          </Form.Item>
        </Col>
        <Col span={12}>
        <Form.Item
            name="entityType"
            label="Entity Type"
            rules={[
              { required: true, message: "Please enter entity Type" },
              { min: 3, message: "Entity Type must be at least 3 characters" },
              { max: 24, message: "Entity Type cannot exceed 24 characters" },
            ]}
            normalize={(value) => value?.trim().toLowerCase() || ""}
          >
            <Input placeholder="Enter entity Type" disabled={viewMode} />
          </Form.Item>
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
      <Row span={24}>
        <h1 className="text-gray-500 mt-6">Enter Entity Bank Details (Optional)</h1>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name={["bankDetails", "accountHolder"]} label="Account Holder">
            <Input placeholder="Enter account holder name" disabled={viewMode} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={["bankDetails", "accountNumber"]} label="Account Number">
            <Input placeholder="Enter account number" disabled={viewMode} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name={["bankDetails", "bankName"]} label="Bank Name">
            <Input placeholder="Enter bank name" disabled={viewMode} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={["bankDetails", "ifscCode"]} label="IFSC Code">
            <Input placeholder="Enter IFSC code" disabled={viewMode} />
          </Form.Item>
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
