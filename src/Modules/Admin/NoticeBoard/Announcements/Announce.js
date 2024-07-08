import React, { useState } from "react";

import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddAnnouncement from "./AddAnnouncement";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdQueryBuilder } from "react-icons/md";


import { notices } from "../../dummyData/dummyData";
import AllNotice from "./AllNotice";

const Announce = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

 

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
          <div className="p-4  ">
            <h1 className=" mb-2 bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent font-semibold bg-clip-text">
              Student Notice board
            </h1>
            <div className="flex p-[10px]  justify-between ">
              <div className="flex gap-4  ">
                <input
                  type="text"
                  placeholder="Search by Notice"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className=" p-2 border rounded w-[250px] "
                />
                <button className=" border w-[100px] rounded bg-pink-100 text-center flex justify-center items-center  ">
                  <span className="font-semibold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text">
                    Search
                  </span>
                </button>
               
              </div>

              <div>
                <button
                  onClick={handleSidebarOpen}
                  className=" p-2 border border-red-300  rounded bg-pink-100 text-center flex justify-center items-center  "
                >
                  <span className="font-semibold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text">
                    Add Notice
                  </span>
                </button>
              </div>
            </div>
            <div className="   mt-5  rounded-lg overflow-auto">
              {filteredNotices.map((notice, index) => (
                <div key={notice.id} className="border  ">
                  <div
                    className={`cursor-pointer   p-2   flex flex-col   'bg-white'}`}
                    onClick={() => toggleAccordion(index)}
                  >
                    <div className="flex gap-6 px-3 py-2">
                      {/* <img className=" h-10 w-10 " src="https://via.placeholder.com/40" alt="notice-image" /> */}
                      <img
                        className=" h-10 w-10  rounded "
                        src={notice.imageUrl}
                        alt="notice-image"
                      />

                      <div className="flex flex-col gap-3 mt-[-5px]">
                        <h2
                          className=" font-[500]  text-[#4D4D4D] "
                          style={{ fontStyle: "inter" }}
                        >
                          {notice.title}
                        </h2>

                        <div className="flex flex-row gap-[50px] text-xs">
                          <div className="flex   flex-wrap  justify-center items-center  ">
                            {/* <FontAwesomeIcon
                              style={{
                                color: "gray",
                                background: " ",
                                margin: "0",
                                padding: "0",
                                height: "13px",
                                width: "13px",
                                borderRadius: "50%",
                                marginRight: "5px",
                              }}
                              icon={faClock}
                            /> */}

                            <MdQueryBuilder
                              style={{
                                color: "gray",
                               
                              }}
                              className=" text-gray-400 text-xl"
                            />

                            <span className=" text-sm p-1 font-[400] text-[#7F7F7F] ">
                              July 25,2014
                            </span>
                          </div>
                          <div className="px-2 text-xs bg-pink-100 text-center flex justify-center items-center">
                            <span
                              className={` ${
                                notice.priority === "High Priority"
                                  ? "  font-semibold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text"
                                  : "text-blue-500 font-bold "
                              }`}
                            >
                              {notice.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {activeIndex === index && (
                      <div className="p-2 text-[#4D4D4D] ">
                        <p>{notice.content}</p>
                      </div>
                    )}
                  </div>
                </div>

                // <AllNotice
                // key={notice.id}
                // notice={notice}
                // onToggle={() => toggleAccordion(index)}
                // isActive={activeIndex === index}
                // />
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
