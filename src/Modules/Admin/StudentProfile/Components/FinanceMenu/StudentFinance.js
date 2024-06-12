import React from "react";
import { MdOutlineLocationOn } from "react-icons/md";
import FinanceCard from "./FinanceCard";
import FinanceTable from "./FinanceTable";

const StudentFinance = ({ student }) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="w-full border p-4">
          <div className="flex flex-row gap-3 p-4">
            <FinanceCard
              icon={<MdOutlineLocationOn className="text-red-300 text-2xl" />}
              label="Total Unpaid Fees"
              value={student.finance.totalUnpaidFees}
              buttonLabel="Message"
              onButtonClick={() => console.log("Message clicked")}
            />
            <FinanceCard
              icon={<MdOutlineLocationOn className="text-red-300 text-2xl" />}
              label="Parents Account Total Paid"
              value={student.finance.parentsAccountTotalPaid}
              buttonLabel="Message"
              onButtonClick={() => console.log("Message clicked")}
            />
            <FinanceCard
              icon={<MdOutlineLocationOn className="text-red-300 text-2xl" />}
              label="Total Paid Fees"
              value={student.finance.totalPaidFees}
              buttonLabel="Message"
              onButtonClick={() => console.log("Message clicked")}
            />
          </div>
        </div>
        <FinanceTable feesDetails={student.finance.feesDetails} />
      </div>
    </>
  );
};

export default StudentFinance;




//--------------------------------





// import React from "react";
// import {
//   MdAccessTime,
//   MdMoneyBillWave,
//   MdOutlineLocationOn,
// } from "react-icons/md";
// import { dummyData } from "../../dummyData/dummyData";

// const StudentFinance = ({ student }) => {
//   return (
//     <>
//       <div className="flex flex-col">
//         <div className="   w-full  border p-4  ">
//           <div className="flex flex-row gap-3  p-4 ">
//             <div className="flex  flex-1 justify-between items-center px-3 py-5  border border-gray-300    rounded-lg ">
//               <div className=" border border-black  flex  items-center justify-center p-1.5 rounded-full">
//                 <MdOutlineLocationOn className="text-red-300  text-2xl   " />
//               </div>
//               <div className="flex flex-col items-center text-center text-xs">
//                 <span className=" font-xs">Total Unpaid Fees</span>
//                 <span className="  text-lg font-bold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text">
//                   {student.finance.totalUnpaidFees} QR
//                 </span>
//               </div>
//               <button
//                 // onClick={onAddNewSubject}
//                 className="flex items-center border  justify-center   px-3 py-1 bg-pink-100   rounded-full"

//                 // className=" border border-gray-300 px-8 w-full rounded-full"
//               >
//                 <span className="text-pink-800">Message </span>
//               </button>
//             </div>
//             <div className="flex  flex-1 justify-between items-center px-3  border border-gray-300  rounded-lg ">
//               <div className=" border border-black  flex  items-center justify-center p-1.5 rounded-full">
//                 <MdOutlineLocationOn className="text-red-300  text-2xl   " />
//               </div>
//               <div className="flex flex-col items-center text-center text-[10px]">
//                 <span className=" font-normal">Parents Account Total Paid</span>
//                 <span className="  text-lg font-bold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text">
//                   {student.finance.parentsAccountTotalPaid} QR
//                 </span>
//               </div>
//               <button
//                 // onClick={onAddNewSubject}
//                 className="flex items-center border  justify-center   px-3 py-1 bg-pink-100   rounded-full"

//                 // className=" border border-gray-300 px-8 w-full rounded-full"
//               >
//                 <span className="text-pink-800">Message </span>
//               </button>
//             </div>
//             <div className="flex  flex-1 justify-between items-center px-3  border border-gray-300   rounded-lg ">
//               <div className=" border border-black  flex  items-center justify-center p-1.5 rounded-full">
//                 <MdOutlineLocationOn className="text-red-300  text-2xl   " />
//               </div>
//               <div className="flex flex-col items-center text-center text-xs">
//                 <span className=" font-normal">Total Paid Fees</span>
//                 <span className="  text-lg font-bold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text">
//                   {student.finance.totalPaidFees} QR
//                 </span>
//               </div>
//               <button
//                 // onClick={onAddNewSubject}
//                 className="flex items-center border  justify-center   px-3 py-1 bg-pink-100   rounded-full"

//                 // className=" border border-gray-300 px-8 w-full rounded-full"
//               >
//                 <span className="text-pink-800">Message </span>
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className=" border  overflow-x-auto bg-white shadow rounded-lg">
//           <table className="min-w-full leading-normal">
//             <thead>
//               <tr className="text-left text-gray-700 bg-gray-100">
//                 <th className="px-5 py-3 border-b-2 border-gray-200">
//                   Fee Type
//                 </th>

//                 <th className="px-5 py-3 border-b-2 border-gray-200">
//                   Paid By
//                 </th>
//                 <th className="px-5 py-3 border-b-2 border-gray-200">
//                   Due Date
//                 </th>
//                 <th className="px-5 py-3 border-b-2 border-gray-200">Amount</th>
//                 <th className="px-5 py-3 border-b-2 border-gray-200">Status</th>

//                 <th className="px-5 py-3 border-b-2 border-gray-200">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {student.finance.feesDetails.map((item, index) => (
//                 <tr key={index} className=" text-left text-gray-700 ">
//                   <td className="px-5 py-2 border-b border-gray-200 flex items-center">
//                     <span>{item.feeType}</span>
//                   </td>
//                   <td className="px-5 py-2 border-b border-gray-200">
//                     {item.paidBy}
//                   </td>

//                   <td className="px-5 py-2 border-b border-gray-200">
//                     {item.dueDate}
//                   </td>
//                   <td className="px-5 py-2 border-b border-gray-200">
//                     {item.amount} QR
//                   </td>
//                   <td className="px-5 py-2 border-b border-gray-200">
//                     <span
//                       className={`px-3 py-1 text-xs font-semibold rounded-full ${
//                         item.status === "Paid"
//                           ? "bg-green-200 text-green-800"
//                           : "bg-red-200 text-red-800"
//                       }`}
//                     >
//                       {item.status}
//                     </span>
//                   </td>
//                   <td className="px-5 py-2 border-b border-gray-200">
//                     {item.status === "Paid" ? (
//                       <span className="inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-green-200 text-green-800  py-1 px-2 rounded-md ">
//                         Complete
//                       </span>
//                     ) : (
//                       <button
//                         className=" inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-1 px-2 rounded-md hover:from-pink-600 hover:to-purple-600"
//                         // onClick={() => {
//                         //   handlePayClick(item);
//                         // }}
//                       >
//                         Message
//                       </button>
//                     )}
//                   </td>

//                   {/* <td className="px-5 py-2 border-b border-gray-200">
//                     {item.status}
//                   </td>

//                   <td className="px-5 py-2 border-b border-gray-200">
//                     <button className="text-indigo-600 hover:text-indigo-900">
//                       Edit
//                     </button>
//                   </td> */}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {/* //upper body */}
//       </div>
//     </>
//   );
// };

// export default StudentFinance;





//_____________________________________




