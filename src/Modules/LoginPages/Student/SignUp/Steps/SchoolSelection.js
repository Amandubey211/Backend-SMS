import React, { useEffect, useState } from "react";
import { Form, Select, Button, Avatar, Tag, Input, Modal, message } from "antd";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import useGetAllSchools from "../../../../../Hooks/CommonHooks/useGetAllSchool";
import useGetClassesBySchool from "../../../../../Hooks/CommonHooks/useGetClassesBySchool";
import CustomInput from "../Components/CustomInput";
import { FaSchool } from "react-icons/fa";
import {
  nextStep,
  updateFormData,
  sendStudentOtp,
  verifyStudentOtp,
  clearOtpState,
  setEmailVerified,
  clearVerification,
  checkStudentByEmail,
} from "../../../../../Store/Slices/Common/User/actions/studentSignupSlice";

const { Option } = Select;

const SchoolSelection = ({ formData }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState("");

  const {
    isLoading: schoolFetchLoading,
    isOtpLoading,
    isVerifying,
    otpError,
    verificationError,
    isEmailVerified,
    verifiedEmail,
  } = useSelector((s) => s.common.studentSignup);

  const { fetchSchools, schoolList } = useGetAllSchools();

  const { classList, loading: classFetchLoading } = useGetClassesBySchool(
    formData?.schoolId
  );

  const selectedSchool = schoolList?.find((s) => s._id === formData?.schoolId);
  const selectedSchoolName = selectedSchool?.nameOfSchool;

  useEffect(() => {
    fetchSchools();
    if (formData) {
      form.setFieldsValue(formData);

      // Check if current email is already verified
      if (isEmailVerified && formData.email === verifiedEmail) {
        form.setFieldsValue({ isVerified: true });
      }
    }
    dispatch(clearOtpState());
  }, []);

  const handleValuesChange = (_, values) => {
    // Clear verification if email changes
    if (values.email && values.email !== verifiedEmail) {
      dispatch(clearVerification());
    }
    dispatch(updateFormData({ school: values }));
  };

  const handleSendOtp = async () => {
    const values = await form.validateFields(["email", "schoolId"]);
    try {
      await dispatch(
        sendStudentOtp({
          email: values.email,
          schoolId: values.schoolId,
        })
      ).unwrap();
      setOtpModalVisible(true);
    } catch (error) {
      console.error("Failed to send OTP:", error);
    }
  };

  const handleVerifyOtp = async () => {
    const values = form.getFieldsValue();
    try {
      // 1. Verify OTP first
      await dispatch(
        verifyStudentOtp({
          email: values.email,
          schoolId: values.schoolId,
          otp,
        })
      ).unwrap();

      // 2. Check if student exists
      const  payload  = await dispatch(checkStudentByEmail(values.email));
      if (payload?.success) {
        // 3. Update form data with either existing or empty structure
        dispatch(
          updateFormData({
            school: payload.exists
              ? payload.data.school
              : {
                  ...values,
                  isVerified: true,
                },
            // Other sections will be either populated or empty
          })
        );

        // 4. Mark email as verified
        dispatch(setEmailVerified(values.email));

        // 5. Close modal
        setOtpModalVisible(false);

        // 6. Show appropriate message
        // if (payload.exists) {
        //   message.success(
        //     "Existing application found. Some fields have been pre-filled."
        //   );
        // } else {
        //   message.success(
        //     "Email verified successfully. Please continue with your application."
        //   );
        // }
      }
      dispatch(nextStep());
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      dispatch(updateFormData({ school: values }));
      dispatch(nextStep());
    } catch (err) {
      // setYupErrorsToAnt(form, err);
      console.log(err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const isCurrentEmailVerified =
    isEmailVerified && formData?.email === verifiedEmail;

  return (
    <>
      <motion.div
        className="max-w-3xl mx-auto px-4 py-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleValuesChange}
          scrollToFirstError
          className="space-y-6"
        >
          {/* School Selection */}
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

          {/* Class Selection */}
          <Form.Item
            name="applyingClass"
            label={
              <span className="font-semibold text-gray-700">
                Applying Class
              </span>
            }
            rules={[{ required: true, message: "Please select a class" }]}
          >
            <Select
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

          {/* Student Email */}
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

          {/* Verified Status */}
          {isCurrentEmailVerified && (
            <div className="flex items-center text-green-500 mb-4">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Email verified successfully</span>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end">
            <motion.div
              initial={{ scale: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {isCurrentEmailVerified ? (
                // {true ? (
                <Button
                  onClick={handleNext}
                  type="primary"
                  size="large"
                  className="
                    !bg-gradient-to-r
                    !from-[#C83B62]
                    !to-[#7F35CD]
                    !border-none
                    !text-white
                    font-semibold
                    rounded-md
                    px-6
                    py-2
                    transition-all
                    duration-200
                    ease-in-out
                    hover:!from-[#A02D53]
                    hover:!to-[#6A28A4]
                    hover:!text-white
                  "
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSendOtp}
                  loading={isOtpLoading}
                  type="primary"
                  size="large"
                  className="
                    !bg-gradient-to-r
                    !from-[#C83B62]
                    !to-[#7F35CD]
                    !border-none
                    !text-white
                    font-semibold
                    rounded-md
                    px-6
                    py-2
                    transition-all
                    duration-200
                    ease-in-out
                    hover:!from-[#A02D53]
                    hover:!to-[#6A28A4]
                    hover:!text-white
                  "
                >
                  Verify Email
                </Button>
              )}
            </motion.div>
          </div>
        </Form>
      </motion.div>

      {/* OTP Verification Modal */}
      <Modal
        title="Verify Your Email"
        visible={otpModalVisible}
        onCancel={() => setOtpModalVisible(false)}
        footer={[
          <Button
            key="back"
            onClick={() => setOtpModalVisible(false)}
            className="
              border border-gray-300
              text-gray-700
              hover:bg-gray-50
              rounded-md
              px-4
              py-2
              transition-colors
              duration-200
            "
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isVerifying}
            onClick={handleVerifyOtp}
            className="
              bg-gradient-to-r
              from-[#C83B62]
              to-[#7F35CD]
              text-white
              border-none
              rounded-md
              px-4
              py-2
              transition-all
              duration-200
              hover:from-[#A02D53]
              hover:to-[#6A28A4]
              hover:text-white
              focus:ring-2
              focus:ring-pink-300
              focus:ring-offset-2
            "
          >
            Verify OTP
          </Button>,
        ]}
        centered
        maskClosable={false}
      >
        <div className="space-y-6">
          <p className="text-gray-600">
            We've sent a 6-digit verification code to{" "}
            <span className="font-semibold">{form.getFieldValue("email")}</span>
            . Please enter it below to continue:
          </p>

          {otpError && (
            <div className="text-red-500 text-sm">
              {otpError.message || "Failed to send OTP"}
            </div>
          )}

          {verificationError && (
            <div className="text-red-500 text-sm">
              {verificationError.message || "Invalid OTP. Please try again."}
            </div>
          )}

          <div className="flex justify-center">
            <Input.OTP
              length={6}
              value={otp}
              onChange={setOtp}
              formatter={(str) => str.toUpperCase()}
              className="otp-input-group"
              inputClassName="
                w-12 h-12
                text-2xl
                font-semibold
                border-2
                border-gray-300
                rounded-lg
                focus:border-pink-500
                focus:ring-2
                focus:ring-pink-200
                transition-all
                duration-200
              "
            />
          </div>

          <div className="text-center text-sm text-gray-500">
            Didn't receive the code?{" "}
            <button
              onClick={handleSendOtp}
              className="
                text-[#7F35CD]
                hover:text-[#C83B62]
                font-medium
                underline
                underline-offset-2
                transition-colors
                duration-200
                focus:outline-none
                focus:ring-2
                focus:ring-pink-200
                rounded
              "
            >
              Resend OTP
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SchoolSelection;
