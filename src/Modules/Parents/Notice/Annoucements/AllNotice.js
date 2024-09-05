import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../../../Components/Common/Layout";
import ParentDashLayout from "../../../../Components/Parents/ParentDashLayout.js";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import CalendarIcon from '../../../../Assets/ParentAssets/svg/calender.svg'; // Updated Import

import announcementIcon from "../../../../Assets/DashboardAssets/Images/image1.png";
import toast from "react-hot-toast";
import Spinner from "../../../../Components/Common/Spinner"; // Import Spinner
import { baseUrl } from "../../../../config/Common.js";

const AllNotice = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backgroundColors = [
    'bg-blue-300',
    'bg-green-300',
    'bg-yellow-300',
    'bg-pink-300',
    'bg-purple-300',
  ];

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem("parent:token");
        const response = await axios.get(`${baseUrl}/admin/all/notices`, {
          headers: {
            Authentication: `${token}`,
          },
        });
        setNotices(response.data.notices);
      } catch (error) {
        setError("Failed to fetch notices");
        toast.error("Failed to fetch notices");
      } finally {
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

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Layout title="Event">
        <ParentDashLayout hideAvatarList={true}>
          <div className="p-4">
            <h1 className="mb-2 bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent font-semibold bg-clip-text">
              Parents Notice Board
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
            </div>

            <div className="mt-5 rounded-lg overflow-auto">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <Spinner />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <img src={CalendarIcon} style={{ width: '40px', height: '40px', marginBottom: '10px' }} alt="calendar" />
                  <p className="text-gray-600 text-lg">Failed to fetch notices.</p>
                </div>
              ) : filteredNotices.length > 0 ? (
                filteredNotices.map((notice, index) => (
                  <div key={notice.id} className="border">
                    <div
                      className={`cursor-pointer p-2 flex flex-col bg-white`}
                      onClick={() => toggleAccordion(index)}
                    >
                      <div className="flex gap-6 px-3 py-2">
                        <div className={`border ${backgroundColors[index % backgroundColors.length]} rounded-[10%] flex items-center justify-center`} style={{ height: '70px', width: '70px' }}>
                          <img
                            className="h-[80%] w-[80%] rounded-[10%]"
                            src={announcementIcon}
                            alt="announcement-image"
                          />
                        </div>
                        <div className="flex flex-col gap-3 mt-[-5px] flex-1">
                          <h2 className="font-[500] text-[#4D4D4D]" style={{ fontStyle: "inter" }}>
                            {notice.title}
                          </h2>
                          <div className="flex flex-row gap-[50px] text-xs">
                            <div className="flex flex-wrap justify-center items-center">
                              <img src={CalendarIcon} alt="calendar" style={{ width: '25px', height: '25px', marginRight: '5px' }} />
                              <span className="text-sm p-1 font-[400] text-[#7F7F7F]">
                                {formatDate(notice.startDate)}
                              </span>
                            </div>
                            <div
                              className={`px-3 text-xs text-center flex justify-center items-center rounded-full ${notice.priority === "High priority"
                                ? "bg-[#FAECF0]"
                                : "bg-[#F2F5FB] border border-[#F2F5FB]"
                                }`}
                            >
                              <span
                                className={`${notice.priority === "High priority"
                                  ? "font-semibold bg-gradient-to-r from-[#C83B62] to-[#7F35CD] inline-block text-transparent bg-clip-text"
                                  : "text-gray-500"
                                  }`}
                              >
                                {notice.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full border border-gray-300">
                          {activeIndex === index ? (
                            <MdExpandLess className="text-xl text-gray-700" />
                          ) : (
                            <MdExpandMore className="text-xl text-gray-700" />
                          )}
                        </div>
                      </div>
                    </div>
                    {activeIndex === index && (
                      <div className="p-2 text-[#4D4D4D]">
                        <p>{notice.description}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <img src={CalendarIcon} style={{ width: '40px', height: '40px', marginBottom: '10px' }} alt="calendar" />
                  <p className="text-gray-600 text-lg">No Notices are available.</p>
                </div>
              )}
            </div>
          </div>
        </ParentDashLayout>
      </Layout>
    </>
  );
};

export default AllNotice;
