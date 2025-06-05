import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, DatePicker, InputNumber, Row, Col, Tooltip, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory } from "../../../../Store/Slices/Finance/Category/financeCategory.Thunk";
import { fetchInventory } from "../../../../Store/Slices/Finance/inventory/inventory.thunk";
import { VscListSelection } from "react-icons/vsc";
import Sidebar from "../../../../Components/Common/Sidebar";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarEntitySelection from "./Components/SelectEntities";
import { createEntityRevenue } from "../../../../Store/Slices/Finance/EntityRevenue/EntityRevenue.thunk";
import { BsInfoCircle } from "react-icons/bs";
import dayjs from "dayjs";
import ConfigurationCreateModel from "../Configuration/ConfigurationCreateModel";
import { getAllPenalties } from "../../../../Store/Slices/Finance/Penalty/Penaltythunk";
const { Option } = Select;

const EntityRevenueForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const categories = useSelector((state) => state.admin.financialCategory.categories);
  const { activeYear } = useSelector((store) => store.common.financialYear);
  const [penalties, setPenalties] = useState([]);
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
      dueDate: null,
      penaltyId: "",
    },
  ]);
  const [entitiesIds, setEntitiesIds] = useState([]);
  const [description, setDescription] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [configModel, setConfigModel] = useState(false);
  const [isConfigData, setIsConfigData] = useState(false);

  useEffect(() => {
    if (location?.state) {
      let lIt = location?.state?.configData?.lineItems.map((i) => ({
        ...i,
        dueDate: "",
        startDate: "",
        endDate: "",
        penaltyId: "",
      }));
      setLineItems(lIt);
      setEntitiesIds(location?.state?.configData?.entitiesIds);
      form.setFieldsValue({
        lineItems: lIt,
      });
    }
    dispatch(fetchCategory({ categoryType: "revenue", search: "", page: 1, limit: 10000 }));
    const fetchPenalties = async () => {
      const response = await dispatch(getAllPenalties({ search: "", page: 1, limit: 1000, isActive: undefined }));
      if (response?.payload?.success) {
        setPenalties(response?.payload?.data || []);
      } else {
        toast.error(response?.payload?.message || "Failed to fetch penalties");
      }
    };
    fetchPenalties();
  }, [dispatch, location?.state, form]);

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const closeConfigModel = () => {
    setIsConfigData(false);
    setConfigModel(false);
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
    updatedItems[index].itemDetails = itemId ? updatedItems[index].items.find((item) => item._id === itemId)?.name : "";
    updatedItems[index].rate = itemId ? updatedItems[index].items.find((item) => item._id === itemId)?.unitPrice : 0;
    let updatedItemsfix = updatedItems.map((i) => ({
      ...i,
      startDate: i?.startDate?.length > 0 ? dayjs(i?.startDate?.slice(0, 10)) : null,
      endDate: i?.endDate?.length > 0 ? dayjs(i?.endDate?.slice(0, 10)) : null, // Fixed typo: enfDate -> endDate
      dueDate: i?.dueDate?.length > 0 ? dayjs(i?.dueDate?.slice(0, 10)) : null,
    }));
    setLineItems(updatedItemsfix);
    form.setFieldsValue({
      lineItems: updatedItemsfix,
    });
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...lineItems];
    updatedItems[index][field] = field.includes("Date") && value ? value.format("YYYY-MM-DD") : value;

    // If dueDate is cleared, also clear penaltyId
    if (field === "dueDate" && !value) {
      updatedItems[index].penaltyId = "";
      form.setFieldsValue({
        lineItems: updatedItems,
      });
    }

    // If penaltyId is cleared, set it to an empty string
    if (field === "penaltyId" && !value) {
      updatedItems[index].penaltyId = "";
    }

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
        penaltyId: "",
      },
    ]);
  };

  const removeLineItem = (index) => {
    const updatedItems = [...lineItems];
    updatedItems.splice(index, 1);
    setLineItems(updatedItems);
  };

  const handleSubmit = (values) => {
    if (entitiesIds.length < 1) {
      toast.error("Please select Entity");
      return;
    }

    // Validate that penaltyId is selected if dueDate is set and penalties are available
    for (let i = 0; i < lineItems.length; i++) {
      const item = lineItems[i];
      if (item.dueDate && penalties.length > 0 && !item.penaltyId) {
        toast.error(`Please select a penalty for line item ${i + 1} since a due date is set`);
        return;
      }
    }

    let entityIds = entitiesIds.map((e) => ({ entityId: e }));
    const data = {
      description,
      lineItems,
      entityIds,
    };
    if (isConfigData) {
      setConfigModel(true);
      return;
    } else {
      console.log("Data to be sent:", JSON.stringify(data, null, 2));
      dispatch(createEntityRevenue({ data, navigate }));
    }
  };

  const minDate = dayjs(activeYear?.startDate?.slice(0, 10));
  const maxDate = dayjs(activeYear?.endDate?.slice(0, 10));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-bold pb-2">Add New Invoice</h1>
          <button
            className="flex flex-row items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 rounded-lg shadow-lg"
            onClick={() => setIsModalVisible(true)}
          >
            Select Entities <span><VscListSelection /></span>
          </button>
        </div>
        <div>
          <input
            type="text"
            className="w-[35rem] h-[3rem] border border-purple-600 rounded-lg p-2"
            placeholder="Enter Short Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>
      </div>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {lineItems.map((item, index) => (
          <div key={index} className="p-4 border rounded-lg bg-gray-100 space-y-4 mb-4">
            {/* Row 1: Category, Item, Rate, Quantity */}
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  name={["lineItems", index, "categoryId"]}
                  label={
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Category</span>
                      <Tooltip
                        title={
                          <div className="text-xs">
                            Only Asset and Revenue categories appear here. Use this to log income, grants, or asset-related earnings from entities
                          </div>
                        }
                      >
                        <BsInfoCircle className="cursor-pointer" />
                      </Tooltip>
                    </span>
                  }
                  rules={[{ required: true, message: "Category is required" }]}
                >
                  <Select style={{ width: "100%" }} onChange={(value) => handleCategoryChange(index, value)} placeholder="Select Category">
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
                    <Select style={{ width: "100%" }} onChange={(value) => handleItemChange(index, value)} placeholder="Select Item">
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
                  <Select style={{ width: "100%" }} onChange={(value) => handleInputChange(index, "discountType", value)} placeholder="Select Discount Type">
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

            {/* Row 3: Frequency, Start Date, End Date, Due Date, Penalty Select */}
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name={["lineItems", index, "frequency"]} label="Frequency" rules={[{ required: true, message: "Frequency is required" }]}>
                  <Select style={{ width: "100%" }} onChange={(value) => handleInputChange(index, "frequency", value)} placeholder="Select Frequency">
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
                      <DatePicker
                        style={{ width: "100%" }}
                        onChange={(date) => handleInputChange(index, "startDate", date)}
                        disabledDate={(current) =>
                          current && (current.isBefore(minDate, "day") || current.isAfter(maxDate, "day"))
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name={["lineItems", index, "endDate"]} label="End Date">
                      <DatePicker
                        style={{ width: "100%" }}
                        onChange={(date) => handleInputChange(index, "endDate", date)}
                        rules={[{ required: true, message: "End Date is required" }]}
                        disabledDate={(current) =>
                          current && (current.isBefore(minDate, "day") || current.isAfter(maxDate, "day"))
                        }
                      />
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col span={6}>
                <Form.Item name={["lineItems", index, "dueDate"]} label="Due Date">
                  <DatePicker
                    style={{ width: "100%" }}
                    onChange={(date) => handleInputChange(index, "dueDate", date)}
                    rules={[{ required: true, message: "Due Date is required" }]}
                    disabledDate={(current) =>
                      current && (current.isBefore(minDate, "day") || current.isAfter(maxDate, "day"))
                    }
                  />
                </Form.Item>
              </Col>
              {item.dueDate && (
                <Col span={6}>
                  <Form.Item
                    name={["lineItems", index, "penaltyId"]}
                    label="Penalty"
                  >
                    <Select
                      style={{ width: "100%" }}
                      onChange={(value) => handleInputChange(index, "penaltyId", value)}
                      placeholder="Select Penalty"
                      allowClear
                    >
                      {penalties.map((penalty) => (
                        <Option key={penalty._id} value={penalty._id}>
                          {penalty.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
              <Col span={6}>
                <Form.Item name={["lineItems", index, "finalAmount"]} label="Sub Amount">
                  <p className="font-bold"> = {item.finalAmount} </p>
                </Form.Item>
              </Col>
            </Row>
            <Button danger onClick={() => removeLineItem(index)}>Remove</Button>
          </div>
        ))}

        <Button type="dashed" onClick={addLineItem} className="text-purple-500">
          Add New Item
        </Button>
        <Button htmlType="submit" className="ml-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
          Add Invoice
        </Button>
        <Button
          htmlType="submit"
          onClick={() => setIsConfigData(true)}
          className="ml-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white"
        >
          Save In Config
        </Button>
      </Form>
      <Sidebar
        title={"Select Multiply Entities"}
        width="50%"
        isOpen={isModalVisible}
        onClose={handleModalClose}
      >
        <SidebarEntitySelection entitiesIds={entitiesIds} setEntitiesIds={setEntitiesIds} />
        {entitiesIds?.length > 0 && (
          <div
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white w-[90%] h-[2rem] flex items-center justify-center rounded-lg cursor-pointer absolute bottom-10"
            onClick={() => handleModalClose()}
          >
            Done
          </div>
        )}
      </Sidebar>
      <Modal
        open={configModel}
        onClose={() => closeConfigModel()}
        onCancel={() => closeConfigModel()}
        footer={null}
      >
        <ConfigurationCreateModel
          closeConfigModel={closeConfigModel}
          data={{ lineItems, entitiesIds }}
          configType="entityRevenue"
        />
      </Modal>
    </div>
  );
};

export default EntityRevenueForm;