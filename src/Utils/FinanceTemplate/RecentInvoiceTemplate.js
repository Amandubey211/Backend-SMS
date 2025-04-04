import React, { forwardRef } from "react";
import Cookies from "js-cookie";
import { getSC } from "../getCurrency";

const RecentInvoiceTemplate = forwardRef((props, ref) => {
  const { data } = props;
  if (!data) return null;

  const {
    InvoiceNumber,
    schoolId,
    discount = 0,
    discountType,
    lineItems = [],
    description,
    penalty = 0,
    isCancel,
    generateDate,
    remark,
    studentDetails,
    paymentStatus,
    entityDetails,
  } = data;



  // Initialize totals
  let totalAmount = 0,
    totalPaid = 0,
    totalRemaining = 0,
    totalTax = 0,
    totalPenalty = penalty,
    totalDiscount = 0;

  lineItems.forEach((item) => {
    totalAmount += item.final_amount || 0;
    totalPaid += item.paid_amount || 0;
    totalRemaining += item.remaining_amount || 0;
    totalTax +=  ((item.rate * item.quantity)/100)*item.tax || 0;
    totalPenalty += item.penalty_amount || 0;
    totalDiscount +=
      item.discountType === "percentage"
        ? (item.final_amount * item.discount) / 100
        : item.discount;
  });

  const finalAmount = totalAmount + totalTax + totalPenalty - discount;

  const {
    address = "",
    branchName = "",
    city = "",
    nameOfSchool = "N/A",
    currency="",
    logo="",
  } = schoolId || {};

  return (
    <div className="p-6 bg-gray-50 rounded-md shadow-lg max-w-3xl mx-auto" ref={ref}>
      <div className="flex flex-col items-center mb-6">
        <div className="w-full bg-pink-100 px-4 flex-row py-2 flex justify-between items-center rounded-t-lg">
          <div>
            <h1 className="font-bold text-lg">{nameOfSchool}</h1>
            <p className="text-sm text-gray-500">{`${city}, ${branchName}`}</p>
          </div>
          {logo && <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />}
        </div>
        <div className="w-full text-center text-white font-bold py-2" style={{ backgroundColor: "#C83B62", fontSize: "18px" }}>
          INVOICE {isCancel && "CANCELLED"}
        </div>
      </div>

      <div className="text-sm text-gray-800 mb-4 flex justify-between">
        {studentDetails &&<div>
          <p><strong>Bill To</strong></p>
          <p><strong>Name:</strong> {studentDetails?.firstName} {studentDetails?.lastName}</p>
          <p><strong>Email:</strong> {studentDetails?.email }</p>
          <p><strong>Contact:</strong> {studentDetails?.contact }</p>
        </div>}
        {entityDetails &&<div>
          <p><strong>Bill To:</strong></p>
          <p><strong>Name:</strong> {entityDetails?.entityName} </p>
          <p><strong>Email:</strong> {entityDetails?.email }</p>
          <p><strong>Contact:</strong> {entityDetails?.contactNumber }</p>
        </div>}
        <div>
          <p><strong>Invoice No:</strong> {InvoiceNumber || ""}</p>
          <p><strong>Issue Date:</strong> {generateDate?.slice(0,10)}</p>
          <p><strong>Status:</strong> {paymentStatus}</p>
          <p><strong>Currency:</strong> {currency}</p>

        </div>
      </div>

      <table className="w-full text-[10px] mb-6 border border-gray-300">
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
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, index) => (
            <tr key={item._id || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
           
              <td className="p-2 border">{item.name || "N/A"}</td>
              <td className="p-2 border">{item.itemDetails} <br/> {item.frequency != "Permanent Purchase" && `
               ${item.frequency} from ${item?.startDate?.slice(0,10)} to ${item?.endDate?.slice(0,10)}`}</td>
              <td className="p-2 border text-start">{item.rate?.toFixed(2)}</td>
              <td className="p-2 border text-start">{item.quantity || 1}</td>
              <td className="p-2 border text-start">{item.tax?.toFixed(2)}</td>
              <td className="p-2 border text-start">{item.penalty_amount?.toFixed(2)}</td>
              <td className="p-2 border text-start">{item.discount?.toFixed(2)}{item.discountType == "percentage"&& "%"}</td>
              <td className="p-2 border text-start">{item.final_amount?.toFixed(2)}</td>
              <td className="p-2 border text-start">{item.paid_amount?.toFixed(2)||0}</td>
              <td className="p-2 border text-start">{item.remaining_amount?.toFixed(2)||0}</td>
              <td className="p-2 border text-start">{item?.dueDate?.slice(0,10)||" "}</td>
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
        <div className="flex flex-col items-start p-4 w-[40%] border-l-2 border-gray-300">
        <p><strong>Total Amount</strong> = {totalAmount?.toFixed(2)} {currency}</p>
        <p><strong>Total Discount</strong> = {totalDiscount?.toFixed(2)} {currency}</p>
        <p><strong>Total Penalty</strong> = {totalPenalty?.toFixed(2)} {currency}</p>
        <p><strong>Total Tax</strong> = {totalTax?.toFixed(2)}  {currency}</p>
        <p className="border-t mt-2"><strong>Final Amount</strong> = {finalAmount?.toFixed(2)} {currency}</p>
        <p><strong>Total Paid</strong> = {totalPaid?.toFixed(2)} {currency}</p>
        <p><strong>Total Remaining</strong> = {(finalAmount-totalPaid).toFixed(2)} {currency}</p>
        </div>
      </div>

      <div className="text-sm text-gray-700">
        <p><strong>Remarks:</strong></p>
        <ul className="list-disc px-5">
          {description && <li>{description}</li>}
          <li>Thank you for your business. Contact us for any queries.</li>
        </ul>
      </div>
    </div>
  );
});

export default RecentInvoiceTemplate;