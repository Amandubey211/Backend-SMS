import { Form, Row, Col, Radio, Input } from "antd";
import {
  HomeOutlined,
  BankOutlined,
  EnvironmentOutlined,
  PushpinOutlined,
  BankFilled,
} from "@ant-design/icons";

const AddressInformation = () => {
  return (
    <>
      <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mb-0">
        Address Information
      </h2>
      <div className="p-3">
        {/* Transport Required */}
        <Row gutter={16} className="mb-4">
          <Col xs={24} md={8}>
            <Form.Item
              name={["addressInformation", "transportRequired"]}
              label="Transport Required"
              rules={[{ required: true, message: "Please select an option" }]}
              initialValue={true}
            >
              <Radio.Group optionType="button" buttonStyle="solid">
                <Radio.Button value={true}>Yes</Radio.Button>
                <Radio.Button value={false}>No</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        {/* Building, Street, City */}
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} md={8}>
            <Form.Item
              name={["addressInformation", "buildingNumber"]}
              label="Building No./House No."
              rules={[
                { required: true, message: "Building number is required" },
              ]}
            >
              <Input
                prefix={<BankOutlined />}
                placeholder="Building No./House No."
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name={["addressInformation", "streetName"]}
              label="Street Address"
              rules={[{ required: true, message: "Street name is required" }]}
            >
              <Input
                prefix={<EnvironmentOutlined />}
                placeholder="Street Address"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name={["addressInformation", "city"]}
              label="City"
              rules={[{ required: true, message: "City is required" }]}
            >
              <Input prefix={<EnvironmentOutlined />} placeholder="City" />
            </Form.Item>
          </Col>
        </Row>

        {/* Postal Code, State, Country */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item
              name={["addressInformation", "postalCode"]}
              label="Postal Code/Zip Code"
              rules={[{ required: true, message: "Postal code is required" }]}
            >
              <Input
                prefix={<BankFilled />}
                placeholder="Postal Code/Zip Code"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name={["addressInformation", "state"]}
              label="State/Region"
              rules={[{ required: true, message: "State is required" }]}
            >
              <Input prefix={<BankFilled />} placeholder="State/Region" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name={["addressInformation", "country"]}
              label="Country"
              rules={[{ required: true, message: "Country is required" }]}
            >
              <Input prefix={<PushpinOutlined />} placeholder="Country" />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AddressInformation;
