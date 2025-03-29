import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Select, InputNumber } from "antd";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import FinanceCategorySelect from "../financeCategory/FinanceCategorySelect";
import { createBudget } from "../../../../Store/Slices/Finance/budget/budget.thunk";

const frequencyOptions = [
  "Monthly",  "Yearly",
];

const CreateBudgetForm = ({ onClose, editData }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSubmit = async (values) => {
    const payload = {
      subCategory: values.subCategory,
      categoryId: selectedCategory?._id,
      amount: Number(values.amount),
      frequency: values.frequency,
      purpose: values.purpose,
      status: "approved",
    };

     dispatch(createBudget(payload));
     onClose()
   ;
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
      <Form.Item
          label="Category"
          required
          validateStatus={!selectedCategory ? "error" : ""}
          help={!selectedCategory ? "Please select a category" : ""}
        >
          <FinanceCategorySelect
            categoryType="expense"
            onSelect={setSelectedCategory}
            onClose={onClose}
          />
        </Form.Item>
        <Form.Item name="subCategory" label="Sub Category" rules={[{ required: true, message: "Enter Sub Category" }]}>
          <Input placeholder="Sub Category" />
        </Form.Item>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Form.Item name="amount" label="Amount" rules={[{ required: true, message: "Enter Amount" }]}>
        <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter Amount" />
        </Form.Item>

        <Form.Item name="frequency" label="Frequency" rules={[{ required: true, message: "Select Frequency" }]}>
          <select placeholder="Select Frequency" className="w-[13rem] h-[2.5rem] border border-gray-200 rounded-lg">
            {frequencyOptions.map(freq => (
              <option key={freq} value={freq}>{freq}</option>
            ))}
          </select>
        </Form.Item>
      </div>
      <Form.Item name="purpose" label="Purpose">
        <Input.TextArea placeholder="Enter Purpose" rows={3} />
      </Form.Item>

      <button
        type="submit"
        className="bg-gradient-to-r from-green-500 to-blue-500 text-white w-full py-2 rounded-md"
      >
        Create Budget
      </button>
    </Form>
  );
};

export default CreateBudgetForm;
