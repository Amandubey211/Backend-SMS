



import React, { useState, useEffect } from "react";
import AnnouncementHeader from "./AnnouncementHeader";
import AnnouncementCard from "./AnnouncementCard";
import { useParams } from "react-router-dom";

const AnnouncementList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cid } = useParams();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("student:token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(`http://localhost:8080/admin/announcement/class/${cid}`, {
          headers: {
            'Authentication': token,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch announcements, status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status && data.data) {
          setAnnouncements(data.data);
        } else {
          console.error("No announcement data or unsuccessful response");
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [cid]);

  const filteredAnnouncements = announcements.filter((card) =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full ps-3">
      <AnnouncementHeader onSearch={setSearchTerm} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
        {filteredAnnouncements.map((card) => (
          <AnnouncementCard
            key={card._id}
            title={card.title}
            section={card.sectionId || "General"}
            date={new Date(card.createdAt).toLocaleDateString()}
            id={card._id}
          />
        ))}
      </div>
    </div>
  );
};

export default AnnouncementList;
