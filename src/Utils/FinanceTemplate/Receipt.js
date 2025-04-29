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
      <div className=" z-40  text-white absolute top-4 right-4 p-2  font-bold">
        RECEIPT
      </div>
      <div className="w-[44%] h-[10rem]  bg-[#B874FF] z-40 [clip-path:polygon(0_0,100%_0,100%_18%,9%_18%)] absolute top-20 right-0">
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
  <table className="w-full text-left border border-gray-400">
    <tbody>
      <tr className="border-b border-gray-400">
        <td className="font-semibold py-2 px-4 border-r border-gray-400">Total Paid:</td>
        <td className="py-2 px-4">{totalAmount} {currency}</td>
      </tr>
      <tr className="border-b border-gray-400">
        <td className="font-semibold py-2 px-4 border-r border-gray-400">Payment Date:</td>
        <td className="py-2 px-4">{paymentDate?.slice(0, 10)}</td>
      </tr>
      <tr className="border-b border-gray-400">
        <td className="font-semibold py-2 px-4 border-r border-gray-400">Payment Type:</td>
        <td className="py-2 px-4">{paymentType}</td>
      </tr>
      <tr className="border-b border-gray-400">
        <td className="font-semibold py-2 px-4 border-r border-gray-400">Paid By:</td>
        <td className="py-2 px-4">{paidBy || "Self"}</td>
      </tr>
      {chequeNumber && (
        <tr className="border-b border-gray-400">
          <td className="font-semibold py-2 px-4 border-r border-gray-400">Cheque Number:</td>
          <td className="py-2 px-4">{chequeNumber}</td>
        </tr>
      )}
      {chequeDate && (
        <tr className="border-b border-gray-400">
          <td className="font-semibold py-2 px-4 border-r border-gray-400">Cheque Date:</td>
          <td className="py-2 px-4">{chequeDate}</td>
        </tr>
      )}
    </tbody>
  </table>
</div>



      <div className="text-sm text-gray-700">
        <p><strong>Remarks:</strong></p>
        <ul className="list-disc px-5">
          {description && <li>{description}</li>}
          <li>Thank you for your business. Contact us for any queries.</li>
        </ul>
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

export default ReceiptTemplate;
