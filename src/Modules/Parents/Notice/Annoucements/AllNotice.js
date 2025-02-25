import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../../../../Components/Common/Layout";
import ParentDashLayout from "../../../../Components/Parents/ParentDashLayout.js";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { RiSignalWifiErrorFill } from "react-icons/ri";
import { IoCalendarOutline } from "react-icons/io5";
import CalendarIcon from '../../../../Assets/ParentAssets/svg/calender.svg';
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading .js";
import announcementIcon from "../../../../Assets/DashboardAssets/Images/image1.png";
import { CiSearch } from "react-icons/ci";
import { fetchAllNotices } from "../../../../Store/Slices/Parent/NoticeBoard/notice.action.js";
import { useTranslation } from "react-i18next";
import { NoticeSkeleton } from "../../Skeletons.js";

const AllNotice = () => {
  const { t } = useTranslation('prtNotices');
  const dispatch = useDispatch();

  const { notices, loading, error } = useSelector((state) => state?.Parent?.notice || {});
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);

  useNavHeading(t("Child Notice Board"));

  useEffect(() => {
    dispatch(fetchAllNotices());
  }, [dispatch]);

  const backgroundColors = useMemo(() => [
    'bg-blue-300',
    'bg-green-300',
    'bg-yellow-300',
    'bg-pink-300',
    'bg-purple-300'
  ], []);

  const filteredNotices = useMemo(() => {
    return notices?.filter((notice) =>
      notice?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notices, searchTerm]);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return t("No Date");
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
          {error}: {t("Failed to fetch notices")}
        </p>
      </div>
    );
  };

  return (
    <Layout title={t("Noticeboard")}>
      <ParentDashLayout hideAvatarList={true}>
        <div className="p-4">
          <div className="flex p-[10px] justify-between">
            <div className="relative flex items-center max-w-xs w-full mr-4">
              <input
                type="text"
                placeholder="Search here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
              />
              <button className="absolute right-3">
                <CiSearch className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="mt-5 overflow-auto">
            {loading ? (
              <NoticeSkeleton count={3} />
            ) : error ? (
              renderErrorMessage()
            ) : filteredNotices?.length > 0 ? (
              filteredNotices?.map((notice, index) => (
                <div key={notice?.id || index} className="border-t">
                  <div className="cursor-pointer p-2 flex flex-col bg-white" onClick={() => toggleAccordion(index)}>
                    <div className="flex gap-6 px-3 py-2 items-center">
                      {/* Icon */}
                      <div className={`border ${backgroundColors[index % backgroundColors.length]} rounded-md flex items-center justify-center h-16 w-16`}>
                        <img
                          className="h-12 w-12"
                          src={announcementIcon}
                          alt={t("Announcement Icon")}
                        />
                      </div>

                      {/* Title and Date */}
                      <div className="flex-1 flex flex-col gap-2">
                        <h2 className="font-semibold text-lg gap-2">
                          {notice?.title}
                          <span className="ml-4 text-sm text-gray-500">
                            ({t("Posted by")}{" "}
                            <span className="text-sm text-gray-700">{notice?.authorName || "-"}</span>)
                          </span>
                        </h2>
                        <div className="flex items-center text-xs">
                          <IoCalendarOutline className="text-gray-400" />
                          <span className="ml-2 text-sm text-gray-500">{formatDate(notice?.startDate)}</span>

                          <div
                            className={`ml-3 px-3 py-1 bg-gray-100 rounded-full ${notice?.priority === t("High Priority")
                              ? "text-pink-500 bg-pink-100"
                              : "text-gray-500"
                              }`}
                          >
                            {notice?.priority || t("Low Priority")}
                          </div>
                        </div>
                      </div>

                      {/* Expand Icon */}
                      <div className="flex items-center gap-4">
                        {activeIndex === index ? (
                          <MdExpandLess className="text-xl" />
                        ) : (
                          <MdExpandMore className="text-xl" />
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {activeIndex === index && (
                      <div className="p-4 text-sm text-gray-700">
                        <p>{notice?.description || t("No description available")}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <img src={CalendarIcon} style={{ width: '40px', height: '40px', marginBottom: '10px' }} alt="calendar" />
                <p className="text-gray-600 text-lg">{t("No Notices are available")}</p>
              </div>
            )}
          </div>
        </div>
      </ParentDashLayout>
    </Layout>
  );
};

export default AllNotice;
