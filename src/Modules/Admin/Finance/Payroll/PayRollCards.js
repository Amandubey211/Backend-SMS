import React, { useEffect } from "react";
import { FaDollarSign, FaWallet, FaClipboard, FaExclamationCircle } from "react-icons/fa"; 
import { GiMoneyStack, GiReceiveMoney } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";


const PayRollCards = () => {
  const dispatch = useDispatch();


  const PayRollCardsData = [
    {
      title: "Total PayRoll",
      value: 0,
      icon: <GiMoneyStack />, 
    },
    {
      title: "Total PayRoll",
      value: 0,
      icon: <GiReceiveMoney />, 
    },
    {
      title: "Total Remaining PayRoll",
      value: 0,
      icon: <FaWallet />, 
    },
  ];

 

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2 place-items-center">
      {PayRollCardsData?.map((item, index) => (
        <div
        className="p-4 w-full h-full rounded-lg border hover:shadow-lg hover:scale-105 transition-transform duration-300"
        style={{
          background:
            "radial-gradient(100.5% 129.64% at 50.05% 35.24%, #FBF7FF 0%, #FFCEDB 100%)",
          borderColor: "#DABDFF",
        }}
      >
        {/* Title and Icon */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-3 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg">
            {item?.icon}
          </div>
          <h3 className="text-sm font-medium text-gray-800 truncate">{item?.title}</h3>
        </div>
  
        {/* Value and Trend */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold text-purple-800 truncate">
            {item?.value}
          </h2>
        </div>
      </div>
      ))}
    </div>
  );
};

export default PayRollCards;
