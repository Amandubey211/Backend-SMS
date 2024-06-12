import React, { useState } from "react";
import DiscussionCard from "./Components/DiscussionCard";
import PinnedDiscussions from "./Components/PinnedDiscussions";
import DiscussionHeader from "./Components/DiscussionHeader";
import { MdKeyboardArrowDown } from "react-icons/md";
import { GoDiscussionClosed } from "react-icons/go";

const dummyDiscussionData = [
  {
    title: "Discussion Next Exam",
    lastPostDate: "10/02/2024",
    lastPostTime: "12:30 PM",
    unreadReplies: 4,
    replies: 2,
  },
  {
    title: "Project Ideas for Next Semester",
    lastPostDate: "11/03/2024",
    lastPostTime: "01:00 PM",
    unreadReplies: 3,
    replies: 5,
  },
  {
    title: "Sustainable Development Goals",
    lastPostDate: "12/04/2024",
    lastPostTime: "02:15 PM",
    unreadReplies: 2,
    replies: 7,
  },
  {
    title: "Machine Learning Trends",
    lastPostDate: "13/05/2024",
    lastPostTime: "03:30 PM",
    unreadReplies: 5,
    replies: 3,
  },
  {
    title: "Blockchain Technology",
    lastPostDate: "14/06/2024",
    lastPostTime: "04:45 PM",
    unreadReplies: 6,
    replies: 4,
  },
  {
    title: "AI in Healthcare",
    lastPostDate: "15/07/2024",
    lastPostTime: "05:30 PM",
    unreadReplies: 1,
    replies: 8,
  },
  {
    title: "Data Science Projects",
    lastPostDate: "16/08/2024",
    lastPostTime: "06:15 PM",
    unreadReplies: 3,
    replies: 6,
  },
  {
    title: "Next Big Tech Innovations",
    lastPostDate: "17/09/2024",
    lastPostTime: "07:00 PM",
    unreadReplies: 4,
    replies: 5,
  },
  {
    title: "Ethics in AI",
    lastPostDate: "18/10/2024",
    lastPostTime: "08:30 PM",
    unreadReplies: 2,
    replies: 7,
  },
  {
    title: "Climate Change Actions",
    lastPostDate: "19/11/2024",
    lastPostTime: "09:45 PM",
    unreadReplies: 5,
    replies: 4,
  },
  {
    title: "Future of Quantum Computing",
    lastPostDate: "20/12/2024",
    lastPostTime: "10:00 AM",
    unreadReplies: 6,
    replies: 3,
  },
  {
    title: "Space Exploration",
    lastPostDate: "21/01/2025",
    lastPostTime: "11:15 AM",
    unreadReplies: 3,
    replies: 7,
  },
];

const MainSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredDiscussions = dummyDiscussionData.filter((discussion) =>
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full p-6">
      <DiscussionHeader onSearch={handleSearch} />
      <PinnedDiscussions />
      <div className="mt-6 ">
        <div className="flex items-center gap-2 ml-3 mb-2">
          <GoDiscussionClosed className="text-xl text-green-600" />
          <h2 className="text-xl "> All Discussions</h2>
          <MdKeyboardArrowDown className="text-gray-500 h-8 w-8" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredDiscussions.map((discussion, index) => (
            <DiscussionCard key={index} discussion={discussion} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainSection;
