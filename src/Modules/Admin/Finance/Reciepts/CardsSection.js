import React from "react";
import Card from "./Components/Card";

const CardsSection = () => {
  const cards = [
    { title: "Total Receipts Issued", count: "12,345", color: "bg-purple-100", textColor: "text-purple-700" },
    { title: "Total Amount Collected", count: "12,345", color: "bg-green-100", textColor: "text-green-700" },
    { title: "Total Pending Balance", count: "12,345", color: "bg-red-100", textColor: "text-red-700" },
    {
      title: "Payment Mode",
      customContent: (
        <div>
          <div className="flex justify-between">
            <span className="text-red-600">Online</span>
            <span className="text-gray-600">67%</span>
          </div>
          <div className="w-full h-2 bg-gray-300 rounded-full">
            <div className="h-full bg-red-500 rounded-full" style={{ width: "67%" }}></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-purple-600">Offline</span>
            <span className="text-gray-600">16%</span>
          </div>
          <div className="w-full h-2 bg-gray-300 rounded-full">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: "16%" }}></div>
          </div>
        </div>
      ),
      color: "bg-white border border-purple-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </div>
  );
};

export default CardsSection;
