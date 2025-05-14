import React, { forwardRef } from "react";
import Cookies from "js-cookie";
import { getSC } from "../getCurrency";
import { FiPhone, FiMail } from 'react-icons/fi';
import { FaGlobe } from 'react-icons/fa';
import { GoLocation } from 'react-icons/go';
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
    contactDetails
  } = schoolId || {};

  return (
    <div className="p-6 bg-gray-50 rounded-md shadow-lg max-w-3xl mx-auto" ref={ref}>
  <div className="flex w-full flex-row  gap-10 mb-2 ">

        <div className="flex flex-col gap-2 w-[70%] ">

          <div className="w-[99%] h-[3rem]  bg-[#7F31AB]  relative">
            <div class="w-10 h-40 bg-gray-50 rotate-45  absolute right-2 top-[-70%]"></div>
          </div>
          <div className="w-[90%] h-[1.5rem]  bg-[#8C1E60]">
          </div>
        </div>
        <div>
          <div className="w-full flex flex-row gap-4 justify-center items-center h-[5rem]">
            {logo && <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />}
            <h1 className="font-bold text-lg">{nameOfSchool}</h1>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center font-bold text-3xl mt-8 mb-2">
        PAY SLIP
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
      <th className="p-2 border">Bonus</th>
      <th className="p-2 border">Overtime</th>
      <th className="p-2 border">Leave Deductions</th>
      <th className="p-2 border">Other Adjustments</th>
            <th className="p-2 border">Net Salary</th>
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
        <td className="p-2 border">{item?.bonus || "-"}</td>
        <td className="p-2 border">{item?.overtime || "-"}</td>
        <td className="p-2 border">{item?.leaveDeductions || "-"}</td>
        <td className="p-2 border">{item?.otherAdjustments || "-"}</td>
        <td className="p-2 border">{item?.netSalary || "-"}</td>
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
          {chequeDate &&<p><strong>Cheque Date:</strong> {chequeDate?.slice(0,10)}</p>}
        </div>}

        </div>
        <div className="flex flex-col items-start p-4 w-[40%] border-l-2 border-gray-300">
        <p><strong>Total Amount</strong> = {totalAmount?.toFixed(2)} {currency}</p>
        </div>
      </div>

      <div className="text-sm text-gray-700 mt-4">
        {description && <li>Remarks / Notes: {description}</li>}
        <div className="p-4 border-t border-gray-300 mt-4">


          <p className="italic text-sm mt-3 text-gray-800">
            This is a system-generated voucher generated by the school system
          </p>
        </div>
      </div>
      <div>
    <div className="bg-[#89125B] text-white p-6 relative  overflow-hidden">
          <div class="w-40 h-40 bg-purple-500 rotate-45  absolute right-[-15%] top-[-60%]"></div>
          <div className="w-full flex flex-row items-center justify-around">
            
            <div className="flex flex-col items-start gap-4">
              {/* Phone */}
              <div className="flex items-center gap-2">
                <FiPhone className="text-lg" />
                <span>{contactDetails?.contactNumber}</span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <FiMail className="text-lg" />
                <span>{contactDetails?.email}</span>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4">
              {/* Website */}
              <div className="flex items-center gap-2">
                <FaGlobe className="text-lg" />
                <span>{contactDetails?.website}</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2">
                <GoLocation className="text-lg" />
                <span>{address}</span>
              </div>
            </div>

          </div>
        </div>

     </div>
    </div>
  );
});

export default PayrollTemplate;