import React, { useState, useEffect } from "react";

import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddAnnouncement from "./AddAnnouncement";
import { MdQueryBuilder } from "react-icons/md";
import axios from "axios";  // Make sure to install axios if not already installed
import { baseUrl } from "../../../../config/Common";
import { useSelector } from "react-redux";

const Announce = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [notices, setNotices] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const role = useSelector((store) => store.Auth.role);
  useEffect(() => {
    const fetchNotices = async () => {
      const token = localStorage.getItem(`${role}:token`);
      try {
        const response = await axios.get(`${baseUrl}/admin/all/notices`, {
          headers: {
            Authentication: token,
          },
        });
        if (response.data.success) {
          setNotices(response.data.notices);
        }
      } catch (error) {
        console.error('Failed to fetch notices', error);
      }
    };

    fetchNotices();
  }, []);

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <>
      <Layout title="Event">
        <DashLayout>
          <div className="p-4">
            <h1 className="mb-2 bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent font-semibold bg-clip-text">
              Student Notice Board
            </h1>
            <div className="flex p-[10px] justify-between">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search by Notice"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 border rounded w-[250px]"
                />
                <button className="border w-[100px] rounded bg-pink-100 text-center flex justify-center items-center">
                  <span className="font-semibold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                    Search
                  </span>
                </button>
              </div>
              <button
                onClick={handleSidebarOpen}
                className="p-2 border border-red-300 rounded bg-pink-100 text-center flex justify-center items-center"
              >
                <span className="font-semibold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                  Add Notice
                </span>
              </button>
            </div>
            <div className="mt-5 rounded-lg overflow-auto">
              {filteredNotices.map((notice, index) => (
                <div key={notice._id} className="border">
                  <div
                    className={`cursor-pointer p-2 flex flex-col ${activeIndex === index ? 'bg-gray-100' : 'bg-white'}`}
                    onClick={() => toggleAccordion(index)}
                  >
                    <div className="flex gap-6 px-3 py-2">
                      <img
                        className="h-10 w-10 rounded"
                        src={notice.imageUrl || "https://via.placeholder.com/40"}
                        alt="notice-image"
                      />
                      <div className="flex flex-col gap-3 mt-[-5px]">
                        <h2 className="font-[500] text-[#4D4D4D]">{notice.title}</h2>
                        <div className="flex flex-row gap-[50px] text-xs">
                          <div className="flex flex-wrap justify-center items-center">
                            <MdQueryBuilder className="text-gray-400 text-xl" />
                            <span className="text-sm p-1 font-[400] text-[#7F7F7F]">
                              {new Date(notice.startDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="px-2 text-xs bg-pink-100 text-center flex justify-center items-center">
                            <span className={`${notice.priority === "High priority"
                                ? "font-semibold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text"
                                : "text-blue-500 font-bold"
                              }`}>
                              {notice.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {activeIndex === index && (
                    <div className="p-2 text-[#4D4D4D]">
                      <p>{notice.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={handleSidebarClose}
              title="Create New Notice"
            >
              <AddAnnouncement />
            </Sidebar>
          </div>
        </DashLayout>
      </Layout>
    </>
  );
};

export default Announce;
