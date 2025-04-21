import React, { forwardRef } from "react";
import Cookies from "js-cookie";
import { getSC } from "../getCurrency";

const PayrollTemplate = forwardRef((props, ref) => {
  const { data } = props;
  if (!data) return null;

  const {
    voucherNumber,
    schoolId,
    lineItems = [],
    description,
    isCancel,
    createdAt,
    remark,
    status,
    staffDetails,
    chequeDate,
    chequeNumber,
    paymentType,
    paymentDate,

  } = data;

  let totalAmount = 0;

  lineItems.forEach((item) => {
    totalAmount += item.netSalary || 0;
   
  });


  const {
    address = "",
    branchName = "",
    city = "",
    nameOfSchool = "-",
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
        Voucher {isCancel && "CANCELLED"}
        </div>
      </div>

      <div className="text-sm text-gray-800 mb-4 flex justify-between">
        <div>
          <p><strong>Bill To:</strong></p>
          <p><strong>Name:</strong> {staffDetails?.firstName} {staffDetails?.lastName} </p>
          <p><strong>Email:</strong> {staffDetails?.email }</p>
          <p><strong>Contact:</strong> {staffDetails?.contact }</p>
        </div>
        <div>
          <p><strong>Invoice No:</strong> {voucherNumber || ""}</p>
          <p><strong>Issue Date:</strong> {createdAt?.slice(0,10)}</p>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Currency:</strong> {currency}</p>

        </div>
      </div>

      <table className="w-full text-[10px] mb-6 border border-gray-300">
  <thead>
    <tr className="bg-pink-200 text-left">
      <th className="p-2 border">Item</th>
      <th className="p-2 border">Salary Month</th>
      <th className="p-2 border">Subcategory</th>
      <th className="p-2 border">Basic Salary</th>
      <th className="p-2 border">Allowances</th>
      <th className="p-2 border">Deductions</th>
      <th className="p-2 border">Tax</th>
      <th className="p-2 border">Net Salary</th>
      <th className="p-2 border">Bonus</th>
      <th className="p-2 border">Overtime</th>
      <th className="p-2 border">Leave Deductions</th>
      <th className="p-2 border">Other Adjustments</th>
    </tr>
  </thead>
  <tbody>
    {lineItems.map((item, index) => (
      <tr key={item._id || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
        <td className="p-2 border">{item?.name || "-"}</td>
        <td className="p-2 border">{item?.salaryMonth || "-"}</td>
        <td className="p-2 border">{item?.subCategory || "-"}</td>
        <td className="p-2 border">{item?.basicSalary || "-"}</td>
        <td className="p-2 border">{item?.allowances || "-"}</td>
        <td className="p-2 border">{item?.deductions || "-"}</td>
        <td className="p-2 border">{item?.tax || "-"}</td>
        <td className="p-2 border">{item?.netSalary || "-"}</td>
        <td className="p-2 border">{item?.bonus || "-"}</td>
        <td className="p-2 border">{item?.overtime || "-"}</td>
        <td className="p-2 border">{item?.leaveDeductions || "-"}</td>
        <td className="p-2 border">{item?.otherAdjustments || "-"}</td>
      </tr>
    ))}
  </tbody>
</table>

      <div className="flex flex-row items-center border border-gray-300 text-xs ">
        <div className="flex flex-col items-start p-4 w-[60%]">
           <p>Payment Details</p>
           {status == "paid" && <div className="my-4 border-t border-gray-500">
          <p><strong>Payment Date :</strong> {paymentDate?.slice(0,10)}</p>
          <p><strong>Payment Method :</strong> {paymentType}</p>
         {chequeNumber&& <p><strong>Cheque Number:</strong> {chequeNumber}</p>}
          {chequeDate &&<p><strong>Cheque Date:</strong> {chequeDate}</p>}
        </div>}

        </div>
        <div className="flex flex-col items-start p-4 w-[40%] border-l-2 border-gray-300">
        <p><strong>Total Amount</strong> = {totalAmount?.toFixed(2)} {currency}</p>
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

export default PayrollTemplate;