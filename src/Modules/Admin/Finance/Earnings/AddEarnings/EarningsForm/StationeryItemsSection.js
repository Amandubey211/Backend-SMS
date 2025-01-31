// src/Components/Admin/Finance/Earnings/EarningsForm/StationeryItemsSection.jsx
import React from "react";
import { useFormikContext, FieldArray } from "formik";
import {
  Card,
  Row,
  Col,
  Button,
  Divider,
  Space,
  Form,
  Input,
  InputNumber,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const StationeryItemsSection = () => {
  const { values, errors, touched, setFieldValue, handleBlur } =
    useFormikContext();

  // FieldArray name (must match the key in your initial state for Stationery Fees)
  const fieldName = "stationeryItems";
  const defaultValues = { itemName: "", quantity: 0, unitCost: 0 };

  // Field configuration for each stationery item.
  const fields = [
    {
      label: "Item Name",
      name: "itemName",
      type: "text",
      span: 12,
      tooltip: "Enter the name of the item",
    },
    {
      label: "Quantity",
      name: "quantity",
      type: "number",
      span: 6,
      placeholder: "0",
      tooltip: "Enter the quantity",
    },
    {
      label: "Unit Cost",
      name: "unitCost",
      type: "number",
      span: 6,
      placeholder: "0",
      tooltip: "Enter the unit cost",
    },
  ];

  // Render a single input field safely for a given item at index.
  const renderField = (field, index) => {
    // Check that the field exists and has a name before proceeding.
    if (!field || !field.name) return null;

    // Safely retrieve the current item from the values array.
    const itemsArray = values && values[fieldName] ? values[fieldName] : [];
    const item = itemsArray[index] || {};
    const currentFieldName = `${fieldName}[${index}].${field.name}`;
    const fieldValue = item[field.name] ?? "";
    const fieldError = errors[fieldName]?.[index]?.[field.name];
    const hasError = touched[fieldName]?.[index]?.[field.name] && fieldError;

    return (
      <Col span={field.span} key={field.name} style={{ padding: "8px" }}>
        <Form.Item
          label={
            field.label && (
              <Tooltip title={field.tooltip}>
                {field.label}{" "}
                <InfoCircleOutlined
                  style={{ marginLeft: 4, color: "rgba(0,0,0,0.45)" }}
                />
              </Tooltip>
            )
          }
          validateStatus={hasError ? "error" : ""}
          help={hasError && fieldError}
        >
          {field.type === "number" ? (
            <InputNumber
              name={currentFieldName}
              placeholder={field.placeholder || field.label}
              value={fieldValue}
              onChange={(value) => setFieldValue(currentFieldName, value)}
              onBlur={handleBlur}
              style={{ width: "100%" }}
              min={0}
            />
          ) : (
            <Input
              name={currentFieldName}
              placeholder={field.placeholder || field.label}
              value={fieldValue}
              onChange={(e) => setFieldValue(currentFieldName, e.target.value)}
              onBlur={handleBlur}
              style={{ width: "100%" }}
            />
          )}
        </Form.Item>
      </Col>
    );
  };

  return (
    <FieldArray name={fieldName}>
      {({ push, remove }) => (
        <Space direction="vertical" style={{ width: "100%" }}>
          {values && values[fieldName] && values[fieldName].length > 0 ? (
            values[fieldName].map((_, index) => (
              <Card
                key={index}
                size="small"
                title={`Stationery Item ${index + 1}`}
                extra={
                  <Button
                    type="text"
                    danger
                    onClick={() => remove(index)}
                    icon={<MinusCircleOutlined />}
                  >
                    Remove
                  </Button>
                }
                style={{ marginBottom: 16 }}
              >
                <Row gutter={16}>
                  {fields.map((field) => renderField(field, index))}
                </Row>
              </Card>
            ))
          ) : (
            <p>No stationery items added.</p>
          )}
          <Divider dashed />
          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={() => push(defaultValues)}
          >
            Add Stationery Item
          </Button>
        </Space>
      )}
    </FieldArray>
  );
};

export default StationeryItemsSection;
