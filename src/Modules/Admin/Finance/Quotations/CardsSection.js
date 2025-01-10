import React, { useEffect } from "react";
import Card from "./Components/Card";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuotationCardData } from "../../../../Store/Slices/Finance/Quotations/quotationThunks";
import { HiDocumentText, HiCheckCircle, HiXCircle } from "react-icons/hi";

const CardsSection = () => {

  const dispatch = useDispatch();

  // Fetching state from Redux store
  const { totalQuotations, acceptedQuotations, rejectedQuotations, pendingQuotations, loading, error } = useSelector((state) => state.admin.quotations);

  // Fetch quotations on component mount
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    dispatch(fetchQuotationCardData({ year: currentYear }));
  }, [dispatch]);

  const cards = [
    { title: "Total Quotation", count: totalQuotations, icon: <HiDocumentText className="text-2xl" />, textColor: "text-purple-700", },
    { title: "Accepted Quotation", count: acceptedQuotations, icon: <HiCheckCircle className="text-2xl" />, textColor: "text-green-700", },
    { title: "Rejected Quotation", count: rejectedQuotations, icon: <HiXCircle className="text-2xl" />, textColor: "text-red-700", }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card key={index} title={card.title} count={card.count} icon={card.icon} />
      ))}
    </div>
  );
};

export default CardsSection;
