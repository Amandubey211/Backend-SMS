import React, { useEffect } from "react";
import Card from "./Components/Card";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuotationCardData } from "../../../../Store/Slices/Finance/Quotations/quotationThunks";

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
    { title: "Total Quotation", count: totalQuotations, color: "bg-purple-100", textColor: "text-purple-700" },
    { title: "Accepted Quotation", count: acceptedQuotations, color: "bg-green-100", textColor: "text-green-700" },
    { title: "Rejected Quotation", count: rejectedQuotations, color: "bg-red-100", textColor: "text-red-700" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card key={index} title={card.title} count={card.count} color={card.color} textColor={card.textColor} />
      ))}
    </div>
  );
};

export default CardsSection;
