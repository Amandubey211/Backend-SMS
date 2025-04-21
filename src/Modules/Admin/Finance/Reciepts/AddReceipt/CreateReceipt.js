// src/Modules/Admin/Finance/Receipts/AddReceipt/CreateReceipt.js

import React, { useEffect, useRef, useState } from "react";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import { Col,  Row, Tabs } from "antd";
import { IoSearch } from "react-icons/io5";
import { MdOutlineFileCopy } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import TabPane from "antd/es/tabs/TabPane";
import toast from "react-hot-toast";
import { TbFileInvoice } from "react-icons/tb";
import { createReceipt, fetchReciptInvoiceData } from "../../../../../Store/Slices/Finance/Receipts/receiptsThunks";
import {  Form, Input, Button, Select, DatePicker } from "antd";
import Layout from "../../../../../Components/Common/Layout";
const CreateReceipt = () => {
 
  const dispatch = useDispatch()
  const [searchInvoiceNumber,setSearchInvoiceNumber] = useState("");
  const[invoiceData,setInvoiceData] = useState(null);
  const[pendingInvoiceData,setPendingInvoiceData] = useState([]);
  const[studentId,setStudentDetails] = useState(null);
  const[entityId,setentityId] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalRemaining, setTotalRemaining] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [totalPenalty, setTotalPenalty] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [receiptData, setReceiptData] = useState({
    paymentType: "",
    paymentStatus: "",
    paidBy: "",
    paymentDate: new Date(),
    paidItems: [],
    chequeNumber: "",
    chequeDate: null,
    onlineTransactionId: "",
    note: "",
    receiptData:null
  });
  const handlePayNowAmountChange = (e, lineItemId) => {
    const value = e.target.value;
    console.log(value);
  
    // Check if the lineItemId exists in the paidItems array
    const itemIndex = receiptData.paidItems.findIndex(item => item.lineItemId === lineItemId);
    
    if (itemIndex !== -1) {
      // If it exists, update the existing item
      const updatedPaidItems = [...receiptData.paidItems];
      updatedPaidItems[itemIndex] = { ...updatedPaidItems[itemIndex], amountPaid: value };
  
      setReceiptData((prevData) => ({ ...prevData, paidItems: updatedPaidItems }));
    } else {
      // If it doesn't exist, add a new item
      const newItem = { lineItemId, amountPaid: value };
      setReceiptData((prevData) => ({
        ...prevData,
        paidItems: [...prevData.paidItems, newItem]
      }));
    }
  };
  
  const searchInvoice = ()=>{
    
    
    if(searchInvoiceNumber?.trim()?.split("-")?.length != 3){
      toast.error("Please Enter Correct Invoice Number");
      return
    }
    if(!["S", "E"].includes(searchInvoiceNumber.slice(-1))){
      toast.error("Please Enter Correct Invoice Number");
      return
    }
   
    dispatch(fetchReciptInvoiceData(searchInvoiceNumber)).then((data)=>{
 
    setInvoiceData(data.payload?.invoice);
 
  })
}


  useEffect(()=>{
    if (!invoiceData?.lineItems) return;
    console.log(invoiceData);
    
    let amount = 0;
    let paid = 0;
    let remaining = 0;
    let tax = 0;
    let penalty = 0;
    let discount = 0;

    invoiceData?.lineItems.forEach((item) => {
      amount += item.final_amount || 0;
      paid += item.paid_amount || 0;
      remaining += item.remaining_amount || 0;
      tax +=  ((item.rate * item.quantity)/100)*item.tax || 0;
      penalty += item.penalty_amount || 0;
      discount += item.discountType === "percentage"
        ? (item.final_amount * item.discount) / 100
        : item.discount;
    });

    setTotalAmount(amount);
    setTotalPaid(paid);
    setTotalRemaining(remaining);
    setTotalTax(tax);
    setTotalPenalty(penalty);
    setTotalDiscount(discount);
    setFinalAmount(amount + tax + penalty - discount);
  },[invoiceData])
  const handleChange = (field, value) => {
    setReceiptData({
      ...receiptData,
      [field]: value,
    });
  };
  const handlePaste = async()=>{
    try {
      const text = await navigator.clipboard.readText();
      setSearchInvoiceNumber(text);
    } catch (error) {
      console.error("Failed to read clipboard contents: ", error);
    }
  }


  return (
    <Layout title="Finance | Create Reciept">
    <DashLayout>
    
      <div className="p-4 ">
        <div className="flex flex-row items-start gap-4">
          <div className="flex flex-row items-center relative">
            <input type="text" className="w-[20rem] h-[2.5rem] p-2 border border-gray-400 rounded-lg" placeholder="Enter Invoice Number" onChange={(e)=>setSearchInvoiceNumber(e.target.value)} value={searchInvoiceNumber}/>
            <MdOutlineFileCopy title="Paste" className="absolute right-1 cursor-pointer" size={20} onClick={()=>handlePaste()} />
          </div>
          <div>
            <button className="flex flex-row items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 rounded-lg shadow-lg h-[2.5rem]" onClick={()=>searchInvoice()}> <IoSearch /> Search</button>
          </div>
        </div>
        {invoiceData ? <Tabs className="mt-4">
          <TabPane tab="Invoice Details" key="1">
          <div className="flex flex-col">
          <div>
          <div className="w-full text-center text-white font-bold py-2" style={{ backgroundColor: "#C83B62", fontSize: "18px" }}>
          INVOICE {invoiceData?.isCancel && "CANCELLED"}

        </div>
      </div> 

          <div className="text-sm text-gray-800 mb-4 flex justify-between">
        {invoiceData?.studentId &&<div>
          <p><strong>Bill To</strong></p>
          <p><strong>Name:</strong> {invoiceData?.studentId?.firstName} {invoiceData?.studentId?.lastName}</p>
          <p><strong>Email:</strong> {invoiceData?.studentId?.email }</p>
          <p><strong>Contact:</strong> {invoiceData?.studentId?.contactNumber }</p>
        </div>}
        {invoiceData?.entityId&&<div>
          <p><strong>Bill To:</strong></p>
          <p><strong>Name:</strong> {invoiceData?.entityId?.name} </p>
          <p><strong>Email:</strong> {invoiceData?.entityId?.email }</p>
          <p><strong>Contact:</strong> {invoiceData?.entityId?.Contact }</p>
        </div>}
        <div>
          <p><strong>Invoice No:</strong> {invoiceData?.InvoiceNumber || ""}</p>
          <p><strong>Issue Date:</strong> {invoiceData?.generateDate?.slice(0,10)}</p>
          <p><strong>Status:</strong> {totalPaid == 0 ? "Unpiad":totalPaid == finalAmount ?"Paid":"Partial"}</p>
          <p><strong>Currency:</strong> {invoiceData?.schoolId?.currency}</p>

        </div>
      </div>

      <table className="w-full text-[15px] mb-6 border border-gray-300">
        <thead>
          <tr className="bg-pink-200 text-left">
          <th className="p-2 border">Item</th>
            <th className="p-2 border">Item Detail</th>
            <th className="p-2 border">Rate</th>
            <th className="p-2 border">Qty</th>
            <th className="p-2 border">Tax (%)</th>
            <th className="p-2 border">Penalty</th>
            <th className="p-2 border">Discount</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Paid</th>
            <th className="p-2 border">Balance</th>
            <th className="p-2 border">Due Date</th>
            <th className="p-2 border">Pay Now</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData?.lineItems.map((item, index) => (
            <tr key={item._id || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="p-2 border">{item.name || "N/A"}</td>
              <td className="p-2 border">{item.itemDetails} <br/> {item.frequency !== "one-time" && ` ${item.frequency} from ${item?.startDate?.slice(0,10)} to ${item?.endDate?.slice(0,10)}`}</td>
              <td className="p-2 border text-start">{item.rate?.toFixed(2)}</td>
              <td className="p-2 border text-start">{item.quantity || 1}</td>
              <td className="p-2 border text-start">{item.tax?.toFixed(2)}</td>
              <td className="p-2 border text-start">{item.penalty_amount?.toFixed(2)||0}</td>
              <td className="p-2 border text-start">{item.discount?.toFixed(2)||0}{item.discountType == "percentage"&& "%"}</td>
              <td className="p-2 border text-start">{item.final_amount?.toFixed(2)||0}</td>
              <td className="p-2 border text-start">{item.paid_amount?.toFixed(2)||0}</td>
              <td className="p-2 border text-start">{item.remaining_amount?.toFixed(2)||0}</td>
              <td className="p-2 border text-start">{item?.dueDate?.slice(0,10)||" "}</td>
              <td className="pl-1 border text-start"> 
                <input type="Number" className="w-[7rem] border border-gray-300 rounded-md p-2"
                 onChange={(e)=>handlePayNowAmountChange(e,item._id)}
                 placeholder="Enter Amount"/>
              </td>
            </tr>
         
          ))}
        </tbody>
      </table>
      <div className="flex flex-row items-center border border-gray-300 text-xs ">
        <div className="flex flex-col items-start p-4 w-[60%]">
           <p>Payment Details</p>
           <div className="w-full h-[90%]">

           </div>

        </div>
        <div className="flex flex-col items-start p-4 w-[40%] border-l-2 border-gray-300 text-sm">
        <p><strong>Total Amount</strong> = {totalAmount?.toFixed(2)} {invoiceData?.schoolId?.currency}</p>
        <p><strong>Total Discount</strong> = {totalDiscount?.toFixed(2)} {invoiceData?.schoolId?.currency}</p>
        <p><strong>Total Penalty</strong> = {totalPenalty?.toFixed(2)} {invoiceData?.schoolId?.currency}</p>
        <p><strong>Total Tax</strong> = {totalTax?.toFixed(2)}  {invoiceData?.schoolId?.currency}</p>
        <p className="border-t mt-2"><strong>Final Amount</strong> = {finalAmount?.toFixed(2)} {invoiceData?.schoolId?.currency}</p>
        <p><strong>Total Paid</strong> = {totalPaid?.toFixed(2)} {invoiceData?.schoolId?.currency}</p>
        <p><strong>Total Remaining</strong> = {(finalAmount-totalPaid)?.toFixed(2)} {invoiceData?.schoolId?.currency}</p>
        </div>
      </div>
      
       </div>
       <Form
      layout="vertical"
      onFinish={() => {dispatch(createReceipt({...receiptData,invoiceNumber:searchInvoiceNumber}))}}
      initialValues={receiptData}
      className="mt-4"
    >
      {/* Row 1 */}
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item label="Payment Type" name="paymentType"  rules={[{ required: true ,message:"Payment Type is required"}]} >
            <Select
              value={receiptData.paymentType}
              onChange={(value) => handleChange("paymentType", value)}
            >
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="card">Card</Select.Option>
              <Select.Option value="online">Online</Select.Option>
              <Select.Option value="cheque">Cheque</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Payment Date" name="paymentDate"  rules={[{ required: true ,message:"Payment Date is required"}]}>
            <input type="date"
            className="w-[15rem] h-[2rem] border border-gray-300 rounded-lg p-2"
              value={receiptData.paymentDate}
              onChange={(e) => handleChange("paymentDate", e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label={`Payer Full Name (${'*Name on Bank Account'})`} name="paidBy" rules={[{ required: true ,message:"Payer Name is required"}]}>
            <Input
              value={receiptData.paidBy}
              placeholder="Payer Full Name"
              onChange={(e) => handleChange("paidBy", e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Row 2 */}
      <Row gutter={16}>
       

        {/* Conditional Fields */}
        {/* {receiptData.paymentType !== "cash" & receiptData.paymentType !== "cheque" ? (
          <>
            <Col span={6}>
              <Form.Item label="Online Transaction ID" name="onlineTransactionId"  rules={[{ required: true ,message:"Transaction ID is required"}]}>
                <Input
                  value={receiptData.onlineTransactionId}
                  onChange={(e) => handleChange("onlineTransactionId", e.target.value)}
                />
              </Form.Item>
            </Col>
          </>
        ):null} */}

        {/* Conditional Fields for Cheque */}
        {receiptData.paymentType === "cheque" && (
          <>
            <Col span={6}>
              <Form.Item label="Cheque Number" name="chequeNumber"  rules={[{ required: true ,message:"Cheque Number is required"}]}>
                <Input
                  value={receiptData.chequeNumber}
                  onChange={(e) => handleChange("chequeNumber", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Cheque Date" name="chequeDate"  rules={[{ required: true ,message:"Cheque Date is required"}]}>
                <input type="date"
                className="w-[15rem] h-[2rem] border border-gray-300 rounded-lg p-2"
                  value={receiptData.chequeDate}
                  onChange={(e) => handleChange("chequeDate", e.target.value)}
                />
              </Form.Item>
            </Col>
          </>
        )}
      </Row>

      {/* Row 3 */}
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item label="Note" name="note">
            <Input.TextArea
              value={receiptData.note}
              onChange={(e) => handleChange("note", e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>

      <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2" htmlType="submit">Submit</Button>
    </Form>
          </TabPane>

          {/* <TabPane tab="OverDue Invoices" key="2">
        
          </TabPane> */}
        </Tabs>:<div className="w-full h-[80vh] flex flex-col items-center justify-center">
            <p className="text-gray-500">Enter or Paste Invoice Number and Get Data</p>
            <p className="text-gray-500"><TbFileInvoice size={50} /></p>
          </div>}
       
      </div>
    </DashLayout>
    </Layout>
  );
};

export default CreateReceipt;

