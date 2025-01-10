// src/Modules/Admin/Finance/Receipts/AddReceipt/ReturnItems.js

import React from "react";
import { FieldArray } from "formik";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const ReturnItems = ({ values, setFieldValue, readOnly }) => (
  <div className="mb-6 p-6 rounded-md" style={{ backgroundColor: "#ECECEC" }}>
    <FieldArray
      name="items"
      render={(arrayHelpers) => (
        <>
          {/* Headings */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-4 text-center font-normal">Revenue Type</div>
            <div className="col-span-4 text-center font-normal">Revenue Reference</div>
            <div className="col-span-4 text-center font-normal">Quantity</div>
            <div className="col-span-4 text-center font-normal">Amount (QR)</div>
            <div className="col-span-1 text-center font-normal">Actions</div>
          </div>

          {Array.isArray(values.items) &&
            values.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-4 items-center mb-4"
              >
                {/* Revenue Type */}
                <div className="col-span-3">
                  <SelectInput
                    name={`items.${index}.revenueType`}
                    label="Revenue Type"
                    options={[
                      { value: "studentFee", label: "Student Fee" },
                      { value: "facilityRevenue", label: "Facility Revenue" },
                      { value: "serviceBasedRevenue", label: "Service-Based Revenue" },
                      {
                        value: "communityExternalAffairRevenue",
                        label: "Community External Affair Revenue",
                      },
                      {
                        value: "financialInvestmentRevenue",
                        label: "Financial Investment Revenue",
                      },
                      { value: "penalties", label: "Penalties" },
                      { value: "other", label: "Other" },
                    ]}
                    placeholder="Select Revenue Type"
                    value={item.revenueType || ""}
                    onChange={(value) =>
                      setFieldValue(`items.${index}.revenueType`, value)
                    }
                    disabled={readOnly}
                    required
                  />
                </div>

                {/* Revenue Reference */}
                <div class="col-span-3" style="display: none;">
                  <TextInput
                    name={`items.${index}.revenueReference`}
                    label="Revenue Reference"
                    placeholder="Enter Revenue Reference"
                    type="text"
                    required
                    disabled={readOnly}
                  />
                </div>
                

                {/* Quantity */}
                <div className="col-span-3">
                  <TextInput
                    name={`items.${index}.quantity`}
                    label="Quantity"
                    type="number"
                    placeholder="Enter Quantity"
                    required
                    min={1}
                    disabled={readOnly}
                  />
                </div>

                {/* Amount */}
                <div className="col-span-3">
                  <TextInput
                    name={`items.${index}.amount`}
                    label="Amount (QR)"
                    type="number"
                    placeholder="Enter Amount"
                    required
                    min={0}
                    disabled={readOnly}
                  />
                </div>

                {/* Remove Item Button */}
                <div className="col-span-1 flex justify-center">
                  {!readOnly && (
                    <MinusCircleOutlined
                      onClick={() => arrayHelpers.remove(index)}
                      className="text-red-500 text-xl cursor-pointer"
                    />
                  )}
                </div>
              </div>
            ))}

          {/* Add Item Button */}
          {!readOnly && (
            <div className="flex justify-center items-center mt-4">
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
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
              >
                <PlusOutlined />
              </button>
              <span className="ml-2 text-gray-600 text-sm">Add Item</span>
            </div>
          )}
        </>
      )}
    />
  </div>
);

export default ReturnItems;
