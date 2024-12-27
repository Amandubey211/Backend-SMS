import React from "react";
import Card from "../../../Earnings/Components/Cards";
import { earningCardsData } from "./cardData";


const CardSection = () => {

   
    
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 auto-rows-fr">
      {earningCardsData.map((item, index) => (
        <Card key={index} {...item} />
      ))}
    </div>
  );
};

export default CardSection;
