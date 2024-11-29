import React, { useEffect, useState, useMemo } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Student/StudentDashLayout";
import { AiOutlineSearch } from "react-icons/ai";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import Spinner from "../../../../Components/Common/Spinner";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import { useDispatch, useSelector } from "react-redux";
import { studentNotice } from "../../../../Store/Slices/Student/Noticeboard/notice.action";
import { setSearchTerm } from "../../../../Store/Slices/Student/Noticeboard/noticeSlice";
import { GoAlertFill } from "react-icons/go";
import NoticeItem from "./NoticeItem";
import { useTranslation } from "react-i18next";
import { gt } from "../../../../Utils/translator/translation";
import { setShowError } from "../../../../Store/Slices/Common/Alerts/alertsSlice";
import OfflineModal from "../../../../Components/Common/Offline";


const StudentAnnounce = () => {

  const { loading, error, noticeData, activeIndex, searchTerm } = useSelector((store) => store.student.studentAnnouncement);
  const {showError}=useSelector((store)=>store?.common?.alertMsg);
  
  const dispatch = useDispatch();
  const {t}=useTranslation();
  useNavHeading("Notice");

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredNotices = () => {
    return noticeData.filter((notice) =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleSearchTerm = (e) => {
    dispatch(setSearchTerm(e.target.value));
  }

  const handleDismiss = () => {
    dispatch(setShowError(false));
  }
  useEffect(() => {
    dispatch(studentNotice())
  }, [dispatch,studentNotice]);


   return (
    <Layout title="Event">
      <DashLayout>
        <div className="ps-5 pt-3">
          <h1 className="mb-1 bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent font-semibold bg-clip-text">
            {t('Student Notice Board',gt.stdNoticeboard)}
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
                  placeholder={t('Search by Notice',gt.stdNoticeboard)}
                  value={searchTerm}
                  onChange={(e) => handleSearchTerm(e)}
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
                {t('Search',gt.stdNoticeboard)}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Handling */}
        <div className="mt-5 rounded-lg overflow-auto">
          {loading ? (
            <div className="flex flex-col justify-center items-center text-center min-h-[300px]">
              <Spinner /> 
            </div>
          )
          //  : 
          // error ? (
          //   <div className="flex flex-col justify-center items-center text-center min-h-[300px] ">
          //       <GoAlertFill className="mb-2 w-12 h-12" />
          //      <p className="text-lg font-semibold">{error}</p>
          //   </div>
           
          // ) 
          : filteredNotices()?.length > 0 ? (
            filteredNotices()?.map((notice, index) => (
              <NoticeItem
                key={notice.id}
                notice={notice}
                index={index}
                formatDate={formatDate}
              />
            ))
          ) : (!loading && filteredNotices()?.length === 0) && (
            <div className="flex flex-col justify-center items-center text-center min-h-[300px]">
            <NoDataFound title="Notices" /> 
            </div>
          )}
        </div>
        {!loading && showError && (
            <OfflineModal error={error} onDismiss={handleDismiss} />
          )}
      </DashLayout>
    </Layout>
  );
};

export default StudentAnnounce;
