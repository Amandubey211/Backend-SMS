// src/pages/StudentSignUp/Steps/SchoolSelection.jsx
import React from "react";
import { Form, Select, Button, Avatar, Tag } from "antd";
import { motion } from "framer-motion";
import useGetAllSchools from "../../../../../Hooks/CommonHooks/useGetAllSchool";
import useGetClassesBySchool from "../../../../../Hooks/CommonHooks/useGetClassesBySchool";
import CustomInput from "../Components/CustomInput";
import { FaSchool } from "react-icons/fa";

const { Option } = Select;

const SchoolSelection = ({ formData, updateFormData }) => {
  // Extract selected school id from parent's formData
  const selectedSchoolId = formData?.schoolId || null;

  // Fetch the list of schools and classes using custom hooks
  const { fetchSchools, schoolList } = useGetAllSchools();
  const { classList } = useGetClassesBySchool(selectedSchoolId);

  const [form] = Form.useForm();

  React.useEffect(() => {
    // Fetch schools once on mount.
    fetchSchools();
    // If parent provided previous form data, pre-fill the form.
    if (formData) {
      form.setFieldsValue(formData);
    }
  }, []);

  // Handle form submission: update the parent's form data.
  const onFinish = (values) => {
    console.log("SchoolSelection values:", values);
    updateFormData(values);
    // Optionally, trigger a step change here if needed
    // dispatch(nextStep());
  };

  // Framer Motion animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto px-4 py-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-6"
      >
        {/* School Selection Field */}
        <Form.Item
          name="schoolId"
          label={
            <span className="font-semibold text-gray-700">Select School</span>
          }
          rules={[{ required: true, message: "Please select a school" }]}
        >
          <Select
            placeholder="Select School"
            size="large"
            showSearch
            allowClear
            // Set optionFilterProp to "label" so that search is performed on the label prop
            optionFilterProp="label"
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
            className="w-full rounded-md focus:border-pink-500 transition-colors"
            onChange={(value) => {
              // Update the parent's state with the selected school id.
              updateFormData({ schoolId: value });
              // Ensure the form field value is updated.
              form.setFieldsValue({ schoolId: value });
            }}
          >
            {schoolList?.map((school) => (
              <Option
                key={school._id}
                value={school._id}
                // Use the school name for filtering purposes
                label={school.nameOfSchool}
              >
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={school.logo}
                    icon={!school.logo && <FaSchool />} // Updated fallback icon
                    size="small"
                  />
                  <span className="font-semibold">{school.nameOfSchool}</span>
                  <Tag color="blue">
                    {school.branchName || school.city || "N/A"}
                  </Tag>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Class Selection Field */}
        <Form.Item
          name="applyingClass"
          label={
            <span className="font-semibold text-gray-700">Applying Class</span>
          }
          rules={[{ required: true, message: "Please select a class" }]}
        >
          <Select
            placeholder="Select Class"
            size="large"
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toLowerCase()?.includes(input.toLowerCase())
            }
            className="w-full focus:border-pink-500 transition-colors"
          >
            {classList && classList.length > 0 ? (
              classList.map((classItem) => (
                <Option key={classItem._id} value={classItem._id}>
                  {classItem?.className}
                </Option>
              ))
            ) : (
              <Option disabled value="">
                No classes available
              </Option>
            )}
          </Select>
        </Form.Item>

        {/* Student Email Field */}
        <Form.Item
          name="email"
          label={
            <span className="font-semibold text-gray-700">Student Email</span>
          }
          rules={[
            { required: true, message: "Please input student email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <CustomInput
            type="email"
            placeholder="student@example.com"
            size="large"
          />
        </Form.Item>

        {/* Submit Button */}
        <div className="flex justify-end">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              htmlType="submit"
              size="large"
              className="border-none text-white font-semibold rounded-md px-6 py-2 bg-gradient-to-r from-[#C83B62] to-[#7F35CD] hover:opacity-90 focus:opacity-90 transition-opacity"
            >
              Next
            </Button>
          </motion.div>
        </div>
      </Form>
    </motion.div>
  );
};

export default SchoolSelection;
