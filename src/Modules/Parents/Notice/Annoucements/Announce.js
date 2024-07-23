import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../../../Components/Common/Layout";
import ParentDashLayout from "../../../../Components/Parents/ParentDashLayout.js";
import Sidebar from "../../../../Components/Common/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdQueryBuilder } from "react-icons/md";
import { FcAlarmClock } from "react-icons/fc";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../config/Common.js";

const ParentAnnounce = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [ancmts, setAncmts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAncmts = async () => {
      try {
        const token = localStorage.getItem("parent:token");
        const response = await axios.get(`${baseUrl}/admin/all/events`, {
          headers: {
            Authentication: `${token}`,
          },
        });
        setAncmts(response.data.events);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch announcements");
        setLoading(false);
      }
    };

    fetchAncmts();
  }, []);

  const filteredAncmts = ancmts.filter((ancmt) =>
    ancmt.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Layout title="Event">
        <ParentDashLayout hideAvatarList={true}>
          <div className="p-4">
            <h1 className="mb-2 bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent font-semibold bg-clip-text">
              Parent Events board
            </h1>
            <div className="flex p-[10px] justify-between">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search by Announcement"
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
            </div>
            <div className="mt-5 rounded-lg overflow-auto">
              {filteredAncmts.map((ancmt, index) => (
                <div key={ancmt._id} className="border">
                  <div
                    className={`cursor-pointer p-2 flex flex-col 'bg-white'}`}
                    onClick={() => toggleAccordion(index)}
                  >
                    <div className="flex gap-6 px-3 py-2">
                      <div
                        className="h-10 w-10 rounded flex items-center justify-center text-3xl"
                        style={{ background: '#f3f4f6' }}
                      >
                        <FcAlarmClock />
                      </div>

                      <div className="flex flex-col gap-3 mt-[-5px]">
                        <h2
                          className="font-[500] text-[#4D4D4D]"
                          style={{ fontStyle: "inter" }}
                        >
                          {ancmt.title}
                        </h2>
                        <div className="flex flex-row gap-[50px] text-xs">
                          <div className="flex flex-wrap justify-center items-center">
                            <MdQueryBuilder
                              style={{ color: "gray" }}
                              className="text-gray-400 text-xl"
                            />
                            <span className="text-sm p-1 font-[400] text-[#7F7F7F]">
                              {new Date(ancmt.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="px-2 text-xs bg-pink-100 text-center flex justify-center items-center">
                            <span
                              className={`${ancmt.type === "High priority"
                                ? "font-semibold bg-pink-100 text-pink-700 inline-block text-transparent bg-clip-text"
                                : "text-blue-500 font-bold"
                                }`}
                            >
                              {ancmt.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {activeIndex === index && (
                      <div className="p-2 text-[#4D4D4D]">
                        <p>{ancmt.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ParentDashLayout>
      </Layout>
    </>
  );
};

export default ParentAnnounce;