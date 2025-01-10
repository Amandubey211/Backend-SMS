import React from "react";
import { FieldArray } from "formik";
import TextInput from "./TextInput";

const ReturnItems = ({ values, setFieldValue }) => (
  <div className="mb-6 p-6 rounded-md" style={{ backgroundColor: "#ECECEC" }}>
    <FieldArray
      name="items"
      render={(arrayHelpers) => (
        <>
          {/* Headings */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-4 text-center font-normal">Category</div>
            <div className="col-span-3 text-center font-normal">Quantity</div>
            <div className="col-span-4 text-center font-normal">Total Amount</div>
            <div className="col-span-1"></div>
          </div>

          {values.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-4 items-center mb-4"
            >
              {/* Category */}
              <div className="col-span-4">
                <TextInput
                  name={`items.${index}.category`}
                  label=""
                  placeholder="Enter category"
                />
              </div>

              {/* Quantity */}
              <div className="col-span-3">
                <TextInput
                  name={`items.${index}.quantity`}
                  type="number"
                  placeholder="Enter quantity"
                />
              </div>

              {/* Total Amount */}
              <div className="col-span-4">
                <TextInput
                  name={`items.${index}.totalAmount`}
                  label=""
                  type="number"
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
                  totalAmount: "",
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
