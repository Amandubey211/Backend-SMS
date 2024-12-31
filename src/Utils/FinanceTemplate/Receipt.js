import React from "react";
import StudentDiwanLogo from "../../Assets/RBAC/StudentDiwan.svg";
import IconLogo from "../../Assets/RBAC/Icon.svg";

const Receipt = ({ receiptData }) => {
  if (!receiptData) return null;

  // Destructure the fields for convenience
  const {
    receiptNumber,
    schoolName,
    date,
    receiver,
    reciever, // some records have "reciever" key
    tax,
    discount,
    penalty,
    totalPaidAmount,
    lineItems = [],
    remark,
    govtRefNumber,
  } = receiptData;

  // We'll use whichever is defined:
  const finalReceiver = reciever?.name ? reciever : receiver;

  // Basic computed values:
  const formattedDate = date ? new Date(date).toLocaleDateString() : "N/A";
  // If you need a "due date" or anything else, you'll have to define how you want to compute it.
  // For demonstration, let's just re-use the same date for "Invoice/Receipt Date" and "Due Date".

  // We'll compute Subtotal by summing all lineItems totals:
  const subtotal = lineItems.reduce((acc, item) => acc + (item.total || 0), 0);
  // If you want a rate or quantity, you might do item.total / item.quantity (for example).

  // If your business logic says totalPaidAmount might be different from the sum, handle that carefully.
  // We'll assume totalPaidAmount is the final amount or read from lineItems + adjustments.

  // Helper to compute final total
  const totalAfterAdjustments = subtotal + (tax || 0) + (penalty || 0) - (discount || 0);

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-full bg-pink-100 px-4 flex justify-between items-center">
          <div>
            <h1 className="font-bold text-lg">{schoolName || "School Name"}</h1>
            <p className="text-sm text-gray-500">
              {/* If you have a school address, put it here. Otherwise static or blank. */}
              11th Street, Main Road, Pincode: 674258, Maharashtra, India
            </p>
          </div>
          {/* Right Section for Images */}
          <div className="flex items-center space-x-4">
            <img src={IconLogo} alt="Icon Logo" className="w-8 h-8" />
            <img src={StudentDiwanLogo} alt="Student Diwan" className="w-20 h-20" />
          </div>
        </div>
        <div
          className="w-full text-center text-white font-bold py-2"
          style={{ backgroundColor: "#C83B62", fontSize: "18px" }}
        >
          RECEIPT
        </div>
      </div>

      {/* Invoice/Receipt Information */}
      <div className="text-sm text-gray-800 mb-4 grid grid-cols-2 gap-4">
        <div>
          <p>
            <strong>Bill To:</strong>
          </p>
          <p>{finalReceiver?.name || "N/A"}</p>
          <p>{finalReceiver?.address || ""}</p>
          <p>{finalReceiver?.phone ? `Phone: ${finalReceiver?.phone}` : ""}</p>
        </div>
        <div>
          <p>
            <strong>Receipt Number:</strong> {receiptNumber}
          </p>
          <p>
            <strong>Receipt Date:</strong> {formattedDate}
          </p>
          <p>
            <strong>Due Date:</strong> {formattedDate}
          </p>
          {/* Example: Government reference if you want to show it */}
          <p>
            <strong>Govt Ref:</strong> {govtRefNumber || "N/A"}
          </p>
        </div>
      </div>

      {/* Student or Payer Information */}
      {/* If your receipt is for a student, you can show additional info here.
          If you do not have such data, you can remove this block or rename it. */}
      <div className="border border-gray-300 rounded mb-6">
        <table className="w-full text-sm">
          <tbody>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name:</th>
              <td className="p-2">{finalReceiver?.name || "N/A"}</td>
              <th className="p-2 text-left">Email:</th>
              <td className="p-2">{finalReceiver?.email || "N/A"}</td>
              <th className="p-2 text-left">Phone:</th>
              <td className="p-2">{finalReceiver?.phone || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Items Table */}
      <table className="w-full text-sm mb-6 border border-gray-300">
        <thead>
          <tr className="bg-pink-200 text-left">
            <th className="p-2">S.No</th>
            <th className="p-2">Items</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Rate</th>
            <th className="p-2">Amount (QAR)</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.length > 0 ? (
            lineItems.map((item, index) => {
              const rate =
                item.quantity && Number(item.quantity) !== 0
                  ? (item.total / Number(item.quantity)).toFixed(2)
                  : item.total; // fallback
              return (
                <tr key={index}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{item.revenueType || "N/A"}</td>
                  <td className="p-2">{item.quantity || "1"}</td>
                  <td className="p-2">{rate} QAR</td>
                  <td className="p-2">{item.total} QAR</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td className="p-2" colSpan="5">
                No items.
              </td>
            </tr>
          )}

          {/* Subtotal row */}
          <tr className="font-bold bg-gray-50">
            <td className="p-2" colSpan="4">
              Subtotal
            </td>
            <td className="p-2">{subtotal} QAR</td>
          </tr>
          {/* Tax row */}
          <tr>
            <td className="p-2" colSpan="4">
              Tax
            </td>
            <td className="p-2">{tax || 0} QAR</td>
          </tr>
          {/* Penalty row */}
          <tr>
            <td className="p-2" colSpan="4">
              Penalty
            </td>
            <td className="p-2">{penalty || 0} QAR</td>
          </tr>
          {/* Discount row */}
          <tr>
            <td className="p-2" colSpan="4">
              Discount
            </td>
            <td className="p-2">{discount || 0} QAR</td>
          </tr>
          {/* Total row */}
          <tr className="font-bold text-pink-600">
            <td className="p-2" colSpan="4">
              Total Amount
            </td>
            <td className="p-2">
              {totalAfterAdjustments} QAR
            </td>
          </tr>
        </tbody>
      </table>

      

      {/* Remark Row */}
      {remark && (
        <div className="text-sm text-gray-700 my-2">
          <p>
            <strong>Remark:</strong> {remark}
          </p>
        </div>
      )}
    </div>
  );
};

export default Receipt;
