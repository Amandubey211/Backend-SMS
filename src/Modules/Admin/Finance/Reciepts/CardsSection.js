import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReceiptCardData } from "../../../../Store/Slices/Finance/Receipts/receiptsThunks"; // Adjust the path as needed
import Card from "./Components/Card";

const CardsSection = () => {
  const dispatch = useDispatch();

  // Access receipts summary and loading/error states from Redux
  const { receiptsSummary, loading = false, error = null } = useSelector(
    (state) => state.admin.receipts || {}
  );

  // Dispatch the fetchReceiptCardData action when the component mounts
  useEffect(() => {
    dispatch(
      fetchReceiptCardData({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 })
    );
  }, [dispatch]);

  console.log('this is summary',receiptsSummary)
  // Card configuration
  const cards = [
    {
      title: "Total Receipts Issued",
      count: loading || error ? "0" : receiptsSummary?.totalReceipts || "0",
      color: "bg-purple-100",
      textColor: "text-purple-700",
      tag: 'receipts'
    },
    {
      title: "Total Amount Collected",
      count: loading || error ? "0" : receiptsSummary?.totalAmountCollected || "0",
      color: "bg-green-100",
      textColor: "text-green-700",
      tag: 'QR'
    },
    {
      title: "Cancelled Receipts",
      count: loading || error ? "0" : receiptsSummary?.cancelledReceipts || "0",
      color: "bg-red-100",
      textColor: "text-red-700",
      tag: 'receipts'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </div>
  );
};

export default CardsSection;
