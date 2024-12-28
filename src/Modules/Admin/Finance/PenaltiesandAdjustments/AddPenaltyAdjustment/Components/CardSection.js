import React, { useEffect } from "react";
import Card from "./Card";
import { fetchReturnCardData } from "../../../../../../Store/Slices/Finance/PenalityandAdjustment/adjustment.thunk";
import { useDispatch, useSelector } from "react-redux";
import { FaClipboardList, FaTimesCircle, FaMoneyCheckAlt, FaFileInvoice } from "react-icons/fa";
import { Tooltip } from "antd";  // Import Tooltip

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
          {returnCardData?.totalReturnInvoices || 0} <span className="text-xs">{returnCardData?.totalReturnInvoices===1?"invoice":"invoices"}</span>
        </>
      ),
      icon: (
        <Tooltip title="Total Return Invoices">
          <FaClipboardList />
        </Tooltip>
      ), // Wrap the icon with Tooltip
    },
    {
      title: "Total Cancelled Return Invoices",
      value: (
        <>
          {returnCardData?.totalCanceledInvoices || 0} <span className="text-xs">{returnCardData?.totalCanceledInvoices===1?"invoice":"invoices"}</span>
        </>
      ),
      icon: (
        <Tooltip title="Total Canceled Return Invoices">
          <FaTimesCircle />
        </Tooltip>
      ), // Wrap the icon with Tooltip
    },
    {
      title: "Total Adjustment Amount",
      value: (
        <>
          {returnCardData?.totalAdjustmentAmount || 0} <span className="text-s">QAR</span>
        </>
      ),
      icon: (
        <Tooltip title="Total Adjustment Amount">
          <FaMoneyCheckAlt />
        </Tooltip>
      ), // Wrap the icon with Tooltip
    },
    {
      title: "Total Cancelled Adjustment Amount",
      value: (
        <>
          {returnCardData?.canceledAdjustmentAmount || 0} <span className="text-s">QAR</span>
        </>
      ),
      icon: (
        <Tooltip title="Total Cancelled Adjustment Amount">
          <FaFileInvoice />
        </Tooltip>
      ), // Wrap the icon with Tooltip
    },
  ];

  useEffect(() => {
    dispatch(fetchReturnCardData());
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 auto-rows-fr">
      {returnCardDataList?.map((item, index) => (
        <Card key={index} {...item}  />
      ))}
    </div>
  );
};

export default CardSection;
