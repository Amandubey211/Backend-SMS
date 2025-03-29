// import React, { useState, useEffect, useMemo } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import Layout from "../../../../Components/Common/Layout";
// import ParentDashLayout from "../../../../Components/Parents/ParentDashLayout.js";
// import { IoCalendarOutline } from "react-icons/io5";
// import { UserOutlined } from "@ant-design/icons";
// import { Tag, Tooltip } from "antd";
// import { format } from "date-fns";
// import { CiSearch, CiBookmarkCheck } from "react-icons/ci";
// import { fetchAllNotices } from "../../../../Store/Slices/Parent/NoticeBoard/notice.action.js";
// import { useTranslation } from "react-i18next";
// import { NoticeSkeleton } from "../../Skeletons";
// import icon1 from "../../../../Assets/DashboardAssets/Images/image1.png";

// const priorityClasses = {
//   "High Priority": "bg-pink-100 text-pink-700",
//   "Low Priority": "bg-gray-100 text-gray-700",
// };

// const backgroundColors = [
//   "#FBB778",
//   "#FF7AA5",
//   "#33C4FE",
//   "#F9B279",
//   "#7F35CD",
// ];

// const truncateText = (text, length) => {
//   if (!text) return "";
//   return text.length > length ? text.substring(0, length) + "..." : text;
// };

// const AllNotice = () => {
//   const { t } = useTranslation('prtNotices');
//   const dispatch = useDispatch();

//   const { notices, loading, error } = useSelector((state) => state?.Parent?.notice || {});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeIndex, setActiveIndex] = useState(null);

//   useEffect(() => {
//     dispatch(fetchAllNotices());
//   }, [dispatch]);

//   const filteredNotices = useMemo(() => {
//     return notices
//       ?.filter((notice) =>
//         notice?.title?.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//       .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
//   }, [notices, searchTerm]);

//   const formatDate = (isoDate) => {
//     if (!isoDate) return t("No Date");
//     return format(new Date(isoDate), "dd/MM/yyyy");
//   };

//   return (
//     <Layout title={t("Noticeboard")}>
//       <ParentDashLayout hideAvatarList={true}>
//         <div className="p-4">
//           {/* Search Input */}
//           <div className="flex p-[10px] justify-between">
//             <div className="relative flex items-center max-w-xs w-full mr-4">
//               <input
//                 type="text"
//                 placeholder="Search here"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
//               />
//               <button className="absolute right-3">
//                 <CiSearch className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
//           </div>

//           {/* Notices List */}
//           <div className="mt-5 overflow-auto">
//             {loading ? (
//               <NoticeSkeleton count={3} />
//             ) : error ? (
//               <div className="flex flex-col items-center justify-center mt-6 text-gray-600">
//                 <p>{t("Failed to fetch notices")}</p>
//               </div>
//             ) : filteredNotices?.length > 0 ? (
//               filteredNotices.map((notice, index) => (
//                 <div
//                   key={notice?.id || index}
//                   className="w-[97%] p-3 my-3 border shadow-md border-gray-200 rounded-lg flex min-h-[80px] hover:shadow-lg transition-all duration-300 ease-in-out"
//                 >
//                   {/* Left Icon with Background */}
//                   <div className="pr-3 flex-shrink-0">
//                     <div
//                       className="h-16 w-16 rounded-md flex items-center justify-center border border-red-900 transition-all duration-300 scale-110 shadow-md"
//                       style={{ background: backgroundColors[index % backgroundColors.length] }}
//                     >
//                       <img src={icon1} alt="icon" className="h-12 w-12 object-contain" />
//                     </div>
//                   </div>

//                   {/* Notice Content */}
//                   <div className="flex flex-col justify-between flex-grow">
//                     <div>
//                       <div className="flex items-start justify-between">
//                         {/* Title with Tooltip */}
//                         <Tooltip title={notice?.title}>
//                           <h2 className="text-base font-semibold text-gray-700 capitalize m-0 leading-5 break-words">
//                             {truncateText(notice?.title, 50)}
//                           </h2>
//                         </Tooltip>

//                         {/* Priority Label */}
//                         <span className={`px-2 pt-[2px] text-xs font-medium rounded self-start ${priorityClasses[notice?.priority]}`}>
//                           {notice?.priority}
//                         </span>
//                       </div>

//                       {/* "Posted by" and Date Badge */}
//                       <div className="mt-1">
//                         <Tag
//                           color="blue"
//                           className="inline-flex items-center text-xs"
//                           style={{ width: "auto" }}
//                         >
//                           <UserOutlined />
//                           <span className="mx-1">Posted by {notice?.authorName || "-"}</span>
//                           <IoCalendarOutline className="mx-1" />
//                           <span>{formatDate(notice?.startDate)}</span>
//                         </Tag>
//                       </div>

//                       {/* Content Snippet */}
//                       <div className="flex items-center gap-1 text-gray-500 mt-2">
//                         <CiBookmarkCheck size={15} />
//                         <pre className="text-xs m-0 leading-4 whitespace-pre-wrap break-words">{notice?.description}</pre>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="flex flex-col items-center justify-center h-full">
//                 <p className="text-gray-600 text-lg">{t("No Notices are available")}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </ParentDashLayout>
//     </Layout>
//   );
// };

// export default AllNotice;
