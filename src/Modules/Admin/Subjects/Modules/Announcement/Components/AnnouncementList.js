import React from "react";
import AnnouncementHeader from "./AnnouncementHeader";
import AnnouncementCard from "./AnnouncementCard";
import AnnouncementCardData from "../DummyData/dummydata";

const AnnouncementList = () => {
  return (
    <div className="w-full ps-3">
      <AnnouncementHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
        {AnnouncementCardData.map((card, index) => (
          <AnnouncementCard
            key={index}
            title={card.title}
            section={card.section}

            date={card.date}
          />
        ))}
      </div>
    </div>
  );
};

export default AnnouncementList;
