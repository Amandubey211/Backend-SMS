import React, { useEffect } from "react";
import { FaDollarSign, FaWallet, FaClipboard, FaExclamationCircle } from "react-icons/fa"; 
import Card from "./Card";
//import { fetchEntityFeeCardData } from "../../../../../Store/Slices/Finance/EntityFees/EntityFeesThunks";
import { useDispatch, useSelector } from "react-redux";


const EntityCardSection = () => {
 const {  paidAllAmount, totalAllAmount, } = useSelector(
     (state) => state.admin.entityRevenue
   );
  const dispatch = useDispatch();

 const formatAmount = (amount) => amount.toFixed(2);
  const EntityCardsData = [
    {
      title: "Total Collected Amount",
      value: formatAmount(paidAllAmount),
      icon: <FaDollarSign />, 
    },
    {
      title: "Amount Not Collected",
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
      {EntityCardsData?.map((item, index) => (
        <Card key={index} {...item} />
      ))}
    </div>
  );
};

export default EntityCardSection;
