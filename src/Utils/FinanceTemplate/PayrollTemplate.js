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
   <div className="flex relative h-[10rem]">
      <div className="w-[70%] h-[10rem]  bg-[#B874FF] z-40 [clip-path:polygon(0_0,100%_0,92%_18%,0_18%)] absolute top-0 left-0">
      </div>
      <div className="w-[70%] h-[10rem]  absolute top-9 left-0 flex flex-col gap-1">
      {logo && <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />}
      <h1 className="font-bold text-lg">{nameOfSchool}</h1>
      <p className="text-sm text-gray-500">{`${city}, ${branchName}`}</p>
      </div>
      <div className="w-[60%] h-[16rem]  bg-gradient-to-r from-[#A535FF] to-[#C83BBA] z-20 [clip-path:polygon(0_0,100%_0%,100%_29%,26%_29%)] absolute top-0 right-0">
      </div>
      <div className=" z-40 bg-yellow-500 text-black absolute top-4 right-4 p-2 rounded-lg font-bold">
        PAY SLIP
      </div>
      <div className="w-[44%] h-[10rem]  bg-[#B874FF] z-40 [clip-path:polygon(0_0,100%_0,100%_18%,9%_18%)] absolute top-20 right-0">
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
          <p><strong>Slip No:</strong> {voucherNumber || ""}</p>
          <p><strong>Issue Date:</strong> {createdAt?.slice(0,10)}</p>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Currency:</strong> {currency}</p>

        </div>
      </div>

      <table className="w-full text-[10px] mb-6 border border-gray-300">
  <thead>
    <tr className="bg-purple-300 text-left">
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
      <div>
     <div className="relative flex h-[8rem] w-full items-start">
  <div className="absolute left-0 top-0 w-[50%] h-[11rem] bg-gradient-to-r from-[#A535FF] to-[#C83BBA] z-20 [clip-path:polygon(0_0,87%_0,100%_20%,0_20%)]">
  </div>
  <div className="absolute right-0 top-[.2rem] w-[70%] h-[10rem] pr-[20%] bg-[#B874FF] z-40 [clip-path:polygon(14%_0,100%_0,100%_20%,0_20%)]">
  </div>
</div>

     </div>
    </div>
  );
});

export default PayrollTemplate;