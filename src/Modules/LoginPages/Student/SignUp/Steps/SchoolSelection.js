// src/pages/StudentSignUp/Steps/SchoolSelection.jsx
import React, { useEffect, useRef, useState } from "react";
import { Form, Select, Button, Avatar, Tag, Input, Modal, message } from "antd";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { FaSchool } from "react-icons/fa";

import useGetAllSchools from "../../../../../Hooks/CommonHooks/useGetAllSchool";
import useGetClassesBySchool from "../../../../../Hooks/CommonHooks/useGetClassesBySchool";
import CustomInput from "../Components/CustomInput";

import {
  nextStep,
  updateFormData,
  sendStudentOtp,
  verifyStudentOtp,
  setEmailVerified,
  clearVerification,
  fetchStudentDraft,
} from "../../../../../Store/Slices/Common/User/actions/studentSignupSlice";

const { Option } = Select;

/* ---------- local helpers ---------- */
const cacheKey = "signupStep1";
const loadCache = () => JSON.parse(sessionStorage.getItem(cacheKey) || "{}");

const saveCache = (data) =>
  sessionStorage.setItem(cacheKey, JSON.stringify(data || {}));

/* -------------------------------------------------------------------- */
const SchoolSelection = ({ formData }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const prevRef = useRef(loadCache());
  /* redux flags */
  const {
    isLoading: schoolFetchLoading,
    isOtpLoading,
    isVerifying,
    otpError,
    verificationError,
    isEmailVerified,
    verifiedEmail,
  } = useSelector((s) => s.common.studentSignup);

  /* API hooks */
  const { fetchSchools, schoolList } = useGetAllSchools();
  const { classList, loading: classFetchLoading } = useGetClassesBySchool(
    formData?.schoolId
  );

  const selectedSchool = schoolList?.find((s) => s?._id === formData?.schoolId);
  useEffect(() => {
    const cached = loadCache();
    const isVerified = cached.isVerified === true;

    // Only restore from cache if verified
    if (isVerified && cached.email && cached.schoolId) {
      const merged = { ...cached, ...formData };
      form.setFieldsValue(merged);
      dispatch(updateFormData({ school: merged }));

      // Automatically mark as verified in form state
      form.setFieldsValue({ isVerified: true });
    }
  }, []);
  /* ------------------ mount ------------------ */
  useEffect(() => {
    fetchSchools();

    /* 1️⃣  restore from Redux (after soft‑nav) */
    if (formData) form.setFieldsValue(formData);

    /* 2️⃣  restore from sessionStorage (after full reload) */
    const cached = loadCache();
    if (Object.keys(cached).length) {
      const merged = { ...cached, ...formData };
      form.setFieldsValue(merged);
      dispatch(updateFormData({ school: merged }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------ keep Form in sync when redux changes (reload after draft fetch) ------------------ */
  useEffect(() => {
    if (!formData) return;
    const { email, schoolId, applyingClass, ...rest } = form.getFieldsValue();
    form.setFieldsValue({ ...rest, ...formData }); // keep existing key fields
  }, [formData, form]);

  /* ------------------ on any change ------------------ */
  const handleValuesChange = (_, allValues) => {
    const { email, schoolId, applyingClass } = allValues;
    const changed =
      email !== prevRef.current.email ||
      schoolId !== prevRef.current.schoolId ||
      applyingClass !== prevRef.current.applyingClass;

    /* if any of the key fields changes -> clear verification */
    if (changed) {
      dispatch(clearVerification());
      allValues.isVerified = false;
    }

    /* push to Redux & cache */
    dispatch(updateFormData({ school: allValues }));
    saveCache({ ...prevRef.current, ...allValues });

    /* finally update prev snapshot */
    prevRef.current = { ...prevRef.current, ...allValues };
  };

  /* ------------------ send OTP ------------------ */
  const handleSendOtp = async () => {
    const { email, schoolId } = await form.validateFields([
      "email",
      "schoolId",
    ]);
    await dispatch(sendStudentOtp({ email, schoolId })).unwrap();
    setOtpModalVisible(true);
  };

  /* ------------------ verify OTP ------------------ */
  const handleVerifyOtp = async () => {
    const values = form.getFieldsValue(); // { email, schoolId, … }
    try {
      await dispatch(
        verifyStudentOtp({
          email: values.email,
          schoolId: values.schoolId,
          otp,
        })
      ).unwrap();

      /* fetch draft after verification */
      const { payload } = await dispatch(
        fetchStudentDraft({
          email: values.email,
          schoolId: values.schoolId,
        })
      );

      if (payload?.success && payload.exists) {
        dispatch(updateFormData(mapDraft(payload.data)));
        message.success("Existing application found and pre‑filled.");
      } else {
        dispatch(
          updateFormData({
            school: { ...values, isVerified: true },
          })
        );
        message.success("Email verified successfully.");
      }

      dispatch(setEmailVerified(values.email));
      saveCache({ ...values, isVerified: true });

      setOtpModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ------------------ navigation ------------------ */
  const handleNext = async () => {
    const vals = await form.validateFields();
    dispatch(updateFormData({ school: vals }));
    dispatch(nextStep());
  };

  /* ------------------ utilities ------------------ */
  const mapDraft = (doc) => ({
    school: {
      schoolId: doc.schoolId ?? undefined,
      // applyingClass: doc.applyingClass?._id ?? undefined,
      email: doc.email,
      isVerified: true,
    },
    guardian: doc.guardian ?? {},
    candidate: {
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      dob: doc.dateOfBirth,
      gender: doc.gender,
      contactNumber: doc.contactNumber,
      ...doc.candidate,
    },
    academic: doc.academicHistory ?? {},
    address: doc.permanentAddress ?? {},
    documents: doc.attachments?.mandatory
      ? Object.entries(doc.attachments.mandatory).map(([name, url]) => ({
          name,
          url,
          mandatory: true,
        }))
      : [],
  });
  console.log(form.getFieldValue("isVerified"), "formform");
  /* ------------------ render ------------------ */
  const isCurrentEmailVerified =
    isEmailVerified && form.getFieldValue("isVerified");

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

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
          {/* ------------ School ------------- */}
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
              filterOption={(i, o) =>
                o.label.toLowerCase().includes(i.toLowerCase())
              }
              className="w-full rounded-md focus:border-pink-500"
              onChange={() => form.setFieldsValue({ applyingClass: undefined })}
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

          {/* ------------ Class ------------- */}
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
                selectedSchool
                  ? `Select Class of ${selectedSchool.nameOfSchool}`
                  : "Select Class"
              }
              size="large"
              loading={classFetchLoading}
              disabled={!form.getFieldValue("schoolId")}
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={(i, o) =>
                o.children.toLowerCase().includes(i.toLowerCase())
              }
              className="w-full focus:border-pink-500"
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

          {/* ------------ Email ------------- */}
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

          {/* ------------ Verified badge ------------- */}
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

          {/* ------------ action button ------------- */}
          <div className="flex justify-end">
            <motion.div
              initial={{ scale: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {isCurrentEmailVerified ? (
                <Button
                  onClick={handleNext}
                  type="primary"
                  size="large"
                  className="!bg-gradient-to-r !from-[#C83B62] !to-[#7F35CD] !border-none !text-white font-semibold"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSendOtp}
                  loading={isOtpLoading}
                  type="primary"
                  size="large"
                  className="!bg-gradient-to-r !from-[#C83B62] !to-[#7F35CD] !border-none !text-white font-semibold"
                >
                  Verify Email
                </Button>
              )}
            </motion.div>
          </div>
        </Form>
      </motion.div>

      {/* ---------------- OTP Modal ---------------- */}
      <Modal
        title="Verify Your Email"
        open={otpModalVisible}
        onCancel={() => setOtpModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setOtpModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isVerifying}
            onClick={handleVerifyOtp}
          >
            Verify OTP
          </Button>,
        ]}
        centered
        maskClosable={false}
      >
        <p className="text-gray-600 mb-4">
          We've sent a 6‑digit verification code to{" "}
          <span className="font-semibold">{form.getFieldValue("email")}</span>.
          Please enter it below:
        </p>

        {otpError && (
          <div className="text-red-500 text-sm mb-2">
            {otpError.message || "Failed to send OTP"}
          </div>
        )}

        {verificationError && (
          <div className="text-red-500 text-sm mb-2">
            {verificationError.message || "Invalid OTP. Please try again."}
          </div>
        )}

        <div className="flex justify-center mb-4">
          <Input.OTP
            length={6}
            value={otp}
            onChange={setOtp}
            formatter={(str) => str.toUpperCase()}
          />
        </div>

        <div className="text-center text-sm text-gray-500">
          Didn't receive the code?{" "}
          <button
            onClick={handleSendOtp}
            className="text-[#7F35CD] hover:text-[#C83B62] underline"
          >
            Resend OTP
          </button>
        </div>
      </Modal>
    </>
  );
};

export default SchoolSelection;
