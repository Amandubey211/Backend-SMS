import React from "react";
import { useFormikContext, FieldArray } from "formik";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Row,
  Col,
  Tooltip,
  Space,
  Divider,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";

const ItemsSection = ({ type }) => {
  const { values, errors, touched, setFieldValue, handleBlur } =
    useFormikContext();

  // Configuration based on `type` prop
  const configurations = {
    classroom: {
      fieldName: "items",
      defaultValues: { itemName: "", unitPrice: 0, quantity: 1, unitType: "" },
      fields: [
        {
          label: "Item Name",
          name: "itemName",
          type: "text",
          span: 10,
          tooltip: "Name of the item",
        },
        {
          name: "unitPrice",
          type: "number",
          span: 4,
          placeholder: "Unit Price",
          tooltip: "Price per unit",
        },
        {
          name: "quantity",
          type: "number",
          span: 4,
          placeholder: "Quantity",
          tooltip: "Number of units",
        },
        {
          name: "unitType",
          type: "text",
          span: 6,
          placeholder: "Unit Type",
          tooltip: "Measurement unit",
        },
      ],
      title: "Item",
    },
    exam: {
      fieldName: "examRelatedCosts",
      defaultValues: { itemName: "", cost: 0 },
      fields: [
        {
          label: "Item Name",
          name: "itemName",
          type: "text",
          span: 16,
          tooltip: "Name of the exam-related item",
        },
        {
          name: "cost",
          type: "number",
          span: 8,
          placeholder: "Cost",
          tooltip: "Cost of the item",
        },
      ],
      title: "Exam-Related Cost",
    },
  };

  // Select configuration based on `type`
  const { fieldName, defaultValues, fields, title } = configurations[type];

  // Render form fields
  const renderField = (field, index) => {
    const currentFieldName = `${fieldName}[${index}].${field.name}`;
    const fieldError = errors[fieldName]?.[index]?.[field.name];
    const hasError = touched[fieldName]?.[index]?.[field.name] && fieldError;

    return (
      <Col
        span={field.span || 6}
        key={field.name}
        style={{
          backgroundColor: "#f5f5f5",
          padding: "8px",
          borderRadius: "4px",
        }}
      >
        <Form.Item
          label={
            field.label && (
              <Tooltip title={field.tooltip}>
                {field.label}{" "}
                <InfoCircleOutlined
                  style={{ marginLeft: 4, color: "rgba(0,0,0,.45)" }}
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
              value={values[fieldName][index][field.name]}
              onChange={(value) => setFieldValue(currentFieldName, value)}
              onBlur={handleBlur}
              style={{ width: "100%", borderRadius: "2px" }}
              min={field.min || 0}
            />
          ) : (
            <Input
              name={currentFieldName}
              placeholder={field.placeholder || field.label}
              value={values[fieldName][index][field.name]}
              onChange={(e) => setFieldValue(currentFieldName, e.target.value)}
              onBlur={handleBlur}
              style={{ width: "100%", borderRadius: "2px" }}
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
          {values[fieldName]?.map((_, index) => (
            <Card
              key={index}
              size="small"
              title={`${title} ${index + 1}`}
              extra={
                <Button
                  type="text"
                  danger
                  icon={<MinusCircleOutlined />}
                  onClick={() => remove(index)}
                  style={{ color: "red", fontWeight: "bold" }}
                >
                  Remove
                </Button>
              }
              style={{ marginBottom: 8 }}
            >
              <Row gutter={[16, 16]}>
                {fields.map((field) => renderField(field, index))}
              </Row>
            </Card>
          ))}

          <Divider dashed />

          <Button
            type="dashed"
            onClick={() => push(defaultValues)}
            block
            icon={<PlusOutlined />}
            style={{ fontWeight: "bold" }}
          >
            Add {title}
          </Button>
        </Space>
      )}
    </FieldArray>
  );
};

ItemsSection.propTypes = {
  type: PropTypes.oneOf(["classroom", "exam"]).isRequired,
};

export default ItemsSection;
