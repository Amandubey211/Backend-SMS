import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../../../../Components/Common/Layout";
import ParentDashLayout from "../../../../Components/Parents/ParentDashLayout.js";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { RiSignalWifiErrorFill } from "react-icons/ri"; // Imported network error icon
import CalendarIcon from '../../../../Assets/ParentAssets/svg/calender.svg';
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading .js";
import announcementIcon from "../../../../Assets/DashboardAssets/Images/image1.png";
import Spinner from "../../../../Components/Common/Spinner";
import { fetchAllNotices } from "../../../../Store/Slices/Parent/NoticeBoard/notice.action.js";

const AllNotice = () => {
  const dispatch = useDispatch();
  
  // Accessing the notices, loading, and error from Redux state
  const { notices, loading, error} = useSelector((state) => state?.Parent?.notice || {});
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  
  // Custom hook for setting navigation heading
  useNavHeading("Notice");

  // Side effect: Dispatches fetch action on mount
  useEffect(() => {
    dispatch(fetchAllNotices());
  }, [dispatch]);

  // Memoized array for background colors
  const backgroundColors = useMemo(() => [
    'bg-blue-300', 
    'bg-green-300', 
    'bg-yellow-300', 
    'bg-pink-300', 
    'bg-purple-300'
  ], []);

  // Memoized filtered notices based on search term
  const filteredNotices = useMemo(() => {
    return notices.filter((notice) =>
      notice?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notices, searchTerm]);

  // Accordion toggle function
  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Date formatting helper
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Error message rendering for notices
  const renderErrorMessage = () => {
    const isNetworkError = error?.toLowerCase().includes("network error");
  
    return (
      <div className="flex flex-col items-center justify-center mt-6">
        {isNetworkError ? (
          <RiSignalWifiErrorFill className="text-gray-400 text-8xl mb-6" />
        ) : (
          <img src={CalendarIcon} style={{ width: '40px', height: '40px', marginBottom: '10px' }} alt="calendar" />
        )}
        <p className="text-gray-600 text-lg text-center mt-2">
          {error}: "Failed to fetch notices."
        </p>
      </div>
    );
  };
  

  return (
    <>
      <Layout title="Parent | Notice Board">
        <ParentDashLayout hideAvatarList={true}>
          <div className="p-4">
            <h1 className="mb-2 bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent font-semibold bg-clip-text">
              Child Notice Board
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

            {/* Show loading spinner, error message, or notices */}
            <div className="mt-5 rounded-lg overflow-auto">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <Spinner />
                </div>
              ) : error ? (
                renderErrorMessage() // Error message with icon below search bar
              ) : filteredNotices.length > 0 ? (
                filteredNotices.map((notice, index) => (
                  <div key={notice.id || index} className="border mb-4">
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
                            {notice?.title || 'Untitled'}
                          </h2>
                          <div className="flex flex-row gap-[50px] text-xs">
                            <div className="flex flex-wrap justify-center items-center">
                              <img src={CalendarIcon} alt="calendar" style={{ width: '25px', height: '25px', marginRight: '5px' }} />
                              <span className="text-sm p-1 font-[400] text-[#7F7F7F]">
                                {formatDate(notice?.startDate) || 'No Date'}
                              </span>
                            </div>
                            <div
                              className={`px-3 text-xs text-center flex justify-center items-center rounded-full ${notice?.priority === "High priority"
                                ? "bg-[#FAECF0]"
                                : "bg-[#F2F5FB] border border-[#F2F5FB]"
                                }`}
                            >
                              <span
                                className={`${notice?.priority === "High priority"
                                  ? "font-semibold bg-gradient-to-r from-[#C83B62] to-[#7F35CD] inline-block text-transparent bg-clip-text"
                                  : "text-gray-500"
                                  }`}
                              >
                                {notice?.priority || 'Low priority'}
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
                      <div className="p-2 pl-6 text-[#4D4D4D]">
                        <p>{notice?.description || 'No description available.'}</p>
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
