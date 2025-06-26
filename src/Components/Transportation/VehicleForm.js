import { useEffect } from "react";
import { Form, Input, Select, Checkbox, Button } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const VehicleForm = ({ vehicleData, handleChange, handleSubmit, isEditing }) => {
  const { t } = useTranslation("transportation");
  const [form] = Form.useForm();

  // Watch the current select values for showing custom inputs
  const currentVehicleType = Form.useWatch("vehicleType", form);
  const currentVehicleCategory = Form.useWatch("vehicleCategory", form);

  const vehicleTypes = ["bus", "van", "cab", "other"];
  const fuelTypes = ["diesel", "petrol", "cng", "electric", "hybrid"];
  const vehicleCategories = [
    "ac",
    "non-ac",
    "sleeper",
    "mini",
    "double-decker",
    "sedan",
    "open",
    "other",
  ];

  useEffect(() => {
    if (vehicleData) {
      let initType = vehicleData.vehicleType;
      let initCategory = vehicleData.vehicleCategory;
      let customTypeInput = "";
      let customCategoryInput = "";

      // Check if incoming type is not one of the options
      if (initType && !vehicleTypes.includes(initType)) {
        customTypeInput = initType;
        initType = "other";
      }

      // Check if incoming category is not one of the options
      if (initCategory && !vehicleCategories.includes(initCategory)) {
        customCategoryInput = initCategory;
        initCategory = "other";
      }

      form.setFieldsValue({
        vehicleType: initType || undefined,
        customTypeInput,
        vehicleNumber: vehicleData.vehicleNumber || "",
        seatingCapacity: vehicleData.seatingCapacity || "",
        status: vehicleData.status || "active",
        fuelType: vehicleData.fuelType || undefined,
        vehicleCategory: initCategory || undefined,
        customCategoryInput,
        cameraInstalled: vehicleData.cameraInstalled || false,
        firstAidAvailable: vehicleData.firstAidAvailable || false,
        speedGovernorInstalled: vehicleData.speedGovernorInstalled || false,
        vehicleName: vehicleData.vehicleName || "",
      });
    } else {
      form.resetFields();
    }
  }, [vehicleData, form, vehicleTypes, vehicleCategories]);

  const onFinish = (values) => {
    let { vehicleType, vehicleCategory } = values;

    if (vehicleType === "other" && values.customTypeInput) {
      vehicleType = values.customTypeInput;
    }
    if (vehicleCategory === "other" && values.customCategoryInput) {
      vehicleCategory = values.customCategoryInput;
    }

    const transformedValues = {
      ...values,
      vehicleType: vehicleType?.toLowerCase(),
      vehicleCategory: vehicleCategory?.toLowerCase(),
      fuelType: values.fuelType?.toLowerCase(),
      status: values.status?.toLowerCase(),
    };
    delete transformedValues.customTypeInput;
    delete transformedValues.customCategoryInput;

    handleSubmit(transformedValues);
  };

  const handleLocalChange = (changedValues, allValues) => {
    const key = Object.keys(changedValues)[0];
    handleChange({ target: { name: key, value: allValues[key] } });
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      onValuesChange={handleLocalChange}
      layout="vertical"
      className="space-y-6"
    >
      {/* Vehicle Information */}
      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="text-md font-medium text-blue-800 mb-3">
          {t("Vehicle Information")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label={t("Vehicle Type")}
            name="vehicleType"
            rules={[
              { required: true, message: `${t("vehicleType")} is required` },
            ]}
          >
            <Select placeholder={t("Select Vehicle Type")} allowClear>
              {vehicleTypes.map((type) => (
                <Option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {currentVehicleType === "other" && (
            <Form.Item
              label={t("Enter Vehicle Type")}
              name="customTypeInput"
              rules={[
                {
                  required: true,
                  message: `${t("Enter Vehicle Type")} is required`,
                },
              ]}
            >
              <Input placeholder={t("e.g. Rickshaw, SUV, etc.")} />
            </Form.Item>
          )}
          <Form.Item
            label={t("Vehicle Name")}
            name="vehicleName"
            rules={[
              { required: true, message: `${t("vehicleName")} is required` },
            ]}
          >
            <Input placeholder={t("Enter Vehicle Name")} />
          </Form.Item>
          <Form.Item
            label={t("Vehicle Number")}
            name="vehicleNumber"
            rules={[
              { required: true, message: `${t("Vehicle Number")} is required` },
            ]}
          >
            <Input placeholder={t("e.g. GJ01WQ4565")} />
          </Form.Item>
          <Form.Item
            label={t("Seating Capacity")}
            name="seatingCapacity"
            rules={[
              { required: true, message: `${t("Seating Capacity")} is required` },
            ]}
          >
            <Input
              type="number"
              min={1}
              placeholder={t("Enter Seating Capacity")}
              onKeyDown={(e) =>
                ["-", "+", ".", "e", "E"].includes(e.key) && e.preventDefault()
              }
            />
          </Form.Item>
          <Form.Item
            label={t("Status")}
            name="status"
            rules={[
              { required: true, message: `${t("Status")} is required` },
            ]}
          >
            <Select>
              <Option value="active">{t("Active")}</Option>
              <Option value="inactive">{t("Inactive")}</Option>
              <Option value="under_maintenance">{t("Under Maintenance")}</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={t("Fuel Type")}
            name="fuelType"
            rules={[
              { required: true, message: `${t("Fuel Type")} is required` },
            ]}
          >
            <Select placeholder={t("Select Fuel Type")}>
              {fuelTypes.map((type) => (
                <Option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </div>

      {/* Vehicle Category */}
      <div className="bg-green-50 p-4 rounded-md">
        <h3 className="text-md font-medium text-green-800 mb-3">
          {t("Vehicle Category")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label={t("Vehicle Category")} name="vehicleCategory">
            <Select placeholder={t("Select Category")} allowClear>
              {vehicleCategories.map((category) => (
                <Option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {currentVehicleCategory === "other" && (
            <Form.Item
              label={t("Enter Vehicle Category")}
              name="customCategoryInput"
              rules={[
                {
                  required: true,
                  message: `${t("Enter Vehicle Category")} is required`,
                },
              ]}
            >
              <Input placeholder={t("e.g. Golf Cart, Tractor, etc.")} />
            </Form.Item>
          )}
        </div>
      </div>

      {/* Safety Features */}
      <div className="bg-yellow-50 p-4 rounded-md">
        <h3 className="text-md font-medium text-yellow-800 mb-3">
          {t("Safety Features")}
        </h3>
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

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3">
        <Button onClick={() => window.history.back()}>{t("Cancel")}</Button>
        <Button
          type="primary"
          htmlType="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        >
          {isEditing ? t("Update Vehicle") : t("Add Vehicle")}
        </Button>
      </div>
    </Form>
  );
};

export default VehicleForm;
