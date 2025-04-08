import React, { useEffect, useState } from "react";
import { Input, Select, Button, Form, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Option } from "antd/es/mentions";
import { createCategory, updateCategory } from "../../../../Store/Slices/Finance/Category/financeCategory.Thunk";
import CreateEditIconModal from "../../Classes/MainSection/CreateEditIconModal";
import IconGrid from "../../Classes/MainSection/IconGrid";
import { selectIcon } from "../../../../Store/Slices/Admin/Class/reducer/iconSlice";
import toast from "react-hot-toast";
import { BsInfoCircle } from "react-icons/bs";

const FinanceCategoryAddForm = ({ visible, onClose, editData }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { icons, selectedIcon } = useSelector(
    (state) => state.admin.classIcons
  );
  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
      console.log(editData);
      
      dispatch(selectIcon(icons?.find((i)=>i?.imageLink==editData?.icon)));
    } else {
      form.resetFields();
    }
  }, [editData, form,onClose]);
  
  const handleSubmit = async (values) => {
    if(!selectedIcon){
      toast.error("Please Select an Icon");
      return
    }
    console.log(selectedIcon);
    
    if (editData) {
      await dispatch(updateCategory({ id: editData._id,icon:selectedIcon?.imageLink, ...values }));
    } else {
      await dispatch(createCategory({icon:selectedIcon?.imageLink,...values}));
    }
    onClose();
  };
  
  const openModal = (icon = null) => {
    dispatch(selectIcon(icon));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="categoryName"
          label="Category Name"
          rules={[{ required: true, message: "Please enter category name" },
          { min: 3, message: "Category name must be at least 3 characters" },
          { max: 24, message: "Category name cannot exceed 24 characters" },]}
        >

          <Input placeholder="Enter category name" />
        </Form.Item>

        <Form.Item
          name="categoryType"
          label={
            <span className="flex flex-row gap-2 items-center">
              Category For
              <Tooltip
              className="cursor-pointer"
                title={
                  <>
                    <div>The category is being added either to</div>
                    <div>generate revenue or to record an expense.</div>
                  </>
                }
              >
               <BsInfoCircle />
              </Tooltip>
            </span>
          }
          rules={[{ required: true, message: "Please select category type" }]}

        >
          <select placeholder="Select category type " className="w-full py-2 border border-gray-200 rounded-lg">
          <option value="">Select Type</option>
            <option value="revenue">Revenue</option>
            <option value="expense">Expense</option>
          </select>
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="Enter description" rows={3} />
        </Form.Item>

        <div>
          <div className="flex flex-col gap-2 mt-6 mb-6 flex-grow">
            <h3 className="font-semibold">Category Icons (Optional)</h3>
            <IconGrid
              icons={icons}
              activeIconId={
                selectedIcon
                  ? selectedIcon._id || selectedIcon.id || selectedIcon
                  : null
              }
              onEdit={openModal}
              type="Category"
            />
          </div>
        </div>
        <Form.Item>
          <button className="bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white w-full py-2" htmlType="submit">
            {editData ? "Update Full Information" : "Add Category"}
          </button>
        </Form.Item>

      </Form>
      {isModalOpen && <CreateEditIconModal onClose={closeModal} type="Category" />}

    </>
  );
};

export default FinanceCategoryAddForm;
