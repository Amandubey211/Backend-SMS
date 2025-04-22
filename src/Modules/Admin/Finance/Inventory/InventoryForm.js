import React, { useEffect, useState } from "react";
import { Input, Select, Button, Form, DatePicker } from "antd";
import { useDispatch } from "react-redux";
import { createInventory, updateInventory } from "../../../../Store/Slices/Finance/inventory/inventory.thunk";
import FinanceCategorySelect from "../financeCategory/FinanceCategorySelect";
import dayjs from "dayjs";
import EntitySelect from "../entities/EntitySelect";

const InventoryForm = ({ visible, onClose, editData }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
   let viewMode = false;
   if(editData?.mode == "view"){
    viewMode = true
   }
  useEffect(() => {
    if (editData) {
       if(editData?.mode == "view"){
      
       }
      form.setFieldsValue({
        ...editData,
        orderDate: editData.orderDate ? dayjs(editData.orderDate) : null, 
        deliveryDate: editData.deliveryDate ? dayjs(editData.deliveryDate) : null,
      });
      setSelectedCategory({ _id: editData.categoryId, categoryName: editData.categoryName });
      setSelectedEntity({ _id: editData.supplierId._id});
    } else {
      form.resetFields();
      setSelectedCategory(null);
    }
    
    
  }, [editData, form,onClose]);

  const handleSubmit = async (values) => {
  
    
    if (editData) {
      await dispatch(updateInventory({ id: editData._id, ...values, categoryId: selectedCategory?._id, categoryName: selectedCategory?.categoryName,supplierId:selectedEntity?._id }));
    } else {
      await dispatch(createInventory({ ...values, categoryId: selectedCategory?._id, categoryName: selectedCategory?.categoryName,supplierId:selectedEntity?._id }));
    }
    onClose();
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <Form.Item name="itemName" label="Item Name" rules={[{ required: true, message: "Please enter item name" }]}> 
          <Input placeholder="Enter item name" disabled={viewMode} />
        </Form.Item>
        <Form.Item name="SKU" label="SKU" rules={[{ required: true, message: "Please enter SKU" }]}> 
          <Input placeholder="Enter SKU" disabled={viewMode}/>
        </Form.Item>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: "Please enter quantity" }]}> 
          <Input type="number" placeholder="Enter quantity" disabled={viewMode} />
        </Form.Item>
        <Form.Item name="unit" label="Unit" rules={[{ required: true, message: "Please enter unit" }]}> 
          <Input placeholder="Enter unit" disabled={viewMode} />
        </Form.Item>
      </div>
      <div className="grid grid-cols-2 gap-4">
      <Form.Item name="unitPrice" label="Unit Price" rules={[{ required: true, message: "Please enter unit price" }]}> 
        <Input type="number" placeholder="Enter unit price" disabled={viewMode} />
      </Form.Item>

      <Form.Item name="supplierId" label="Supplier" > 
      <EntitySelect  onClose={onClose} onSelect={setSelectedEntity} disabled={viewMode} EntityName={editData?.supplierId.entityName}/>
      </Form.Item>
</div>
      
      <div className="grid grid-cols-2 gap-4">
      <Form.Item name="lowStockAlert" label="Low Stock Alert" > 
        <select placeholder="Set Low Stock Alert" disabled={viewMode} className="w-full py-2 border border-gray-200 rounded-lg" > 
          <option value={true}>Yes</option>
          <option value={false}>No</option> 
        </select>
      </Form.Item>
      <Form.Item label="Category" rules={[{ required: true, message: "Please select Category" }]}>
        <FinanceCategorySelect categoryType="revenue" onSelect={setSelectedCategory} disabled={viewMode} categoryName={editData?.categoryName} onClose={onClose}/>
      </Form.Item>
</div>
          <div className="grid grid-cols-2 gap-4">
        <Form.Item name="damagedQuantity" label="Damaged Quantity" > 
          <Input type="number" placeholder="Damaged Quantity" disabled={viewMode} />
        </Form.Item>
        <Form.Item name="lowStockNumber" label="Low Stock Number" rules={[{ required: true, message: "Please enter low Stock Number" }]}> 
          <Input type="number"  placeholder="Enter Low Stock Number" disabled={viewMode} />
        </Form.Item>
          </div>
          <div className="grid grid-cols-3 gap-4">
        <Form.Item name="orderDate" label="Order Date" rules={[{ required: true, message: "Please enter Order Date" }]}> 
          <DatePicker className="w-full" disabled={viewMode} />
        </Form.Item>
        <Form.Item name="deliveryDate" label="Delivery Date" rules={[{ required: true, message: "Please enter Order Date" }]}> 
          <DatePicker className="w-full" disabled={viewMode}/>
        </Form.Item>
        <Form.Item name="expireDate" label="Expire Date" > 
          <DatePicker className="w-full" disabled={viewMode}/>
        </Form.Item>
      </div>
  
         <button disabled={viewMode} className="bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white w-full py-2" htmlType="submit"> 
          {editData ? "Update Inventory" : "Add Inventory"} 
        </button>
      
    </Form>
  );
};

export default InventoryForm;
