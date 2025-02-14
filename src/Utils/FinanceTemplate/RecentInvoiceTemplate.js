import React, { forwardRef } from "react";
import StudentDiwanLogo from "../../Assets/RBAC/StudentDiwan.svg";
import IconLogo from "../../Assets/RBAC/Icon.svg";
import Cookies from "js-cookie";
const RecentInvoiceTemplate = forwardRef((props, ref) => {
  const { data } = props;
   const logo = Cookies.get('logo')
  if (!data) return null;

  // Destructure necessary fields from the response data
  const {
    invoiceNumber,
    schoolId,
    tax = 0,
    discount = 0,
    discountType,
    lineItems = [],
    dueDate,
    paymentStatus,
    paymentType,
    penalty = 0,
    reason,
    isCancel,
    receiver = {},
    issueDate,
    remark,
  } = data;

  // Format dates
  const formattedIssueDate = issueDate
    ? new Date(issueDate).toLocaleDateString()
    : "N/A";
  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString()
    : "N/A";

  // Calculate subtotal from line items
  const subtotal = lineItems.reduce((acc, item) => acc + (item.amount || 0), 0);

// Calculate tax as a percentage of the subtotal
const taxAmount = (subtotal * tax) / 100;

// Calculate total before discount
const totalBeforeDiscount = subtotal + taxAmount + penalty;

// FIX: Apply discount on subtotal, not totalBeforeDiscount
const discountAmount = discountType === "percentage"
  ? (subtotal * discount) / 100  // Corrected line
  : discount;

// Calculate final amount
const finalAmount = (totalBeforeDiscount - discountAmount).toFixed(2);

console.log("Final Amount:", finalAmount); // Expected Output: 119.00 QAR


  const {
    address = "",
    branchName = "",
    city = "",
    nameOfSchool = "N/A",
  } = schoolId || {};

  return (
    <div
      className="p-6 bg-gray-50 rounded-md shadow-lg max-w-3xl mx-auto"
      ref={ref}
    >
      {/* Show "Cancelled" label if isCancel is true */}

      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-full bg-pink-100 px-4 flex-row  py-2 flex justify-between items-center rounded-t-lg">
          <div>
            <h1 className="font-bold text-lg">{nameOfSchool}</h1>
            <p className="text-sm text-gray-500">{`${address}, ${branchName}, ${city}`}</p>
          </div>
          {logo && <div>
         <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          </div>}
        </div>
        <div
          className="w-full text-center text-white font-bold py-2"
          style={{ backgroundColor: "#C83B62", fontSize: "18px" }}
        >
          INVOICE {isCancel && "CANCELLED"}
        </div>
      </div>

      {/* Invoice Details */}
      <div className="text-sm text-gray-800 mb-4 flex justify-between">
        <div>
          <p>
            <strong>Bill To:</strong>
          </p>
          <p>Name: {receiver.name || "N/A"}</p>
          <p>Email: {receiver.email || "N/A"}</p>
          <p>Address: {receiver.address || "N/A"}</p>
          <p>Phone no: {receiver.contact || "N/A"}</p>
        </div>
        <div>
          <p>
            <strong>Invoice No:</strong>{" "}
            {invoiceNumber || "INV0001-202412-0001"}
          </p>
          <p>
            <strong>Issue Date:</strong> {formattedIssueDate}
          </p>
          <p>
            <strong>Due Date:</strong> {formattedDueDate}
          </p>
        </div>
      </div>

      {/* Line Items Table */}
      <table className="w-full text-sm mb-6 border border-gray-300">
        <thead>
          <tr className="bg-pink-200 text-left">
            <th className="p-2 border border-gray-300">S.No</th>
            <th className="p-2 border border-gray-300">Item Description</th>
            <th className="p-2 border border-gray-300">Quantity</th>
            <th className="p-2 border border-gray-300">Rate (QAR)</th>
            <th className="p-2 border border-gray-300">Amount (QAR)</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.length > 0 ? (
            lineItems.map((item, index) => (
              <tr
                key={item._id || index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="p-2 border border-gray-300 text-center">
                  {index + 1}
                </td>
                <td className="p-2 border border-gray-300">
                  {item.revenueType
                    ? item.revenueType
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())
                    : "N/A"}
                </td>
                <td className="p-2 border border-gray-300 text-center">
                  {item.quantity || 1}
                </td>
                <td className="p-2 border border-gray-300 text-right">
                  {(item.amount / (item.quantity || 1)).toFixed(2)} QAR
                </td>
                <td className="p-2 border border-gray-300 text-right">
                  {item.amount.toLocaleString()} QAR
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="p-2 border border-gray-300 text-center"
                colSpan="5"
              >
                No items found.
              </td>
            </tr>
          )}
          {/* Subtotal Row */}
          <tr className="font-bold bg-gray-50">
            <td className="p-2 border border-gray-300" colSpan="4">
              Subtotal
            </td>
            <td className="p-2 border border-gray-300 text-right">
              {subtotal.toFixed(2)} QAR
            </td>
          </tr>
          {/* Tax Row */}
          <tr>
            <td className="p-2 border border-gray-300" colSpan="4">
              Tax
            </td>
            <td className="p-2 border border-gray-300 text-right">
              {tax.toFixed(2)}%
            </td>
          </tr>
          {/* Penalty Row */}
          <tr>
            <td className="p-2 border border-gray-300" colSpan="4">
              Penalty
            </td>
            <td className="p-2 border border-gray-300 text-right">
              {penalty.toFixed(2)} QAR
            </td>
          </tr>
          {/* Discount Row */}
          <tr>
            <td className="p-2 border border-gray-300" colSpan="4">
              Discount
            </td>
            <td className="p-2 border border-gray-300 text-right">
              {discount.toFixed(2)}{" "}
              {discountType === "percentage" ? "%" : "QAR"}
            </td>
          </tr>
          {/* Final Total Row */}
          <tr className="font-bold text-pink-600">
            <td className="p-2 border border-gray-300" colSpan="4">
              Final Amount
            </td>
            <td className="p-2 border border-gray-300 text-right">
              {finalAmount} QAR
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
              `${isCancel && "This Invoice is cancelled"}`,
            ].map((defaultRemark, index) => (
              <li key={index}>{defaultRemark}</li>
            ))}
            {remark && <li>{remark}</li>}
          </ul>
        </div>
      </div>
    </div>
  );
});

export default RecentInvoiceTemplate;
