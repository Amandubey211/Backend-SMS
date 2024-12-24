import React from "react";
import { FieldArray } from "formik";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";

const ReturnItems = ({ values, setFieldValue }) => (
  <div className="mb-6 p-6 rounded-md" style={{ backgroundColor: "#ECECEC" }}>
    <FieldArray
      name="items"
      render={(arrayHelpers) => (
        <>
          {/* Headings */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-3 text-center font-normal">Category</div>
            <div className="col-span-2 text-center font-normal">Quantity</div>
            <div className="col-span-3 text-center font-normal">Rate</div>
            <div className="col-span-3 text-center font-normal">Total Amount</div>
            <div className="col-span-1"></div>
          </div>

          {values.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-4 items-center mb-4"
            >
              {/* Category */}
              <div className="col-span-3">
                <SelectInput
                  name={`items.${index}.category`}
                  label=""
                  options={["Category 1", "Category 2", "Category 3"]}
                  placeholder="Select"
                />
              </div>

              {/* Quantity */}
              <div className="col-span-2">
                <SelectInput
                  name={`items.${index}.quantity`}
                  label=""
                  options={[1, 2, 3, 4, 5]} // Example quantity options
                  placeholder="Select"
                />
              </div>

              {/* Rate */}
              <div className="col-span-3">
                <TextInput
                  name={`items.${index}.rate`}
                  label=""
                  type="number"
                  placeholder="Enter rate"
                />
              </div>

              {/* Total Amount */}
              <div className="col-span-3">
                <TextInput
                  name={`items.${index}.totalAmount`}
                  label=""
                  type="number"
                  readOnly
                  placeholder="Enter total amount"
                />
              </div>

              {/* Remove Button */}
              <div className="col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={() => arrayHelpers.remove(index)}
                  className="text-purple-500 hover:text-red-500 text-lg font-bold"
                >
                  ✖
                </button>
              </div>
            </div>
          ))}

          {/* Add Item Button */}
          <div className="flex justify-center items-center flex-col mt-4">
            <button
              type="button"
              onClick={() =>
                arrayHelpers.push({
                  category: "",
                  quantity: "",
                  rate: 0,
                  totalAmount: 0,
                })
              }
              className="rounded-full w-12 h-12 flex items-center justify-center"
              style={{
                background: "linear-gradient(to right, #ec4899, #a855f7)", // from-pink-500 to-purple-500
              }}
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
