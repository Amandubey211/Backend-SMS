import React from "react";
import StudentDiwanLogo from "../../../../../Assets/RBAC/StudentDiwan.svg";
import IconLogo from "../../../../../Assets/RBAC/Icon.svg";

const Invoice = () => {
  return (
    <div className="bg-white shadow-lg w-[650px] p-6 rounded-lg">
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-full bg-pink-100 px-4 flex justify-between items-center">
          <div>
            <h1 className="font-bold text-lg">ABC Higher Secondary School</h1>
            <p className="text-sm text-gray-500">
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
          INVOICE
        </div>
      </div>

      {/* Invoice Information */}
      <div className="text-sm text-gray-800 mb-4 grid grid-cols-2 gap-4">
        <div>
          <p><strong>Bill To:</strong></p>
          <p>Ms. Jane Kelly</p>
          <p>1234 Wall Street</p>
          <p>Doha, Qatar</p>
        </div>
        <div>
          <p><strong>Invoice Number:</strong> 3474679890</p>
          <p><strong>Invoice Date:</strong> 12/12/2024</p>
          <p><strong>Due Date:</strong> 12/12/2024</p>
        </div>
      </div>

      {/* Student Information */}
      <div className="border border-gray-300 rounded mb-6">
        <table className="w-full text-sm">
          <tbody>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name:</th>
              <td className="p-2">Kameswaran S</td>
              <th className="p-2 text-left">Class:</th>
              <td className="p-2">10</td>
              <th className="p-2 text-left">Section:</th>
              <td className="p-2">B</td>
            </tr>
            <tr>
              <th className="p-2 text-left">Admission No:</th>
              <td className="p-2">2341</td>
              <th className="p-2 text-left">Parent Name:</th>
              <td className="p-2">Jane Kelly</td>
              <th className="p-2 text-left">Contact No:</th>
              <td className="p-2">669844279</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Invoice Table */}
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
          <tr>
            <td className="p-2">1</td>
            <td className="p-2">Tuition Fees</td>
            <td className="p-2">1</td>
            <td className="p-2">1200 QAR</td>
            <td className="p-2">1200 QAR</td>
          </tr>
          <tr>
            <td className="p-2">2</td>
            <td className="p-2">Items</td>
            <td className="p-2">1</td>
            <td className="p-2">600 QAR</td>
            <td className="p-2">600 QAR</td>
          </tr>
          <tr className="font-bold bg-gray-50">
            <td className="p-2" colSpan="4">Subtotal</td>
            <td className="p-2">1800 QAR</td>
          </tr>
          <tr>
            <td className="p-2" colSpan="4">Tax (12%)</td>
            <td className="p-2">216 QAR</td>
          </tr>
          <tr>
            <td className="p-2" colSpan="4">Penalty</td>
            <td className="p-2">25 QAR</td>
          </tr>
          <tr className="font-bold text-pink-600">
            <td className="p-2" colSpan="4">Total Amount</td>
            <td className="p-2">2041 QAR</td>
          </tr>
        </tbody>
      </table>

      {/* Payment Instructions */}
      <div className="text-sm text-gray-700 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
        <p className="font-bold mb-2">Payment Instructions</p>
        <p>1. <span className="font-semibold">Online Payment:</span> Log in to the Parent Portal and use the "Pay Now" option.</p>
        <p>2. <span className="font-semibold">Bank Transfer:</span> Bank Account Name: Account Number: IBAN Number: SWIFT Code:</p>
        <p>3. <span className="font-semibold">Cash Payment:</span> Visit the school office during working hours. Payment is due 15 days after the invoice date. Please ensure that payment is made by the due date to avoid any late penalties.</p>
      </div>

    </div>
  );
};

export default Invoice;
