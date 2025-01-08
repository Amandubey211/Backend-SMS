import React, { useEffect, useState } from "react";
import { Formik, Form, FieldArray, useFormikContext } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { addInvoice } from "../../../../../Store/Slices/Finance/Invoice/invoice.thunk";
import AdminDashLayout from "../../../../../Components/Admin/AdminDashLayout";
import Layout from "../../../../../Components/Common/Layout";
import TextInput from "./Components/TextInput";
import SelectInput from "./Components/SelectInput";
import { TotalInputs } from "./TotalInputs";

const CreateNewInvoice = () => {
  const [loading, setLoading] = useState(false);
  const { invoiceData } = useSelector((store) => store.admin.invoices); // Redux data
  const dispatch = useDispatch();

  let initialValues = invoiceData || {
    dueDate: "",
    receiver: {
      name: "",
      address: "",
      contact: "",
      email: "",
    },
    description: "",
    lineItems: [{ revenueType: "", quantity: 1, amount: 0 }],
    discountType: "",
    discount: 0,
    penalty: 0,
    tax: 0,
    totalAmount: 0,
    finalAmount: 0,
    paymentType: "",
    paymentStatus: "",
  };

  const validationSchema = Yup.object().shape({
    dueDate: Yup.string().required("Due Date is required"),
    "receiver.name": Yup.string().required("Receiver name is required"),
    "receiver.address": Yup.string().required("Receiver address is required"),
    "receiver.contact": Yup.string(),
    "receiver.email": Yup.string().email("Invalid email format"),
    lineItems: Yup.array().of(
      Yup.object().shape({
        revenueType: Yup.string().required("Revenue type is required"),
        quantity: Yup.number().min(1, "Quantity must be at least 1").required(),
        amount: Yup.number().min(0, "Amount must be positive").required(),
      })
    ),
    discountType: Yup.string().oneOf(["percentage", "amount"], "Invalid discount type"),
    totalAmount: Yup.number().min(0, "Total amount must be positive"),
    finalAmount: Yup.number().min(0, "Final amount must be positive"),
    paymentType: Yup.string().oneOf(["cash", "card", "online", "cheque", "other"]),
    paymentStatus: Yup.string().oneOf(["paid", "unpaid", "partial", "advance"]),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    dispatch(addInvoice(values)).then(()=>setLoading(false))
  };
  

  const isReadonly = invoiceData?.mode == 'view' ?true:false ;
  
  return (
    <Layout title="Finance | Invoice">
      <AdminDashLayout>
        <div className="p-6 min-h-screen">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div className="flex justify-between gap-4 mb-6">
                  <h1 className="text-2xl font-semibold mb-6">
                    {isReadonly ? "View Invoice" : "Create Invoice"}
                  </h1>
                  {!isReadonly && (
                    <div className="gap-4">
                      <button
                        type="reset"
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
                      >
                        Reset
                      </button>
                      <button
                        onClick={()=>handleSubmit(values)}
                        disabled={loading}
                        className="px-4 py-2 mx-2 rounded-md text-white"
                        style={{
                          background: "linear-gradient(to right, #ec4899, #a855f7)",
                        }}
                      >
                        {loading ? "Loading..." : "Save Invoice"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <TextInput
                    name="dueDate"
                    label="Due Date"
                    placeholder="Enter due date"
                    type="date"
                    disabled={isReadonly}
                  />
                  <TextInput
                    name="receiver.name"
                    label="Receiver Name"
                    placeholder="Enter Receiver Name"
                    disabled={isReadonly}
                  />
                  <TextInput
                    name="receiver.address"
                    label="Receiver Address"
                    placeholder="Enter Receiver Address"
                    disabled={isReadonly}
                  />
                  <TextInput
                    name="receiver.contact"
                    label="Contact"
                    placeholder="Enter Contact"
                    disabled={isReadonly}
                  />
                  <TextInput
                    name="receiver.email"
                    label="Email"
                    placeholder="Enter Email"
                    disabled={isReadonly}
                  />
                  <TextInput
                    name="description"
                    label="Note"
                    placeholder="Enter Short Description"
                    disabled={isReadonly}
                  />
                </div>

                <div className="p-6 rounded-md mx-20 mb-8" style={{ backgroundColor: "#ECECEC" }}>
                  <h2 className="text-lg font-semibold mb-4">Items</h2>
                  <FieldArray name="lineItems">
                    {({ remove, push }) => (
                      <>
                        {values?.lineItems?.map((item, index) => (
                          <div key={index} className="grid grid-cols-12 gap-4 items-center mb-4">
                            <div className="col-span-4">
                              <SelectInput
                                name={`lineItems.${index}.revenueType`}
                                label="Revenue Type"
                                options={[
                                  "Student-Based Revenue",
                                  "Facility-Based Revenue",
                                  "Service-Based Revenue",
                                  "Community and External Revenue",
                                  "Financial Investments",
                                  "Penalties",
                                  "Other",
                                ]}
                                disabled={isReadonly}
                              />
                            </div>
                            <div className="col-span-3">
                              <TextInput
                                name={`lineItems.${index}.quantity`}
                                label="Quantity"
                                type="number"
                                placeholder="Enter Quantity"
                                disabled={isReadonly}
                              />
                            </div>
                            <div className="col-span-3">
                              <TextInput
                                name={`lineItems.${index}.amount`}
                                label="Amount"
                                type="number"
                                placeholder="Enter Amount"
                                disabled={isReadonly}
                              />
                            </div>
                            {!isReadonly && (
                              <div className="col-span-2 flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  ✖
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {!isReadonly && (
                          <div className="flex justify-center items-center flex-col mt-4">
                            <button
                              type="button"
                              onClick={() => push({ revenueType: "", quantity: 1, amount: 0 })}
                              className="rounded-full w-12 h-12 flex items-center justify-center"
                              style={{
                                background: "linear-gradient(to right, #ec4899, #a855f7)",
                              }}
                            >
                              <span className="text-white text-lg">+</span>
                            </button>
                            <span className="text-gray-600 text-sm mt-2">Add Item</span>
                          </div>

                        )}
                      </>
                    )}
                  </FieldArray>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <SelectInput
                    name="discountType"
                    label="Discount Type"
                    options={["percentage", "amount"]}
                    disabled={isReadonly}
                  />
                  <TextInput
                    name="discount"
                    label="Discount"
                    placeholder="Enter Discount"
                    disabled={isReadonly}
                  />
                  <TextInput
                    name="penalty"
                    label="Penalty"
                    placeholder="Enter Penalty"
                    disabled={isReadonly}
                  />
                  <TextInput
                    name="tax"
                    label="Tax"
                    placeholder="Enter Tax"
                    disabled={isReadonly}
                  />
                 
                  <SelectInput
                    name="paymentType"
                    label="Payment Type"
                    options={["cash", "card", "online", "cheque", "other"]}
                    disabled={isReadonly}
                  />
                  <SelectInput
                    name="paymentStatus"
                    label="Payment Status"
                    options={["paid", "unpaid", "partial", "advance"]}
                    disabled={isReadonly}
                  />
                </div>
                <TotalInputs/>
              </Form>
            )}
          </Formik>
        </div>
      </AdminDashLayout>
    </Layout>
  );
};

export default CreateNewInvoice;
