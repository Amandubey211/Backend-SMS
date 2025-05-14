import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, InputNumber, Row, Col, Tooltip, DatePicker, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { VscListSelection } from "react-icons/vsc";
import Sidebar from "../../../../Components/Common/Sidebar";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchCategory } from "../../../../Store/Slices/Finance/Category/financeCategory.Thunk";
import Layout from '../../../../Components/Common/Layout';
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import { fetchBudget } from "../../../../Store/Slices/Finance/budget/budget.thunk";
import SidebarEntitySelection from "../entityRevenue/Components/SelectEntities";
import { createOperationalExpense } from "../../../../Store/Slices/Finance/operationalExpenses/operationalExpenses.thunk";
import { BsInfoCircle } from "react-icons/bs";
import dayjs from "dayjs";
import ConfigurationCreateModel from "../Configuration/ConfigurationCreateModel";

const { Option } = Select;

const AddOperationalExpenses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector((state) => state.admin.financialCategory.categories);
  const [form] = Form.useForm();
  const [lineItems, setLineItems] = useState([
    {
      categoryId: "",
      budgetId: "",
      rate: 0,
      quantity: 0,
      unit: 0,
      amount: 0,
      frequency: "",
      startDate: "",
      endDate: "",
      budgets: [],
    },


  ]);
  const [description, setDescription] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [entitiesIds, setEntitiesIds] = useState([]);

  const [receiptData, setReceiptData] = useState({
    status: "pending",
    paymentType: "cash",
    paymentDate: "",
    onlineTransactionId:"",
    chequeNumber: "",
    chequeDate: "",
    note: "",
  });
  const location = useLocation();
  useEffect(() => {
    if(location?.state){
      let lIt =location?.state?.configData?.lineItems.map((i)=>{
        return {
          ...i,
             startDate:"",
          endDate:""
        }
      });
      setLineItems(lIt);
      setEntitiesIds(location?.state?.configData?.entitiesIds);
      form.setFieldsValue({
        lineItems: lIt,
      });
    }
    dispatch(fetchCategory({ categoryType: "expense", search: "", page: 1, limit: 10000 }));
  }, [dispatch]);


  const handleCategoryChange = async (index, categoryId) => {
    const a = await dispatch(fetchBudget({ categoryId, page: 1, limit: 10000 }));
    const updatedItems = [...lineItems];
    updatedItems[index].categoryId = categoryId;
    updatedItems[index].budgetId = "";
    updatedItems[index].budgets = a?.payload?.data || [];
    let updatedItemsfix = updatedItems.map((i) => ({ ...i, 
      startDate:  i?.startDate?.length > 0 ? dayjs(i?.startDate?.slice(0, 10)) : null,
      enfDate: i?.endDate?.length >0 ? dayjs(i?.endDate?.slice(0, 10)) : null,
      dueDate:  i?.dueDate?.length >0 ? dayjs(i?.dueDate?.slice(0, 10)) : null,
     }))
    setLineItems(updatedItemsfix);
  };

  const handleBudgetChange = (index, budgetId) => {
    const updatedItems = [...lineItems];
    updatedItems[index].budgetId = budgetId;
    setLineItems(updatedItems);
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...lineItems];
    updatedItems[index][field] = field.includes('Date') && value ? value.format('YYYY-MM-DD') : value;

    // Auto-calculate amount if rate, quantity, or unit is updated
    const { rate, quantity } = updatedItems[index];
    updatedItems[index].amount = rate * quantity;

    setLineItems(updatedItems);
  };


  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        categoryId: "",
        budgetId: "",
        rate: 0,
        quantity: 0,
        unit: 0,
        amount: 0,
        paidAmount:0,
        frequency: "",
        startDate: "",
        endDate: "",
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
    let newone = lineItems[index];
    setLineItems([
      ...lineItems,
      newone
    ]);
  };
  const [configModel, setConfigModel] = useState(false);
  const [isConfigData, setIsConfigData] = useState(false);
  const closeConfigModel = ()=>{
    setIsConfigData(false)
    setConfigModel(false)
  }
  const handleSubmit = () => {
    if (entitiesIds.length < 1) {
      toast.error("Please select User");
      return;
    }
    const data = {
      description,
      lineItems,
      entitiesIds,
      ...receiptData,
    };
    if(isConfigData){
      setConfigModel(true)
      return 
    }else{
    
   dispatch(createOperationalExpense({data,navigate}))}

  };

  const handleChange = (field, value) => {
    setReceiptData({
      ...receiptData,
      [field]: field.includes('Date') && value ? value.format('YYYY-MM-DD') : value,
    });
  };

  const { activeYear } = useSelector((store) => store.common.financialYear);
  const minDate = dayjs(activeYear?.startDate?.slice(0, 10));
  const maxDate = dayjs(activeYear?.endDate?.slice(0, 10));
  return (
    <Layout title="Finance | Add Expense">
      <AdminDashLayout>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="font-bold pb-2">Add New Operational Expenses</h1>
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
            {/* OperationalExpenses Details */}
            {lineItems?.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-100 space-y-4 mb-4">
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item name={["lineItems", index, "categoryId"]} 
                    label={
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Category</span>
                        <Tooltip
                          title={
                            <>
                              <div className="text-xs">Shows Expense  categories only.
                              Use this to track purchases.</div>
      
                            </>
                          }
                        >
                          <BsInfoCircle className="cursor-pointer" />
                        </Tooltip>
                      </span>
                    } 
                    required>
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
                    <Form.Item name={["lineItems", index, "rate"]} label="Rate">
                      <InputNumber style={{ width: "100%" }} value={item.rate} onChange={(value) => handleInputChange(index, "rate", value)} />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item name={["lineItems", index, "quantity"]} label="Quantity">
                      <InputNumber style={{ width: "100%" }} value={item.quantity} onChange={(value) => handleInputChange(index, "quantity", value)} />
                    </Form.Item>
                  </Col>


                  <Col span={6}>
                    <Form.Item name={["lineItems", index, "frequency"]} label="Frequency">
                      <Select value={item.frequency} onChange={(value) => handleInputChange(index, "frequency", value)}>
                        <Option value="Permanent Purchase">Permanent Purchase</Option>
                        <Option value="Monthly">Monthly</Option>
                        <Option value="Quarterly">Quarterly</Option>
                        <Option value="Half yearly">Half yearly</Option>
                        <Option value="Yearly">Yearly</Option>
                        <Option value="Custom Date">Custom Date</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  {lineItems[index].frequency == "Permanent Purchase" ? <>
                    <Col span={6}>
                      <Form.Item name={["lineItems", index, "unit"]} label="Unit">
                        <input type="text" className="w-full h-[2rem] border border-gray-300 rounded-lg p-2" style={{ width: "100%" }} value={item.unit} onChange={(e) => handleInputChange(index, "unit", e.target.value)} placeholder="e.g, Pieces,Meter..." />
                      </Form.Item>
                    </Col>
                  </> : <>
                    <Col span={6}>
                      <Form.Item name={["lineItems", index, "startDate"]} label="Start Date">
                        <DatePicker type="date" className="w-full h-[2rem] border border-gray-300 rounded-lg p-2" value={item.startDate } onChange={(e) => handleInputChange(index, "startDate", e)} 
                           disabledDate={(current) =>
                            current && (current.isBefore(minDate, 'day') || current.isAfter(maxDate, 'day'))
                          }/>
                      </Form.Item>
                    </Col>

                    <Col span={6}>
                      <Form.Item name={["lineItems", index, "endDate"]} label="End Date">
                        <DatePicker type="date" className="w-full h-[2rem] border border-gray-300 rounded-lg p-2" value={item.endDate } onChange={(e) => handleInputChange(index, "endDate", e)}  disabledDate={(current) =>
                    current && (current.isBefore(minDate, 'day') || current.isAfter(maxDate, 'day'))
                  }/>
                      </Form.Item>
                    </Col>
                  </>}
                  
                  {receiptData.status == "partial" &&
                    <Col span={6}>
                    <Form.Item name={["lineItems", index, "paidAmount"]} label="Paid Now" required>
                      <input style={{ width: "100%" }} className="w-[15rem] h-[2rem] border border-gray-300 rounded-lg p-2" value={item.paidAmount} onChange={(e) => handleInputChange(index, "paidAmount", e.target.value)} />
                    </Form.Item>
                  </Col>}
                  <Col span={6}>
                    <Form.Item name={["lineItems", index, "amount"]} label="Amount">
                      <p>= {item?.amount}</p>
                    </Form.Item>
                  </Col>

                </Row>
                <Button danger onClick={() => removeLineItem(index)}>Remove</Button>
                {/* <Button onClick={() => copyLineItem(index)} 
                className="ml-10 border border-blue-500 text-blue-500">Copy</Button> */}
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
                      <Option value="partial">Partial</Option>
                      <Option value="hold">Hold</Option>
                    </Select>
                  </Form.Item>

                </Col>
                {receiptData.status == "paid" | receiptData.status == "partial" ?
                 <>
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
                    <Form.Item name="onlineTransactionId" label="Online Transaction Id">
                        <input type="text" className="w-full h-[2rem] border border-gray-300 rounded-lg p-2" style={{ width: "100%" }} value={receiptData.onlineTransactionId} onChange={(e) => handleChange("onlineTransactionId", e.target.value)} placeholder="Online Transaction Id" />
                      </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item label="Payment Date" name="paymentDate" rules={[{ required: true, message: "Payment Date is required" }]}>
                      <DatePicker type="date" className="w-[15rem] h-[2rem] border border-gray-300 rounded-lg p-2" value={receiptData.paymentDate} onChange={(e) => handleChange("paymentDate", e)}
                       disabledDate={(current) =>
                        current && (current.isBefore(minDate, 'day') || current.isAfter(maxDate, 'day'))
                      }
                       />
                    </Form.Item>
                  </Col>
                </>:null}
              </Row>

              {receiptData.status == "paid" && receiptData.paymentType === "cheque" && (
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item label="Cheque Number" name="chequeNumber" rules={[{ required: true, message: "Cheque Number is required" }]}>
                      <Input value={receiptData.chequeNumber} onChange={(e) => handleChange("chequeNumber", e.target.value)} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Cheque Date" name="chequeDate" rules={[{ required: true, message: "Cheque Date is required" }]}>
                      <DatePicker type="date" className="w-[15rem] h-[2rem] border border-gray-300 rounded-lg p-2" value={receiptData.chequeDate} onChange={(e) => handleChange("chequeDate", e)}  disabledDate={(current) =>
                    current && (current.isBefore(minDate, 'day') || current.isAfter(maxDate, 'day'))
                  } />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item label="Note" name="note" rules={[{ required: receiptData.status == "hold"?true:false, message: "Please Enter Hold reason" }]}>
                    <Input.TextArea value={receiptData.note} onChange={(e) => handleChange("note", e.target.value)} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 mt-4 ml-10 " htmlType="submit">Submit</Button>
            <Button htmlType="submit" onClick={()=> setIsConfigData(true)}  className=" ml-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white">Save In Config</Button>
          </Form>

          <Sidebar title="Select Multiple Users" width="50%" isOpen={isModalVisible} onClose={() => setIsModalVisible(false)}>
            <SidebarEntitySelection entitiesIds={entitiesIds} setEntitiesIds={setEntitiesIds} />
            {entitiesIds?.length > 0 && <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white w-[90%] h-[2rem] flex items-center justify-center rounded-lg cursor-pointer absolute bottom-10" onClick={()=>setIsModalVisible(false)}>Done</div>}
          </Sidebar>
        </div>
        <Modal
      open={configModel}
      onClose={()=>closeConfigModel()}
      onCancel={()=>closeConfigModel()}
      footer={null}
      >
       <ConfigurationCreateModel closeConfigModel={closeConfigModel} data={{lineItems,entitiesIds}} configType="generalExpense"/>
      </Modal>
      </AdminDashLayout>
    </Layout>
  );
};

export default AddOperationalExpenses;
