import React, { useState } from "react";
import AnnouncementHeader from "./AnnouncementHeader";
import AnnouncementCard from "./AnnouncementCard";
import AnnouncementCardData from "../DummyData/dummydata";

const AnnouncementList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAnnouncements = AnnouncementCardData.filter((card) =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full ps-3">
      <AnnouncementHeader onSearch={setSearchTerm} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
        {filteredAnnouncements.map((card, index) => (
          <AnnouncementCard
            key={card.id || index}
            title={card.title}
            section={card.section}
            date={card.date}
            id={card.id}
          />
        ))}
      </div>
    </div>
  );
};

export default AnnouncementList;
