import React, { useEffect } from "react";
import { FaDollarSign, FaWallet, FaClipboard, FaExclamationCircle } from "react-icons/fa"; 
import StudentCard from "./StudentCard";

import { useDispatch, useSelector } from "react-redux";


const StudentCardSection = () => {
  const {  paidAllAmount, totalAllAmount, } = useSelector(
    (state) => state.admin.studentFees
  );
   const formatAmount = (amount) => amount.toFixed(2);

 const studentCardsData = [
   {
     title: "Total Collected Amount",
     value: formatAmount(paidAllAmount),
     icon: <FaDollarSign />, 
   },
   {
     title: "Amount not collected",
     value: formatAmount(totalAllAmount -paidAllAmount),
     icon: <FaExclamationCircle />, 
   },
   {
     title: "Total Amount",
     value: formatAmount(totalAllAmount),
     icon: <FaWallet />, 
   },
 ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2 place-items-center">
      {studentCardsData?.map((item, index) => (
        <StudentCard key={index} {...item} />
      ))}
    </div>
  );
};

export default StudentCardSection;
