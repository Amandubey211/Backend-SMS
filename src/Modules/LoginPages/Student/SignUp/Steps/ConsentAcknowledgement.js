import React, { useState } from "react";
import {
  Form,
  Button,
  Checkbox,
  Radio,
  Card,
  Modal,
  Result,
  message,
} from "antd";
import { CheckCircleFilled, DownloadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  nextStep,
  prevStep,
  updateFormData,
  registerStudentDetails,
} from "../../../../../Store/Slices/Common/User/actions/studentSignupSlice";

const ConsentAcknowledgement = ({ formData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  /* helper: download receipt */
  const handleDownload = () => {
    message.success("The download feature will be available soon.");
  };

  /* handle back navigation */
  const handleBack = () => {
    dispatch(prevStep());
  };

  /* final submit */
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Update consent data in Redux store
      dispatch(updateFormData({ consent: values }));

      // Submit all form data to the server
      await dispatch(registerStudentDetails()).unwrap();

      // Show success modal
      setOpenModal(true);
    } catch (err) {
      console.error(err);
      message.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-6"
        initialValues={formData} // Initialize form with existing data
      >
        {/* ───────── photo / video consent ───────── */}
        <Card
          title="Parental Consent for Photos & Videos"
          className="rounded-xl shadow-md mb-6"
        >
          <Form.Item
            name="photoConsent"
            rules={[{ required: true, message: "Please select an option" }]}
          >
            <Radio.Group className="space-y-4">
              <Radio value="yes" className="text-lg">
                I give permission to use my child's photographs / videos
              </Radio>
              <Radio value="no" className="text-lg">
                I DO NOT give permission to use my child's photographs / videos
              </Radio>
            </Radio.Group>
          </Form.Item>
        </Card>

        {/* ───────── acknowledgements ───────── */}
        <Card title="Acknowledgement" className="rounded-xl shadow-md mb-6">
          <Form.Item
            name="acknowledgements"
            rules={[
              {
                validator: (_, v) =>
                  v && v.length >= 4
                    ? Promise.resolve()
                    : Promise.reject("Please acknowledge all statements"),
              },
            ]}
          >
            <Checkbox.Group className="grid gap-4">
              <Checkbox value="infoAccurate" className="text-lg">
                I confirm all provided information is true and accurate
              </Checkbox>
              <Checkbox value="legalCustody" className="text-lg">
                I confirm I have legal custody of the student
              </Checkbox>
              <Checkbox value="acceptPolicies" className="text-lg">
                I accept the school's policies and regulations
              </Checkbox>
              <Checkbox value="dataUsage" className="text-lg">
                I grant the school the right to use provided information for
                analytics and quality improvement
              </Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </Card>

        {/* nav buttons */}
        <div className="flex justify-between mt-6">
          <Button
            size="large"
            className="text-gray-600 border-gray-300"
            onClick={handleBack}
          >
            Back
          </Button>

          <div className="flex gap-3">
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              size="large"
            >
              Download Copy
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white border-none hover:opacity-90 focus:opacity-90 transition-opacity"
            >
              Save&nbsp;&amp;&nbsp;Submit
            </Button>
          </div>
        </div>
      </Form>

      {/* Success confirmation modal */}
      <Modal
        open={openModal}
        footer={null}
        centered
        onCancel={() => {
          setOpenModal(false);
          navigate("/studentlogin");
        }}
        width={500}
        closeIcon={false}
      >
        <Result
          icon={<CheckCircleFilled style={{ color: "#52c41a" }} />}
          title="Application Submitted!"
          subTitle="Thank you. Your application has been received. You may download a copy for your records."
          extra={[
            <Button
              key="download"
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
            >
              Download Copy
            </Button>,
            <Button
              key="done"
              onClick={() => {
                setOpenModal(false);
                navigate("/studentlogin");
              }}
            >
              Done
            </Button>,
          ]}
        />
      </Modal>
    </div>
  );
};

export default ConsentAcknowledgement;
