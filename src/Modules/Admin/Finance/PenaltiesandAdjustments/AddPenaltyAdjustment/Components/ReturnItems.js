import React from "react";
import { FieldArray } from "formik";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const ReturnItems = ({ values, setFieldValue }) => (
  <div className="mb-6 p-6 rounded-md bg-gray-100">
    <FieldArray
      name="items"
      render={(arrayHelpers) => (
        <>
          {/* Headings */}
          <div className="grid grid-cols-12 gap-6 mb-4">
            <div className="col-span-4 flex items-center justify-center">
              <span className="font-medium">
                Revenue Type <span className="text-red-500">*</span>
              </span>
            </div>
            <div className="col-span-4 flex items-center justify-center">
              <span className="font-medium">
                Quantity <span className="text-red-500">*</span>
              </span>
            </div>
            <div className="col-span-4 flex items-center justify-center">
              <span className="font-medium">
                Amount <span className="text-red-500">*</span>
              </span>
            </div>
          </div>

          {values.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-6 items-center mb-4">
              {/* Revenue Type */}
              <div className="col-span-4">
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
                />
              </div>

              {/* Revenue Reference */}
              <div className="col-span-3 hidden">
                <TextInput
                  name={`items.${index}.revenueReference`}
                  label=""
                  placeholder="Enter Revenue Reference (e.g., ID or code)"
                  type="text"
                />
              </div>

              {/* Quantity */}
              <div className="col-span-4">
                <TextInput
                  name={`items.${index}.quantity`}
                  label=""
                  placeholder="Enter Quantity"
                  type="number"
                  min={1}
                />
              </div>

              {/* Amount */}
              <div className="col-span-4">
                <TextInput
                  name={`items.${index}.amount`}
                  label=""
                  placeholder="Enter Amount"
                  type="number"
                  min={0}
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
        </>
      )}
    />
  </div>
);

export default ReturnItems;
