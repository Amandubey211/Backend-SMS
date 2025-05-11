import React, { forwardRef } from "react";
import Cookies from "js-cookie";
import { getSC } from "../getCurrency";
import { FiPhone, FiMail } from 'react-icons/fi';
import { FaGlobe } from 'react-icons/fa';
import { GoLocation } from 'react-icons/go';
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
    receiptIds,
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
    totalTax += ((item.rate * item.quantity) / 100) * item.tax || 0;
    totalPenalty += item.penalty_amount || 0;
    totalDiscount +=
      item.discountType === "percentage"
        ? (item.final_amount * item.discount) / 100
        : item.discount;
  });

  const {
    address = "",
    branchName = "",
    city = "",
    nameOfSchool = "N/A",
    currency = "",
    logo = "",
  } = schoolId || {};

  return (
    <div className="p-6 bg-gray-50 rounded-md shadow-lg  max-w-3xl mx-auto " ref={ref}>

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
      <div className="flex w-full items-center justify-center font-bold text-3xl mt-8">
        INVOICE
      </div>
      <div className="text-sm text-gray-800 mb-4 flex justify-between">
        {studentDetails && <div>
          <p><strong>Name:</strong> {studentDetails?.firstName} {studentDetails?.lastName}</p>
          <p><strong>Class:</strong> {studentDetails?.className}</p>
          <p><strong>Email:</strong> {studentDetails?.email}</p>
          <p><strong>Contact:</strong> {studentDetails?.contactNumber}</p>
        </div>}
        {entityDetails && <div>
          <p><strong>Name:</strong> {entityDetails?.entityName} </p>
          <p><strong>Email:</strong> {entityDetails?.email}</p>
          <p><strong>Contact:</strong> {entityDetails?.contactNumber}</p>
          <p><strong>Type:</strong> {entityDetails?.entityType}</p>
        </div>}
        <div>
          <p><strong>Invoice No:</strong> {InvoiceNumber || ""}</p>
          <p><strong>Invoice Date:</strong> {generateDate?.slice(0, 10)}</p>
          <p><strong>Status:</strong> {paymentStatus}</p>
          <p><strong>Currency:</strong> {currency}</p>

        </div>
      </div>

      <table className="w-full text-[10px] mb-1">
        <thead>
          <tr className="bg-[#7F31AB] text-left text-white">
            <th className="p-2  border-4 border-white">Item</th>
            <th className="p-2 border-4 border-white">Item Detail</th>
            <th className="p-2 border-4 border-white">Rate</th>
            <th className="p-2 border-4 border-white">Qty</th>
            <th className="p-2 border-4 border-white">Tax (%)</th>
            <th className="p-2 border-4 border-white">Penalty</th>
            <th className="p-2 border-4 border-white">Discount</th>
            <th className="p-2 border-4 border-white">Total</th>
            <th className="p-2 border-4 border-white">Paid</th>
            <th className="p-2 border-4 border-white">Balance</th>
            <th className="p-2 border-4 border-white">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, index) => (
            <tr key={item._id || index} className={index % 2 === 0 ? "bg-[#E4D9FA]" : "bg-[#E4D9FA]"}>
              <td className="p-2 border-4 border-white">{item.name || "N/A"}</td>
              <td className="p-2 border-4 border-white">{item.itemDetails} <br /> {item.frequency != "Permanent Purchase" && `
               ${item.frequency} from ${item?.startDate?.slice(0, 10)} to ${item?.endDate?.slice(0, 10)}`}</td>
              <td className="p-2 border-4 border-white text-start">{item.rate?.toFixed(2)}</td>
              <td className="p-2 border-4 border-white text-start">{item.quantity || 1}</td>
              <td className="p-2 border-4 border-white text-start">{item.tax?.toFixed(2)}</td>
              <td className="p-2 border-4 border-white text-start">{item.penalty_amount?.toFixed(2)}</td>
              <td className="p-2 border-4 border-white text-start">{item.discount?.toFixed(2)}{item.discountType == "percentage" && "%"}</td>
              <td className="p-2 border-4 border-white text-start">{item.final_amount?.toFixed(2)}</td>
              <td className="p-2 border-4 border-white text-start">{item.paid_amount?.toFixed(2) || 0}</td>
              <td className="p-2 border-4 border-white text-start">{item.remaining_amount?.toFixed(2) || 0}</td>
              <td className="p-2 border-4 border-white text-start">{item?.dueDate?.slice(0, 10) || " "}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-row items-center text-xs ">

        <div className="w-[100%]">
          <table className="w-full table-auto bg-[#E4D9FA] ">
            <tbody>

              <tr className="border-4 border-white text-start" >
                <td className="p-2  text-center" colSpan={16}>Total Tax </td>
                <td className="p-2 border-4 border-white">{totalTax?.toFixed(2)} {currency}</td>
              </tr>
              <tr className="border-4 border-white text-start">
                <td className="p-2  text-center" colSpan={16}>Total Penalty</td>
                <td className="p-2 border-4 border-white">{totalPenalty?.toFixed(2)} {currency}</td>
              </tr>
              <tr className="border-4 border-white text-start">
                <td className="p-2  text-center" colSpan={16}>Total Discount</td>
                <td className="p-2 border-4 border-white">{totalDiscount?.toFixed(2)} {currency}</td>
              </tr>
              <tr className="border-4 border-white text-start">
                <td className="p-2 font-semibold text-center" colSpan={16}>Final Amount</td>
                <td className="p-2 border-4 border-white">{totalAmount?.toFixed(2)} {currency}</td>
              </tr>
              <tr className="border-4 border-white text-start">
                <td className="p-2  text-center" colSpan={16}>Amount Paid</td>
                <td className="p-2 border-4 border-white">{totalPaid?.toFixed(2)} {currency}</td>
              </tr>
              <tr className="border-4 border-white text-start">
                <td className="p-2 font-semibold text-center" colSpan={16}>Balance Due</td>
                <td className="p-2 border-4 border-white">{(totalAmount - totalPaid).toFixed(2)} {currency}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
      <div className="flex flex-col items-start p-4 w-full">
        <div className="w-full">
          {receiptIds?.length > 0 && <p className="mb-1 text-gray-600">Receipts of Paid Payments</p>}
          {receiptIds?.map((i) => (<p>Receipt Number: {i?.toUpperCase()}</p>))}
        </div>

      </div>
      <div className="text-sm text-gray-700 mt-4">
        {description && <li>{description}</li>}
        <div className="p-4 border-t border-gray-300 mt-4">
          <h2 className="text-base font-semibold mb-2">Payment Instructions</h2>
          <p><strong>Bank Name:</strong> [Bank Name]</p>
          <p><strong>Account Name:</strong> [School Account Name]</p>
          <p><strong>Account Number:</strong> [Account Number]</p>
          <p><strong>IBAN:</strong> [IBAN Number]</p>
          <p><strong>SWIFT Code:</strong> [SWIFT Code]</p>
          <p><strong>Payment Reference:</strong> [Invoice Number or Student ID]</p>

          <h2 className="text-base font-semibold mt-6 mb-2">Notes</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            <li>Please make the payment by the due date to avoid any late payment penalties.</li>
            <li>For any queries regarding this invoice, contact us at [Contact Information].</li>
            <li>Scholarships and discounts are subject to approval and may vary each term.</li>
          </ul>

          <p className="italic text-sm mt-3 text-gray-800">
            Thank you for partnering with us in your child’s education.
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
                <span>+974-7444-9111</span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <FiMail className="text-lg" />
                <span>info@studentdiwan.com</span>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4">
              {/* Website */}
              <div className="flex items-center gap-2">
                <FaGlobe className="text-lg" />
                <span>https://studentdiwan.com</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2">
                <GoLocation className="text-lg" />
                <span>Msheireb Downtown Doha - Qatar</span>
              </div>
            </div>

          </div>
        </div>


      </div>
    </div>
  );
});

export default RecentInvoiceTemplate;