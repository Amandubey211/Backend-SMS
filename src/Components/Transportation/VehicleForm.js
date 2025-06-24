import { useEffect, useState } from "react";
import { Form, Input, Select, Checkbox, Button } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const VehicleForm = ({ vehicleData, handleChange, handleSubmit, isEditing }) => {
  const { t } = useTranslation("transportation");
  const [form] = Form.useForm();

  // Sync initial form values with vehicleData
  useEffect(() => {
    form.setFieldsValue({
      vehicleType: vehicleData?.vehicleType || undefined,
      customVehicleType: vehicleData?.customVehicleType || "",
      vehicleNumber: vehicleData?.vehicleNumber || "",
      seatingCapacity: vehicleData?.seatingCapacity || "",
      status: vehicleData?.status || "active",
      fuelType: vehicleData?.fuelType || undefined,
      vehicleCategory: vehicleData?.vehicleCategory || undefined,
      customVehicleCategory: vehicleData?.customVehicleCategory || "",
      cameraInstalled: vehicleData?.cameraInstalled || false,
      firstAidAvailable: vehicleData?.firstAidAvailable || false,
      speedGovernorInstalled: vehicleData?.speedGovernorInstalled || false,
      vehicleName: vehicleData?.vehicleName || "",
    });
  }, [vehicleData, form]);

  const validateVehicleNumber = (_, value) => {
    const vehicleNumberRegex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
    if (value && !vehicleNumberRegex.test(value)) {
      return Promise.reject(new Error("Vehicle number must be in format XXDDXXDDDD (e.g., GJ01WQ4565) with uppercase letters for the first and third parts"));
    }
    return Promise.resolve();
  };

  // Handle form submission with custom logic for vehicleType and vehicleCategory
  const onFinish = (values) => {
    let transformedValues = {
      ...values,
      vehicleType: values.vehicleType.toLowerCase(),
      fuelType: values.fuelType.toLowerCase(),
      vehicleCategory: values.vehicleCategory ? values.vehicleCategory.toLowerCase() : "",
      status: values.status.toLowerCase(),
    };

    // Only include customVehicleType if vehicleType is "other" and a custom value is provided
    if (values.vehicleType === "other" && values.customVehicleType) {
      transformedValues.customVehicleType = values.customVehicleType;
    } else {
      delete transformedValues.customVehicleType; // Remove customVehicleType if not "other" or no custom value
    }

    // Only include customVehicleCategory if vehicleCategory is "other" and a custom value is provided
    if (values.vehicleCategory === "other" && values.customVehicleCategory) {
      transformedValues.customVehicleCategory = values.customVehicleCategory;
    } else {
      delete transformedValues.customVehicleCategory; // Remove customVehicleCategory if not "other" or no custom value
    }

    handleSubmit(transformedValues);
  };

  // Handle local change and update parent
  const handleLocalChange = (changedValues, allValues) => {
    const transformedValues = {
      ...allValues,
      vehicleType: allValues.vehicleType ? allValues.vehicleType.toLowerCase() : "",
      fuelType: allValues.fuelType ? allValues.fuelType.toLowerCase() : "",
      vehicleCategory: allValues.vehicleCategory ? allValues.vehicleCategory.toLowerCase() : "",
      status: allValues.status ? allValues.status.toLowerCase() : "",
    };
    handleChange({ target: { name: Object.keys(changedValues)[0], value: transformedValues[Object.keys(changedValues)[0]] } });
  };

  // Dropdown options (display capitalized, send lowercase)
  const vehicleTypes = ["bus", "van", "auto", "cab", "e-rickshaw", "other"];
  const fuelTypes = ["diesel", "petrol", "cng", "electric", "hybrid"];
  const vehicleCategories = [
    "ac",
    "non-ac",
    "sleeper",
    "semi-sleeper",
    "mini",
    "double-decker",
    "hatchback",
    "sedan",
    "e-rickshaw",
    "open",
    "cargo",
    "other",
  ];

  return (
    <Form
      form={form}
      name="vehicleForm"
      onFinish={onFinish}
      onValuesChange={handleLocalChange}
      layout="vertical"
      className="space-y-6"
      initialValues={{
        vehicleType: undefined, // Use undefined to show placeholder
        customVehicleType: "",
        vehicleNumber: "",
        seatingCapacity: "",
        status: "active",
        fuelType: undefined, // Use undefined to show placeholder
        vehicleCategory: undefined, // Use undefined to show placeholder
        customVehicleCategory: "",
        cameraInstalled: false,
        firstAidAvailable: false,
        speedGovernorInstalled: false,
        vehicleName: "",
      }}
    >
      {/* Vehicle Information Section */}
      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="text-md font-medium text-blue-800 mb-3">{t("Vehicle Information")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">{t("Vehicle Type")} *</span>}
            name="vehicleType"
            rules={[{ required: true, message: `${t("vehicleType")} is required` }]}
          >
            <Select placeholder={t("Select Vehicle Type")} allowClear>
              {vehicleTypes.map((type) => (
                <Option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">{t("Vehicle Name")} *</span>}
            name="vehicleName"
            rules={[{ required: true, message: `${t("vehicleName")} is required` }]}
          >
            <Input placeholder={t("Enter Vehicle Name")} />
          </Form.Item>
          {form.getFieldValue("vehicleType") === "other" && (
            <Form.Item
              label={<span className="text-sm font-medium text-gray-700">{t("Custom Vehicle Type")} *</span>}
              name="customVehicleType"
              rules={[{ required: true, message: `${t("Custom Vehicle Type")} is required` }]}
            >
              <Input placeholder={t("Enter Custom Vehicle Type")} />
            </Form.Item>
          )}
          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">{t("Vehicle Number")} *</span>}
            name="vehicleNumber"
            rules={[
              { required: true, message: `${t("Vehicle Number")} is required` },
              // { validator: validateVehicleNumber },
            ]}
          >
            <Input placeholder={t("Enter Vehicle Number")} />
          </Form.Item>
          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">{t("Seating Capacity")} *</span>}
            name="seatingCapacity"
            rules={[
              { required: true, message: `${t("Seating Capacity")} is required` },
            ]}
          >
            <Input type="number" placeholder={t("Enter Seating Capacity")} min={1}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+" || e.key === ".") {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>
          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">{t("Status")} *</span>}
            name="status"
            rules={[{ required: true, message: `${t("Status")} is required` }]}
          >
            <Select>
              <Option value="active">{t("Active")}</Option>
              <Option value="inactive">{t("Inactive")}</Option>
              <Option value="under_maintenance">{t("Under Maintenance")}</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">{t("Fuel Type")} *</span>}
            name="fuelType"
            rules={[{ required: true, message: `${t("Fuel Type")} is required` }]}
          >
            <Select placeholder={t("Select Fuel Type")} allowClear>
              {fuelTypes.map((type) => (
                <Option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </div>
      {/* Vehicle Category Section */}
      <div className="bg-green-50 p-4 rounded-md">
        <h3 className="text-md font-medium text-green-800 mb-3">{t("Vehicle Category")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">{t("Vehicle Category")}</span>}
            name="vehicleCategory"
          >
            <Select placeholder={t("Select Category")} allowClear>
              {vehicleCategories.map((category) => (
                <Option key={category} value={category}>
                  {category.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('-')}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {form.getFieldValue("vehicleCategory") === "other" && (
            <Form.Item
              label={<span className="text-sm font-medium text-gray-700">{t("Custom Vehicle Category")} *</span>}
              name="customVehicleCategory"
              rules={[{ required: true, message: `${t("Custom Vehicle Category")} is required` }]}
            >
              <Input placeholder={t("Enter Custom Vehicle Category")} />
            </Form.Item>
          )}
        </div>
      </div>
      {/* Safety Features Section */}
      <div className="bg-yellow-50 p-4 rounded-md">
        <h3 className="text-md font-medium text-yellow-800 mb-3">{t("Safety Features")}</h3>
        <div className="flex flex-col gap-1">
          <Form.Item name="cameraInstalled" valuePropName="checked">
            <Checkbox>{t("Camera Installed")}</Checkbox>
          </Form.Item>
          <Form.Item name="firstAidAvailable" valuePropName="checked">
            <Checkbox>{t("First Aid Available")}</Checkbox>
          </Form.Item>
          <Form.Item name="speedGovernorInstalled" valuePropName="checked">
            <Checkbox>{t("Speed Governor Installed")}</Checkbox>
          </Form.Item>
        </div>
      </div>
      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <Button onClick={() => window.history.back()} className="border border-gray-300 rounded-md">
          {t("Cancel")}
        </Button>
        <Button type="primary" htmlType="submit" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 transition duration-300">
          {isEditing ? t("Update Vehicle") : t("Add Vehicle")}
        </Button>
      </div>
    </Form>
  );
};

export default VehicleForm;
