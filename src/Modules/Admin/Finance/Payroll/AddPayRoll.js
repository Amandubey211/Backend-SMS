import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, InputNumber, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { VscListSelection } from "react-icons/vsc";
import Sidebar from "../../../../Components/Common/Sidebar";
import SelectStaffs from "./SelectStaffs";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { fetchCategory } from "../../../../Store/Slices/Finance/Category/financeCategory.Thunk";
import Layout from '../../../../Components/Common/Layout';
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import { fetchBudget } from "../../../../Store/Slices/Finance/budget/budget.thunk";
import { createPayroll } from "../../../../Store/Slices/Finance/payroll/payroll.thunk";

const { Option } = Select;

const AddPayRoll = () => {
  useNavHeading("Finance", "PayRoll");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector((state) => state.admin.financialCategory.categories);
  const [form] = Form.useForm();
  const [lineItems, setLineItems] = useState([
    {
      categoryId: "",
      budgetId: "",
      salaryMonth: "",
      basicSalary: 0,
      allowances: 0,
      deductions: 0,
      tax: 0,
      netSalary: 0,
      bonus: 0,
      overtime: 0,
      leaveDeductions: 0,
      otherAdjustments: 0,
      budgets: [],
    },
  ]);
  const [description, setDescription] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [staffIds, setStaffIds] = useState([]);

  const [receiptData, setReceiptData] = useState({
    status:"pending",
    paymentType: "cash",
    paymentDate: "",
    onlineTransactionId: "",
    chequeNumber: "",
    chequeDate: "",
    note: "",
  });

  useEffect(() => {
    dispatch(fetchCategory({ categoryType: "expense", search: "", page: 1, limit: 10000 }));
  }, [dispatch]);


  const handleCategoryChange = async(index, categoryId) => {
   const a = await dispatch(fetchBudget({ categoryId, page: 1, limit: 10000 }));
    const updatedItems = [...lineItems];
    updatedItems[index].categoryId = categoryId;
    updatedItems[index].budgetId = ""; 
    updatedItems[index].budgets = a?.payload?.data || []; 
    setLineItems(updatedItems);
  };

  const handleBudgetChange = (index, budgetId) => {
    const updatedItems = [...lineItems];
    updatedItems[index].budgetId = budgetId;
    setLineItems(updatedItems);
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...lineItems];
    updatedItems[index][field] = value;

    const { basicSalary, allowances, deductions, tax, bonus, otherAdjustments, leaveDeductions, overtime } = updatedItems[index];
    const netSalary = basicSalary + allowances + otherAdjustments + overtime + bonus - deductions - leaveDeductions - tax;
    updatedItems[index].netSalary = netSalary;

    setLineItems(updatedItems);
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        categoryId: "",
        budgetId: "",
        salaryMonth: "",
        basicSalary: 0,
        allowances: 0,
        deductions: 0,
        tax: 0,
        netSalary: 0,
        bonus: 0,
        overtime: 0,
        leaveDeductions: 0,
        otherAdjustments: 0,
        budgets: [], 
      },
    ]);
  };

  const removeLineItem = (index) => {
    const updatedItems = [...lineItems];
    updatedItems.splice(index, 1);
    setLineItems(updatedItems);
  };
   const copyLineItem = (index) => {
      let newone =lineItems[index];
       const updatedItems = [...lineItems,{
         categoryId:newone?.categoryId,
         budgetId:newone?.budgetId,
         salaryMonth:lineItems[index]?.salaryMonth,
         basicSalary:newone?.basicSalary,
         allowances:newone?.allowances,
         deductions:newone?.deductions,
         tax:newone?.tax,
         netSalary:newone?.netSalary,
         bonus:newone?.bonus,
         overtime:newone?.overtime,
         leaveDeductions:newone?.leaveDeductions,
         otherAdjustments:newone?.otherAdjustments,
         budgets:newone?.budgets, 
       }]
       setLineItems(updatedItems);
     };

  const handleSubmit = (values) => {
     if (staffIds.length < 1) {
       toast.error("Please select User");
       return;
     }
    const data = {
      description,
      lineItems,
      staffIds,
      ...receiptData,
    };
    console.log(data);
    

     dispatch(createPayroll({ data, navigate }));
  };

  const handleChange = (field, value) => {
    setReceiptData({
      ...receiptData,
      [field]: value,
    });
  };

  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];

  return (
    <Layout title="Finance | PayRoll">
      <AdminDashLayout>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="font-bold pb-2">Add New PayRoll</h1>
              <button
                className="flex flex-row items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 rounded-lg shadow-lg"
                onClick={() => setIsModalVisible(true)}
              >
                Select User <span><VscListSelection /></span>
              </button>
            </div>
            <div>
              <input
                type="text"
                className="w-[35rem] h-[3rem] border border-purple-600 rounded-lg p-2"
                placeholder="Enter Short Description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {/* Payroll Details */}
            {lineItems.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-100 space-y-4 mb-4">
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item name={["lineItems", index, "categoryId"]} label="Category" required>
                      <Select
                        style={{ width: "100%" }}
                        value={item.categoryId}
                        onChange={(value) => handleCategoryChange(index, value)}
                      >
                        {categories.map((cat) => (
                          <Option key={cat._id} value={cat._id}>
                            {cat.categoryName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name={["lineItems", index, "budgetId"]} label="Sub Category" required>
                      <Select
                        style={{ width: "100%" }}
                        value={item.budgetId}
                        onChange={(value) => handleBudgetChange(index, value)}
                      >
                        {item.budgets?.map((budget, idx) => (
                          <Option key={idx} value={budget._id}>
                            {budget.subCategory}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name={["lineItems", index, "salaryMonth"]} label="Salary Month" required>
                      <Select
                        style={{ width: "100%" }}
                        value={item.salaryMonth}
                        onChange={(value) => handleInputChange(index, "salaryMonth", value)}
                      >
                        {months.map((month, idx) => (
                          <Option key={idx} value={month}>
                            {month}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name={["lineItems", index, "basicSalary"]} label="Basic Salary" required>
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        value={item.basicSalary}
                        onChange={(value) => handleInputChange(index, "basicSalary", value)}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item name={["lineItems", index, "allowances"]} label="Allowances" required>
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        value={item.allowances}
                        onChange={(value) => handleInputChange(index, "allowances", value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name={["lineItems", index, "leaveDeductions"]} label="Leave Deductions" required>
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        value={item.allowances}
                        onChange={(value) => handleInputChange(index, "leaveDeductions", value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name={["lineItems", index, "overtime"]} label="Over time" required>
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        value={item.allowances}
                        onChange={(value) => handleInputChange(index, "overtime", value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name={["lineItems", index, "otherAdjustments"]} label="Other Adjustments" required>
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        value={item.allowances}
                        onChange={(value) => handleInputChange(index, "otherAdjustments", value)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item name={["lineItems", index, "deductions"]} label="Deductions" required>
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        value={item.deductions}
                        onChange={(value) => handleInputChange(index, "deductions", value)}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item name={["lineItems", index, "tax"]} label="Tax" required>
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        value={item.tax}
                        onChange={(value) => handleInputChange(index, "tax", value)}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item name={["lineItems", index, "bonus"]} label="Bonus" required>
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        value={item.bonus}
                        onChange={(value) => handleInputChange(index, "bonus", value)}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item name={["lineItems", index, "netSalary"]} label="Net Salary">
                      <p className="font-bold">{item.netSalary}</p>
                    </Form.Item>
                  </Col>
                </Row>

                <Button danger onClick={() => removeLineItem(index)}>Remove</Button>
                <Button  onClick={() => copyLineItem(index)} className="ml-10 border border-blue-500 text-blue-500">Copy</Button>
              </div>
            ))}

            <Button type="dashed" onClick={addLineItem} className="text-purple-500">Add New Item</Button>

            {/* Payment Details Section */}
            <div className="p-4 mt-6 border rounded-lg bg-gray-100 space-y-4">
              <h3 className="font-bold">Payment Details</h3>
              <Row gutter={16}>
              <Col span={6}>
                  <Form.Item label="Payment Status" name="status" rules={[{ required: true, message: "Payment Status is required" }]}>
                    <Select value={receiptData.paymentType} onChange={(value) => handleChange("status", value)}>
                      <Option value="pending">Pending</Option>
                      <Option value="paid">Paid</Option>
                      <Option value="hold">Hold</Option>
                    </Select>
                  </Form.Item>

                </Col>
                {receiptData.status == "paid" && <>
                <Col span={6}>
                  <Form.Item label="Payment Type" name="paymentType" rules={[{ required: true, message: "Payment Type is required" }]}>
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
                  <Form.Item label="Payment Date" name="paymentDate" rules={[{ required: true, message: "Payment Date is required" }]}>
                    <input type="date" className="w-[15rem] h-[2rem] border border-gray-300 rounded-lg p-2" value={receiptData.paymentDate} onChange={(e) => handleChange("paymentDate", e.target.value)} />
                  </Form.Item>
                </Col>
                </>}
              </Row>


              { receiptData.status == "paid" &&  receiptData.paymentType === "cheque" && (
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item label="Cheque Number" name="chequeNumber" rules={[{ required: true, message: "Cheque Number is required" }]}>
                      <Input value={receiptData.chequeNumber} onChange={(e) => handleChange("chequeNumber", e.target.value)} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Cheque Date" name="chequeDate" rules={[{ required: true, message: "Cheque Date is required" }]}>
                      <input type="date" className="w-[15rem] h-[2rem] border border-gray-300 rounded-lg p-2" value={receiptData.chequeDate} onChange={(e) => handleChange("chequeDate", e.target.value)} />
                    </Form.Item>
                  </Col>
                </Row>
              )}
            
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item label="Note" name="note">
                    <Input.TextArea value={receiptData.note} onChange={(e) => handleChange("note", e.target.value)} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 mt-4 ">Save in Config</Button>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 mt-4 ml-10 " htmlType="submit">Submit</Button>

          </Form>

          <Sidebar title="Select Multiple Users" width="50%" isOpen={isModalVisible} onClose={() => setIsModalVisible(false)}>
            <SelectStaffs staffIds={staffIds} setStaffIds={setStaffIds} />
          </Sidebar>
        </div>
      </AdminDashLayout>
    </Layout>
  );
};

export default AddPayRoll;
