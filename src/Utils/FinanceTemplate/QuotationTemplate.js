import React from "react";
import StudentDiwanLogo from "../../Assets/RBAC/StudentDiwan.svg";
import IconLogo from "../../Assets/RBAC/Icon.svg";

const QuotationTemplate = ({ data }) => {
  if (!data) return null;

  // Destructure necessary fields from the response data
  const {
    quotationNumber,
    schoolName,
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

  // Calculate discount amount based on discount type
  const discountAmount =
    discountType === "percentage"
      ? (subtotal * (discount || 0)) / 100
      : discount || 0;

  // Calculate final amount
  const finalAmount = (subtotal + taxAmount - discountAmount).toFixed(2);

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
          QUOTATION
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
                  {item.revenueType || "N/A"}
                </td>
                <td className="p-2 border border-gray-300 text-center">
                  {item.quantity || 1}
                </td>
                <td className="p-2 border border-gray-300 text-right">
                  {item.amount && item.quantity
                    ? (item.amount / item.quantity).toFixed(2)
                    : item.amount
                      ? item.amount.toFixed(2)
                      : "0.00"}{" "}
                  QAR
                </td>
                <td className="p-2 border border-gray-300 text-right">
                  {item.amount
                    ? parseFloat(item.amount).toLocaleString() + " QAR"
                    : "0 QAR"}
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
              Tax
            </td>
            <td className="p-2 border border-gray-300 text-right">
              {taxAmount.toFixed(2)} %
            </td>
          </tr>
          {/* Discount Row */}
          <tr>
            <td className="p-2 border border-gray-300" colSpan="4">
              Discount
            </td>
            <td className="p-2 border border-gray-300 text-right">
              {discountType === "percentage" ? `${discountAmount.toFixed(2)}%` : `${discountAmount.toFixed(2)} QAR`}
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

        {/* Summary Table aligned to the right */}
        {/* <table className="text-sm border border-gray-300 rounded-md w-1/2">
          <tbody>
            <tr className="bg-white">
              <td className="p-2 border border-gray-300" colSpan="4">
                Total Amount
              </td>
              <td className="p-2 border border-gray-300 text-right">
                {total_amount.toLocaleString()} QAR
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2 border border-gray-300" colSpan="4">
                Tax
              </td>
              <td className="p-2 border border-gray-300 text-right">
                {taxAmount.toFixed(2)} %
              </td>
            </tr>
            <tr className="bg-white">
              <td className="p-2 border border-gray-300" colSpan="4">
                Discount ({discountType === "percentage" ? `${discount}%` : `${discount} QAR`})
              </td>
              <td className="p-2 border border-gray-300 text-right">
                {discountType === "percentage" ? `${discountAmount.toFixed(2)}%` : `${discountAmount.toFixed(2)} QAR`}
              </td>
            </tr>

            <tr className="font-bold text-gray-900 bg-gray-50">
              <td className="p-2 border border-gray-300" colSpan="4">
                Final Amount
              </td>
              <td className="p-2 border border-gray-300 text-right text-pink-600">
                {finalAmount} QAR
              </td>
            </tr>
          </tbody>
        </table> */}
      </div>
    </div>
  );
};

export default QuotationTemplate;
