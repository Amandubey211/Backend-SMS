import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReceiptCardData } from "../../../../Store/Slices/Finance/Receipts/receiptsThunks";
import Card from "./Components/Card";
import { FaReceipt, FaMoneyBillAlt, FaBan } from "react-icons/fa";

const CardsSection = () => {
  const dispatch = useDispatch();

  const { receiptsSummary, loading = false, error = null } = useSelector(
    (state) => state.admin.receipts || {}
  );

  useEffect(() => {
    dispatch(
      fetchReceiptCardData({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 })
    );
  }, [dispatch]);

  const cards = [
    {
      title: "Total Receipts Issued",
      count: loading || error ? "0" : receiptsSummary?.totalReceipts || "0",
      color: "bg-purple-100",
      textColor: "text-purple-700",
      tag: "receipts",
      icon: (

        <FaReceipt className="text-white text-xl" />

      ),
    },
    {
      title: "Total Amount Collected",
      count: loading || error ? "0" : receiptsSummary?.totalAmountCollected || "0",
      color: "bg-green-100",
      textColor: "text-green-700",
      tag: "QAR",
      icon: (

        <FaMoneyBillAlt className="text-white text-xl" />

      ),
    },
    {
      title: "Cancelled Receipts",
      count: loading || error ? "0" : receiptsSummary?.cancelledReceipts || "0",
      color: "bg-red-100",
      textColor: "text-red-700",
      tag: "receipts",
      icon: (

        <FaBan className="text-white text-xl" />

      ),
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
