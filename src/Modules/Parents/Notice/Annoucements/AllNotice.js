import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../../../Components/Common/Layout";
import ParentDashLayout from "../../../../Components/Parents/ParentDashLayout.js";
import {  FcAdvertising } from "react-icons/fc";
import { MdQueryBuilder } from "react-icons/md";
import Notice from "./Notice";
import toast from "react-hot-toast";

const AllNotice = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem("parent:token");
        console.log(token)
        const response = await axios.get("http://localhost:8080/admin/all/notices", {
          headers: {
            Authentication: `${token}`,
          },
        });
        console.log(response)
        setNotices(response.data.notices);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch notices");
        setLoading(false);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Layout title="Event">
        <ParentDashLayout hideAvatarList={true}>
          <div className="p-4">
            <h1 className="mb-2 bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent font-semibold bg-clip-text">
              Student Notice board
            </h1>
            <div className="mt-5 rounded-lg overflow-auto">
              {filteredNotices.map((notice, index) => (
                <div key={notice.id} className="border">
                  <div
                    className={`cursor-pointer p-2 flex flex-col 'bg-white'}`}
                    onClick={() => toggleAccordion(index)}
                  >
                    <div className="flex gap-6 px-3 py-2">
                    {/* <img
  className="h-10 w-10 rounded"
  src={notice.imageUrl}
  alt="notice-image"
  onError={(e) => {
    e.target.onerror = null; 
    e.target.src = "https://via.placeholder.com/40"; 
    e.target.style = "background: #f3f4f6; display: flex; align-items: center; justify-content: center;";
    e.target.alt = '📅'; 
  }}
/> */}
<div
  className="h-10 w-10 rounded flex items-center justify-center text-2xl"
  style={{ background: '#f3f4f6' }}
>
<FcAdvertising />{/* You can replace this emoji with any other relevant emoji */}
</div>


                      <div className="flex flex-col gap-3 mt-[-5px]">
                        <h2
                          className="font-[500] text-[#4D4D4D]"
                          style={{ fontStyle: "inter" }}
                        >
                          {notice.title}
                        </h2>
                        <div className="flex flex-row gap-[50px] text-xs">
                          <div className="flex flex-wrap justify-center items-center">
                            <MdQueryBuilder
                              style={{ color: "gray" }}
                              className="text-gray-400 text-xl"
                            />
                            <span className="text-sm p-1 font-[400] text-[#7F7F7F]">
                              {new Date(notice.startDate).toLocaleDateString()}
                            </span>
                            <span className="text-sm p-1 font-[400] text-[#7F7F7F]">
                              {new Date(notice.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="px-3 py-1 text-xs text-center flex justify-center items-center">
  <span
    className={`${
      notice.priority === "High priority"
        ? "px-3 py-1 bg-pink-100 text-pink-700 font-bold"
        : notice.priority === "Low priority"
        ? "px-3 py-1 bg-gray-100 text-black font-normal"
        : ""
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
                      <div className="p-2 text-[#4D4D4D]">
                        <p>{notice.description}</p>
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

export default AllNotice;