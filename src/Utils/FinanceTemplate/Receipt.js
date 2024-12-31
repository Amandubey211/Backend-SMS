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
    penalty,
    totalPaidAmount,
    lineItems = [],
    remark,
    govtRefNumber,
    paymentMethod,
    paymentStatus,
    createdBy,
  } = data;

  const finalReceiver = reciever?.name ? reciever : receiver;
  const formattedDate = date ? new Date(date).toLocaleDateString() : "N/A";
  const subtotal = lineItems.reduce((acc, item) => acc + (item.total || 0), 0);
  const totalAfterAdjustments =
    subtotal + (tax || 0) + (penalty || 0) - (discount || 0);

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
          <p>Name: {finalReceiver?.name || "Akash"}</p>
          <p>Email: {finalReceiver?.email || "ak@gmail.com"}</p>
          <p>Address: {finalReceiver?.address || "India"}</p>
          <p>Phone no: {finalReceiver?.phone || "8965896589"}</p>
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
            <strong>Date:</strong> {formattedDate || "MM-DD-YYYY"}
          </p>
          {govtRefNumber && (
            <p>
              <strong>Govt Ref (if any):</strong>{" "}
              {govtRefNumber || "GINV0001-202412-0001"}
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
                  {(item.quantity
                    ? (item.total / item.quantity).toFixed(2)
                    : item.total || 0
                  ).toLocaleString()}{" "}
                  QAR
                </td>
                <td className="p-2 border border-gray-300 text-right">
                  {(item.total || 0).toLocaleString()} QAR
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
              {(tax || 0).toLocaleString()} QAR
            </td>
          </tr>
          {/* Penalty Row */}
          <tr>
            <td className="p-2 border border-gray-300" colSpan="4">
              Penalty
            </td>
            <td className="p-2 border border-gray-300 text-right">
              {(penalty || 0).toLocaleString()} QAR
            </td>
          </tr>
          {/* Discount Row */}
          <tr>
            <td className="p-2 border border-gray-300" colSpan="4">
              Discount
            </td>
            <td className="p-2 border border-gray-300 text-right">
              -{(discount || 0).toLocaleString()} QAR
            </td>
          </tr>
          {/* Final Total Row */}
          <tr className="font-bold text-pink-600">
            <td className="p-2 border border-gray-300" colSpan="4">
              Final Amount
            </td>
            <td className="p-2 border border-gray-300 text-right">
              {"200" || totalAfterAdjustments.toLocaleString()} QAR
            </td>
          </tr>
        </tbody>
      </table>

      {/* Added ml-auto for right alignment */}
      <div className="w-full flex justify-between items-start gap-x-2">
        {/* Remark on the left */}
        <div className="text-sm text-gray-700 w-2/3">
          <p>
            <strong>Remarks:</strong>
          </p>
          <ul className="list-disc px-5">
            {[
              "Thank you for doing business with us. If you have any questions, please contact us.",
              "Ensure to retain this document for future reference.",
              "For further details, reach out to our support team.",
            ].map((defaultRemark, index) => (
              <li key={index}>{defaultRemark}</li>
            ))}
            {remark && <li>{remark || "rrr"}</li>}
          </ul>
        </div>

        {/* Table aligned to the right */}
        <table className="text-sm  border border-gray-300 rounded-md w-1/2">
          <tbody>
            <tr className="bg-white">
              <td className="p-2 border border-gray-300" colSpan="4">
                Total Invoice Amount
              </td>
              <td className="p-2 border border-gray-300 text-right">
                1,000 QAR
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2 border border-gray-300" colSpan="4">
                Return Amount
              </td>
              <td className="p-2 border border-gray-300 text-right">200 QAR</td>
            </tr>
            <tr className="font-bold text-gray-900 bg-gray-50">
              <td className="p-2 border border-gray-300" colSpan="4">
                Net Paid Amount
              </td>
              <td className="p-2 border border-gray-300 text-right text-pink-600">
                800 QAR
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Remark */}
    </div>
  );
};

export default ReceiptTemplate;
