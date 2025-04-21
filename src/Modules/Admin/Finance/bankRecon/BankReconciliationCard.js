import React, { useEffect, useState } from 'react'
import { GrDocumentVerified } from 'react-icons/gr';
import { MdOutlinePendingActions } from 'react-icons/md';
import { TbDeviceIpadHorizontalCancel } from 'react-icons/tb';
import { RiCheckboxMultipleBlankFill } from "react-icons/ri";

import { useDispatch } from 'react-redux';
import { fetchAllReceiptsReconciliation } from '../../../../Store/Slices/Finance/Receipts/receiptsThunks';

export default function BankReconciliationCard() {
    const dispatch = useDispatch();

    const [alldata, setAlldata] = useState({});

  useEffect(() => {
    dispatch(fetchAllReceiptsReconciliation({ page: 1, limit: 5, pending: 'no' })).then((action) => {
      setAlldata(action?.payload)
    })
  }, [])
    const BankReconciliationCardsData = [
      {
        title: "Total Verified Transactions",
        value: alldata.verifiedReconciliationRecords ||0,
        icon: <GrDocumentVerified/>
        , 
      },
      {
        title: "Total Resolved Transactions",
        value: alldata.resolvedReconciliationRecords ||0,
        icon: <RiCheckboxMultipleBlankFill />
        , 
      },
      {
        title: "Total Pending Transactions",
        value: alldata.pendingReconciliationRecords ||0,
        icon: <MdOutlinePendingActions />, 
      },
      {
        title: "Total Reject Transactions",
        value: alldata.rejectReconciliationRecords ||0,
        icon: <TbDeviceIpadHorizontalCancel />, 
      },
    ];
  
   
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-2 gap-6 p-2 place-items-center">
        {BankReconciliationCardsData?.map((item, index) => (
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
}
