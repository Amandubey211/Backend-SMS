// src/Utils/FinanceTemplate/PenaltyAdjustmentTemplate.js

import React from "react";
import StudentDiwanLogo from "../../Assets/RBAC/StudentDiwan.svg";
import IconLogo from "../../Assets/RBAC/Icon.svg";

const PenaltyAdjustmentTemplate = ({ data }) => {
  if (!data) return null;

  // Destructure necessary fields from the response data
  const {
    returnInvoiceNumber,
    invoiceId,
    tax,
    discount,
    discountType,
    adjustmentPenalty,
    penaltyType,
    adjustmentTotal,
    adjustmentAmount,
    items = [],
    reason,
    paymentType,
    paymentStatus,
    adjustedBy,
    adjustedAt,
    academicYear,
  } = data;

  // Extract receiver details
  const receiver = invoiceId?.receiver || {};

  // Format the date
  const formattedDate = adjustedAt
    ? new Date(adjustedAt).toLocaleDateString()
    : "N/A";

  // Calculate subtotal from line items
  const subtotal = items.reduce((acc, item) => acc + (item.amount || 0), 0);

  // Calculate tax amount
  const taxAmount = (subtotal * (tax || 0)) / 100;

  // Calculate penalty amount based on penalty type
  const penaltyAmount =
    penaltyType === "percentage"
      ? (subtotal * (adjustmentPenalty || 0)) / 100
      : adjustmentPenalty || 0;

  // Calculate discount amount based on discount type
  const discountAmount =
    discountType === "percentage"
      ? (subtotal * (discount || 0)) / 100
      : discount || 0;

  // Calculate final amount after all adjustments
  const finalAmount = (subtotal + taxAmount + penaltyAmount - discountAmount).toFixed(2);

  // Calculate net paid amount
  const netPaidAmount = (adjustmentTotal - (adjustmentAmount || 0)).toFixed(2);

  const schoolName = "Student Diwan School"; // Replace with dynamic school name if available

  return (
    <div className="p-6 bg-gray-50 rounded-md shadow-lg max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-full bg-pink-100 px-4 py-2 flex justify-between items-center rounded-t-lg">
          <div>
            <h1 className="font-bold text-lg">{schoolName}</h1>
            <p className="text-sm text-gray-500">
              11th Street, Main Road, Pincode: 674258, Maharashtra, India
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <img src={IconLogo} alt="Icon Logo" className="w-8 h-8" />
            <img
              src={StudentDiwanLogo}
              alt="Student Diwan"
              className="w-20 h-20"
            />
          </div>
        </div>
        <div
          className="w-full text-center text-white font-bold py-2"
          style={{ backgroundColor: "#C83B62", fontSize: "18px" }}
        >
          RETURN INVOICE
        </div>
      </div>

      {/* Invoice Details */}
      <div className="text-sm text-gray-800 mb-4 flex justify-between">
        <div>
          <p>
            <strong>Bill To:</strong>
          </p>
          <p>Name: {receiver?.name || "N/A"}</p>
          <p>Email: {receiver?.email || "N/A"}</p>
          <p>Address: {receiver?.address || "N/A"}</p>
          <p>Phone no: {receiver?.contact || "N/A"}</p>
        </div>
        <div>
          <p>
            <strong>Penalty Adjustment No:</strong>{" "}
            {returnInvoiceNumber || "RTA0001-202412-0001"}
          </p>
          <p>
            <strong>Ref Invoice No:</strong>{" "}
            {invoiceId?.invoiceNumber || "INV0001-202412-0001"}
          </p>
          <p>
            <strong>Date:</strong> {formattedDate}
          </p>
          {invoiceId?.govtRefNumber && (
            <p>
              <strong>Govt Ref (if any):</strong>{" "}
              {invoiceId.govtRefNumber || "GINV0001-202412-0001"}
            </p>
          )}
        </div>
      </div>

      {/* Additional Details */}
      <div className="mb-4">
        <p>
          <strong>Payment Method:</strong> {paymentType || "N/A"}
        </p>
        <p>
          <strong>Payment Status:</strong> {paymentStatus || "N/A"}
        </p>
        <p>
          <strong>Academic Year:</strong> {academicYear?.year || "N/A"}
        </p>
        <p>
          <strong>Adjusted By:</strong> {adjustedBy?.adminName || "N/A"}
        </p>
      </div>

      {/* Items Table */}
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
          {items.length > 0 ? (
            items.map((item, index) => (
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
                      .replace(/_/g, ' ') // Replace underscores with spaces
                      .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
                    : "N/A"}
                </td>

                <td className="p-2 border border-gray-300 text-center">
                  {item.quantity || 1}
                </td>
                <td className="p-2 border border-gray-300 text-right">
                  {(item.amount / item.quantity).toFixed(2)} QAR
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
              {subtotal.toLocaleString()} QAR
            </td>
          </tr>
          {/* Tax Row */}
          <tr>
            <td className="p-2 border border-gray-300" colSpan="4">
              Tax ({tax || 0}%)
            </td>
            <td className="p-2 border border-gray-300 text-right">
              {taxAmount.toFixed(2)} QAR
            </td>
          </tr>
          {/* Penalty Row */}
          <tr>
            <td className="p-2 border border-gray-300" colSpan="4">
              Penalty ({penaltyType === "percentage" ? `${adjustmentPenalty}%` : `${adjustmentPenalty} QAR`})
            </td>
            <td className="p-2 border border-gray-300 text-right">
              {penaltyAmount.toFixed(2)} QAR
            </td>
          </tr>
          {/* Discount Row */}
          <tr>
            <td className="p-2 border border-gray-300" colSpan="4">
              Discount ({discountType === "percentage" ? `${discount}%` : `${discount} QAR`})
            </td>
            <td className="p-2 border border-gray-300 text-right">
              {discountType === "percentage"
                ? `${discountAmount.toFixed(2)}%`
                : `${discountAmount.toFixed(2)} QAR`}
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
        {/* Remarks on the left */}
        <div className="text-sm text-gray-700">
          <p>
            <strong>Reason for Adjustment:</strong>
          </p>
          <p>{reason || "N/A"}</p>
          <p>
            <strong>Remarks:</strong>
          </p>
          <ul className="list-disc px-5 w-full break-words">
            {[
              "Thank you for your attention to this adjustment.",
              "Please retain this document for your records.",
              "Contact support for any queries regarding this adjustment.",
            ].map((defaultRemark, index) => (
              <li key={index}>{defaultRemark}</li>
            ))}
            {reason && <li>{reason}</li>}
          </ul>
        </div>

        {/* Summary Table aligned to the right */}
        {/* <table className="text-sm border border-gray-300 rounded-md w-1/2">
          <tbody>
            <tr className="bg-white">
              <td className="p-2 border border-gray-300" colSpan="4">
                Total Adjustment Amount
              </td>
              <td className="p-2 border border-gray-300 text-right">
                {adjustmentTotal.toLocaleString()} QAR
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2 border border-gray-300" colSpan="4">
                Return Amount
              </td>
              <td className="p-2 border border-gray-300 text-right">
                {adjustmentAmount ? `${adjustmentAmount.toLocaleString()} QAR` : "0 QAR"}
              </td>
            </tr>
            <tr className="font-bold text-gray-900 bg-gray-50">
              <td className="p-2 border border-gray-300" colSpan="4">
                Net Paid Amount
              </td>
              <td className="p-2 border border-gray-300 text-right text-pink-600">
                {netPaidAmount} QAR
              </td>
            </tr>
          </tbody>
        </table> */}
      </div>
    </div>
  );
};

export default PenaltyAdjustmentTemplate;
