import React, { useEffect, useState } from 'react'
import Announce from './Announce'
import Layout from '../../../Components/Common/Layout';
import DashLayout from '../../../Components/Student/StudentDashLayout';
import { MdQueryBuilder } from "react-icons/md";
import noticeIcon from "../../../Assets/StudentAssets/notice.png"
import axios from 'axios';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

const StudentAnnounce = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [notices, setNotices] = useState([]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem('student:token');
      if (!token) {
        throw new Error('Authentication not found');
      }

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/student/all/notices/`, {
        headers: {
          'Authentication': token
        }
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch notices, status: ${response.status}`);
      }

      const data = response.data;
      if (data.success && data.notices) {
        const formattedNotices = data.notices.reverse().map(notice => ({
          ...notice,
          startDate: new Date(notice.startDate),
          endDate: new Date(notice.endDate)
        }));
        setNotices(formattedNotices);
      } else {
        console.log("No notices data or unsuccessful response");
      }
    } catch (error) {
      console.error("Failed to fetch notices:", error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

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
            </div>

            <div className="mt-5 rounded-lg overflow-auto">
              {filteredNotices.map((notice, index) => (
                <div key={notice.id} className="border">
                  <div
                    className={`cursor-pointer p-2 flex flex-col bg-white`}
                    onClick={() => toggleAccordion(index)}
                  >
                    <div className="flex gap-6 px-3 py-2">
                      <div className='bg-gray-300 border rounded-[10%] flex items-center justify-center' style={{ height: '60px', width: '60px' }}>
                        <img
                          className="h-full w-full bg-pink-300 rounded-[10%]"
                          src={noticeIcon}
                          alt="notice-image"
                        />
                      </div>
                      <div className="flex flex-col gap-3 mt-[-5px] flex-1">
                        <h2 className="font-[500] text-[#4D4D4D]" style={{ fontStyle: "inter" }}>
                          {notice.title}
                        </h2>
                        <div className="flex flex-row gap-[50px] text-xs">
                          <div className="flex flex-wrap justify-center items-center">
                            <MdQueryBuilder
                              style={{ color: "gray" }}
                              className="text-gray-400 text-xl"
                            />
                            <span className="text-sm p-1 font-[400] text-[#7F7F7F]">
                              {formatDate(notice.startDate)}
                            </span>
                          </div>
                          <div className="px-3 text-xs bg-gray-100 text-center flex justify-center items-center rounded-full">
                            <span className={` ${notice.priority == "High priority" ? "font-semibold text-red-500" : "text-gray-500"}`}>
                              {notice.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {activeIndex === index ? <MdExpandLess className="text-xl" /> : <MdExpandMore className="text-xl" />}
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
          </div>
        </DashLayout>
      </Layout>
    </>
  );
}

export default StudentAnnounce


