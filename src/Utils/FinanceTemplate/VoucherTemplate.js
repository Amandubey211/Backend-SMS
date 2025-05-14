import React, { forwardRef } from "react";
import Cookies from "js-cookie";
import { getSC } from "../getCurrency";
import { FiPhone, FiMail } from 'react-icons/fi';
import { FaGlobe } from 'react-icons/fa';
import { GoLocation } from 'react-icons/go';
const VoucherTemplate = forwardRef((props, ref) => {
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
    entityDetails,
    chequeDate,
    chequeNumber,
    paymentType,
    paymentDate,
    status,
    history,
    userName,
    onlineTransactionId
  } = data;

  let totalAmount = 0;
  let totalPaid = 0;

  lineItems.forEach((item) => {
    totalAmount += item.amount || 0;
    totalPaid += item.paidAmount || 0;
  });


  const {
    address = "",
    branchName = "",
    city = "",
    nameOfSchool = "N/A",
    currency = "",
    logo = "",
    bankDetails, contactDetails
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
        VOUCHER
      </div>

      <div className="text-sm text-gray-800 mb-4 flex justify-between">
        <div>
          <p><strong>Bill To:</strong></p>
          <p><strong>Name:</strong> {entityDetails?.entityName} </p>
          <p><strong>Email:</strong> {entityDetails?.email}</p>
          <p><strong>Contact:</strong> {entityDetails?.contactNumber}</p>
        </div>
        <div>
          <p><strong>Voucher No:</strong> {voucherNumber || ""}</p>
          <p><strong>Issue Date:</strong> {createdAt?.slice(0, 10)}</p>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Currency:</strong> {currency}</p>

        </div>
      </div>

      <table className="w-full text-[10px]  border border-gray-300">
        <thead>
          <tr className="bg-[#7F31AB] text-left text-white">
            <th className="p-2 border-4 border-white">Item</th>
            <th className="p-2 border-4 border-white">Item Detail</th>
            <th className="p-2 border-4 border-white">Rate</th>
            <th className="p-2 border-4 border-white">Qty</th>
            <th className="p-2 border-4 border-white">Amount</th>
            <th className="p-2 border-4 border-white">Paid Amount</th>
            <th className="p-2 border-4 border-white">Remaining Amount</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, index) => (
            <tr key={item._id || index} className={index % 2 === 0 ? "bg-[#E4D9FA]" : "bg-[#E4D9FA]"}>

              <td className="p-2 border-4 border-white">{item?.name || "N/A"}</td>
              <td className="p-2 border-4 border-white">{item?.subCategory} <br /> {item.frequency != "Permanent Purchase" && `
               ${item.frequency} from ${item?.startDate?.slice(0, 10)} to ${item?.endDate?.slice(0, 10)}`}</td>
              <td className="p-2 border-4 border-white text-start">{item.rate?.toFixed(2)}</td>
              <td className="p-2 border-4 border-white text-start">{item.quantity || 1}</td>
              <td className="p-2 border-4 border-white text-start">{item.amount?.toFixed(2)}</td>
              <td className="p-2 border-4 border-white text-start">{item.paidAmount?.toFixed(2)}</td>
              <td className="p-2 border-4 border-white text-start">{item.remainingAmount?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="">
        <table className="w-full table-auto bg-[#E4D9FA]">
          <tbody>
            <tr className="border-4 border-white text-start" >
              <td className="p-2  text-center" colSpan={16}>Total Amount </td>
              <td className="p-2 border-4 border-white">{totalAmount?.toFixed(2)} {currency}</td>
            </tr>
            <tr className="border-4 border-white text-start">
              <td className="p-2  text-center" colSpan={16}>Total Paid</td>
              <td className="p-2 border-4 border-white">{totalPaid?.toFixed(2)} {currency}</td>
            </tr>
            <tr className="border-4 border-white text-start">
              <td className="p-2  text-center" colSpan={16}>Total Remaining</td>
              <td className="p-2 border-4 border-white">{(totalAmount - totalPaid).toFixed(2)} {currency}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-start  mt-2">
        <p>Authorization & Internal Tracking</p>
         <p><strong>Status:</strong> {status}</p>
        {!["pending", "hold"].includes(status) & history?.length < 1 ? <div className="">
          <p><strong>Approved By :</strong> {userName}</p>
          <p><strong>Transaction ID :</strong> {onlineTransactionId}</p>
          <p><strong>Payment Date :</strong> {paymentDate?.slice(0, 10)}</p>
          <p><strong>Payment Method :</strong> {paymentType}</p>
          <p><strong>Amount :</strong> {totalPaid?.toFixed(2)} {currency}</p>
          {chequeNumber && <p><strong>Cheque Number:</strong> {chequeNumber}</p>}
          {chequeDate && <p><strong>Cheque Date:</strong> {chequeDate?.slice(0, 10)}</p>}
        </div>: history?.filter((i)=>i.oldData.totalpaid !=0)?.map((i) => (
            <div key={i._id} className="border-t py-2">
          <p><strong>Approved By :</strong> {i?.oldData?.userName}</p>
          <p><strong>Transaction ID :</strong> {i?.oldData?.onlineTransactionId || "N/A"}</p>
              <p><strong>Payment Date :</strong> {i?.oldData?.paymentDate?.slice(0, 10)}</p>
              <p><strong>Payment Method :</strong> {i?.oldData?.paymentType}</p>
              <p><strong>Amount :</strong> {i?.oldData?.totalpaid} {currency}</p>
              {i?.oldData?.chequeNumber && (
                <p><strong>Cheque Number:</strong> {i?.oldData?.chequeNumber}</p>
              )}
              {i?.oldData?.chequeDate && (
                <p><strong>Cheque Date:</strong> {i?.oldData?.chequeDate?.slice(0, 10)}</p>
              )}
            </div>
        ))}
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

export default VoucherTemplate;