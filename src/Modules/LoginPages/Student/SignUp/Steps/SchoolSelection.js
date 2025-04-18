// SchoolSelection.jsx
// UI unchanged – only wiring & bug‑fixes

import React, { useEffect } from "react";
import { Form, Select, Button, Avatar, Tag } from "antd";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import useGetAllSchools from "../../../../../Hooks/CommonHooks/useGetAllSchool";
import useGetClassesBySchool from "../../../../../Hooks/CommonHooks/useGetClassesBySchool";
import CustomInput from "../Components/CustomInput";
import { FaSchool } from "react-icons/fa";
import {
  nextStep,
  updateFormData,
} from "../../../../../Store/Slices/Common/User/actions/studentSignupSlice";
import { setYupErrorsToAnt } from "../Utils/yupAntdHelpers";
import { SchoolSchema } from "../Utils/validationSchemas";

const { Option } = Select;

/**
 * SchoolSelection component
 * Handles user selection of school, class, and email for signup flow
 */
const SchoolSelection = ({ formData }) => {
  const dispatch = useDispatch();

  // Initialize Ant Design form instance
  const [form] = Form.useForm();

  // Fetch all schools for dropdown
  const {
    fetchSchools,
    schoolList,
    loading: schoolFetchLoading,
  } = useGetAllSchools();

  // Fetch classes based on selected school
  const { classList, loading: classFetchLoading } = useGetClassesBySchool(
    formData?.schoolId
  );

  // Determine selected school's name for placeholder
  const selectedSchool = schoolList?.find((s) => s._id === formData?.schoolId);
  const selectedSchoolName = selectedSchool?.nameOfSchool;

  // On component mount: load schools and populate form with saved data
  useEffect(() => {
    fetchSchools();
    if (formData) {
      form.setFieldsValue(formData);
    }
  }, []);

  /**
   * Live-save draft on any field change
   */
  const handleValuesChange = (_, values) => {
    dispatch(updateFormData({ school: values }));
  };

  /**
   * Final submission: validate and move to next step
   */
  const onFinish = async (values) => {
    try {
      await SchoolSchema.validate(values, { abortEarly: false });
      // Save final form data before navigating
      dispatch(updateFormData({ school: values }));
      dispatch(nextStep());
    } catch (err) {
      setYupErrorsToAnt(form, err);
    }
  };

  // Animation variants for form container
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
        onValuesChange={handleValuesChange}
        scrollToFirstError
        className="space-y-6"
      >
        {/* ---------------------- */}
        {/* Select School Section */}
        {/* ---------------------- */}
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
            loading={schoolFetchLoading}
            showSearch
            allowClear
            optionFilterProp="label"
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
            className="w-full rounded-md focus:border-pink-500 transition-colors"
            onChange={() => {
              // Reset class when school changes
              form.setFieldsValue({ applyingClass: undefined });
            }}
          >
            {schoolList?.map((s) => (
              <Option key={s._id} value={s._id} label={s.nameOfSchool}>
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={s.logo}
                    icon={!s.logo && <FaSchool />}
                    size="small"
                  />
                  <span className="font-semibold">{s.nameOfSchool}</span>
                  <Tag color="blue">{s.branchName || s.city || "N/A"}</Tag>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* --------------------- */}
        {/* Select Class Section */}
        {/* --------------------- */}
        <Form.Item
          name="applyingClass"
          label={
            <span className="font-semibold text-gray-700">Applying Class</span>
          }
          rules={[{ required: true, message: "Please select a class" }]}
        >
          <Select
            // Show school name in placeholder if available
            placeholder={
              selectedSchoolName
                ? `Select Class of ${selectedSchoolName}`
                : "Select Class"
            }
            size="large"
            loading={classFetchLoading}
            disabled={!formData?.schoolId}
            showArrow
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            className="w-full focus:border-pink-500 transition-colors"
          >
            {classList?.length ? (
              classList.map((c) => (
                <Option key={c._id} value={c._id}>
                  {c.className}
                </Option>
              ))
            ) : (
              <Option disabled value="">
                No classes available
              </Option>
            )}
          </Select>
        </Form.Item>

        {/* ------------------ */}
        {/* Student Email */}
        {/* ------------------ */}
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

        {/* ------------------ */}
        {/* Next Button */}
        {/* ------------------ */}
        <div className="flex justify-end">
          <motion.div
            initial={{ scale: 1, y: 0 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Button
              htmlType="submit"
              type="primary" // keep it as primary so AntD won’t revert to default hover
              size="large"
              className="
      !bg-gradient-to-r       // override any AntD bg
      !from-[#C83B62]         // initial gradient start
      !to-[#7F35CD]           // initial gradient end
      !border-none
      !text-white
      font-semibold
      rounded-md
      px-6
      py-2
      transition-all
      duration-200
      ease-in-out
      hover:!from-[#A02D53]   // darker start on hover
      hover:!to-[#6A28A4]     // darker end on hover
      hover:!text-white       // make absolutely sure text stays white
    "
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
