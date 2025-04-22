import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, DatePicker, InputNumber, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory } from "../../../../Store/Slices/Finance/Category/financeCategory.Thunk";
import { fetchInventory } from "../../../../Store/Slices/Finance/inventory/inventory.thunk";
import { VscListSelection } from "react-icons/vsc";
import Sidebar from "../../../../Components/Common/Sidebar";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SidebarEntitySelection from "./Components/SelectEntities";
import { createEntityRevenue } from "../../../../Store/Slices/Finance/EntityRevenue/EntityRevenue.thunk";
const { Option } = Select;

const EntityRevenueForm = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.admin.financialCategory.categories);

  const [form] = Form.useForm();
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
    },
  ]);

  useEffect(() => {
    dispatch(fetchCategory({ categoryType: "revenue", search: "", page: 1, limit: 10000 }));
  }, [dispatch]);
  const [description, setDescription] = useState('');
  
  
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
    updatedItems[index] = { ...updatedItems[index], categoryId, categoryName: category.categoryName, items: fetchedItems, itemId: "", itemDetails: "" };
    setLineItems(updatedItems);
  };

  const handleItemChange = (index, itemId) => {
    const updatedItems = [...lineItems];
    updatedItems[index].itemId = itemId;
    updatedItems[index].itemDetails = itemId ? updatedItems[index].items.find((item) => item._id == itemId)?.name : "";
    setLineItems(updatedItems);
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...lineItems];
    updatedItems[index][field] = value;

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
      },
    ]);
  };

  const removeLineItem = (index) => {
    const updatedItems = [...lineItems];
    updatedItems.splice(index, 1);
    setLineItems(updatedItems);
  };
const navigate = useNavigate();
const [entitiesIds,setEntitiesIds] = useState([]);
  const handleSubmit = (values) => {
    if(entitiesIds.length < 1){
      toast.error("Please select Entity")
     return
    }
  let entityIds = entitiesIds.map((e)=>{
return {entityId:e}
  })
    const data = {
      description,
      lineItems,
      entityIds 
    }
    
  dispatch(createEntityRevenue({data,navigate}))
    
  };

 
  return (
    <div className="p-6 ">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-bold pb-2">Add New Invoice</h1>
          <button className=" flex flex-row items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 rounded-lg shadow-lg" onClick={()=> setIsModalVisible(true)} >Select Entities <span><VscListSelection /></span></button>
        </div>
        <div>
          <input type="text" className="w-[35rem] h-[3rem] border border-purple-600 rounded-lg p-2" placeholder="Enter Short Description " onClick={(e)=>setDescription(e.target.value)}/>
        </div>

      </div>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
      {lineItems.map((item, index) => (
        <div key={index} className="p-4 border rounded-lg bg-gray-100 space-y-4 mb-4">
          {/* Row 1: Category, Item, Rate, Quantity */}
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name={["lineItems", index, "categoryId"]} label="Category" rules={[{ required: true ,message:"Category is required"}]}>
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
                <Form.Item name={["lineItems", index, "itemId"]} label="Item" rules={[{ required: true ,message:"Item is required"}]}>
                  <Select style={{ width: "100%" }} onChange={(value) => handleItemChange(index, value)}>
                    {item.items.map((item) => (
                      <Option key={item._id} value={item._id}>
                        {item.itemName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : (
                <Form.Item name={["lineItems", index, "itemDetails"]} label="Item Details" rules={[{ required: true ,message:"Item is required"}]}>
                  <Input style={{ width: "100%" }} onChange={(e) => handleInputChange(index, "itemDetails", e.target.value)} />
                </Form.Item>
              )}
            </Col>

            <Col span={6}>
              <Form.Item name={["lineItems", index, "rate"]} label="Rate" rules={[{ required: true ,message:"Rate is required"}]}>
                <InputNumber style={{ width: "100%" }} min={0} onChange={(value) => handleInputChange(index, "rate", value)} />
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
              <Form.Item name={["lineItems", index, "frequency"]} label="Frequency" rules={[{ required: true ,message:"frequency is required"}]}>
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
                <Form.Item name={["lineItems", index, "startDate"]} label="Start Date" rules={[{ required: true ,message:"Start Date is required"}]}>
                  <DatePicker style={{ width: "100%" }} onChange={(date) => handleInputChange(index, "startDate", date)} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name={["lineItems", index, "endDate"]} label="End Date">
                  <DatePicker style={{ width: "100%" }} onChange={(date) => handleInputChange(index, "endDate", date)} rules={[{ required: true ,message:"End Date is required"}]} />
                </Form.Item>
              </Col>
           
              </>
          )}
               <Col span={6}>
                <Form.Item name={["lineItems", index, "dueDate"]} label="Due Date">
                  <DatePicker style={{ width: "100%" }} onChange={(date) => handleInputChange(index, "dueDate", date)} rules={[{ required: true ,message:"End Date is required"}]} />
                </Form.Item>
              </Col>
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
      <Button  htmlType="submit" className=" ml-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white">Add Invoice</Button>
      <Button  htmlType="submit" className=" ml-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white">Save In Config</Button>
    </Form>
    <Sidebar
          title={ "Select Multiply Entities"}
          width="50%"
          isOpen={isModalVisible}
          onClose={handleModalClose}
        >
         <SidebarEntitySelection entitiesIds={entitiesIds} setEntitiesIds={setEntitiesIds}/>
         {entitiesIds?.length > 0 && <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white w-[90%] h-[2rem] flex items-center justify-center rounded-lg cursor-pointer absolute bottom-10" onClick={()=>handleModalClose()}>Done</div>}
        </Sidebar>
    </div>
  );
};

export default EntityRevenueForm;
