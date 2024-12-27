import React from "react";
import Card from "./Components/Card";
import { useSelector } from "react-redux";

const CardsSection = () => {
  const { cardData } = useSelector((store) => store.admin.invoices);
  const cards = [
    { title: "Total Invoices", count: cardData?.totalInvoices, color: "bg-purple-100", textColor: "text-purple-700" },
    { title: "Return Invoices", count: cardData?.returnInvoices, color: "bg-green-100", textColor: "text-green-700" },
    { title: "Cancel Invoices", count: cardData?.cancelledInvoices, color: "bg-red-100", textColor: "text-red-700" },
    { title: "Overdue Invoices", count: cardData?.overdueInvoices, color: "bg-yellow-100", textColor: "text-yellow-700" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} title={card.title} count={card.count} color={card.color} textColor={card.textColor} />
      ))}
    </div>
  );
};

export default CardsSection;
