import React from "react";
import Card from "./Components/Card";

const CardsSection = () => {
  const cards = [
    { title: "Total Invoices", count: "12,345", color: "bg-purple-100", textColor: "text-purple-700" },
    { title: "Paid Invoices", count: "12,345", color: "bg-green-100", textColor: "text-green-700" },
    { title: "Unpaid Invoices", count: "12,345", color: "bg-red-100", textColor: "text-red-700" },
    { title: "Overdue Invoices", count: "12,345", color: "bg-yellow-100", textColor: "text-yellow-700" },
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
