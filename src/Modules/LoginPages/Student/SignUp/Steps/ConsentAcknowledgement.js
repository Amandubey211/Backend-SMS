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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleDownload } from "../Utils/pdfDownload";
import {
  prevStep,
  updateFormData,
  registerStudentDetails,
  resetSignup,
} from "../../../../../Store/Slices/Common/User/actions/studentSignupSlice";
const ConsentAcknowledgement = ({ formData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { formData: ApplicationData } = useSelector(
    (s) => s.common.studentSignup
  );
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false); // New state for PDF loading
  const [openModal, setOpenModal] = useState(false);

  /* Generate and download PDF */
  const handlePdfDownload = async () => {
    setPdfLoading(true);
    try {
      await handleDownload(ApplicationData);
    } catch (error) {
      message.error("Failed to generate PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
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

      // Directly call registration without saving draft
      await dispatch(registerStudentDetails()).unwrap();

      // Show success modal
      setOpenModal(true);
    } catch (err) {
      console.log(err);
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
        initialValues={formData}
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
              onClick={handlePdfDownload}
              size="large"
              loading={pdfLoading}
            >
              {pdfLoading ? "Generating PDF..." : "Download Copy"}
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
        // open={openModal}
        open={true}
        footer={null}
        centered
        onCancel={() => {
          navigate("/studentlogin");
          sessionStorage.removeItem("signupStep1");
          dispatch(resetSignup());
        }}
        width={600}
        closeIcon={<span className="text-gray-500 hover:text-gray-700">×</span>}
        className="[&_.ant-modal-body]:pt-8"
      >
        <Result
          icon={<CheckCircleFilled className="!text-[#52c41a] text-6xl" />}
          title={
            <span className="text-2xl font-bold text-gray-800">
              Application Submitted Successfully!
            </span>
          }
          subTitle={
            <div className="space-y-4 text-center">
              <p className="text-gray-600 text-lg">
                Thank you for completing the registration process.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 max-w-md mx-auto">
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Next Steps:</span>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 text-left">
                  <li>
                    <span className="font-medium">
                      Please allow 4-5 business days
                    </span>{" "}
                    to receive your login credentials via email
                  </li>
                  <li>
                    Check your spam folder if you don't see the email in your
                    inbox
                  </li>
                </ul>
              </div>

              <p className="text-gray-500">
                For any inquiries, please contact your respective school
                administration.
              </p>
            </div>
          }
          extra={[
            <div key="buttons" className="flex gap-4 justify-center">
              <Button
                key="download"
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handlePdfDownload}
                loading={pdfLoading}
                className="!bg-gradient-to-r !from-[#C83B62] !to-[#7F35CD] !border-none"
                size="large"
              >
                {pdfLoading ? "Generating..." : "Download Application Copy"}
              </Button>
              ,
              <Button
                key="done"
                onClick={() => {
                  setOpenModal(false);
                  navigate("/studentlogin");
                  sessionStorage.removeItem("signupStep1");
                  dispatch(resetSignup());
                }}
                size="large"
                className="border-gray-300"
              >
                Return to Login
              </Button>
              ,
            </div>,
          ]}
        />
      </Modal>
    </div>
  );
};

export default ConsentAcknowledgement;
