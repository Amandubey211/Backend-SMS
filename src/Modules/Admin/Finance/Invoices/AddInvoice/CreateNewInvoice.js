import React, { useState } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import AdminDashLayout from "../../../../../Components/Admin/AdminDashLayout";
import TextInput from "./Components/TextInput";
import SelectInput from "./Components/SelectInput";
import { useDispatch } from "react-redux";
import { addInvoice } from "../../../../../Store/Slices/Finance/Invoice/invoice.thunk";
import toast from "react-hot-toast";
import Layout from "../../../../../Components/Common/Layout";

const CreateNewInvoice = () => {
  const [loading,setLoading] = useState(false)
  const initialValues = {
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
  const dispatch = useDispatch()
  const handleSubmit = async (values) => {
    setLoading(true)
    dispatch(addInvoice(values)).then(()=>setLoading(false))
  };

  return (
    <Layout title="Finance | Invoice">
    <AdminDashLayout>
      <div className="p-6 min-h-screen">

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={() => { }}
        >

          {({ values, setFieldValue }) => (
            <Form>
              <div className="flex justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-semibold mb-6">Create Invoice</h1>
                </div>

                <div className="gap-4">
                  <button
                    type="reset"
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 mx-2 rounded-md text-white"
                    onClick={() => handleSubmit(values)}
                    style={{
                      background: "linear-gradient(to right, #ec4899, #a855f7)", // from-pink-500 to-purple-500
                    }}
                  >
                    {loading?'Loading..':'Save Invoice'}
                  </button></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <TextInput name="dueDate" label="Due Date" placeholder="Enter due date" type="datetime-local" />
                <TextInput name="receiver.name" label="Receiver Name" placeholder="Enter Receiver Name" />
                <TextInput name="receiver.address" label="Receiver Address" placeholder="Enter Receiver Address" />
                <TextInput name="receiver.contact" label="Contact" placeholder="Enter Contact" />
                <TextInput name="receiver.email" label="Email" placeholder="Enter Email" />
                <TextInput name="description" label="Note" placeholder="Enter Short Description" />
              </div>
              <div className="p-6 rounded-md flex items-center flex-col justify-center mx-20" style={{ backgroundColor: "#ECECEC" }}>
                <h2 className="text-lg font-semibold mb-4">Items</h2>
                <FieldArray name="lineItems">
                  {({ remove, push }) => (
                    <>
                      {values.lineItems.map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-12 gap-4 items-center mb-4"
                        >
                          <div className="col-span-4">
                            <SelectInput
                              name={`lineItems.${index}.revenueType`}
                              label="Revenue Type"
                              options={["studentFee",
                                "FacilityRevenue",
                                "service_based_revenue",
                                "community_externalaffair_revenue",
                                "financial_investment_revenue",
                                "Penalties",
                                "Other",]}
                            />
                          </div>

                          <div className="col-span-3">
                            <TextInput
                              name={`lineItems.${index}.quantity`}
                              label="Quantity"
                              type="number"
                              placeholder="Enter Quantity"
                            />
                          </div>
                          <div className="col-span-3">
                            <TextInput
                              name={`lineItems.${index}.amount`}
                              label="Amount"
                              type="number"
                              placeholder="Enter Amount"
                            />
                          </div>
                          <div className="col-span-2 flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✖
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-center items-center flex-col mt-4">
                        <button
                          type="button"
                          onClick={() =>
                            push({ revenueType: "", quantity: 1, amount: 0 })
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
                </FieldArray>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <SelectInput
                  name="discountType"
                  label="Discount Type"
                  options={["percentage", "amount"]}
                />
                <TextInput name="discount" label="Discount" placeholder="Enter Discount" />
                <TextInput name="penalty" label="Penalty" placeholder="Enter Penalty" />
                <TextInput name="tax" label="Tax" placeholder="Enter Tax" />
                <TextInput name="finalAmount" label="Final Amount" placeholder="Calculated automatically" />
                <SelectInput
                  name="paymentType"
                  label="Payment Type"
                  options={["cash", "card", "online", "cheque", "other"]}
                />
                <SelectInput
                  name="paymentStatus"
                  label="Payment Status"
                  options={["paid", "unpaid", "partial", "advance"]}
                />
              </div>


            </Form>
          )}
        </Formik>
      </div>
    </AdminDashLayout>
    </Layout>
  );
};

export default CreateNewInvoice;
