import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, InputNumber, Row, Col, DatePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {  updateOperationalExpenses } from "../../../../Store/Slices/Finance/operationalExpenses/operationalExpenses.thunk";
import dayjs from "dayjs";

const { Option } = Select;

const EditOperationalExpenses = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [lineItems, setLineItems] = useState([]);
  const [receiptData, setReceiptData] = useState({
    status: "",
    paymentType: "",
    paymentDate: null,
    chequeNumber: "",
    chequeDate: "",
    note: "",
  });

  useEffect(() => {
    if (data?.lineItems) {
      const items = data.lineItems.map((item) => ({
        ...item,
        payNow:  0,
      }));
      setLineItems(items)}
  }, [data]);

  const handleInputChange = (index, value) => {
    const updatedItems = [...lineItems];
    const remaining = updatedItems[index].remainingAmount;

    if (value <= 0) {
      toast.error("Pay Now must be greater than 0");
      return;
    }

    updatedItems[index].payNow = value;
    setLineItems(updatedItems);

    const totalRemaining = updatedItems.reduce((acc, item) => acc + item.remainingAmount, 0);
    const totalPayNow = updatedItems.reduce((acc, item) => acc + item.payNow, 0);

    const status = totalPayNow === totalRemaining ? "paid" : "partial";
    setReceiptData((prev) => ({ ...prev, status }));
  };

  const handleReceiptChange = (field, value) => {
    setReceiptData((prev) => ({
      ...prev,
      [field]: field.includes('Date') && value ? value.format('YYYY-MM-DD') : value,
    }));
  };

  const handleSubmit = () => {
    const updatedData = {
      ...data,
      lineItems: lineItems.map((item) => ({
        ...item,
        remainingAmount: item.remainingAmount - Number(item.payNow),
      })),
      ...receiptData,
    };

    dispatch(updateOperationalExpenses({ id: data._id, data: updatedData, navigate }));
  };
  const { activeYear } = useSelector((store) => store.common.financialYear);
  const minDate = dayjs(activeYear?.startDate?.slice(0, 10));
  const maxDate = dayjs(activeYear?.endDate?.slice(0, 10));
  return (
    <>
        <div className="p-6">
          <h1 className="font-bold pb-2">Edit Operational Expense</h1>

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {lineItems.map((item, index) => (
              <div key={item._id} className="p-4 mb-4 border rounded-lg bg-gray-100 space-y-4">
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item label="Category">
                      <Input value={item.categoryId} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Sub Category">
                      <Input value={item.subCategory} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Rate">
                      <Input value={item.rate} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Quantity">
                      <Input value={item.quantity} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Remaining">
                      <Input value={item.remainingAmount} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Pay Now">
                      <InputNumber
                        min={0}
                        max={item.remainingAmount}
                        value={item.payNow}
                        onChange={(value) => handleInputChange(index, value)}
                        style={{ width: "100%" }}
                        required
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            ))}

            <div className="p-4 border rounded-lg bg-gray-100 space-y-4">
              <h3 className="font-bold">Payment Details</h3>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item label="Status">
                    <Input value={receiptData?.status} disabled />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item label="Payment Type">
                    <Select
                      value={receiptData?.paymentType}
                      onChange={(value) => handleReceiptChange("paymentType", value)}
                      required
                    >
                      <Option value="cash">Cash</Option>
                      <Option value="card">Card</Option>
                      <Option value="online">Online</Option>
                      <Option value="cheque">Cheque</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item label="Payment Date" required>
                    <DatePicker
                      type="date"
                      value={receiptData?.paymentDate ? dayjs(receiptData?.paymentDate) : null}
                      className="w-full h-[2rem] border border-gray-300 rounded-lg p-2"
                      onChange={(e) => handleReceiptChange("paymentDate", e)}
                      disabledDate={(current) =>
                        current && (current.isBefore(minDate, 'day') || current.isAfter(maxDate, 'day'))
                      }
                    />
                  </Form.Item>
                </Col>

                {receiptData.paymentType === "cheque" && (
                  <>
                    <Col span={6}>
                      <Form.Item label="Cheque Number">
                        <Input
                          value={receiptData?.chequeNumber}
                          onChange={(e) => handleReceiptChange("chequeNumber", e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="Cheque Date">
                        <DatePicker
                          type="date"
                          className="w-full h-[2rem] border border-gray-300 rounded-lg p-2"
                          value={receiptData?.chequeDate ? dayjs(receiptData?.chequeDate) : null}
                          onChange={(e) => handleReceiptChange("chequeDate", e)}
                          disabledDate={(current) =>
                            current && (current.isBefore(minDate, 'day') || current.isAfter(maxDate, 'day'))
                          }
                        />
                      </Form.Item>
                    </Col>
                  </>
                )}
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Note">
                    <Input.TextArea
                      value={receiptData.note}
                      onChange={(e) => handleReceiptChange("note", e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Button htmlType="submit" className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              Update Expense
            </Button>
          </Form>
        </div>
      
    </>
  );
};

export default EditOperationalExpenses;
