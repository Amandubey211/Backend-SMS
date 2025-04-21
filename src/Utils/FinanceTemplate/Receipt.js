import React, { forwardRef } from "react";


const ReceiptTemplate = forwardRef((props, ref) => {
  const { data } = props;
  if (!data) return null;

  const {
    _id,
    invoiceNumber,
    schoolId,
    description,
    penalty = 0,
    isCancel,
    paymentDate,
    paidItems=[],
    paidBy,
    studentId,
    paymentStatus,
    entityId,
    onlineTransactionId,
    chequeDate,
    chequeNumber,
    paymentType
  } = data;



  // Initialize totals
  let totalAmount = 0;

  paidItems.forEach((item) => {
    totalAmount += item.amountPaid || 0;
  });


  const {
    address = "",
    branchName = "",
    city = "",
    nameOfSchool = "N/A",
    currency="",
    logo="",
  } = schoolId || {};

  return (
    <div className="p-6 bg-gray-50 rounded-md shadow-lg max-w-3xl mx-auto" ref={ref}>
      <div className="flex flex-col items-center mb-6">
        <div className="w-full bg-pink-100 px-4 flex-row py-2 flex justify-between items-center rounded-t-lg">
          <div>
            <h1 className="font-bold text-lg">{nameOfSchool}</h1>
            <p className="text-sm text-gray-500">{`${city}, ${branchName}`}</p>
          </div>
          {logo && <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />}
        </div>
        <div className="w-full text-center text-white font-bold py-2" style={{ backgroundColor: "#C83B62", fontSize: "18px" }}>
          Receipt {isCancel && "CANCELLED"}
        </div>
      </div>

      <div className="text-sm text-gray-800 mb-4 flex justify-between">
        {studentId &&<div>
          <p><strong>Receipt Number:</strong> {_id?.toUpperCase()}</p>
          <p><strong>Name:</strong> {studentId?.firstName} {studentId?.lastName}</p>
          <p><strong>Email:</strong> {studentId?.email }</p>
          <p><strong>Contact:</strong> {studentId?.contact }</p>
        </div>}
        {entityId &&<div>
          <p><strong>Receipt Number:</strong> {_id?.toUpperCase()}</p>
          <p><strong>Name:</strong> {entityId?.entityName} </p>
          <p><strong>Email:</strong> {entityId?.email }</p>
          <p><strong>Contact:</strong> {entityId?.contactNumber }</p>
        </div>}
        <div>
          <p><strong>Invoice No:</strong> {invoiceNumber || ""}</p>
          <p><strong>Issue Date:</strong> {paymentDate?.slice(0,10)}</p>
          <p><strong>Status:</strong> {paymentStatus}</p>
          <p><strong>Currency:</strong> {currency}</p>

        </div>
      </div>
      <div className="my-4 border-t border-gray-500">
          <p><strong>Total Paid:</strong> {totalAmount} {currency}</p>
          <p><strong>Payment Date :</strong> {paymentDate?.slice(0,10)}</p>
          <p><strong>Payment Type :</strong> {paymentType}</p>
          <p><strong>Paid By:</strong> {paidBy || "Self"}</p>
         {chequeNumber&& <p><strong>Cheque Number:</strong> {chequeNumber}</p>}
          {chequeDate &&<p><strong>Cheque Date:</strong> {chequeDate}</p>}
        </div>

      <div className="text-sm text-gray-700">
        <p><strong>Remarks:</strong></p>
        <ul className="list-disc px-5">
          {description && <li>{description}</li>}
          <li>Thank you for your business. Contact us for any queries.</li>
        </ul>
      </div>
    </div>
  );
});

export default ReceiptTemplate;
