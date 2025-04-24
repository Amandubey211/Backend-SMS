import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, InputNumber, Row, Col, DatePicker } from "antd";
import Sidebar from "../../../../Components/Common/Sidebar";
import Layout from "../../../../Components/Common/Layout";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { updatePayroll } from "../../../../Store/Slices/Finance/payroll/payroll.thunk";
import dayjs from "dayjs";

const { Option } = Select;

const EditPayRoll = ({ data }) => {
    const schoolCurrency = useSelector((store) => store.common.user.userDetails?.currency);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [receiptData, setReceiptData] = useState({
    status: data?.status || "pending",
    paymentType: data?.paymentType || "cash",
    paymentDate: data?.paymentDate || "",
    chequeNumber: data?.chequeNumber || "",
    chequeDate: data?.chequeDate || "",
    note: data?.note || "",
  });

  const handleChange = (field, value) => {
    setReceiptData({ ...receiptData, [field]: value });
  };

  const handleSubmit = () => {
    dispatch(updatePayroll({ id: data._id, data:receiptData }));
  };
  const { activeYear } = useSelector((store) => store.common.financialYear);
  const minDate = dayjs(activeYear?.startDate?.slice(0, 10));
  const maxDate = dayjs(activeYear?.endDate?.slice(0, 10));

  return (
    <>
      
        <div className="p-6">
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {data?.lineItems?.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-100 mb-4">
                <Row gutter={16}>
                  <Col span={6}><strong>Category:</strong> {item?.categoryName}</Col>
                  <Col span={6}><strong>Sub Category:</strong> {item?.budgetName}</Col>
                  <Col span={6}><strong>Month:</strong> {item?.salaryMonth}</Col>
                  <Col span={6}><strong>Basic Salary:</strong>  {item?.basicSalary}</Col>
                  <Col span={6}><strong>Allowances:</strong>  {item?.allowances}</Col>
                  <Col span={6}><strong>Leave Deductions:</strong>  {item?.leaveDeductions}</Col>
                  <Col span={6}><strong>Overtime:</strong>  {item?.overtime}</Col>
                  <Col span={6}><strong>Adjustments:</strong>  {item?.otherAdjustments}</Col>
                  <Col span={6}><strong>Deductions:</strong>  {item?.deductions}</Col>
                  <Col span={6}><strong>Tax:</strong>  {item?.tax}</Col>
                  <Col span={6}><strong>Bonus:</strong>  {item?.bonus}</Col>
                  <Col span={6}><strong>Net Salary:</strong>  {item?.netSalary} {schoolCurrency}</Col>
                </Row>
              </div>
            ))}

            <div className="p-4 mt-6 border rounded-lg bg-gray-100 space-y-4">
              <h3 className="font-bold">Edit Payment Details</h3>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item label="Payment Status" name="status" rules={[{ required: true }]}>
                    <Select value={receiptData.status} onChange={(value) => handleChange("status", value)}>
                      <Option value="pending">Pending</Option>
                      <Option value="paid">Paid</Option>
                      <Option value="hold">Hold</Option>
                    </Select>
                  </Form.Item>
                </Col>

                {receiptData.status === "paid" && (
                  <>
                    <Col span={6}>
                      <Form.Item label="Payment Type" name="paymentType" rules={[{ required: true }]}>
                        <Select value={receiptData.paymentType} onChange={(value) => handleChange("paymentType", value)}>
                          <Option value="cash">Cash</Option>
                          <Option value="card">Card</Option>
                          <Option value="online">Online</Option>
                          <Option value="cheque">Cheque</Option>
                          <Option value="other">Other</Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={6}>
                      <Form.Item label="Payment Date" name="paymentDate" rules={[{ required: true }]}>
                        <DatePicker type="date" className="w-full border p-2 rounded" value={receiptData.paymentDate} onChange={(e) => handleChange("paymentDate", e)}  disabledDate={(current) =>
                    current && (current.isBefore(minDate, 'day') || current.isAfter(maxDate, 'day'))
                  }/>
                      </Form.Item>
                    </Col>
                  </>
                )}

                {receiptData.status === "paid" && receiptData.paymentType === "cheque" && (
                  <>
                    <Col span={6}>
                      <Form.Item label="Cheque Number" name="chequeNumber" rules={[{ required: true }]}>
                        <Input value={receiptData.chequeNumber} onChange={(e) => handleChange("chequeNumber", e.target.value)} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="Cheque Date" name="chequeDate" rules={[{ required: true }]}>
                        <DatePicker type="date" className="w-full border p-2 rounded" value={receiptData.chequeDate} onChange={(e) => handleChange("chequeDate", e)}  disabledDate={(current) =>
                    current && (current.isBefore(minDate, 'day') || current.isAfter(maxDate, 'day'))
                  } />
                      </Form.Item>
                    </Col>
                  </>
                )}
              </Row>

              <Row>
                <Col span={12}>
                  <Form.Item label="Note">
                    <Input.TextArea rows={3} value={receiptData.note} onChange={(e) => handleChange("note", e.target.value)} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <Button htmlType="submit" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white mt-4">
              Update Payroll
            </Button>
          </Form>
        </div>
      
    </>
  );
};

export default EditPayRoll;
