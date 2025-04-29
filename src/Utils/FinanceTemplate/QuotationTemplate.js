import React, { forwardRef } from "react";
import StudentDiwanLogo from "../../Assets/RBAC/StudentDiwan.svg";
import IconLogo from "../../Assets/RBAC/Icon.svg";
import Cookies from "js-cookie";
// Import the common calculation helper function
import { calculateFinalAmount } from "../../Utils/helperFunctions";
import { useSelector } from "react-redux";

const QuotationTemplate = forwardRef((props, ref) => {

  const { data } = props;
  const schoolCurrency =props.data?.schoolCurrency
  if (!data) return null;

  // Destructure necessary fields from the response data
  const {
    quotationNumber,
    schoolId,
    tax,
    discount,
    discountType,
    final_amount,
    total_amount,
    lineItems = [],
    dueDate,
    purpose,
    status,
    govtRefNumber,
    remark,
    academicYear,
    receiver = {},
    date,
    isCancel,
  } = data;

  // Format dates
  const formattedDate = date ? new Date(date).toLocaleDateString() : "N/A";
  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString()
    : "N/A";

  // Calculate subtotal from line items
  const subtotal = lineItems.reduce((acc, item) => acc + (item.amount || 0), 0);

  // Calculate tax amount
  const taxAmount = (subtotal * (tax || 0)) / 100;

  // Calculate total before discount
  const totalBeforeDiscount = subtotal + taxAmount;

  // Calculate discount amount based on discount type
  const discountAmount =
    discountType === "percentage"
      ? (totalBeforeDiscount * (discount || 0)) / 100
      : discount || 0;

  // Calculate displayed discount percentage
  const displayedDiscountPercentage = ((discountAmount / totalBeforeDiscount) * 100).toFixed(2);

  const { address, branchName, city, code, nameOfSchool } = schoolId;
  const logo = Cookies.get("logo");

  // Compute final amount using the helper function
  const finalAmount = calculateFinalAmount({
    lineItems,
    tax,
    discount,
    discountType,
    penalty: 0, // No penalty for quotations
    final_amount,
  });


  return (
    <div className="p-6 bg-gray-50 rounded-md shadow-lg max-w-3xl mx-auto" ref={ref}>
      {/* Show "Cancelled" label if isCancel is true */}

      {/* Header */}
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
        QUOTATION
      </div>
      <div className="w-[44%] h-[10rem]  bg-[#B874FF] z-40 [clip-path:polygon(0_0,100%_0,100%_18%,9%_18%)] absolute top-20 right-0">
      </div>
      </div>

      {/* Quotation Details */}
      <div className="text-sm text-gray-800 mb-4 flex justify-between">
        <div>
          <p>
            <strong>Bill To:</strong>
          </p>
          <p>Name: {receiver?.name || "N/A"}</p>
          <p>Email: {receiver?.email || "N/A"}</p>
          <p>Address: {receiver?.address || "N/A"}</p>
          <p>Phone no: {receiver?.phone || "N/A"}</p>
        </div>
        <div>
          <p>
            <strong>Quotation No:</strong> {quotationNumber || "QN0001-202412-0001"}
          </p>
          <p>
            <strong>Date:</strong> {formattedDate}
          </p>
          <p>
            <strong>Due Date:</strong> {formattedDueDate}
          </p>
          {govtRefNumber && (
            <p>
              <strong>Govt Ref (if any):</strong> {govtRefNumber}
            </p>
          )}
        </div>
      </div>

      {/* Purpose and Status */}
      <div className="mb-4">
        {/* <p>
          <strong>Purpose:</strong> {purpose || "N/A"}
        </p> */}
        {/* <p>
          <strong>Status:</strong> {status || "N/A"}
        </p>
        <p>
          <strong>Academic Year:</strong> {academicYear?.year || "N/A"}
        </p> */}
      </div>

      {/* Line Items Table */}
      <table className="w-full text-sm mb-6 border border-gray-300">
        <thead>
          <tr className="bg-purple-300 text-left">
            <th className="p-2 border border-gray-300">S.No</th>
            <th className="p-2 border border-gray-300">Category</th>
            <th className="p-2 border border-gray-300">Item Description</th>
            <th className="p-2 border border-gray-300">Quantity</th>
            <th className="p-2 border border-gray-300">Rate </th>
            <th className="p-2 border border-gray-300">Amount </th>
          </tr>
        </thead>
        <tbody>
          {lineItems.length > 0 ? (
            lineItems.map((item, index) => (
              <tr key={item._id || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-2 border border-gray-300 text-center">{index + 1}</td>
                <td className="p-2 border border-gray-300">{item.category || "N/A"}</td>
                <td className="p-2 border border-gray-300">{item.description || "N/A"}</td>
                <td className="p-2 border border-gray-300 text-center">{item.quantity || 1}</td>
                <td className="p-2 border border-gray-300 text-right">
                  {item.amount && item.quantity
                    ? (item.amount / item.quantity).toFixed(2)
                    : item.amount
                      ? item.amount.toFixed(2)
                      : "0.00"}{" "}
                  {schoolCurrency}
                </td>
                <td className="p-2 border border-gray-300 text-right">
                  {item.amount ? parseFloat(item.amount).toLocaleString() : 0} {schoolCurrency}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-2 border border-gray-300 text-center" colSpan="5">
                No items found.
              </td>
            </tr>
          )}
          {/* Subtotal Row */}
          <tr className="font-bold bg-gray-50">
            <td className="p-2 border border-gray-300" colSpan="5">
              Subtotal
            </td>
            <td className="p-2 border border-gray-300 text-right">
              {subtotal.toLocaleString()} {schoolCurrency}
            </td>
          </tr>
          {/* Tax Row */}
          <tr>
            <td className="p-2 border border-gray-300" colSpan="5">
              Tax
            </td>
            <td className="p-2 border border-gray-300 text-right">
              {tax > 0 ? `${tax.toFixed(2)}%` : 0}
            </td>
          </tr>
          {/* Discount Row */}
          <tr>
            <td className="p-2 border border-gray-300" colSpan="5">
              Discount
            </td>
            <td className="p-2 border border-gray-300 text-right">
              {
                discountAmount > 0 ? <>{discountType === "percentage" ? `${displayedDiscountPercentage}%` : `${discountAmount.toFixed(2)} ${schoolCurrency}`}</> : 0
              }

            </td>
          </tr>
          {/* Final Total Row */}
          <tr className="font-bold text-pink-600">
            <td className="p-2 border border-gray-300" colSpan="5">
              Final Amount
            </td>
            <td className="p-2 border border-gray-300 text-right">
              {finalAmount}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Remarks and Summary */}
      <div className="w-full flex flex-col gap-y-4">
        <div className="text-sm text-gray-700">
          <p>
            <strong>Remarks:</strong>
          </p>
          <ul className="list-disc px-5 w-full break-words">
            {[
              "Thank you for doing business with us. If you have any questions, please contact us.",
              "Ensure to retain this document for future reference.",
              "For further details, reach out to our support team.",
            ].map((defaultRemark, index) => (
              <li key={index}>{defaultRemark}</li>
            ))}
            {remark && <li>{remark}</li>}
          </ul>
        </div>
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

export default QuotationTemplate;
