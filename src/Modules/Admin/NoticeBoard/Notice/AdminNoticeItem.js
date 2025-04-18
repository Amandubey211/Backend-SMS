// src/components/Admin/NoticeBoard/Notice/AdminNoticeItem.jsx
import React, { useMemo } from "react";
import { Popover, Tooltip, Button, Tag, Avatar } from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { setTitleToDelete } from "../../../../Store/Slices/Admin/NoticeBoard/Notice/noticeSlice";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../config/permission";

const stepImages = [
  "https://static.vecteezy.com/system/resources/previews/057/454/300/large_2x/beautiful-artistic-modern-university-building-with-clock-tower-transparent-background-professional-png.png",
  "https://static.vecteezy.com/system/resources/thumbnails/057/566/031/small_2x/dramatic-traditional-family-portrait-session-setup-isolated-high-resolution-png.png",
  "https://static.vecteezy.com/system/resources/previews/052/560/690/large_2x/3d-icon-purple-user-profile-with-star-png.png",
  "https://static.vecteezy.com/system/resources/previews/051/222/567/large_2x/3d-checklist-with-icons-task-management-and-organization-png.png",
  "https://static.vecteezy.com/system/resources/previews/057/723/065/large_2x/wonderful-creative-virtual-real-estate-tour-isolated-element-high-resolution-free-png.png",
  "https://static.vecteezy.com/system/resources/previews/045/815/999/large_2x/agreement-contract-document-paperwork-stack-information-note-page-3d-icon-realistic-vector.jpg",
  "https://static.vecteezy.com/system/resources/previews/047/247/933/large_2x/3d-user-account-blue-mark-icon-concept-of-user-verified-icon-illustration-png.png",
];

const AdminNoticeItem = React.memo(
  ({
    notice,
    index,
    activeIndex,
    toggleAccordion,
    handleEditNotice,
    setDeleteModalOpen,
    setNoticeToDelete,
  }) => {
    const dispatch = useDispatch();
    const userRole = useSelector((s) => s.common.auth.role);
    const { userDetails } = useSelector((s) => s.common.user);
    const { t } = useTranslation("admNotice");

    // ➤ Randomly pick an icon once per mount
    const noticeImage = useMemo(() => {
      const rand = Math.floor(Math.random() * stepImages.length);
      return stepImages[rand];
    }, []);

    // Format dates
    const formattedStart = new Date(notice.startDate).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
    const formattedEnd = notice.endDate
      ? new Date(notice.endDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-";

    const roles = notice.noticeForRoles || [];
    const usersCount = notice.noticeForUsers?.length || 0;
    const priorityLower = notice.priority?.toLowerCase() || "";

    const handleDelete = () => {
      setDeleteModalOpen(true);
      setNoticeToDelete(notice._id);
      dispatch(setTitleToDelete(notice.title));
    };

    return (
      <motion.div
        className="border-b border-gray-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* HEADER */}
        <div
          className={`relative transition-all duration-200 ${
            activeIndex === index
              ? "border-l-2 border-[#C83B62] bg-gray-50"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <div
            className="flex items-start px-5 py-4 cursor-pointer"
            onClick={() => toggleAccordion(index)}
          >
            {/* Random Icon */}
            <div className="flex items-center justify-center mr-6 mt-1">
              <img
                src={noticeImage}
                alt="Notice icon"
                className="w-20 h-20 object-contain"
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-lg capitalize truncate">
                    {notice.title}
                  </h3>

                  {/* Roles & Priority */}
                  <div className="flex items-center mt-1 gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {roles.slice(0, 3).map((r) => (
                        <Tag key={r} color="blue" className="m-0 capitalize">
                          {r}
                        </Tag>
                      ))}
                      {roles.length > 3 && (
                        <Popover
                          content={
                            <div className="flex flex-wrap gap-1">
                              {roles.map((r) => (
                                <Tag
                                  key={r}
                                  color="blue"
                                  className="m-0 capitalize"
                                >
                                  {r}
                                </Tag>
                              ))}
                            </div>
                          }
                          trigger="hover"
                        >
                          <Tag color="blue" className="m-0 cursor-pointer">
                            +{roles.length - 3}
                          </Tag>
                        </Popover>
                      )}
                      {usersCount > 0 && (
                        <Tag color="green" className="m-0">
                          <UserOutlined className="mr-1" />
                          {usersCount}
                        </Tag>
                      )}
                    </div>
                    <Tag
                      color={
                        priorityLower.includes("high")
                          ? "red"
                          : priorityLower.includes("medium")
                          ? "orange"
                          : "blue"
                      }
                      className="m-0 text-sm"
                    >
                      {notice.priority}
                    </Tag>
                  </div>

                  {/* Author */}
                  <div className="flex items-center mt-3 text-sm text-gray-600">
                    <Avatar
                      size="small"
                      icon={<UserOutlined />}
                      className="mr-2 bg-gray-200 text-gray-600"
                    />
                    <Tooltip title={notice.authorName}>
                      <span className="truncate max-w-[100px]">
                        {notice.authorName || "-"}
                      </span>
                    </Tooltip>
                  </div>
                </div>

                {/* Actions & Expand */}
                <div
                  className="flex items-center space-x-2 ml-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(notice.authorId === userDetails.userId ||
                    userRole === "admin") && (
                    <>
                      <ProtectedAction
                        requiredPermission={PERMISSIONS.UPDATE_NOTICE}
                      >
                        <Tooltip title={t("Edit")}>
                          <Button
                            type="text"
                            shape="circle"
                            icon={<EditOutlined className="text-lg" />}
                            size="large"
                            className="text-gray-500 hover:text-blue-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditNotice(notice);
                            }}
                          />
                        </Tooltip>
                      </ProtectedAction>
                      <ProtectedAction
                        requiredPermission={PERMISSIONS.REMOVE_NOTICE}
                      >
                        <Tooltip title={t("Delete")}>
                          <Button
                            type="text"
                            shape="circle"
                            danger
                            icon={<DeleteOutlined className="text-lg" />}
                            size="large"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete();
                            }}
                          />
                        </Tooltip>
                      </ProtectedAction>
                    </>
                  )}
                  <Button
                    type="text"
                    shape="circle"
                    size="large"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => toggleAccordion(index)}
                    icon={
                      activeIndex === index ? (
                        <MdExpandLess className="text-2xl" />
                      ) : (
                        <MdExpandMore className="text-2xl" />
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {/* Persistent Date in Header */}
            <div className="absolute bottom-3 right-5 flex items-center text-sm text-gray-600 space-x-1 pointer-events-none">
              <span>{formattedStart}</span>
              <span className="text-gray-400">–</span>
              <span>{formattedEnd}</span>
            </div>
          </div>

          {/* Expanded Description */}
          {activeIndex === index && (
            <motion.div
              className="px-5 pb-4 ml-10 border-t"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="prose max-w-none p-2"
                dangerouslySetInnerHTML={{ __html: notice.description }}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }
);

export default AdminNoticeItem;
