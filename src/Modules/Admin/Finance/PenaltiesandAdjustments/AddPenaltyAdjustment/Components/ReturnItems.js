import React from "react";
import { FieldArray } from "formik";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const ReturnItems = ({ values, setFieldValue }) => (
  <div className="mb-6 p-6 rounded-md" style={{ backgroundColor: "#ECECEC" }}>
    <FieldArray
      name="items"
      render={(arrayHelpers) => (
        <>
          {/* Headings */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-4 text-center font-normal">Revenue Type</div>
            <div className="col-span-4 text-center font-normal">Quantity</div>
            <div className="col-span-4 text-center font-normal">Amount</div>
          </div>

          {values.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-center mb-4">
              {/* Revenue Type */}
              <div className="col-span-4">
                <SelectInput
                  name={`items.${index}.revenueType`}
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
                  onChange={(value) => setFieldValue(`items.${index}.revenueType`, value)}
                />
              </div>

              {/* Quantity */}
              <div className="col-span-4">
                <TextInput
                  name={`items.${index}.quantity`}
                  placeholder="Enter Quantity"
                  type="number"
                  min={1}
                />
              </div>

              {/* Amount */}
              <div className="col-span-4">
                <TextInput
                  name={`items.${index}.amount`}
                  placeholder="Enter Amount"
                  type="number"
                  min={0}
                />
              </div>

              {/* Remove Button */}
              <div className="col-span-1 flex justify-center">
                <MinusCircleOutlined
                  onClick={() => arrayHelpers.remove(index)}
                  className="text-red-500 text-lg cursor-pointer"
                />
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
                  quantity: "",
                  amount: "",
                })
              }
              className="rounded-full w-12 h-12 flex items-center justify-center"
              style={{ background: "linear-gradient(to right, #ec4899, #a855f7)" }}
            >
              <span className="text-white text-lg">+</span>
            </button>
            <span className="text-gray-600 text-sm mt-2">Add Item</span>
          </div>
        </>
      )}
    />
  </div>
);

export default ReturnItems;
