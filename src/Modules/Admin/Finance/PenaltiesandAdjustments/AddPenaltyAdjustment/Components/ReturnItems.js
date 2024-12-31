import React from "react";
import { FieldArray, ErrorMessage } from "formik";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const ReturnItems = ({ values, setFieldValue, required }) => (
  <div className="mb-6 p-6 rounded-md bg-gray-100">
    <FieldArray
      name="items"
      render={(arrayHelpers) => (
        <>
          {/* Headings */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-3 text-center font-normal">Revenue Type *</div>
            <div className="col-span-3 text-center font-normal">Revenue Reference *</div>
            <div className="col-span-2 text-center font-normal">Quantity *</div>
            <div className="col-span-2 text-center font-normal">Amount *</div>
            <div className="col-span-2"></div>
          </div>

          {values.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-4 items-center mb-4"
            >
              {/* Revenue Type */}
              <div className="col-span-3">
                <SelectInput
                  name={`items.${index}.revenueType`}
                  label=""
                  options={[
                    { value: "studentFee", label: "Student Fee" },
                    { value: "FacilityRevenue", label: "Facility Revenue" },
                    { value: "service_based_revenue", label: "Service-Based Revenue" },
                    { value: "community_externalaffair_revenue", label: "Community External Affair Revenue" },
                    { value: "financial_investment_revenue", label: "Financial Investment Revenue" },
                    { value: "Penalties", label: "Penalties" },
                    { value: "Other", label: "Other" },
                  ]}
                  placeholder="Select Revenue Type"
                  value={item.revenueType || undefined}
                  onChange={(value) =>
                    setFieldValue(`items.${index}.revenueType`, value)
                  }
                  required
                />
                <ErrorMessage
                  name={`items.${index}.revenueType`}
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Revenue Reference */}
              <div className="col-span-3">
                <TextInput
                  name={`items.${index}.revenueReference`}
                  label=""
                  placeholder="Enter Revenue Reference (e.g., ID or code)"
                  required
                  type="text"
                />
                <ErrorMessage
                  name={`items.${index}.revenueReference`}
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Quantity */}
              <div className="col-span-2">
                <TextInput
                  name={`items.${index}.quantity`}
                  label=""
                  placeholder="Enter Quantity"
                  required
                  type="number"
                  min={1}
                />
                <ErrorMessage
                  name={`items.${index}.quantity`}
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Amount */}
              <div className="col-span-2">
                <TextInput
                  name={`items.${index}.amount`}
                  label=""
                  placeholder="Enter Amount (e.g., 100.00)"
                  required
                  type="number"
                  min={0}
                />
                <ErrorMessage
                  name={`items.${index}.amount`}
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Remove Button */}
              <div className="col-span-2 flex justify-center">
                {values.items.length > 1 && (
                  <MinusCircleOutlined
                    onClick={() => arrayHelpers.remove(index)}
                    className="text-red-500 text-lg cursor-pointer"
                  />
                )}
              </div>
            </div>
          ))}

          {/* Add Item Button */}
          <div className="flex justify-center items-center flex-col mt-4">
            <button
              type="button"
              onClick={() =>
                arrayHelpers.push({
                  revenueType: "",
                  revenueReference: "",
                  quantity: 1,
                  amount: 0,
                })
              }
              className="rounded-full w-12 h-12 flex items-center justify-center"
              style={{
                background: "linear-gradient(to right, #ec4899, #a855f7)", // from-pink-500 to-purple-500
              }}
            >
              <PlusOutlined className="text-white text-lg" />
            </button>
            <span className="text-gray-600 text-sm mt-2">Add Item</span>
          </div>
        </>
      )}
    />
  </div>
);

export default ReturnItems;
