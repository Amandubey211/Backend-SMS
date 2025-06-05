import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, DatePicker, InputNumber, Row, Col, Descriptions, Tooltip, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory } from "../../../../Store/Slices/Finance/Category/financeCategory.Thunk";
import { fetchInventory } from "../../../../Store/Slices/Finance/inventory/inventory.thunk";
import { VscListSelection } from "react-icons/vsc";
import Sidebar from "../../../../Components/Common/Sidebar";
import SidebarClassSelection from "./Components/SelectClassAndSection.js";
import toast from "react-hot-toast";
import { createStudentFee } from "../../../../Store/Slices/Finance/StudentFees/studentFeesThunks";
import { useLocation, useNavigate } from "react-router-dom";
import { BsInfoCircle } from "react-icons/bs";
import dayjs from "dayjs";
import ConfigurationCreateModel from "../Configuration/ConfigurationCreateModel.js";
import { setStudentId } from "../../../../Store/Slices/Common/User/reducers/userSlice.js";
import { getAllPenalties } from "../../../../Store/Slices/Finance/Penalty/Penaltythunk.js";
const { Option } = Select;

const StudentFeeForm = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.admin.financialCategory.categories);
  const [penalties, setpanelties] = useState([])
  const [form] = Form.useForm();
  const [studentIds, setStudentIds] = useState([]);

  const [lineItems, setLineItems] = useState([
    {
      categoryId: "",
      categoryName: "",
      items: [],
      itemId: "",
      itemDetails: "",
      rate: 0,
      quantity: 1,
      penalty: 0,
      tax: 0,
      discount: 0,
      discountType: "amount",
      finalAmount: 0,
      frequency: "Permanent Purchase",
      startDate: null,
      endDate: null,
      dueDate: null,
      penaltyId: ""
    },
  ]);
  const location = useLocation();
  const [classAndSectionDetail, setClassAndSectionDetail] = useState([]);
  useEffect(() => {
    if (location?.state) {
      let lIt = location?.state?.configData?.lineItems.map((i) => {
        return {
          ...i,
          dueDate: null,
          startDate: null,
          endDate: null,
          penaltyId: "",
        }
      });
      setLineItems(lIt);
      setStudentIds(location?.state?.configData?.studentIds);
      setClassAndSectionDetail(location?.state?.configData?.classAndSectionDetail);
      form.setFieldsValue({
        lineItems: lIt,
      });
    }
    dispatch(fetchCategory({ categoryType: "revenue", search: "", page: 1, limit: 10000 }));
    const fetchPenalties = async () => {
      const response = await dispatch(getAllPenalties({ search: "", page: 1, limit: 1000, isActive: undefined }));
      if (response?.payload?.success) {
        setpanelties(response?.payload?.data || []);
      }
      else {
        toast.error(response?.payload?.message || "Failed to fetch penalties");
      }
    }
    fetchPenalties();
  }, [dispatch]);
  const [description, setDescription] = useState('');


  const [studentDetail, setStudentDetail] = useState({
    classes: '',
    sections: [{
      sectionId: '',
      sectionName: '',
      students: [],
      selected: false
    }],

  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalClose = (s) => {
    setIsModalVisible(false);

  };

  const handleCategoryChange = async (index, categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    if (!category) return;

    const res = await dispatch(fetchInventory({ status: "Available", search: category.categoryName, page: 1, limit: 1000 }));
    const fetchedItems = res.payload?.data || [];

    const updatedItems = [...lineItems];
    updatedItems[index] = { ...updatedItems[index], categoryId, categoryName: category.categoryName, items: fetchedItems, itemId: "", itemDetails: "", rate: 0, };
    // console.log(updatedItems);
    let updatedItemsfix = updatedItems.map((i) => ({
      ...i,
      startDate: i?.startDate?.length > 0 ? dayjs(i?.startDate?.slice(0, 10)) : null,
      enfDate: i?.endDate?.length > 0 ? dayjs(i?.endDate?.slice(0, 10)) : null,
      dueDate: i?.dueDate?.length > 0 ? dayjs(i?.dueDate?.slice(0, 10)) : null,
    }))
    setLineItems(updatedItemsfix);
    form.setFieldsValue({
      lineItems: updatedItemsfix
    });
  };

  const handleItemChange = (index, itemId) => {


    const updatedItems = [...lineItems];
    updatedItems[index].itemId = itemId;
    updatedItems[index].itemDetails = itemId ? updatedItems[index].items.find((item) => item._id === itemId)?.name : "";
    updatedItems[index].rate = itemId ? updatedItems[index].items.find((item) => item._id === itemId)?.unitPrice : 0;
    setLineItems(updatedItems);
    form.setFieldsValue({
      lineItems: updatedItems
    });
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...lineItems];
    updatedItems[index][field] = field.includes('Date') && value ? value?.format('YYYY-MM-DD') : value;


    const rate = updatedItems[index].rate || 0;
    const quantity = updatedItems[index].quantity || 1;
    const penalty = updatedItems[index].penalty || 0;
    const tax = updatedItems[index].tax || 0;
    const discount = updatedItems[index].discount || 0;
    const discountType = updatedItems[index].discountType;

    let subtotal = rate * quantity;
    let taxAmount = (subtotal * tax) / 100;

    let finalAmount = subtotal + penalty + taxAmount;

    if (discountType === "percentage") {
      finalAmount -= (finalAmount * discount) / 100;
    } else {
      finalAmount -= discount;
    }

    updatedItems[index].finalAmount = finalAmount;
    setLineItems(updatedItems);
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        categoryId: "",
        categoryName: "",
        items: [],
        itemId: null,
        itemDetails: "",
        rate: 0,
        quantity: 1,
        penalty: 0,
        tax: 0,
        discount: 0,
        discountType: "amount",
        finalAmount: 0,
        frequency: "Permanent Purchase",
        startDate: null,
        endDate: null,
        dueDate: null,
        penaltyId: ""
      },
    ]);
  };

  const removeLineItem = (index) => {
    const updatedItems = [...lineItems];
    updatedItems.splice(index, 1);
    setLineItems(updatedItems);
  };
  const { studentsIdsArray } = useSelector((state) => state.admin.studentFees);
  const navigate = useNavigate();
  const [configModel, setConfigModel] = useState(false);
  const [isConfigData, setIsConfigData] = useState(false);
  const closeConfigModel = () => {
    setIsConfigData(false)
    setConfigModel(false)
  }
  const handleSubmit = (values) => {
    if (studentsIdsArray?.length < 1) {
      toast.error("Please Select Student");
      return
    }
    const data = {
      description,
      lineItems,
      studentIds: studentsIdsArray
    }
    if (isConfigData) {
      setConfigModel(true)
      return
    } else {
      dispatch(createStudentFee({ feeData: data, navigate }))
    }
  };
  const { activeYear } = useSelector((store) => store.common.financialYear);
  const minDate = dayjs(activeYear?.startDate?.slice(0, 10));
  const maxDate = dayjs(activeYear?.endDate?.slice(0, 10));

  return (
    <div className="p-6 ">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-bold pb-2">Add New Fees</h1>
          <button className=" flex flex-row items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 rounded-lg shadow-lg" onClick={() => setIsModalVisible(true)} >Select Students <span><VscListSelection /></span></button>
        </div>
        <div>
          <input type="text" className="w-[35rem] h-[3rem] border border-purple-600 rounded-lg p-2" placeholder="Enter Short Description " onClick={(e) => setDescription(e.target.value)} />
        </div>

      </div>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {lineItems.map((item, index) => (
          <div key={index} className="p-4 border rounded-lg bg-gray-100 space-y-4 mb-4">
            {/* Row 1: Category, Item, Rate, Quantity */}
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name={["lineItems", index, "categoryId"]} label=
                  {
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Category</span>
                      <Tooltip
                        title={
                          <>
                            <div className="text-xs">Only Asset and Revenue categories appear here.
                              Use this to log income from tuition, transport, uniforms, etc.
                            </div>

                          </>
                        }
                      >
                        <BsInfoCircle className="cursor-pointer" />
                      </Tooltip>
                    </span>
                  }
                  rules={[{ required: true, message: "Category is required" }]}>
                  <Select style={{ width: "100%" }} onChange={(value) => handleCategoryChange(index, value)}>
                    {categories.map((cat) => (
                      <Option key={cat._id} value={cat._id}>
                        {cat.categoryName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>


              <Col span={6}>
                {item.items.length > 0 ? (
                  <Form.Item name={["lineItems", index, "itemId"]} label="Item" rules={[{ required: true, message: "Item is required" }]}>
                    <Select style={{ width: "100%" }} onChange={(value) => handleItemChange(index, value)}>
                      {item.items.map((item) => (
                        <Option key={item._id} value={item._id}>
                          {item.itemName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                ) : (
                  <Form.Item name={["lineItems", index, "itemDetails"]} label="Item Details" rules={[{ required: true, message: "Item is required" }]}>
                    <Input style={{ width: "100%" }} onChange={(e) => handleInputChange(index, "itemDetails", e.target.value)} />
                  </Form.Item>
                )}
              </Col>

              <Col span={6}>
                <Form.Item name={["lineItems", index, "rate"]} label="Rate" rules={[{ required: true, message: "Rate is required" }]}>

                  <input type="Number" className="w-[15rem] h-[2rem] border border-gray-300 rounded-lg p-2" value={lineItems[index].rate} onChange={(e) => handleInputChange(index, "rate", e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name={["lineItems", index, "quantity"]} label="Quantity">
                  <InputNumber style={{ width: "100%" }} min={1} value={item.quantity} onChange={(value) => handleInputChange(index, "quantity", value)} />
                </Form.Item>
              </Col>
            </Row>

            {/* Row 2: Tax, Penalty, Discount Type, Discount Amount */}
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name={["lineItems", index, "tax"]} label="Tax (%)">
                  <InputNumber style={{ width: "100%" }} min={0} max={100} onChange={(value) => handleInputChange(index, "tax", value)} />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name={["lineItems", index, "penalty"]} label="Penalty">
                  <InputNumber style={{ width: "100%" }} min={0} onChange={(value) => handleInputChange(index, "penalty", value)} />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name={["lineItems", index, "discountType"]} label="Discount Type">
                  <Select style={{ width: "100%" }} onChange={(value) => handleInputChange(index, "discountType", value)}>
                    <Option value="percentage">Percentage</Option>
                    <Option value="amount">Amount</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name={["lineItems", index, "discount"]} label="Discount">
                  <InputNumber style={{ width: "100%" }} min={0} onChange={(value) => handleInputChange(index, "discount", value)} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name={["lineItems", index, "frequency"]} label="Frequency" rules={[{ required: true, message: "frequency is required" }]}>
                  <Select style={{ width: "100%" }} onChange={(value) => handleInputChange(index, "frequency", value)}>
                    <Option value="Permanent Purchase">Permanent Purchase</Option>
                    <Option value="Monthly">Monthly</Option>
                    <Option value="Half yearly">Half yearly</Option>
                    <Option value="Yearly">Yearly</Option>
                    <Option value="Custom Date">Custom Date</Option>
                  </Select>
                </Form.Item>
              </Col>

              {item.frequency !== "Permanent Purchase" && (
                <>
                  <Col span={6}>
                    <Form.Item name={["lineItems", index, "startDate"]} label="Start Date" rules={[{ required: true, message: "Start Date is required" }]}>
                      <DatePicker style={{ width: "100%" }} onChange={(date) => handleInputChange(index, "startDate", date)} disabledDate={(current) =>
                        current && (current.isBefore(minDate, 'day') || current.isAfter(maxDate, 'day'))
                      } />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name={["lineItems", index, "endDate"]} label="End Date">
                      <DatePicker style={{ width: "100%" }} onChange={(date) => handleInputChange(index, "endDate", date)} rules={[{ required: true, message: "End Date is required" }]} disabledDate={(current) =>
                        current && (current.isBefore(minDate, 'day') || current.isAfter(maxDate, 'day'))
                      } />
                    </Form.Item>
                  </Col>

                </>
              )}
              <Col span={6}>
                <Form.Item name={["lineItems", index, "dueDate"]} label="Due Date">
                  <DatePicker style={{ width: "100%" }} onChange={(date) => handleInputChange(index, "dueDate", date)} rules={[{ required: true, message: "End Date is required" }]} disabledDate={(current) =>
                    current && (current.isBefore(minDate, 'day') || current.isAfter(maxDate, 'day'))
                  } />
                </Form.Item>
              </Col>
              {
                item.dueDate && (
                  <Col span={6}>
                    <Form.Item name={["lineItems", index, "penaltyId"]} label="Name">
                      <Select style={{ width: "100%" }} onChange={(value) => handleInputChange(index, "penaltyId", value)} placeholder="Select Penalty">
                        {
                          penalties.map((penalty) => (
                            <Option key={penalty._id} value={penalty._id}>
                              {penalty.name}</Option>
                          ))
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                )
              }
              <Col span={6}>
                <Form.Item name={["lineItems", index, "finalAmount"]} label="Sub Amount">

                  <p className="font-bold"> = {item.finalAmount} </p>
                </Form.Item>
              </Col>
            </Row>
            <Button danger onClick={() => removeLineItem(index)}>Remove</Button>
          </div>
        ))}

        <Button type="dashed" onClick={addLineItem} className=" text-purple-500 " >Add New Item</Button>
        <Button htmlType="submit" className=" ml-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white">Add Fees</Button>
        <Button htmlType="submit" onClick={() => setIsConfigData(true)} className=" ml-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white">Save In Config</Button>
      </Form>
      <Sidebar
        title={"Select Multiply classes & sections"}
        width="50%"
        isOpen={isModalVisible}
        onClose={handleModalClose}
      >
        <SidebarClassSelection onClose={handleModalClose} studentIds={studentIds} setStudentIds={setStudentIds} classAndSectionDetail={classAndSectionDetail} setClassAndSectionDetail={setClassAndSectionDetail} />
        {studentsIdsArray.length > 0 && <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white w-[90%] h-[2rem] flex items-center justify-center rounded-lg cursor-pointer absolute bottom-10" onClick={() => handleModalClose()}>Done</div>}
      </Sidebar>
      <Modal
        open={configModel}
        onClose={() => closeConfigModel()}
        onCancel={() => closeConfigModel()}
        footer={null}
      >
        <ConfigurationCreateModel closeConfigModel={closeConfigModel} data={{ lineItems, studentIds, classAndSectionDetail }} configType="studentRevenue" />
      </Modal>
    </div>
  );
};

export default StudentFeeForm;
