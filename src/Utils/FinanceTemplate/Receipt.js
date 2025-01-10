import React from "react";
import StudentDiwanLogo from "../../Assets/RBAC/StudentDiwan.svg";
import IconLogo from "../../Assets/RBAC/Icon.svg";

const ReceiptTemplate = ({ data }) => {
  if (!data) return null;

  const {
    receiptNumber,
    schoolName,
    date,
    receiver,
    reciever,
    tax,
    discount,
    discountType,
    penalty,
    lineItems = [],
    remark,
    govtRefNumber,
    paymentMethod,
    paymentStatus,
    totalPaidAmount,
  } = data;

  const finalReceiver = reciever?.name ? reciever : receiver;
  const formattedDate = date ? new Date(date).toLocaleDateString() : "N/A";

  // Calculate subtotal
  const subtotal = lineItems.reduce((acc, item) => acc + (item.total || 0), 0);

  // Calculate tax as a percentage of subtotal
  const taxAmount = (subtotal * (tax || 0)) / 100;

  // Calculate discount based on type
  const discountAmount =
    discountType === "percentage"
      ? (subtotal * (discount || 0)) / 100
      : discount || 0;

  // Calculate final total after adjustments
  const finalAmount = (
    subtotal + taxAmount + (penalty || 0) - discountAmount
  ).toFixed(2);

  return (
    <div className="p-6 bg-gray-50 rounded-md shadow-lg max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-full bg-pink-100 px-4 py-2 flex justify-between items-center rounded-t-lg">
          <div>
            <h1 className="font-bold text-lg">{schoolName || "School Name"}</h1>
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
          <p>Name: {finalReceiver?.name || "N/A"}</p>
          <p>Email: {finalReceiver?.email || "N/A"}</p>
          <p>Address: {finalReceiver?.address || "N/A"}</p>
          <p>Phone no: {finalReceiver?.phone || "N/A"}</p>
        </div>
        <div>
          <p>
            <strong>Return Invoice No:</strong>{" "}
            {receiptNumber || "RNT0001-202412-0001"}
          </p>
          <p>
            <strong>Ref Invoice No:</strong> {"INV0001-202412-0001"}
          </p>
          <p>
            <strong>Date:</strong> {formattedDate}
          </p>
          {govtRefNumber && (
            <p>
              <strong>Govt Ref (if any):</strong> {govtRefNumber}
            </p>
          )}
        </div>
      </div>

      {/* Additional Details */}
      <div className="mb-4">
        <p>
          <strong>Payment Method:</strong> {paymentMethod || "Cash"}
        </p>
        <p>
          <strong>Payment Status:</strong> {paymentStatus || "Paid"}
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
          {lineItems.length > 0 ? (
            lineItems.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="p-2 border border-gray-300 text-center">
                  {index + 1}
                </td>
                <td className="p-2 border border-gray-300">
                  {item.revenueType || "N/A"}
                </td>
                <td className="p-2 border border-gray-300 text-center">
                  {item.quantity || 1}
                </td>
                <td className="p-2 border border-gray-300 text-right">
                  {(item.total / (item.quantity || 1)).toFixed(2)} QAR
                </td>
                <td className="p-2 border border-gray-300 text-right">
                  {item.total.toLocaleString()} QAR
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
              Tax ({tax || 0}%)
            </td>
            <td className="p-2 border border-gray-300 text-right">
              {taxAmount.toFixed(2)} %
            </td>
          </tr>
          {/* Penalty Row */}
          <tr>
            <td className="p-2 border border-gray-300" colSpan="4">
              Penalty
            </td>
            <td className="p-2 border border-gray-300 text-right">
              {(penalty || 0).toFixed(2)} QAR
            </td>
          </tr>
          {/* Discount Row */}
          <tr>
            <td className="p-2 border border-gray-300" colSpan="4">
              Discount (
              {discountType === "percentage" ? `${discount}%` : `${discount} QAR`}
              )
            </td>
            <td className="p-2 border border-gray-300 text-right">
              {discountType === "percentage"
                ? `${discount}%`
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


        {/* Summary Table */}
        {/* <table className="text-sm border border-gray-300 rounded-md w-1/2">
          <tbody>
            <tr className="bg-white">
              <td className="p-2 border border-gray-300">Total Invoice Amount</td>
              <td className="p-2 border border-gray-300 text-right">
                {subtotal.toFixed(2)} QAR
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2 border border-gray-300">Return Amount</td>
              <td className="p-2 border border-gray-300 text-right">
                {finalAmount} QAR
              </td>
            </tr>
            <tr className="font-bold text-gray-900 bg-gray-50">
              <td className="p-2 border border-gray-300">Net Paid Amount</td>
              <td className="p-2 border border-gray-300 text-right text-pink-600">
                {totalPaidAmount.toFixed(2)} QAR
              </td>
            </tr>
          </tbody>
        </table> */}
      </div>
    </div>
  );
};

export default ReceiptTemplate;
