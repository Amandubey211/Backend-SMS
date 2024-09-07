import React, { useEffect, useState, useMemo } from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Student/StudentDashLayout";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import NoDataFound from "../../../Components/Common/NoDataFound";
import Spinner from "../../../Components/Common/Spinner";
import { baseUrl } from "../../../config/Common";
import announcementIcon from "../../../Assets/StudentAssets/announcement.png";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";

// NoticeItem Component (Reused for each notice)
const NoticeItem = ({
  notice,
  index,
  activeIndex,
  toggleAccordion,
  formatDate,
}) => (
  <div className="border-t">
    <div
      className="cursor-pointer p-2 flex flex-col bg-white"
      onClick={() => toggleAccordion(index)}
      aria-expanded={activeIndex === index ? "true" : "false"}
    >
      <div className="flex gap-6 px-3 py-2 items-center">
        {/* Icon */}
        <div
          className="border bg-blue-300 rounded-md flex items-center justify-center"
          style={{ height: "60px", width: "60px" }}
        >
          <img
            className="h-[80%] w-[80%] rounded-sm"
            src={announcementIcon}
            alt="Announcement Icon"
          />
        </div>

        {/* Title and Date */}
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="font-[500] text-[#4D4D4D] text-sm leading-5">
            {notice.title}
          </h2>
          <div className="flex items-center text-xs">
            <IoCalendarOutline
              className="text-gray-400 text-lg"
              aria-hidden="true"
            />
            <span className="text-sm font-[400] text-[#7F7F7F] ml-2">
              {formatDate(notice.startDate)}
            </span>
            <div className="ml-3 px-3 py-[2px] bg-gray-100 text-center flex justify-center items-center rounded-full">
              <span
                className={`text-xs ${
                  notice.priority === "High Priority"
                    ? "font-semibold text-pink-500 bg-pink-100 px-2 rounded-full"
                    : "text-gray-500"
                }`}
              >
                {notice.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Expand Icon */}
        <div className="flex items-center justify-center">
          {activeIndex === index ? (
            <MdExpandLess
              className="text-xl text-gray-500"
              aria-label="Collapse"
            />
          ) : (
            <MdExpandMore
              className="text-xl text-gray-500"
              aria-label="Expand"
            />
          )}
        </div>
      </div>

      {/* Description */}
      {activeIndex === index && (
        <div className="p-4 text-sm text-[#4D4D4D] bg-white">
          <p>{notice.description}</p>
        </div>
      )}
    </div>
  </div>
);

const StudentAnnounce = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  useNavHeading("Notice");

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem("student:token");
      if (!token) throw new Error("Authentication not found");

      const response = await axios.get(`${baseUrl}/student/all/notices/`, {
        headers: { Authentication: token },
      });

      if (response.status === 200 && response.data.success) {
        const formattedNotices = response.data.notices
          .reverse()
          .map((notice) => ({
            ...notice,
            startDate: new Date(notice.startDate),
            endDate: new Date(notice.endDate),
          }));
        setNotices(formattedNotices);
      }
    } catch (error) {
      console.error("Failed to fetch notices:", error);
    } finally {
      setLoading(false); // Disable loading state after fetching data
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const filteredNotices = useMemo(() => {
    return notices.filter((notice) =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notices, searchTerm]);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (loading) {
    return <Spinner />; // Show Spinner while loading
  }
  return (
    <Layout title="Event">
      <DashLayout>
        <div className="ps-5 pt-3">
          <h1 className="mb-1 bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent font-semibold bg-clip-text">
            Student Notice Board
          </h1>
          <div className="flex p-[10px] justify-between">
            <div className="flex gap-4">
              {/* Search Input */}
              <div className="relative flex items-center">
                <AiOutlineSearch
                  className="absolute left-3 text-gray-400 text-lg"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="Search by Notice"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 pl-10 border rounded-md w-72 text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  aria-label="Search Notices"
                />
              </div>

              {/* Search Button */}
              <button
                className="border w-[100px] rounded bg-pink-100 text-center flex justify-center items-center"
                aria-label="Search Notices"
              >
                <span className="font-semibold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                  Search
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Notice List */}
        <div className="mt-5 rounded-lg overflow-auto">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice, index) => (
              <NoticeItem
                key={notice.id}
                notice={notice}
                index={index}
                activeIndex={activeIndex}
                toggleAccordion={toggleAccordion}
                formatDate={formatDate}
              />
            ))
          ) : (
            <NoDataFound title="Notices" /> // Show "No Data Found" if there are no notices
          )}
        </div>
      </DashLayout>
    </Layout>
  );
};

export default StudentAnnounce;
