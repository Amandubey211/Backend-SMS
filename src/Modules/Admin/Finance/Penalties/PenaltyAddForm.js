import React, { useEffect } from "react";
import { Input, Select, Form, Button, InputNumber, Switch } from "antd";
import { useDispatch } from "react-redux";
import { createPenalty, updatePenalty } from "../../../../Store/Slices/Finance/Penalty/Penaltythunk";
import toast from "react-hot-toast";

const PenaltyAddForm = ({ visible, onClose, editData, onSuccess }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const isViewMode = editData?.mode === "view";
    useEffect(() => {
        if (editData) {
            form.setFieldsValue(editData);
        } else {
            form.resetFields();
            form.setFieldsValue({ isActive: true });
        }
    }, [editData, form, onClose]);

    const handleSubmit = async (values) => {
        try {
            if (editData) {
                const response = await dispatch(updatePenalty({ penaltyId: editData._id, penaltyData: values }));
                // console.log("Update Response:", response);
                if (response.payload.success) {

                    toast.success("Penalty updated successfully");
                }
                else {
                    toast.error("Failed to update penalty" || response.payload.message);
                }
            } else {
                const response = await dispatch(createPenalty(values));
                if (response.payload.success) {

                    toast.success("Penalty created successfully");
                }
                else {
                    toast.error("Failed to create penalty" || response.payload.message);
                }
            }
            onClose();
            if (onSuccess) {
                onSuccess(); // Call the callback to trigger refetch
            }
        } catch (error) {
            console.error("Error saving penalty:", error);
            toast.error("Failed to save penalty");
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
        >
            <Form.Item
                name="name"
                label="Penalty Name"
                rules={[
                    { required: true, message: "Please enter penalty name" },
                    { min: 3, message: "Penalty name must be at least 3 characters" },
                    { max: 24, message: "Penalty name cannot exceed 24 characters" },
                ]}
            >
                <Input placeholder="Enter penalty name" disabled={isViewMode} />
            </Form.Item>

            <Form.Item
                name="penaltyType"
                label="Penalty Type"
                rules={[{ required: true, message: "Please select penalty type" }]}
            >
                <Select placeholder="Select penalty type" className="w-full" disabled={isViewMode}>
                    <Select.Option value="fixed">Fixed</Select.Option>
                    <Select.Option value="percentage">Percentage</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="penaltyValue"
                label="Penalty Value"
                rules={[
                    { required: true, message: "Please enter penalty value" },
                    { type: "number", min: 0, message: "Penalty value must be a non-negative number" },
                ]}
            >
                <InputNumber placeholder="Enter penalty value" min={0} style={{ width: "100%" }} disabled={isViewMode} />
            </Form.Item>

            <Form.Item
                name="gracePeriod"
                label="Grace Period (Days)"
                rules={[
                    { required: true, message: "Please enter grace period" },
                    { type: "number", min: 0, message: "Grace period must be a non-negative number" },
                ]}
            >
                <InputNumber placeholder="Enter grace period in days" min={0} defaultValue={0} style={{ width: "100%" }} disabled={isViewMode} />
            </Form.Item>

            <Form.Item name="description" label="Description">
                <Input.TextArea placeholder="Enter description" rows={3} disabled={isViewMode} />
            </Form.Item>

            <Form.Item
                name="isActive"
                label="Status"
                valuePropName="checked"
            >
                <Switch
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                    defaultChecked={true}
                    disabled={isViewMode}
                />
            </Form.Item>

            <Form.Item>
                {
                    !isViewMode && <Button
                        className="bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white w-full py-2"
                        htmlType="submit"
                    >
                        {editData ? "Update Penalty" : "Add Penalty"}
                    </Button>
                }
            </Form.Item>
        </Form>
    );
};

export default PenaltyAddForm;