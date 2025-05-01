import React from "react";
import { Form, Input, Select, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function RouteFormFields({ form, routeData, t }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Form.Item
        name="routeName"
        label={t("Route Name")}
        rules={[{ required: true, message: t("Please input route name") }]}
      >
        <Input placeholder={t("e.g. Main Campus Route")} />
      </Form.Item>

      <Form.Item name="isActive" label={t("Status")} initialValue={true}>
        <Select>
          <Select.Option value={true}>{t("Active")}</Select.Option>
          <Select.Option value={false}>{t("Inactive")}</Select.Option>
        </Select>
      </Form.Item>
    </div>
  );
}
