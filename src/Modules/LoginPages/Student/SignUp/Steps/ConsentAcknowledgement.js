// src/pages/StudentSignUp/Steps/ConsentAcknowledgement.jsx
import React from "react";
import { Form, Button, Checkbox, Radio, Card, message } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ConsentAcknowledgement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      message.success("Application submitted successfully!");
      navigate("/studentlogin");
    } catch (error) {
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
      >
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
                I give permission to use my child's photograph/videos
              </Radio>
              <Radio value="no" className="text-lg">
                I DO NOT give permission to use my child's photograph/videos
              </Radio>
            </Radio.Group>
          </Form.Item>
        </Card>

        <Card title="Acknowledgement" className="rounded-xl shadow-md mb-6">
          <Form.Item
            name="acknowledgements"
            rules={[
              {
                validator: (_, value) =>
                  value && value.length >= 4
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

        <div className="flex justify-between mt-6">
          <Button size="large" className="text-gray-600 border-gray-300">
            Back
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white border-none hover:opacity-90 focus:opacity-90 transition-opacity"
          >
            Save & Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ConsentAcknowledgement;
