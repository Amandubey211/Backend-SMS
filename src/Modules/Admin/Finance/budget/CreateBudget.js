import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Select, InputNumber, Tooltip } from "antd";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import FinanceCategorySelect from "../financeCategory/FinanceCategorySelect";
import { createBudget } from "../../../../Store/Slices/Finance/budget/budget.thunk";
import { BsInfoCircle } from "react-icons/bs";

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
          label={
            <span className="flex items-center gap-1">
              <span className="font-medium">Category</span>
              <Tooltip
                title={
                  <>
                    <div className="text-xs">Only Expense categories appear here.
                    Use this to allocate budgets for salaries, rent, maintenance, etc.</div>
                  </>
                }
              >
                <BsInfoCircle className="cursor-pointer" />
              </Tooltip>
            </span>
          } 
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
          <option  value=''>Select</option>
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
        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white w-full py-2 rounded-md"
      >
        Create Budget
      </button>
    </Form>
  );
};

export default CreateBudgetForm;
