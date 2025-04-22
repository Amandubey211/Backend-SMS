import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  InputNumber,
  Select,
  DatePicker,
  Upload,
  Space,
  Row,
  Col,
  Typography,
  Divider,
  message
} from "antd";
import { PlusOutlined, MinusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { addQuotation } from "../../../../../Store/Slices/Finance/Quotations/quotationThunks";
import { useNavigate } from "react-router-dom";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";

const { Title } = Typography;

const CreateQuotationAntForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const { selectedQuotation } = useSelector(state => state.admin.quotations);

  const formatDate = (date) => moment(date).format("YYYY-MM-DD");

  const formattedQuotation = {
    receiver: selectedQuotation?.receiver || {
      name: "",
      email: "",
      address: "",
      phone: "",
    },
    lineItems: selectedQuotation?.lineItems || [
      { revenueType: "", subCategory: "", description: "", quantity: 1, amount: 0, },
    ],
    date: selectedQuotation?.date ? moment(selectedQuotation.date) : moment(),
    dueDate: selectedQuotation?.dueDate ? moment(selectedQuotation.dueDate) : moment(),
    purpose: selectedQuotation?.purpose || "",
    status: selectedQuotation?.status || "pending",
    total_amount: selectedQuotation?.total_amount || 0,
    tax: selectedQuotation?.tax || 0,
    discountType: selectedQuotation?.discountType || "percentage",
    discount: selectedQuotation?.discount || 0,
    final_amount: selectedQuotation?.final_amount || 0,
    document: selectedQuotation?.document || null,
    paymentMode: selectedQuotation?.paymentMode || "",
    paymentStatus: selectedQuotation?.paymentStatus || "",
    remainingAmount: selectedQuotation?.remainingAmount || 0,
    remark: selectedQuotation?.remark || "",
    govtRefNumber: selectedQuotation?.govtRefNumber || ""
  };

  useEffect(() => {
    form?.setFieldsValue(formattedQuotation);
    setReadOnly(!!selectedQuotation);
  }, [selectedQuotation]);

  // useEffect(() => {
  //   const unsubscribe = form.subscribe(({ values }) => {
  //     const updatedItems = values?.lineItems?.map((item) => ({
  //       ...item,
  //       quantityAmount: (item.quantity || 0) * (item.amount || 0),
  //     }));
  //     form?.setFieldsValue({ lineItems: updatedItems });
  //   });

  //   return () => unsubscribe?.();
  // }, [form]);

  const onFinish = async (values) => {
    const payload = {
      ...values,
      date: values.date.format("YYYY-MM-DD"),
      dueDate: values.dueDate.format("YYYY-MM-DD"),
    };
    try {
      setLoading(true);
      await dispatch(addQuotation(payload)).unwrap();
      message.success("Quotation created successfully");
      navigate("/finance/quotations/quotations-list");
    } catch (err) {
      message.error("Error creating quotation");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const unsubscribe = form?.watch?.((changedValues, allValues) => {
      if (changedValues?.lineItems) {
        const updatedItems = allValues.lineItems.map((item) => ({
          ...item,
          quantityAmount: (item.quantity || 0) * (item.amount || 0),
        }));
        form.setFieldsValue({ lineItems: updatedItems });
      }
    });
    return () => unsubscribe?.();
  }, [form]);
  
  return (
    <Layout>
      <DashLayout>
        <div className="p-6 min-h-screen bg-white">
          <Title level={3}>{readOnly ? "View Quotation" : "Create Quotation"}</Title>
          <Divider />

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={readOnly}
            onValuesChange={(changedValues, allValues) => {
              if (changedValues?.lineItems) {
                const updatedItems = allValues.lineItems.map((item) => ({
                  ...item,
                  quantityAmount: (item.quantity || 0) * (item.amount || 0),
                }));
                form.setFieldsValue({ lineItems: updatedItems });
              }
            }}
          >

            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item label="Receiver Name" name={["receiver", "name"]} rules={[{ required: true }]}>
                  <Input placeholder="Enter receiver's name" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Address" name={["receiver", "address"]}>
                  <Input placeholder="Enter address" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Phone" name={["receiver", "phone"]}>
                  <Input placeholder="Enter phone number" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item label="Email" name={["receiver", "email"]}>
                  <Input type="email" placeholder="Enter email" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Purpose" name="purpose" rules={[{ required: true }]}>
                  <Input placeholder="Enter purpose" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Quotation Date" name="date" rules={[{ required: true }]}>
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left" className="px-10">Items</Divider>
            <Form.List name="lineItems">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row gutter={[16, 16]} key={key} align="middle">
                      <Col span={5}>
                        <Form.Item {...restField} name={[name, "category"]} label="Category">
                          <Input placeholder="Category" />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item {...restField} name={[name, "description"]} label="Description">
                          <Input placeholder="Description" />
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item {...restField} name={[name, "quantity"]} label="Qty">
                          <InputNumber min={1} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item {...restField} name={[name, "amount"]} label="Rate">
                          <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item {...restField} name={[name, "quantityAmount"]} label="Total">
                          <InputNumber disabled style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        {!readOnly && <MinusCircleOutlined onClick={() => remove(name)} />}
                      </Col>
                    </Row>
                  ))}
                  {!readOnly && (
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Item
                      </Button>
                    </Form.Item>
                  )}
                </>
              )}
            </Form.List>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Form.Item label="Due Date" name="dueDate">
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Tax (%)" name="tax">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Discount Type" name="discountType" rules={[{ required: true }]}>
                  <Select>
                    <Select.Option value="percentage">Percentage</Select.Option>
                    <Select.Option value="amount">Amount</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Discount" name="discount">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Form.Item label="Govt Ref #" name="govtRefNumber">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Remark" name="remark">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Upload Document" name="document" valuePropName="fileList">
                  <Upload beforeUpload={() => false} maxCount={1}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            {!readOnly && (
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save Quotation
                </Button>
              </Form.Item>
            )}
          </Form>

        </div>
      </DashLayout>
    </Layout>
  );
};

export default CreateQuotationAntForm;
