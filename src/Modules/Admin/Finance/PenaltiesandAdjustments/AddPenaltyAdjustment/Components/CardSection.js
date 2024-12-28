import React, { useEffect } from "react";
import Card from "./Card";
import { fetchReturnCardData } from "../../../../../../Store/Slices/Finance/PenalityandAdjustment/adjustment.thunk";
import { useDispatch, useSelector } from "react-redux";
import { FaClipboardList, FaTimesCircle, FaMoneyCheckAlt , FaFileInvoice} from "react-icons/fa";

const CardSection = () => {
  // Extracting necessary state from Redux store
  const { returnCardData, loading, errors } = useSelector(
    (state) => state.admin.penaltyAdjustment
  );
  const dispatch = useDispatch();
  const returnCardDataList = [
    {
      title: "Total Return Invoices",
      value: (
        <>
          {returnCardData?.totalReturnInvoices} <span className="text-xs">invoice</span>
        </>
      ),
      icon: <FaClipboardList />, // Represents a list of tasks or documents, suitable for invoices
    },
    {
      title: "Total Cancelled Return Invoices",
      value: (
        <>
          {returnCardData?.totalCanceledInvoices} <span className="text-xs">invoice</span>
        </>
      ),
      icon: <FaTimesCircle />, // Indicates cancellation clearly with a cross icon
    },
    {
      title: "Total Adjustment Amount",
      value: (
        <>
          {returnCardData?.totalAdjustmentAmount} <span className="text-s">QR</span>
        </>
      ),
      icon: <FaMoneyCheckAlt />, // Reflects adjustment or balance
    },
    {
      title: "Total Cancelled Adjustment Amount",
      value: (
        <>
          {returnCardData?.canceledAdjustmentAmount} <span className="text-s">QR</span>
        </>
      ),
      icon: <FaFileInvoice />, // Highlights cancellation or warning
    },
  ];
  
  
  useEffect(() => {
    dispatch(fetchReturnCardData());
  }, [dispatch]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 auto-rows-fr">
      {returnCardDataList?.map((item, index) => (
        <Card key={index} {...item} />
      ))}
    </div>
  );
};

export default CardSection;
