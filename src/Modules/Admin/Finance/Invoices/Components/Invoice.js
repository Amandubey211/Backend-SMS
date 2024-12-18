import React from "react";
import StudentDiwanLogo from "../../../../../Assets/RBAC/StudentDiwan.svg";
import IconLogo from "../../../../../Assets/RBAC/Icon.svg";

const Invoice = () => {
  return (
    <div>
      {/* Dimmed Background */}
      <div
        className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 backdrop-blur-md z-10"
        style={{ backdropFilter: "blur(4px)" }}
      ></div>

      {/* Invoice Modal */}
      <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-20 bg-white shadow-lg w-[700px] p-6">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-full bg-pink-100 px-4 flex justify-between items-center ">
            <div>
              <h1 className="font-bold text-lg">ABC Higher Secondary School</h1>
              <p className="text-sm text-gray-500">11th Street, Main Road, Pincode: 674258, Maharashtra, India</p>
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
        <div className="text-sm text-gray-700 mb-4">
          <p className="font-bold mb-2">Payment Instructions</p>
          <p><strong>1. Online Payment:</strong> Log in to the Parent Portal.</p>
          <p><strong>2. Bank Transfer:</strong> Bank Account Number: IBAN.</p>
          <p><strong>3. Cash Payment:</strong> Visit the school office.</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            className="px-6 py-2 rounded text-white font-bold"
            style={{ background: "linear-gradient(90deg, #C83B62 0%, #7F35CD 100%)" }}
          >
            Download PDF
          </button>
          <button
            className="px-6 py-2 rounded text-white font-bold"
            style={{ background: "linear-gradient(90deg, #C83B62 0%, #7F35CD 100%)" }}
          >
            Send Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
